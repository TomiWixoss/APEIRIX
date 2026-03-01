/**
 * DurabilityModifierHandler - Modify durability consumption
 * 
 * SINGLE SOURCE OF TRUTH for 'durability_modifier' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * Items với attribute 'durability_modifier' có thể:
 * - Set số lần sử dụng tối đa (durability)
 * - Tự động tính toán damage cần trừ dựa trên max durability của item
 * 
 * Config:
 * - context: 'mining' (chỉ active khi đào block)
 * - durability: 4 (số lần sử dụng tối đa)
 * 
 * Logic:
 * - Lấy max durability của item (từ durability component)
 * - Tính damage per use = max_durability / configured_durability
 * - Mỗi lần sử dụng trừ damage_per_use từ durability hiện tại
 * - Item tự động break khi durability về 0 (vanilla behavior)
 * 
 * Example: Wooden pickaxe với durability: 4
 * - Vanilla max durability: 59
 * - Damage per use: 59 / 4 = 14.75
 * - Sau 4 lần sử dụng: 59 - (14.75 * 4) = 0 → item breaks
 */

import { world, ItemStack, Player, system, GameMode } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { BreakableHandler } from './BreakableHandler';

interface DurabilityConfig {
  context?: string;
  durability?: number; // Số lần sử dụng tối đa
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
   * Replaces: {durability}
   */
  static processLorePlaceholders(itemId: string, line: string): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    
    if (config?.durability !== undefined) {
      return line.replace(/{durability}/g, config.durability.toString());
    }
    
    return line;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static durabilityItems = new Map<string, DurabilityConfig>();

  static initialize(): void {
    console.warn('[DurabilityModifierHandler] Initializing...');
    
    // Load durability modifier items from attributes
    this.loadDurabilityItems();
    
    console.warn(`[DurabilityModifierHandler] Loaded ${this.durabilityItems.size} durability modifier items`);
    
    // Listen to block break events (mining)
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleItemUse(event.player, event.itemStackBeforeBreak);
    });
    
    // Listen to entity hit events (combat)
    world.afterEvents.entityHitEntity.subscribe((event) => {
      if (event.damagingEntity?.typeId === 'minecraft:player') {
        const player = event.damagingEntity as any;
        const inventory = player.getComponent('minecraft:inventory');
        if (inventory?.container) {
          const heldItem = inventory.container.getItem(player.selectedSlotIndex);
          if (heldItem) {
            this.handleItemUse(player, heldItem);
          }
        }
      }
    });
    
    console.warn('[DurabilityModifierHandler] Initialized');
  }

  private static loadDurabilityItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.durabilityItems.set(item.itemId, item.config || {});
      
      const durability = item.config?.durability ?? 'default';
      console.warn(`[DurabilityModifierHandler] ${item.itemId}: durability=${durability} uses`);
    }
  }

  private static handleItemUse(player: Player, itemStack: ItemStack | undefined): void {
    try {
      if (!itemStack) return;
      
      const itemId = itemStack.typeId;
      
      // Check if item was broken by BreakableHandler
      if (BreakableHandler.wasItemBroken(player.id, itemId)) {
        console.warn(`[DurabilityModifierHandler] ${itemId} was broken by BreakableHandler - skipping durability modification`);
        return;
      }
      
      // Check if item has durability modifier
      const config = this.durabilityItems.get(itemId);
      if (!config) return;
      
      // Skip if player is in creative mode
      if (player.getGameMode() === GameMode.Creative) {
        return;
      }
      
      // Apply durability modification
      this.applyDurabilityModification(player, itemStack, config);
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error in item use handler:', error);
    }
  }

  private static applyDurabilityModification(player: Player, itemStack: ItemStack, config: DurabilityConfig): void {
    try {
      // Skip if player is in creative mode
      if (player.getGameMode() === GameMode.Creative) {
        return;
      }
      
      const configuredDurability = config.durability;
      
      // If durability is set, calculate damage and apply
      if (configuredDurability !== undefined && configuredDurability > 0) {
        // Get durability component
        const durabilityComp = itemStack.getComponent('minecraft:durability');
        if (!durabilityComp) {
          console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} has no durability component`);
          return;
        }
        
        const maxDurability = durabilityComp.maxDurability;
        const currentDamage = durabilityComp.damage;
        const currentDurability = maxDurability - currentDamage;
        
        // Calculate damage per use
        const damagePerUse = Math.ceil(maxDurability / configuredDurability);
        
        // Calculate new damage
        const newDamage = currentDamage + damagePerUse;
        
        console.warn(`[DurabilityModifierHandler] ${itemStack.typeId}: ${currentDurability}/${maxDurability} -> applying ${damagePerUse} damage (${configuredDurability} uses total)`);
        
        // Defer item update to avoid blocking event handler
        system.run(() => {
          try {
            // Apply damage to item in player's hand
            const inventory = player.getComponent('minecraft:inventory');
            if (!inventory) return;
            
            const container = inventory.container;
            if (!container) return;
            
            const selectedSlot = player.selectedSlotIndex;
            const heldItem = container.getItem(selectedSlot);
            
            if (heldItem && heldItem.typeId === itemStack.typeId) {
              const heldDurability = heldItem.getComponent('minecraft:durability');
              if (heldDurability) {
                // Check if item will break (damage >= maxDurability)
                if (newDamage >= maxDurability) {
                  // Break item manually
                  this.breakItem(player, selectedSlot, heldItem);
                  console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} broke (damage: ${newDamage}/${maxDurability})`);
                } else {
                  // Apply damage (safe - newDamage < maxDurability)
                  heldDurability.damage = newDamage;
                  container.setItem(selectedSlot, heldItem);
                  console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} damaged: ${newDamage}/${maxDurability}`);
                }
              }
            }
          } catch (error) {
            console.warn('[DurabilityModifierHandler] Error in deferred item update:', error);
          }
        });
      }
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error applying durability modification:', error);
    }
  }

  /**
   * Break item manually
   */
  private static breakItem(player: Player, slot: number, itemStack: ItemStack): void {
    try {
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Remove or reduce item amount
      if (itemStack.amount > 1) {
        itemStack.amount -= 1;
        container.setItem(slot, itemStack);
      } else {
        container.setItem(slot, undefined);
      }
      
      // Play break sound and particle effect
      player.playSound('random.break');
      player.dimension.spawnParticle('minecraft:item_break_particle', player.location);
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error breaking item:', error);
    }
  }
}
