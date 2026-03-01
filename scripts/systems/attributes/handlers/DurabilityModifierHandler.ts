/**
 * DurabilityModifierHandler - Modify durability consumption
 * 
 * SINGLE SOURCE OF TRUTH for 'durability_modifier' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * Items với attribute 'durability_modifier' có thể:
 * - Tăng/giảm durability consumption
 * - Set max durability khác vanilla
 * 
 * Config:
 * - context: 'mining' (chỉ active khi đào block)
 * - maxDurability: 4 (override max durability)
 * - consumptionMultiplier: 14.75 (59/4 = 14.75x consumption để chỉ còn 4 uses)
 * 
 * Example: Wooden pickaxe với maxDurability: 4
 * - Vanilla: 59 durability
 * - Modified: Track uses, break after 4 uses
 */

import { world, ItemStack, Player } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';

interface DurabilityConfig {
  context?: AttributeContext | string;
  maxDurability?: number;
  consumptionMultiplier?: number;
  conditions?: any;
}

export class DurabilityModifierHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'durability_modifier';
  static readonly TEMPLATE_KEY = 'durability_template';
  
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
   * Replaces: {max_durability}
   */
  static processLorePlaceholders(itemId: string, line: string): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    
    if (config?.maxDurability !== undefined) {
      return line.replace(/{max_durability}/g, config.maxDurability.toString());
    }
    
    return line;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static durabilityItems = new Map<string, DurabilityConfig>();
  private static itemUsageCount = new Map<string, number>(); // Track uses per item (by unique ID)

  static initialize(): void {
    console.warn('[DurabilityModifierHandler] Initializing...');
    
    // Load durability modifier items from attributes
    this.loadDurabilityItems();
    
    console.warn(`[DurabilityModifierHandler] Loaded ${this.durabilityItems.size} durability modifier items`);
    
    // Listen to block break events
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
    
    console.warn('[DurabilityModifierHandler] Initialized');
  }

  private static loadDurabilityItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.durabilityItems.set(item.itemId, item.config || {});
      
      const maxDur = item.config?.maxDurability ?? 'default';
      const mult = item.config?.consumptionMultiplier ?? 1;
      console.warn(`[DurabilityModifierHandler] ${item.itemId}: maxDurability=${maxDur}, multiplier=${mult}x`);
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
      
      // Check if item has durability modifier
      const config = this.durabilityItems.get(itemId);
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
      if (!AttributeConditionEvaluator.isActive(config as any, evalContext)) {
        return;
      }
      
      // Apply durability modification
      this.applyDurabilityModification(player, itemStackBeforeBreak, config);
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error in block break handler:', error);
    }
  }

  private static applyDurabilityModification(player: Player, itemStack: ItemStack, config: DurabilityConfig): void {
    try {
      const maxDurability = config.maxDurability;
      
      // If maxDurability is set, track uses and break when limit reached
      if (maxDurability !== undefined) {
        // Get or create usage count for this item
        const itemKey = this.getItemKey(player, itemStack);
        const currentUses = this.itemUsageCount.get(itemKey) || 0;
        const newUses = currentUses + 1;
        
        console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} used ${newUses}/${maxDurability} times`);
        
        // Check if reached max uses
        if (newUses >= maxDurability) {
          // Break item
          this.breakItem(player, itemStack);
          this.itemUsageCount.delete(itemKey);
          
          console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} broke after ${newUses} uses`);
        } else {
          // Update usage count
          this.itemUsageCount.set(itemKey, newUses);
        }
      }
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error applying durability modification:', error);
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
          player.sendMessage(`§c${itemStack.typeId} đã hết độ bền!`);
          
          break;
        }
      }
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error breaking item:', error);
    }
  }

  /**
   * Get unique key for tracking item usage
   * Uses player ID + item type (simple tracking)
   */
  private static getItemKey(player: Player, itemStack: ItemStack): string {
    return `${player.id}_${itemStack.typeId}`;
  }

  /**
   * Get block tags for condition evaluation
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
