/**
 * Lore System - UNIFIED DYNAMIC LORE
 * 
 * CORE PRINCIPLE: Lore = Function(Attributes)
 * - Lore is ALWAYS generated from attributes (no static templates)
 * - Every attribute change → Auto-refresh lore
 * - Static attributes (YAML) are just "initial state"
 * 
 * BEHAVIOR:
 * - Items with attributes → Show attribute lore
 * - Items without attributes → No lore
 * - Lore auto-updates when items enter inventory
 */

import { world, system, Player, Container, ItemStack } from "@minecraft/server";
import { PlaceholderRegistry } from "./placeholders/PlaceholderRegistry";

export class LoreSystem {
  // Guard to prevent recursive lore application
  private static processingSlots = new Set<string>();
  
  static initialize(): void {
    console.warn('[LoreSystem] Initializing UNIFIED DYNAMIC LORE system...');
    
    // Initialize placeholder registry
    PlaceholderRegistry.initialize();
    
    // Subscribe to inventory change events
    this.subscribeToInventoryEvents();
    
    // Also check existing items when players join
    this.subscribeToPlayerJoinEvents();
    
    console.warn('[LoreSystem] Initialized - Lore = Function(Attributes)');
  }

  /**
   * Subscribe to inventory change events
   * ALWAYS regenerate lore from attributes (no template check)
   */
  private static subscribeToInventoryEvents(): void {
    world.afterEvents.playerInventoryItemChange.subscribe((event) => {
      try {
        const { player, slot, itemStack } = event;
        
        // Only process if there's a new item in the slot
        if (!itemStack) return;
        
        const inventory = player.getComponent('minecraft:inventory');
        if (!inventory) return;
        
        const container = inventory.container;
        if (!container) return;
        
        // Create unique key for this slot to prevent recursion
        const slotKey = `${player.id}:${slot}`;
        
        // Skip if already processing this slot
        if (this.processingSlots.has(slotKey)) {
          return;
        }
        
        // ALWAYS apply lore from attributes (no template check)
        this.applyDynamicLoreToSlot(container, slot, itemStack, slotKey);
      } catch (error) {
        console.warn('[LoreSystem] Error in inventory change handler:', error);
      }
    });
  }

  /**
   * Subscribe to player join events to check existing items
   */
  private static subscribeToPlayerJoinEvents(): void {
    world.afterEvents.playerSpawn.subscribe((event) => {
      try {
        const { player, initialSpawn } = event;
        
        // Only check on initial spawn (when player joins)
        if (initialSpawn) {
          // Delay slightly to ensure inventory is fully loaded
          system.runTimeout(() => {
            this.checkPlayerInventory(player);
          }, 5); // 5 ticks delay
        }
      } catch (error) {
        console.warn('[LoreSystem] Error in player spawn handler:', error);
      }
    });
  }

  /**
   * Check and apply lore to items in player inventory
   * ALWAYS regenerate from attributes
   */
  private static checkPlayerInventory(player: Player): void {
    try {
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;

      const container = inventory.container;
      if (!container) return;

      for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;

        // ALWAYS apply dynamic lore
        this.applyDynamicLoreToSlot(container, slot, item);
      }
    } catch (error) {
      // Player might have disconnected or inventory unavailable
    }
  }

  /**
   * Apply dynamic lore to an item in a specific slot
   * ALWAYS generates from attributes (no template)
   */
  private static applyDynamicLoreToSlot(container: Container, slot: number, itemStack: ItemStack, slotKey?: string): void {
    try {
      // Mark slot as being processed
      if (slotKey) {
        this.processingSlots.add(slotKey);
      }
      
      // Get current lore
      const currentLore = itemStack.getLore();
      
      // Generate new lore from attributes
      const newLore = PlaceholderRegistry.generateAttributeLore(itemStack);
      
      // Check if lore changed (avoid unnecessary setItem calls)
      const loreChanged = currentLore.length !== newLore.length || 
                          currentLore.some((line, i) => line !== newLore[i]);
      
      if (loreChanged) {
        // Apply lore (empty array if no attributes)
        itemStack.setLore(newLore);
        
        // Save back to container
        container.setItem(slot, itemStack);
      }
      
      // Clear processing flag after a tick
      if (slotKey) {
        system.runTimeout(() => {
          this.processingSlots.delete(slotKey);
        }, 1);
      }
    } catch (error) {
      console.warn(`[LoreSystem] Failed to apply dynamic lore to ${itemStack.typeId}:`, error);
      // Clear flag on error too
      if (slotKey) {
        this.processingSlots.delete(slotKey);
      }
    }
  }

  /**
   * Apply lore to an item stack (manual usage - for AttributeAPI)
   * ALWAYS generates from attributes
   * 
   * @param itemStack The item stack to apply lore to
   * @returns true if lore was applied, false otherwise
   */
  static applyLore(itemStack: ItemStack): boolean {
    try {
      // Generate lore from attributes
      const lore = PlaceholderRegistry.generateAttributeLore(itemStack);
      
      // Apply lore
      itemStack.setLore(lore);
      
      return true;
    } catch (error) {
      console.warn(`[LoreSystem] Failed to apply lore to ${itemStack.typeId}:`, error);
      return false;
    }
  }

  /**
   * Update lore for an item stack (for dynamic lore updates)
   * This method should be called by attribute handlers after modifying item state
   * 
   * @param itemStack The item stack to update lore for
   * @returns true if lore was updated, false otherwise
   */
  static updateLore(itemStack: ItemStack): boolean {
    return this.applyLore(itemStack);
  }
}
