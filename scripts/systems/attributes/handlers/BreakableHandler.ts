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

import { world, ItemStack, Player } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';

export class BreakableHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'breakable';
  static readonly TEMPLATE_KEY = 'breakable_template';
  
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
  static processLorePlaceholders(itemId: string, line: string): string {
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
    console.warn('[BreakableHandler] Initializing...');
    
    // Load breakable items from attributes
    this.loadBreakableItems();
    
    console.warn(`[BreakableHandler] Loaded ${this.breakableItems.size} breakable items`);
    
    // Listen to block break events
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
    
    console.warn('[BreakableHandler] Initialized');
  }

  private static loadBreakableItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.breakableItems.set(item.itemId, item.config);
      
      const value = item.config?.value ?? 100;
      const context = item.config?.context ?? 'always';
      console.warn(`[BreakableHandler] ${item.itemId}: ${value}% breakable (context: ${context})`);
    }
  }

  private static handleBlockBreak(event: any): void {
    try {
      const { player, block, itemStackBeforeBreak } = event;
      
      // Check if player has item
      if (!itemStackBeforeBreak) {
        return;
      }
      
      const itemId = itemStackBeforeBreak.typeId;
      
      // Check if item has breakable attribute
      const config = this.breakableItems.get(itemId);
      if (!config) {
        return;
      }
      
      // Get block tags for condition evaluation
      const blockTags = this.getBlockTags(block.typeId);
      
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
        // Break item
        this.breakItem(player, itemStackBeforeBreak);
        
        console.warn(`[BreakableHandler] ${itemId} broke (${breakChance}% chance, rolled ${roll.toFixed(1)})`);
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
      
      // Find item in inventory and remove it
      for (let i = 0; i < container.size; i++) {
        const slot = container.getItem(i);
        if (slot && slot.typeId === itemStack.typeId) {
          // Reduce amount by 1
          if (slot.amount > 1) {
            slot.amount -= 1;
            container.setItem(i, slot);
          } else {
            container.setItem(i, undefined);
          }
          
          // Play break sound
          player.playSound('random.break');
          
          // Send message
          player.sendMessage(`§c${itemStack.typeId} đã bị phá hủy!`);
          
          break;
        }
      }
    } catch (error) {
      console.warn('[BreakableHandler] Error breaking item:', error);
    }
  }

  /**
   * Get block tags for condition evaluation
   * Returns tags like 'ore', 'stone', etc.
   */
  private static getBlockTags(blockId: string): string[] {
    const tags: string[] = [];
    
    // Check for ore tag
    if (blockId.includes('_ore') || blockId.includes('ore_')) {
      tags.push('ore');
    }
    
    // Check for stone tag
    if (blockId.includes('stone') || blockId.includes('cobblestone') || blockId.includes('deepslate')) {
      tags.push('stone');
    }
    
    // Check for wood tag
    if (blockId.includes('log') || blockId.includes('wood') || blockId.includes('planks')) {
      tags.push('wood');
    }
    
    // Check for dirt tag
    if (blockId.includes('dirt') || blockId.includes('grass') || blockId.includes('mycelium')) {
      tags.push('dirt');
    }
    
    return tags;
  }
}
