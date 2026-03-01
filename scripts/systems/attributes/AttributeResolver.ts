/**
 * AttributeResolver - Resolve static + dynamic attributes
 * 
 * Merge attributes từ 2 sources:
 * 1. Static (GeneratedAttributes.ts) - default attributes từ YAML
 * 2. Dynamic (ItemStack properties) - runtime modifications
 * 
 * Priority: Dynamic > Static
 * - Dynamic.disabled → disable static attribute
 * - Dynamic.modified → override static config
 * - Dynamic.added → add new attribute
 */

import { ItemStack } from '@minecraft/server';
import { getItemAttributes, getAttributeConfig } from '../../data/GeneratedAttributes';
import { DynamicAttributeStorage, DynamicAttributeData } from './DynamicAttributeStorage';

export interface ResolvedAttribute {
  id: string;
  source: 'static' | 'dynamic' | 'modified';
  config: any;
  enabled: boolean;
}

export class AttributeResolver {
  // Cache resolved attributes per tick to avoid repeated JSON parsing
  private static cache = new WeakMap<ItemStack, {
    tick: number;
    attributes: ResolvedAttribute[];
  }>();
  
  /**
   * Resolve ALL attributes (static + dynamic) cho ItemStack
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
    
    // 1. Load static attributes (from GeneratedAttributes)
    const staticAttrs = getItemAttributes(itemId);
    for (const attrId of staticAttrs) {
      const config = getAttributeConfig(itemId, attrId);
      resolved.push({
        id: attrId,
        source: 'static',
        config: config || {},
        enabled: true
      });
    }
    
    // 2. Load dynamic data
    const dynamicData = DynamicAttributeStorage.load(itemStack);
    
    // 3. Apply dynamic modifications
    this.applyDynamicData(resolved, dynamicData);
    
    // 4. Filter disabled attributes
    const filtered = resolved.filter(a => a.enabled);
    
    // Cache result
    if (currentTick !== undefined) {
      this.cache.set(itemStack, {
        tick: currentTick,
        attributes: filtered
      });
    }
    
    return filtered;
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
   * Apply dynamic data to resolved attributes
   */
  private static applyDynamicData(resolved: ResolvedAttribute[], dynamicData: DynamicAttributeData): void {
    // 2a. Disable attributes
    if (dynamicData.disabled) {
      for (const attrId of dynamicData.disabled) {
        const existing = resolved.find(a => a.id === attrId);
        if (existing) {
          existing.enabled = false;
        }
      }
    }
    
    // 2b. Modify existing attributes
    if (dynamicData.modified) {
      for (const [attrId, configPatch] of Object.entries(dynamicData.modified)) {
        const existing = resolved.find(a => a.id === attrId);
        if (existing) {
          existing.config = { ...existing.config, ...configPatch };
          existing.source = 'modified';
        }
      }
    }
    
    // 2c. Add new attributes
    if (dynamicData.added) {
      for (const [attrId, config] of Object.entries(dynamicData.added)) {
        // Skip if already exists (shouldn't happen, but safety check)
        if (resolved.some(a => a.id === attrId)) {
          continue;
        }
        
        resolved.push({
          id: attrId,
          source: 'dynamic',
          config: config || {},
          enabled: true
        });
      }
    }
  }
  
  /**
   * Clear cache (call when tick changes or manual refresh needed)
   */
  static clearCache(): void {
    this.cache = new WeakMap();
  }
}
