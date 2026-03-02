/**
 * EntityAttributeStorage - Store and load dynamic attributes from Entity.dynamicProperties
 * 
 * PURE DYNAMIC SYSTEM (per-instance):
 * - Each entity instance has its own attributes
 * - Stored in entity.dynamicProperties
 * - Simple key-value storage: attrId → config
 * 
 * Storage format in dynamicProperties:
 * {
 *   attrId: config,
 *   attrId2: config2,
 *   ...
 * }
 */

import { Entity } from '@minecraft/server';

export type EntityAttributeData = Record<string, any>; // attrId → config

export class EntityAttributeStorage {
  private static readonly PROPERTY_KEY = 'apeirix:entity_attributes';
  
  /**
   * Load dynamic attributes from Entity.dynamicProperties
   */
  static load(entity: Entity): EntityAttributeData {
    try {
      const json = entity.getDynamicProperty(this.PROPERTY_KEY) as string;
      if (!json) return {};
      
      const data = JSON.parse(json);
      return data || {};
    } catch (error) {
      console.warn(`[EntityAttributeStorage] Failed to load attributes for ${entity.typeId}:`, error);
      return {};
    }
  }
  
  /**
   * Save dynamic attributes to Entity.dynamicProperties
   */
  static save(entity: Entity, data: EntityAttributeData): void {
    try {
      const json = JSON.stringify(data);
      entity.setDynamicProperty(this.PROPERTY_KEY, json);
    } catch (error) {
      console.warn(`[EntityAttributeStorage] Failed to save attributes for ${entity.typeId}:`, error);
    }
  }
  
  /**
   * Clear all attributes from entity
   */
  static clear(entity: Entity): void {
    try {
      entity.setDynamicProperty(this.PROPERTY_KEY, undefined);
    } catch (error) {
      console.warn(`[EntityAttributeStorage] Failed to clear attributes for ${entity.typeId}:`, error);
    }
  }
  
  /**
   * Check if entity has any attributes
   */
  static hasAttributes(entity: Entity): boolean {
    const data = this.load(entity);
    return Object.keys(data).length > 0;
  }
  
  /**
   * Get specific attribute from entity
   */
  static getAttribute(entity: Entity, attrId: string): any | undefined {
    const data = this.load(entity);
    return data[attrId];
  }
  
  /**
   * Set specific attribute on entity
   */
  static setAttribute(entity: Entity, attrId: string, config: any): void {
    const data = this.load(entity);
    data[attrId] = config;
    this.save(entity, data);
  }
  
  /**
   * Remove specific attribute from entity
   */
  static removeAttribute(entity: Entity, attrId: string): boolean {
    const data = this.load(entity);
    if (!(attrId in data)) return false;
    
    delete data[attrId];
    this.save(entity, data);
    return true;
  }
}
