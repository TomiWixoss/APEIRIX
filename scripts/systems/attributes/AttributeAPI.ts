/**
 * AttributeAPI - Public API for dynamic attribute manipulation
 * 
 * Provides high-level operations:
 * - addAttribute() - Add new attribute to item
 * - removeAttribute() - Remove attribute from item
 * - transferAttribute() - Transfer attribute between items
 * - transferAttributeToBlockType() - Transfer attribute from item to block type
 * - transferAttributeBetweenBlockTypes() - Transfer attribute between block types
 * - transferAttributeFromBlockType() - Transfer attribute from block type to item
 * 
 * All operations trigger lore refresh automatically
 */

import { ItemStack } from '@minecraft/server';
import { DynamicAttributeStorage } from './DynamicAttributeStorage';
import { AttributeResolver } from './AttributeResolver';
import { LoreSystem } from '../lore/LoreSystem';
import { GlobalBlockAttributeRegistry } from './GlobalBlockAttributeRegistry';
import { GlobalItemAttributeRegistry } from './GlobalItemAttributeRegistry';

export class AttributeAPI {
  /**
   * Add attribute to ItemStack
   * 
   * For stackable items: Adds to GlobalItemAttributeRegistry (affects all items of that type)
   * For non-stackable items: Adds to ItemStack.dynamicProperties (per-instance)
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
      
      // Check if stackable (maxAmount > 1)
      const isStackable = itemStack.maxAmount > 1;
      
      if (isStackable) {
        // Add to GlobalItemAttributeRegistry (affects all items of this type)
        return GlobalItemAttributeRegistry.addItemAttribute(itemStack.typeId, attrId, config);
      } else {
        // Add to ItemStack.dynamicProperties (per-instance)
        const data = DynamicAttributeStorage.load(itemStack);
        data[attrId] = config;
        DynamicAttributeStorage.save(itemStack, data);
        
        // Trigger lore refresh
        this.triggerLoreRefresh(itemStack);
        
        console.warn(`[AttributeAPI] Added attribute '${attrId}' to ${itemStack.typeId}`);
        return true;
      }
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
      const attr = AttributeResolver.getAttribute(itemStack, attrId);
      if (!attr) {
        console.warn(`[AttributeAPI] Item doesn't have attribute: ${attrId}`);
        return false;
      }
      
      // Handle based on source
      if (attr.source === 'item_type') {
        // Remove from GlobalItemAttributeRegistry (stackable items)
        return GlobalItemAttributeRegistry.removeItemAttribute(itemStack.typeId, attrId);
      } else if (attr.source === 'item_instance') {
        // Remove from ItemStack.dynamicProperties (non-stackable items)
        const data = DynamicAttributeStorage.load(itemStack);
        delete data[attrId];
        DynamicAttributeStorage.save(itemStack, data);
        
        // Trigger lore refresh
        this.triggerLoreRefresh(itemStack);
        
        console.warn(`[AttributeAPI] Removed attribute '${attrId}' from ${itemStack.typeId}`);
        return true;
      } else {
        console.warn(`[AttributeAPI] Cannot remove attribute from source: ${attr.source}`);
        return false;
      }
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to remove attribute:`, error);
      return false;
    }
  }
  
  /**
   * Transfer attribute from one item to another
   * Auto-detects if items are blocks and updates block registry accordingly
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
      
      const sourceId = fromStack.typeId;
      const targetId = toStack.typeId;
      const config = attr.config;
      
      // Check if items are blocks (simple heuristic: contains "minecraft:" and common block names)
      const isSourceBlock = this.isBlockItem(sourceId);
      const isTargetBlock = this.isBlockItem(targetId);
      
      console.warn(`[AttributeAPI] Transfer: ${sourceId} (isBlock: ${isSourceBlock}) → ${targetId} (isBlock: ${isTargetBlock})`);
      
      // Add to target
      if (!this.addAttribute(toStack, attrId, config)) {
        return false;
      }
      
      // If target is a block, also add to block registry
      if (isTargetBlock) {
        GlobalBlockAttributeRegistry.addBlockAttribute(targetId, attrId, config);
        console.warn(`[AttributeAPI] Also added to block registry for ${targetId}`);
      }
      
      // Remove from source
      if (!this.removeAttribute(fromStack, attrId)) {
        // Rollback target
        this.removeAttribute(toStack, attrId);
        if (isTargetBlock) {
          GlobalBlockAttributeRegistry.removeBlockAttribute(targetId, attrId);
        }
        return false;
      }
      
      // If source is a block, also remove from block registry
      if (isSourceBlock) {
        GlobalBlockAttributeRegistry.removeBlockAttribute(sourceId, attrId);
        console.warn(`[AttributeAPI] Also removed from block registry for ${sourceId}`);
      }
      
      console.warn(`[AttributeAPI] Transferred attribute '${attrId}' from ${sourceId} to ${targetId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to transfer attribute:`, error);
      return false;
    }
  }
  
  /**
   * Check if an item ID represents a block
   * Simple heuristic: vanilla blocks or common block patterns
   */
  private static isBlockItem(itemId: string): boolean {
    // Common block types that can be placed
    const blockPatterns = [
      '_log', '_wood', '_planks', 'stone', 'dirt', 'grass', 'sand', 'gravel',
      'cobblestone', 'bedrock', 'ore', '_block', 'obsidian', 'netherrack',
      'end_stone', 'concrete', 'terracotta', 'wool', 'glass', 'ice'
    ];
    
    return blockPatterns.some(pattern => itemId.includes(pattern));
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
   * Transfer attribute from item to block type
   * Transfers BOTH item attributes (for lore) AND block attributes (for mining)
   * 
   * @param itemStack Source item
   * @param attrId Attribute ID to transfer
   * @param targetBlockId Target block type ID (e.g., 'minecraft:dirt')
   * @returns Success status
   */
  static transferAttributeToBlockType(itemStack: ItemStack, attrId: string, targetBlockId: string): boolean {
    try {
      // Check source has attribute
      const attr = AttributeResolver.getAttribute(itemStack, attrId);
      if (!attr) {
        console.warn(`[AttributeAPI] Source item doesn't have attribute: ${attrId}`);
        return false;
      }
      
      const sourceItemId = itemStack.typeId;
      const config = attr.config;
      
      // Transfer item attributes (for lore)
      // 1. Remove from source item type
      if (GlobalItemAttributeRegistry.hasItemAttribute(sourceItemId, attrId)) {
        GlobalItemAttributeRegistry.removeItemAttribute(sourceItemId, attrId);
      }
      
      // 2. Add to target item type
      GlobalItemAttributeRegistry.addItemAttribute(targetBlockId, attrId, config);
      
      // Transfer block attributes (for mining)
      // 3. Remove from source block type
      if (GlobalBlockAttributeRegistry.hasBlockAttribute(sourceItemId, attrId)) {
        GlobalBlockAttributeRegistry.removeBlockAttribute(sourceItemId, attrId);
      }
      
      // 4. Add to target block type
      GlobalBlockAttributeRegistry.addBlockAttribute(targetBlockId, attrId, config);
      
      console.warn(`[AttributeAPI] Transferred attribute '${attrId}' from ${sourceItemId} to ${targetBlockId} (both item and block)`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to transfer attribute to block type:`, error);
      return false;
    }
  }
  
  /**
   * Transfer attribute between block types
   * 
   * @param fromBlockId Source block type ID
   * @param toBlockId Target block type ID
   * @param attrId Attribute ID to transfer
   * @returns Success status
   */
  static transferAttributeBetweenBlockTypes(fromBlockId: string, toBlockId: string, attrId: string): boolean {
    try {
      // Check source has attribute (dynamic only - can't transfer static)
      if (!GlobalBlockAttributeRegistry.hasBlockAttribute(fromBlockId, attrId)) {
        console.warn(`[AttributeAPI] Source block type doesn't have dynamic attribute: ${attrId}`);
        return false;
      }
      
      const config = GlobalBlockAttributeRegistry.getBlockAttribute(fromBlockId, attrId);
      
      // Check target doesn't have attribute
      if (GlobalBlockAttributeRegistry.hasBlockAttribute(toBlockId, attrId)) {
        console.warn(`[AttributeAPI] Target block type already has attribute: ${attrId}`);
        return false;
      }
      
      // Add to target
      if (!GlobalBlockAttributeRegistry.addBlockAttribute(toBlockId, attrId, config)) {
        return false;
      }
      
      // Remove from source
      if (!GlobalBlockAttributeRegistry.removeBlockAttribute(fromBlockId, attrId)) {
        // Rollback target
        GlobalBlockAttributeRegistry.removeBlockAttribute(toBlockId, attrId);
        return false;
      }
      
      console.warn(`[AttributeAPI] Transferred attribute '${attrId}' from block type ${fromBlockId} to ${toBlockId}`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to transfer attribute between block types:`, error);
      return false;
    }
  }
  
  /**
   * Transfer attribute from block type to item
   * Transfers BOTH item attributes (for lore) AND block attributes (for mining)
   * 
   * @param sourceBlockId Source block type ID
   * @param targetStack Target item
   * @param attrId Attribute ID to transfer
   * @returns Success status
   */
  static transferAttributeFromBlockType(sourceBlockId: string, targetStack: ItemStack, attrId: string): boolean {
    try {
      // Check source has attribute in block registry
      if (!GlobalBlockAttributeRegistry.hasBlockAttribute(sourceBlockId, attrId)) {
        console.warn(`[AttributeAPI] Source block type doesn't have dynamic attribute in block registry: ${attrId}`);
        return false;
      }
      
      const config = GlobalBlockAttributeRegistry.getBlockAttribute(sourceBlockId, attrId);
      
      // Check target doesn't have attribute
      if (AttributeResolver.hasAttribute(targetStack, attrId)) {
        console.warn(`[AttributeAPI] Target item already has attribute: ${attrId}`);
        return false;
      }
      
      // Add to target item
      if (!this.addAttribute(targetStack, attrId, config)) {
        return false;
      }
      
      // Remove from source ITEM registry (for lore)
      if (GlobalItemAttributeRegistry.hasItemAttribute(sourceBlockId, attrId)) {
        GlobalItemAttributeRegistry.removeItemAttribute(sourceBlockId, attrId);
      }
      
      // Remove from source BLOCK registry (for mining)
      if (!GlobalBlockAttributeRegistry.removeBlockAttribute(sourceBlockId, attrId)) {
        // Rollback target
        this.removeAttribute(targetStack, attrId);
        // Rollback item registry
        GlobalItemAttributeRegistry.addItemAttribute(sourceBlockId, attrId, config);
        return false;
      }
      
      console.warn(`[AttributeAPI] Transferred attribute '${attrId}' from block type ${sourceBlockId} to item ${targetStack.typeId} (both item and block)`);
      return true;
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to transfer attribute from block type to item:`, error);
      return false;
    }
  }
  
  /**
   * Trigger lore refresh for ItemStack
   * Uses unified dynamic lore system
   */
  private static triggerLoreRefresh(itemStack: ItemStack): void {
    try {
      LoreSystem.applyLore(itemStack);
    } catch (error) {
      console.warn(`[AttributeAPI] Failed to refresh lore:`, error);
    }
  }
}
