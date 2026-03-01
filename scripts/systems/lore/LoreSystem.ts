/**
 * Lore System - Apply lore to items based on GeneratedGameData
 * 
 * Automatically applies lore from GENERATED_WIKI_ITEMS to item stacks
 * when they enter player inventory
 * 
 * DYNAMIC LORE SUPPORT:
 * - Supports placeholders in lore via PlaceholderRegistry
 * - Placeholders are replaced with actual values from attribute configs
 * - See placeholders/ folder for available processors
 */

import { world, system, Player, Container, ItemStack } from "@minecraft/server";
import { GENERATED_WIKI_ITEMS } from "../../data/GeneratedGameData";
import { PlaceholderRegistry } from "./placeholders/PlaceholderRegistry";

export class LoreSystem {
  private static loreMap: Map<string, string[]> = new Map();

  static initialize(): void {
    console.warn('[LoreSystem] Initializing...');
    
    // Initialize placeholder registry
    PlaceholderRegistry.initialize();
    
    // Build lore map from GENERATED_WIKI_ITEMS
    for (const item of GENERATED_WIKI_ITEMS) {
      if (item.lore && item.lore.length > 0) {
        this.loreMap.set(item.id, item.lore);
      }
    }
    
    console.warn(`[LoreSystem] Loaded ${this.loreMap.size} items with lore`);
    
    // Subscribe to inventory change events
    this.subscribeToInventoryEvents();
    
    // Also check existing items when players join
    this.subscribeToPlayerJoinEvents();
    
    console.warn('[LoreSystem] Initialized');
  }

  /**
   * Subscribe to inventory change events
   * This event fires when items are added or removed from player inventory
   */
  private static subscribeToInventoryEvents(): void {
    world.afterEvents.playerInventoryItemChange.subscribe((event) => {
      try {
        const { player, slot, itemStack } = event;
        
        // Only process if there's a new item in the slot
        if (!itemStack) return;
        
        // OPTIMIZATION: Skip items that don't have lore defined
        if (!this.loreMap.has(itemStack.typeId)) return;
        
        // Check if this specific item needs lore
        if (this.needsLore(itemStack)) {
          const inventory = player.getComponent('minecraft:inventory');
          if (!inventory) return;
          
          const container = inventory.container;
          if (!container) return;
          
          // Apply lore to the specific slot that changed
          this.applyLoreToSlot(container, slot, itemStack);
        }
      } catch (error) {
        console.warn('[LoreSystem] Error in inventory change handler:', error);
      }
    });
  }

  /**
   * Subscribe to player join events to check existing items
   * This ensures items that were already in inventory get lore applied
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
   * Only checks items that have lore defined (optimized)
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

        // OPTIMIZATION: Skip items that don't have lore defined
        if (!this.loreMap.has(item.typeId)) continue;

        // Check if item needs lore
        if (this.needsLore(item)) {
          this.applyLoreToSlot(container, slot, item);
        }
      }
    } catch (error) {
      // Player might have disconnected or inventory unavailable
    }
  }

  /**
   * Check if an item needs lore applied
   * Returns true if item has lore defined but not yet applied
   * 
   * PRECONDITION: item.typeId must be in loreMap (checked by caller)
   */
  private static needsLore(item: ItemStack): boolean {
    const lore = this.loreMap.get(item.typeId)!; // Safe because caller checks

    // Check if item already has lore
    const currentLore = item.getLore();
    
    // If no lore or lore doesn't match, needs update
    if (currentLore.length === 0) return true;
    
    // Check if lore matches (in case lore was changed)
    if (currentLore.length !== lore.length) return true;
    
    for (let i = 0; i < lore.length; i++) {
      if (currentLore[i] !== lore[i]) return true;
    }
    
    return false;
  }

  /**
   * Apply lore to an item in a specific slot
   */
  private static applyLoreToSlot(container: Container, slot: number, item: ItemStack): void {
    try {
      const loreTemplate = this.loreMap.get(item.typeId);
      if (!loreTemplate) return;

      // Process lore with placeholders via registry
      const lore = PlaceholderRegistry.process(item.typeId, loreTemplate);
      
      // IMPORTANT: Clear existing lore first (removes vanilla lore)
      // This ensures only custom lore is displayed
      item.setLore([]);
      
      // Apply custom lore
      item.setLore(lore);
      
      // Save back to container
      container.setItem(slot, item);
      
    } catch (error) {
      console.warn(`[LoreSystem] Failed to apply lore to ${item.typeId}:`, error);
    }
  }

  /**
   * Apply lore to an item stack (manual usage)
   * @param itemStack The item stack to apply lore to
   * @returns true if lore was applied, false otherwise
   */
  static applyLore(itemStack: ItemStack): boolean {
    const loreTemplate = this.loreMap.get(itemStack.typeId);
    if (!loreTemplate) {
      return false;
    }

    try {
      const lore = PlaceholderRegistry.process(itemStack.typeId, loreTemplate);
      itemStack.setLore(lore);
      return true;
    } catch (error) {
      console.warn(`[LoreSystem] Failed to apply lore to ${itemStack.typeId}:`, error);
      return false;
    }
  }

  /**
   * Get lore for an item ID
   * @param itemId Full item ID (e.g., "apeirix:bronze_hammer")
   * @returns Lore array or undefined if no lore exists
   */
  static getLore(itemId: string): string[] | undefined {
    return this.loreMap.get(itemId);
  }

  /**
   * Check if an item has lore
   * @param itemId Full item ID
   * @returns true if item has lore defined
   */
  static hasLore(itemId: string): boolean {
    return this.loreMap.has(itemId);
  }
}
