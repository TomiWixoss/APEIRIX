/**
 * DynamicAttributeStorage - Store and load dynamic attributes from ItemStack
 * 
 * Attributes được lưu trong ItemStack.dynamicProperties với format:
 * {
 *   added: { attrId: config },      // Attributes được thêm vào
 *   modified: { attrId: config },   // Attributes bị modify config
 *   disabled: ['attrId'],           // Attributes bị disable
 * }
 * 
 * Similar to durability system - attributes persist qua save/load
 */

import { ItemStack } from '@minecraft/server';

export interface DynamicAttributeData {
  added?: Record<string, any>;      // Attributes thêm vào runtime
  modified?: Record<string, any>;   // Config overrides cho static attributes
  disabled?: string[];              // Attributes bị disable
}

export class DynamicAttributeStorage {
  private static readonly PROPERTY_KEY = 'apeirix:attributes';
  
  /**
   * Load dynamic attribute data từ ItemStack
   */
  static load(itemStack: ItemStack): DynamicAttributeData {
    try {
      const json = itemStack.getDynamicProperty(this.PROPERTY_KEY) as string;
      return json ? JSON.parse(json) : {};
    } catch (error) {
      console.warn(`[DynamicAttributeStorage] Failed to load attributes:`, error);
      return {};
    }
  }
  
  /**
   * Save dynamic attribute data vào ItemStack
   */
  static save(itemStack: ItemStack, data: DynamicAttributeData): void {
    try {
      // Clean up empty objects/arrays
      const cleaned = this.cleanup(data);
      
      if (Object.keys(cleaned).length === 0) {
        // No dynamic data - remove property
        itemStack.setDynamicProperty(this.PROPERTY_KEY, undefined);
      } else {
        itemStack.setDynamicProperty(this.PROPERTY_KEY, JSON.stringify(cleaned));
      }
    } catch (error) {
      console.warn(`[DynamicAttributeStorage] Failed to save attributes:`, error);
    }
  }
  
  /**
   * Check if ItemStack has any dynamic attributes
   */
  static hasDynamicAttributes(itemStack: ItemStack): boolean {
    const data = this.load(itemStack);
    const hasAdded = !!(data.added && Object.keys(data.added).length > 0);
    const hasModified = !!(data.modified && Object.keys(data.modified).length > 0);
    const hasDisabled = !!(data.disabled && data.disabled.length > 0);
    return hasAdded || hasModified || hasDisabled;
  }
  
  /**
   * Clear all dynamic attributes
   */
  static clear(itemStack: ItemStack): void {
    itemStack.setDynamicProperty(this.PROPERTY_KEY, undefined);
  }
  
  /**
   * Cleanup empty objects/arrays
   */
  private static cleanup(data: DynamicAttributeData): DynamicAttributeData {
    const cleaned: DynamicAttributeData = {};
    
    if (data.added && Object.keys(data.added).length > 0) {
      cleaned.added = data.added;
    }
    
    if (data.modified && Object.keys(data.modified).length > 0) {
      cleaned.modified = data.modified;
    }
    
    if (data.disabled && data.disabled.length > 0) {
      cleaned.disabled = data.disabled;
    }
    
    return cleaned;
  }
}
