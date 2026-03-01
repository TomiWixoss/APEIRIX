/**
 * AttributeAPI - Public API for dynamic attribute manipulation
 * 
 * Provides high-level operations:
 * - addAttribute() - Add new attribute to item
 * - removeAttribute() - Remove attribute from item
 * - modifyAttribute() - Modify attribute config
 * - transferAttribute() - Transfer attribute between items
 * - resetAttributes() - Reset to static defaults
 * 
 * All operations trigger lore refresh automatically
 */

import { ItemStack, Player } from '@minecraft/server';
import { DynamicAttributeStorage } from './DynamicAttributeStorage';
import { AttributeResolver } from './AttributeResolver';
import { hasAttribute as hasStaticAttribute } from '../../data/GeneratedAttributes';
import { LoreRefreshSystem } from '../lore/LoreRefreshSystem';

export class AttributeAPI {
  /**
   * Add attribute to ItemStack
   * 
   * @param itemStack Target item
   * @param attrId Attribute ID (e.g., 'hammer_mining')
   * @param config Attribute config (optional)
   * @returns Success status
   */
  static addAttribute(itemStack: ItemStack, attrId: string, config: any = {}): boolean {
    try {
      // Check if already has attribute
      if (AttributeResolver.hasAttribute(itemStack, attrId)) {
        console.warn(`[AttributeAPI] Item already has attribute: ${attrId}`);
        return false;
      }
      
      // Load dynamic data
      const data = DynamicAttributeStorage.load(itemStack);
      
      // Add to added list
      data.added = data.added || {};
      data.added[attrId] = config;
      
      // Save
      DynamicAttributeStorage.save(itemStack, data);
      
      // Trigger lore refresh
      this.triggerLoreRefresh(itemStack);
      
      console.warn(`[AttributeAPI] Added attribute '${attrId}' to ${itemStack.typeId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to add attribute:`, error);
      return false;
    }
  }
  
  /**
   * Remove attribute from ItemStack
   * 
   * @param itemStack Target item
   * @param attrId Attribute ID to remove
   * @returns Success status
   */
  static removeAttribute(itemStack: ItemStack, attrId: string): boolean {
    try {
      // Check if has attribute
      if (!AttributeResolver.hasAttribute(itemStack, attrId)) {
        console.warn(`[AttributeAPI] Item doesn't have attribute: ${attrId}`);
        return false;
      }
      
      // Load dynamic data
      const data = DynamicAttributeStorage.load(itemStack);
      
      // If static attribute, add to disabled list
      if (hasStaticAttribute(itemStack.typeId, attrId)) {
        data.disabled = data.disabled || [];
        if (!data.disabled.includes(attrId)) {
          data.disabled.push(attrId);
        }
      }
      
      // If dynamic attribute, remove from added
      if (data.added?.[attrId]) {
        delete data.added[attrId];
      }
      
      // Remove from modified (if exists)
      if (data.modified?.[attrId]) {
        delete data.modified[attrId];
      }
      
      // Save
      DynamicAttributeStorage.save(itemStack, data);
      
      // Trigger lore refresh
      this.triggerLoreRefresh(itemStack);
      
      console.warn(`[AttributeAPI] Removed attribute '${attrId}' from ${itemStack.typeId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to remove attribute:`, error);
      return false;
    }
  }
  
  /**
   * Modify attribute config
   * 
   * @param itemStack Target item
   * @param attrId Attribute ID to modify
   * @param configPatch Config changes (merged with existing)
   * @returns Success status
   */
  static modifyAttribute(itemStack: ItemStack, attrId: string, configPatch: any): boolean {
    try {
      // Check if has attribute
      if (!AttributeResolver.hasAttribute(itemStack, attrId)) {
        console.warn(`[AttributeAPI] Item doesn't have attribute: ${attrId}`);
        return false;
      }
      
      // Load dynamic data
      const data = DynamicAttributeStorage.load(itemStack);
      
      // Get current config
      const current = AttributeResolver.getAttribute(itemStack, attrId);
      if (!current) return false;
      
      // Merge config
      const newConfig = { ...current.config, ...configPatch };
      
      // If dynamic attribute, update added
      if (data.added?.[attrId]) {
        data.added[attrId] = newConfig;
      } else {
        // Static attribute, add to modified
        data.modified = data.modified || {};
        data.modified[attrId] = newConfig;
      }
      
      // Save
      DynamicAttributeStorage.save(itemStack, data);
      
      // Trigger lore refresh
      this.triggerLoreRefresh(itemStack);
      
      console.warn(`[AttributeAPI] Modified attribute '${attrId}' on ${itemStack.typeId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to modify attribute:`, error);
      return false;
    }
  }
  
  /**
   * Transfer attribute from one item to another
   * 
   * @param fromStack Source item
   * @param toStack Target item
   * @param attrId Attribute ID to transfer
   * @returns Success status
   */
  static transferAttribute(fromStack: ItemStack, toStack: ItemStack, attrId: string): boolean {
    try {
      // Check source has attribute
      const attr = AttributeResolver.getAttribute(fromStack, attrId);
      if (!attr) {
        console.warn(`[AttributeAPI] Source item doesn't have attribute: ${attrId}`);
        return false;
      }
      
      // Check target doesn't have attribute
      if (AttributeResolver.hasAttribute(toStack, attrId)) {
        console.warn(`[AttributeAPI] Target item already has attribute: ${attrId}`);
        return false;
      }
      
      // Add to target
      if (!this.addAttribute(toStack, attrId, attr.config)) {
        return false;
      }
      
      // Remove from source
      if (!this.removeAttribute(fromStack, attrId)) {
        // Rollback target
        this.removeAttribute(toStack, attrId);
        return false;
      }
      
      console.warn(`[AttributeAPI] Transferred attribute '${attrId}' from ${fromStack.typeId} to ${toStack.typeId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to transfer attribute:`, error);
      return false;
    }
  }
  
  /**
   * Reset item to static attributes (remove all dynamic modifications)
   * 
   * @param itemStack Target item
   * @returns Success status
   */
  static resetAttributes(itemStack: ItemStack): boolean {
    try {
      DynamicAttributeStorage.clear(itemStack);
      
      // Trigger lore refresh
      this.triggerLoreRefresh(itemStack);
      
      console.warn(`[AttributeAPI] Reset attributes for ${itemStack.typeId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to reset attributes:`, error);
      return false;
    }
  }
  
  /**
   * Get all attributes (resolved) for display/debugging
   */
  static getAttributes(itemStack: ItemStack): Array<{ id: string; config: any; source: string }> {
    const resolved = AttributeResolver.resolve(itemStack);
    return resolved.map(a => ({
      id: a.id,
      config: a.config,
      source: a.source
    }));
  }
  
  /**
   * Trigger lore refresh for ItemStack
   */
  private static triggerLoreRefresh(itemStack: ItemStack): void {
    try {
      LoreRefreshSystem.refresh(itemStack);
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to refresh lore:`, error);
    }
  }
}
