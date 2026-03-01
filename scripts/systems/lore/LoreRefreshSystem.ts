/**
 * LoreRefreshSystem - Auto-refresh lore when attributes change
 * 
 * Similar to durability lore updates, but for attributes
 * Regenerates lore from template when attributes are modified
 */

import { ItemStack, Player, world } from '@minecraft/server';
import { LoreSystem } from './LoreSystem';

export class LoreRefreshSystem {
  private static initialized = false;
  
  /**
   * Initialize lore refresh system
   */
  static initialize(): void {
    if (this.initialized) return;
    
    console.warn('[LoreRefreshSystem] Initializing...');
    
    // No event subscriptions needed - refresh is called explicitly by AttributeAPI
    
    this.initialized = true;
    console.warn('[LoreRefreshSystem] Initialized');
  }
  
  /**
   * Refresh lore for ItemStack
   * Regenerates lore from template with current attribute values
   * 
   * @param itemStack ItemStack to refresh lore for
   */
  static refresh(itemStack: ItemStack): void {
    try {
      const itemId = itemStack.typeId;
      
      // Apply lore (will regenerate from template)
      LoreSystem.applyLore(itemStack);
      
      console.warn(`[LoreRefreshSystem] Refreshed lore for ${itemId}`);
    } catch (error) {
      console.warn(`[LoreRefreshSystem] Failed to refresh lore:`, error);
    }
  }
  
  /**
   * Refresh lore for all items in player inventory
   * Useful for bulk updates or debugging
   * 
   * @param player Player to refresh inventory for
   */
  static refreshPlayerInventory(player: Player): void {
    try {
      const inventory = player.getComponent('inventory');
      if (!inventory?.container) return;
      
      let refreshed = 0;
      for (let i = 0; i < inventory.container.size; i++) {
        const item = inventory.container.getItem(i);
        if (item) {
          this.refresh(item);
          inventory.container.setItem(i, item);
          refreshed++;
        }
      }
      
      console.warn(`[LoreRefreshSystem] Refreshed ${refreshed} items in ${player.name}'s inventory`);
    } catch (error) {
      console.warn(`[LoreRefreshSystem] Failed to refresh player inventory:`, error);
    }
  }
  
  /**
   * Refresh lore for all items in world
   * WARNING: Expensive operation, use sparingly
   */
  static refreshAllItems(): void {
    try {
      let refreshed = 0;
      
      for (const player of world.getAllPlayers()) {
        const inventory = player.getComponent('inventory');
        if (!inventory?.container) continue;
        
        for (let i = 0; i < inventory.container.size; i++) {
          const item = inventory.container.getItem(i);
          if (item) {
            this.refresh(item);
            inventory.container.setItem(i, item);
            refreshed++;
          }
        }
      }
      
      console.warn(`[LoreRefreshSystem] Refreshed ${refreshed} items in world`);
    } catch (error) {
      console.warn(`[LoreRefreshSystem] Failed to refresh all items:`, error);
    }
  }
}
