/**
 * GlobalItemAttributeRegistry - Global registry for item type attributes
 * 
 * Manages dynamic attributes for ITEM TYPES (not per-instance):
 * - Attributes apply to ALL items of that type in the world
 * - Persisted to world.dynamicProperty
 * - Used for STACKABLE items (blocks, materials, etc.)
 * 
 * Priority: GlobalItemAttributeRegistry > ItemStack.dynamicProperties
 * 
 * Use cases:
 * - Stackable items that need attributes (dirt, cobblestone, etc.)
 * - Runtime modification of item behavior
 * - Attribute transfer between item types
 * 
 * Example:
 * - Add requires_tool to dirt item type
 * - Now ALL dirt items require axe
 */

import { world } from '@minecraft/server';
import { GENERATED_ATTRIBUTES, getAttributeConfig } from '../../data/GeneratedAttributes';

interface ItemAttributeData {
  [itemId: string]: {
    [attrId: string]: any; // Attribute config
  };
}

export class GlobalItemAttributeRegistry {
  private static readonly PROPERTY_KEY = 'apeirix:item_attributes';
  private static readonly MIGRATION_FLAG_KEY = 'apeirix:item_attrs_migrated';
  private static data: ItemAttributeData = {};
  private static initialized = false;

  /**
   * Initialize registry - load from world storage
   * Also performs one-time migration from static attributes
   */
  static initialize(): void {
    if (this.initialized) {
      console.warn('[GlobalItemAttributeRegistry] Already initialized, skipping...');
      return;
    }

    console.warn('[GlobalItemAttributeRegistry] Initializing...');
    this.load();
    
    // Check if migration needed
    this.performMigrationIfNeeded();
    
    this.initialized = true;
    
    const itemCount = Object.keys(this.data).length;
    const attrCount = Object.values(this.data).reduce((sum, attrs) => sum + Object.keys(attrs).length, 0);
    console.warn(`[GlobalItemAttributeRegistry] Loaded ${attrCount} attributes for ${itemCount} item types`);
  }

  /**
   * Perform one-time migration from static attributes (YAML) to dynamic registry
   */
  private static performMigrationIfNeeded(): void {
    try {
      // Check if already migrated
      const migrated = world.getDynamicProperty(this.MIGRATION_FLAG_KEY);
      if (migrated) {
        console.warn('[GlobalItemAttributeRegistry] Migration already completed, skipping...');
        return;
      }

      console.warn('[GlobalItemAttributeRegistry] Performing one-time migration from YAML...');
      
      let migratedCount = 0;
      
      // Migrate all static attributes to registry
      // GENERATED_ATTRIBUTES format: { attrId: [{ itemId, config }, ...] }
      for (const [attrId, items] of Object.entries(GENERATED_ATTRIBUTES)) {
        for (const item of items) {
          const itemId = item.itemId;
          const config = item.config || {};
          
          if (!this.data[itemId]) {
            this.data[itemId] = {};
          }
          
          this.data[itemId][attrId] = config;
          migratedCount++;
        }
      }
      
      // Save migrated data
      this.save();
      
      // Set migration flag
      world.setDynamicProperty(this.MIGRATION_FLAG_KEY, true);
      
      console.warn(`[GlobalItemAttributeRegistry] Migration completed: ${migratedCount} item attributes migrated`);
    } catch (error) {
      console.warn(`[GlobalItemAttributeRegistry] Migration failed:`, error);
    }
  }

  /**
   * Add attribute to item type
   * 
   * @param itemId Item type ID (e.g., 'minecraft:dirt')
   * @param attrId Attribute ID (e.g., 'requires_tool')
   * @param config Attribute config
   * @returns Success status
   */
  static addItemAttribute(itemId: string, attrId: string, config: any = {}): boolean {
    try {
      if (!this.data[itemId]) {
        this.data[itemId] = {};
      }

      this.data[itemId][attrId] = config;
      this.save();

      console.warn(`[GlobalItemAttributeRegistry] Added attribute '${attrId}' to item type '${itemId}'`);
      return true;
    } catch (error) {
      console.warn(`[GlobalItemAttributeRegistry] Failed to add attribute:`, error);
      return false;
    }
  }

  /**
   * Remove attribute from item type
   * 
   * @param itemId Item type ID
   * @param attrId Attribute ID to remove
   * @returns Success status
   */
  static removeItemAttribute(itemId: string, attrId: string): boolean {
    try {
      if (!this.data[itemId] || !this.data[itemId][attrId]) {
        console.warn(`[GlobalItemAttributeRegistry] Item type '${itemId}' doesn't have attribute '${attrId}'`);
        return false;
      }

      delete this.data[itemId][attrId];

      // Clean up empty item entry
      if (Object.keys(this.data[itemId]).length === 0) {
        delete this.data[itemId];
      }

      this.save();

      console.warn(`[GlobalItemAttributeRegistry] Removed attribute '${attrId}' from item type '${itemId}'`);
      return true;
    } catch (error) {
      console.warn(`[GlobalItemAttributeRegistry] Failed to remove attribute:`, error);
      return false;
    }
  }

  /**
   * Get attribute config for item type
   * 
   * @param itemId Item type ID
   * @param attrId Attribute ID
   * @returns Attribute config or undefined
   */
  static getItemAttribute(itemId: string, attrId: string): any | undefined {
    return this.data[itemId]?.[attrId];
  }

  /**
   * Check if item type has attribute
   * 
   * @param itemId Item type ID
   * @param attrId Attribute ID
   * @returns True if item type has attribute
   */
  static hasItemAttribute(itemId: string, attrId: string): boolean {
    return !!(this.data[itemId]?.[attrId] !== undefined);
  }

  /**
   * Get all attributes for item type
   * 
   * @param itemId Item type ID
   * @returns Array of attribute IDs
   */
  static getItemAttributes(itemId: string): string[] {
    return Object.keys(this.data[itemId] || {});
  }

  /**
   * Get all attributes with configs for item type
   * 
   * @param itemId Item type ID
   * @returns Record of attribute ID → config
   */
  static getAllAttributesForItem(itemId: string): Record<string, any> {
    return this.data[itemId] || {};
  }

  /**
   * Get all item attributes (for debugging)
   */
  static getAllItemAttributes(): ItemAttributeData {
    return { ...this.data };
  }

  /**
   * Clear all item attributes (for testing/reset)
   */
  static clearAll(): void {
    this.data = {};
    this.save();
    console.warn('[GlobalItemAttributeRegistry] Cleared all item attributes');
  }

  /**
   * Load data from world storage
   */
  private static load(): void {
    try {
      const json = world.getDynamicProperty(this.PROPERTY_KEY) as string;
      this.data = json ? JSON.parse(json) : {};
    } catch (error) {
      console.warn(`[GlobalItemAttributeRegistry] Failed to load from world storage:`, error);
      this.data = {};
    }
  }

  /**
   * Save data to world storage
   */
  private static save(): void {
    try {
      if (Object.keys(this.data).length === 0) {
        // No data - remove property
        world.setDynamicProperty(this.PROPERTY_KEY, undefined);
      } else {
        world.setDynamicProperty(this.PROPERTY_KEY, JSON.stringify(this.data));
      }
    } catch (error) {
      console.warn(`[GlobalItemAttributeRegistry] Failed to save to world storage:`, error);
    }
  }
}
