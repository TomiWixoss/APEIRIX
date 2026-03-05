/**
 * BreakableHandler - Handle 'breakable' attribute
 * 
 * SINGLE SOURCE OF TRUTH for 'breakable' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * Items với attribute 'breakable' có chance bị phá hủy khi sử dụng
 * 
 * Config:
 * - context: 'mining' (chỉ active khi đào block)
 * - value: 100 (100% chance bị phá)
 * - conditions: { blockTags: ['ore'] } (chỉ khi đào quặng)
 * 
 * Example: Wooden pickaxe với 100% breakable khi đào quặng
 */

import { world, ItemStack, Player, system } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';

export class BreakableHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'breakable';
  static readonly TEMPLATE_KEY = 'breakable_template';
  
  // ============================================
  // EVENT COORDINATION
  // ============================================
  // Track items broken by breakable in current tick
  // Key: playerId + itemTypeId, Value: tick when broken
  private static brokenItems = new Map<string, number>();
  
  /**
   * Check if item was broken by breakable handler in current/recent tick
   */
  static wasItemBroken(playerId: string, itemTypeId: string): boolean {
    const key = `${playerId}:${itemTypeId}`;
    const brokenTick = this.brokenItems.get(key);
    
    if (brokenTick === undefined) return false;
    
    const currentTick = system.currentTick;
    const tickDiff = currentTick - brokenTick;
    
    // Consider broken if within last 2 ticks (safety margin)
    if (tickDiff <= 2) {
      return true;
    }
    
    // Clean up old entries
    this.brokenItems.delete(key);
    return false;
  }
  
  /**
   * Mark item as broken by breakable handler
   */
  private static markItemBroken(playerId: string, itemTypeId: string): void {
    const key = `${playerId}:${itemTypeId}`;
    this.brokenItems.set(key, system.currentTick);
  }
  
  // ============================================
  // LORE GENERATION (Compile-time)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {breakable_value}, {breakable_condition}
   */
  static processLorePlaceholders(itemId: string, line: string, itemStack?: any): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    let result = line;
    
    // Replace {breakable_value}
    if (config?.value !== undefined) {
      result = result.replace(/{breakable_value}/g, config.value.toString());
    }
    
    // Replace {breakable_condition}
    if (config?.conditions) {
      const conditionText = this.formatCondition(config.conditions);
      result = result.replace(/{breakable_condition}/g, conditionText);
    } else {
      result = result.replace(/{breakable_condition}/g, '');
    }
    
    return result;
  }
  
  /**
   * Format condition text from config
   */
  private static formatCondition(conditions: any): string {
    // Check for blockTags
    if (conditions.blockTags && conditions.blockTags.length > 0) {
      const tags = conditions.blockTags.join(', ');
      return `khi đào ${tags}`;
    }
    
    // Check for blockIds
    if (conditions.blockIds && conditions.blockIds.length > 0) {
      const ids = conditions.blockIds.map((id: string) => id.replace('minecraft:', '')).join(', ');
      return `khi đào ${ids}`;
    }
    
    return '';
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static breakableItems = new Map<string, any>(); // itemId -> config

  static initialize(): void {
    // Register with PlaceholderRegistry for lore processing
    PlaceholderRegistry.registerAttributeHandler(this);
    
    // Load breakable items from attributes
    this.loadBreakableItems();
    
    // Listen to block break events BEFORE they happen (to get actual block data)
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
  }

  private static loadBreakableItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.breakableItems.set(item.itemId, item.config);
    }
  }

  private static handleBlockBreak(event: any): void {
    try {
      const { player, block } = event;
      
      // Get player's held item
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      const heldItem = container.getItem(player.selectedSlotIndex);
      if (!heldItem) return;
      
      const itemId = heldItem.typeId;
      
      // Check if item has breakable attribute
      const config = this.breakableItems.get(itemId);
      if (!config) return;
      
      // Get block tags for condition evaluation (from actual block component)
      const blockTags = this.getBlockTags(block);
      
      // Create evaluation context
      const evalContext: EvaluationContext = {
        context: AttributeContext.MINING,
        blockId: block.typeId,
        blockTags: blockTags
      };
      
      // Check if attribute is active
      if (!AttributeConditionEvaluator.isActive(config, evalContext)) {
        return;
      }
      
      // Get breakable chance
      const breakChance = AttributeConditionEvaluator.getValue(config, evalContext);
      
      // Roll for break
      const roll = Math.random() * 100;
      
      if (roll < breakChance) {
        // Cancel block break event (prevent block from being destroyed)
        event.cancel = true;
        
        // Mark item as broken (for DurabilityModifier to skip)
        this.markItemBroken(player.id, itemId);
        
        // Defer item breaking to avoid restricted execution context
        system.run(() => {
          this.breakItem(player, heldItem);
        });
      }
    } catch (error) {
      console.warn('[BreakableHandler] Error in block break handler:', error);
    }
  }

  private static breakItem(player: Player, itemStack: ItemStack): void {
    try {
      // Get player inventory
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Get selected slot
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = container.getItem(selectedSlot);
      
      // Verify it's the same item
      if (!heldItem || heldItem.typeId !== itemStack.typeId) {
        return;
      }
      
      // Remove or reduce item amount
      if (heldItem.amount > 1) {
        heldItem.amount -= 1;
        container.setItem(selectedSlot, heldItem);
      } else {
        container.setItem(selectedSlot, undefined);
      }
      
      // Play break sound
      player.playSound('random.break');
      
    } catch (error) {
      console.warn('[BreakableHandler] Error breaking item:', error);
    }
  }

  /**
   * Get block tags for condition evaluation
   * Reads from block's actual tags via Script API
   * Fallback: infer common tags from blockId if specific tags not found
   */
  private static getBlockTags(block: any): string[] {
    try {
      // Use Script API to get actual block tags
      const actualTags = block.getTags();
      
      // Infer semantic tags from blockId (ore, stone, wood, dirt)
      const blockId = block.typeId;
      const inferredTags: string[] = [];
      
      // Check for ore tag
      if (blockId.includes('_ore') || blockId.includes('ore_')) {
        inferredTags.push('ore');
      }
      
      // Check for stone tag
      if (blockId.includes('stone') || blockId.includes('cobblestone') || blockId.includes('deepslate')) {
        inferredTags.push('stone');
      }
      
      // Check for wood tag
      if (blockId.includes('log') || blockId.includes('wood') || blockId.includes('planks')) {
        inferredTags.push('wood');
      }
      
      // Check for dirt tag
      if (blockId.includes('dirt') || blockId.includes('grass') || blockId.includes('mycelium')) {
        inferredTags.push('dirt');
      }
      
      // Combine actual tags + inferred semantic tags
      return [...actualTags, ...inferredTags];
    } catch (error) {
      console.warn('[BreakableHandler] Error getting block tags:', error);
      return [];
    }
  }
}
