/**
 * DynamicAttributeStorage - Store and load dynamic attributes from ItemStack.dynamicProperties
 * 
 * PURE DYNAMIC SYSTEM:
 * - Only for NON-STACKABLE items (tools, armor)
 * - Stackable items use GlobalItemAttributeRegistry instead
 * - Simple key-value storage: attrId → config
 * 
 * Storage format in dynamicProperties:
 * {
 *   attrId: config,
 *   attrId2: config2,
 *   ...
 * }
 */

import { ItemStack } from '@minecraft/server';

export type DynamicAttributeData = Record<string, any>; // attrId → config

export class DynamicAttributeStorage {
  private static readonly PROPERTY_KEY = 'apeirix:attributes';
  
  /**
   * Load dynamic attributes from ItemStack.dynamicProperties
   * Only works for non-stackable items
   */
  static load(itemStack: ItemStack): DynamicAttributeData {
    try {
      const json = itemStack.getDynamicProperty(this.PROPERTY_KEY) as string;
      if (json) {
        return JSON.parse(json);
      }
    } catch (error) {
      // Ignore - return empty
    }
    
    return {};
  }
  
  /**
   * Save dynamic attributes to ItemStack.dynamicProperties
   * Only works for non-stackable items
   */
  static save(itemStack: ItemStack, data: DynamicAttributeData): void {
    try {
      if (Object.keys(data).length === 0) {
        itemStack.setDynamicProperty(this.PROPERTY_KEY, undefined);
      } else {
        itemStack.setDynamicProperty(this.PROPERTY_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.warn(`[DynamicAttributeStorage] Failed to save (probably stackable item):`, error);
    }
  }
  
  /**
   * Check if ItemStack has any dynamic attributes
   */
  static hasDynamicAttributes(itemStack: ItemStack): boolean {
    const data = this.load(itemStack);
    return Object.keys(data).length > 0;
  }
  
  /**
   * Clear all dynamic attributes
   */
  static clear(itemStack: ItemStack): void {
    try {
      itemStack.setDynamicProperty(this.PROPERTY_KEY, undefined);
    } catch (error) {
      // Ignore
    }
  }
}
