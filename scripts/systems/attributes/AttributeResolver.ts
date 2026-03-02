/**
 * AttributeResolver - Resolve attributes from multiple sources
 * 
 * NEW ARCHITECTURE: Pure dynamic, no static attributes
 * 
 * Sources for ITEMS (priority order):
 * 1. ItemStack.dynamicProperties (non-stackable items, per-instance)
 * 2. GlobalItemAttributeRegistry (stackable items, per-type)
 * 
 * NOTE: GlobalBlockAttributeRegistry is NOT checked here
 * - Block attributes are for mining checks only (RequiresToolHandler)
 * - Items should NOT show block attributes in lore
 * - Separation: Item attributes (lore) vs Block attributes (mining)
 */

import { ItemStack } from '@minecraft/server';
import { DynamicAttributeStorage } from './DynamicAttributeStorage';
import { GlobalItemAttributeRegistry } from './GlobalItemAttributeRegistry';

export interface ResolvedAttribute {
  id: string;
  source: 'item_instance' | 'item_type' | 'block_type';
  config: any;
}

export class AttributeResolver {
  // Cache resolved attributes per tick to avoid repeated JSON parsing
  private static cache = new WeakMap<ItemStack, {
    tick: number;
    attributes: ResolvedAttribute[];
  }>();
  
  /**
   * Resolve ALL attributes for ItemStack
   * 
   * Priority:
   * 1. ItemStack.dynamicProperties (non-stackable items, per-instance)
   * 2. GlobalItemAttributeRegistry (stackable items, per-type)
   * 
   * NOTE: Does NOT check GlobalBlockAttributeRegistry - block attributes are for mining only, not lore
   * 
   * @param itemStack ItemStack to resolve attributes for
   * @param currentTick Current game tick (for cache invalidation)
   * @returns Array of resolved attributes
   */
  static resolve(itemStack: ItemStack, currentTick?: number): ResolvedAttribute[] {
    // Check cache
    if (currentTick !== undefined) {
      const cached = this.cache.get(itemStack);
      if (cached && cached.tick === currentTick) {
        return cached.attributes;
      }
    }
    
    const resolved: ResolvedAttribute[] = [];
    const itemId = itemStack.typeId;
    
    // 1. Try ItemStack.dynamicProperties (non-stackable items)
    const dynamicData = DynamicAttributeStorage.load(itemStack);
    for (const [attrId, config] of Object.entries(dynamicData)) {
      resolved.push({
        id: attrId,
        source: 'item_instance',
        config: config || {}
      });
    }
    
    // 2. Check GlobalItemAttributeRegistry (stackable items, per-type)
    const itemTypeAttrs = GlobalItemAttributeRegistry.getAllAttributesForItem(itemId);
    for (const [attrId, config] of Object.entries(itemTypeAttrs)) {
      // Skip if already in resolved (instance takes priority)
      if (resolved.some(a => a.id === attrId)) continue;
      
      resolved.push({
        id: attrId,
        source: 'item_type',
        config: config || {}
      });
    }
    
    // NOTE: We do NOT check GlobalBlockAttributeRegistry here
    // Block attributes are for mining checks only, not for item lore
    // RequiresToolHandler checks GlobalBlockAttributeRegistry directly when mining
    
    // Cache result
    if (currentTick !== undefined) {
      this.cache.set(itemStack, {
        tick: currentTick,
        attributes: resolved
      });
    }
    
    return resolved;
  }
  
  /**
   * Get specific attribute config (resolved)
   */
  static getAttribute(itemStack: ItemStack, attrId: string, currentTick?: number): ResolvedAttribute | undefined {
    const resolved = this.resolve(itemStack, currentTick);
    return resolved.find(a => a.id === attrId);
  }
  
  /**
   * Check if ItemStack has specific attribute (resolved)
   */
  static hasAttribute(itemStack: ItemStack, attrId: string, currentTick?: number): boolean {
    return this.getAttribute(itemStack, attrId, currentTick) !== undefined;
  }
  
  /**
   * Get all attribute IDs (resolved)
   */
  static getAttributeIds(itemStack: ItemStack, currentTick?: number): string[] {
    return this.resolve(itemStack, currentTick).map(a => a.id);
  }
  
  /**
   * Clear cache (call when tick changes or manual refresh needed)
   */
  static clearCache(): void {
    this.cache = new WeakMap();
  }
}
