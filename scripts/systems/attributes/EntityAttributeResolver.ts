/**
 * EntityAttributeResolver - Resolve attributes from Entity
 * 
 * PURE DYNAMIC SYSTEM:
 * - Only source: Entity.dynamicProperties (per-instance)
 * - No static attributes for entities
 * - No global registry for entity types
 */

import { Entity } from '@minecraft/server';
import { EntityAttributeStorage } from './EntityAttributeStorage';

export interface ResolvedEntityAttribute {
  id: string;
  source: 'entity_instance';
  config: any;
}

export class EntityAttributeResolver {
  /**
   * Resolve ALL attributes for Entity
   * 
   * @param entity Entity to resolve attributes for
   * @returns Array of resolved attributes
   */
  static resolve(entity: Entity): ResolvedEntityAttribute[] {
    const resolved: ResolvedEntityAttribute[] = [];
    
    // Load from entity.dynamicProperties
    const data = EntityAttributeStorage.load(entity);
    for (const [attrId, config] of Object.entries(data)) {
      resolved.push({
        id: attrId,
        source: 'entity_instance',
        config: config || {}
      });
    }
    
    return resolved;
  }
  
  /**
   * Get specific attribute from entity
   * 
   * @param entity Entity to check
   * @param attrId Attribute ID
   * @returns Resolved attribute or undefined
   */
  static getAttribute(entity: Entity, attrId: string): ResolvedEntityAttribute | undefined {
    const data = EntityAttributeStorage.load(entity);
    if (!(attrId in data)) return undefined;
    
    return {
      id: attrId,
      source: 'entity_instance',
      config: data[attrId] || {}
    };
  }
  
  /**
   * Check if entity has specific attribute
   * 
   * @param entity Entity to check
   * @param attrId Attribute ID
   * @returns True if entity has attribute
   */
  static hasAttribute(entity: Entity, attrId: string): boolean {
    return this.getAttribute(entity, attrId) !== undefined;
  }
  
  /**
   * Get all attribute IDs for entity
   * 
   * @param entity Entity to check
   * @returns Array of attribute IDs
   */
  static getAttributeIds(entity: Entity): string[] {
    const data = EntityAttributeStorage.load(entity);
    return Object.keys(data);
  }
}
