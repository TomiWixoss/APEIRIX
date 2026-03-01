/**
 * GlobalBlockAttributeRegistry - Global registry for block type attributes
 * 
 * Manages dynamic attributes for BLOCK TYPES (not per-location):
 * - Attributes apply to ALL blocks of that type in the world
 * - Persisted to world.dynamicProperty
 * - Priority: Dynamic (this registry) > Static (YAML)
 * 
 * Use cases:
 * - Transfer attribute from item to block type
 * - Transfer attribute between block types
 * - Runtime modification of block behavior
 * 
 * Example:
 * - Log item has requires_tool:axe → Transfer to dirt block type
 * - Now ALL dirt blocks require axe to mine
 */

import { world } from '@minecraft/server';

interface BlockAttributeData {
  [blockId: string]: {
    [attrId: string]: any; // Attribute config
  };
}

export class GlobalBlockAttributeRegistry {
  private static readonly PROPERTY_KEY = 'apeirix:block_attributes';
  private static data: BlockAttributeData = {};
  private static initialized = false;

  /**
   * Initialize registry - load from world storage
   */
  static initialize(): void {
    if (this.initialized) {
      console.warn('[GlobalBlockAttributeRegistry] Already initialized, skipping...');
      return;
    }

    console.warn('[GlobalBlockAttributeRegistry] Initializing...');
    this.load();
    this.initialized = true;
    
    const blockCount = Object.keys(this.data).length;
    const attrCount = Object.values(this.data).reduce((sum, attrs) => sum + Object.keys(attrs).length, 0);
    console.warn(`[GlobalBlockAttributeRegistry] Loaded ${attrCount} attributes for ${blockCount} block types`);
  }

  /**
   * Add attribute to block type
   * 
   * @param blockId Block type ID (e.g., 'minecraft:dirt')
   * @param attrId Attribute ID (e.g., 'requires_tool')
   * @param config Attribute config
   * @returns Success status
   */
  static addBlockAttribute(blockId: string, attrId: string, config: any = {}): boolean {
    try {
      if (!this.data[blockId]) {
        this.data[blockId] = {};
      }

      this.data[blockId][attrId] = config;
      this.save();

      console.warn(`[GlobalBlockAttributeRegistry] Added attribute '${attrId}' to block type '${blockId}'`);
      return true;
    } catch (error) {
      console.warn(`[GlobalBlockAttributeRegistry] Failed to add attribute:`, error);
      return false;
    }
  }

  /**
   * Remove attribute from block type
   * 
   * @param blockId Block type ID
   * @param attrId Attribute ID to remove
   * @returns Success status
   */
  static removeBlockAttribute(blockId: string, attrId: string): boolean {
    try {
      if (!this.data[blockId] || !this.data[blockId][attrId]) {
        console.warn(`[GlobalBlockAttributeRegistry] Block type '${blockId}' doesn't have attribute '${attrId}'`);
        return false;
      }

      delete this.data[blockId][attrId];

      // Clean up empty block entry
      if (Object.keys(this.data[blockId]).length === 0) {
        delete this.data[blockId];
      }

      this.save();

      console.warn(`[GlobalBlockAttributeRegistry] Removed attribute '${attrId}' from block type '${blockId}'`);
      return true;
    } catch (error) {
      console.warn(`[GlobalBlockAttributeRegistry] Failed to remove attribute:`, error);
      return false;
    }
  }

  /**
   * Get attribute config for block type
   * 
   * @param blockId Block type ID
   * @param attrId Attribute ID
   * @returns Attribute config or undefined
   */
  static getBlockAttribute(blockId: string, attrId: string): any | undefined {
    return this.data[blockId]?.[attrId];
  }

  /**
   * Check if block type has attribute
   * 
   * @param blockId Block type ID
   * @param attrId Attribute ID
   * @returns True if block type has attribute
   */
  static hasBlockAttribute(blockId: string, attrId: string): boolean {
    return !!(this.data[blockId]?.[attrId] !== undefined);
  }

  /**
   * Get all attributes for block type
   * 
   * @param blockId Block type ID
   * @returns Array of attribute IDs
   */
  static getBlockAttributes(blockId: string): string[] {
    return Object.keys(this.data[blockId] || {});
  }

  /**
   * Get all block attributes (for debugging)
   */
  static getAllBlockAttributes(): BlockAttributeData {
    return { ...this.data };
  }

  /**
   * Clear all block attributes (for testing/reset)
   */
  static clearAll(): void {
    this.data = {};
    this.save();
    console.warn('[GlobalBlockAttributeRegistry] Cleared all block attributes');
  }

  /**
   * Load data from world storage
   */
  private static load(): void {
    try {
      const json = world.getDynamicProperty(this.PROPERTY_KEY) as string;
      this.data = json ? JSON.parse(json) : {};
    } catch (error) {
      console.warn(`[GlobalBlockAttributeRegistry] Failed to load from world storage:`, error);
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
      console.warn(`[GlobalBlockAttributeRegistry] Failed to save to world storage:`, error);
    }
  }
}
