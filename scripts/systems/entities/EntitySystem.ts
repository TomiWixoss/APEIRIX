/**
 * EntitySystem - Auto-apply attributes to entities on spawn
 * 
 * Loads entity attribute configs from GENERATED_ENTITIES and applies them
 * when entities spawn in the world.
 */

import { world, system, Entity } from '@minecraft/server';
import { GENERATED_ENTITIES } from '../../data/GeneratedGameData';
import { EntityAttributeStorage } from '../attributes/EntityAttributeStorage';

interface EntityAttributeConfig {
  entityId: string;
  attributes: Array<{
    id: string;
    config: any;
  }>;
}

export class EntitySystem {
  private static initialized = false;
  private static entityConfigs = new Map<string, EntityAttributeConfig>();
  private static processedEntities = new WeakSet<Entity>();

  static initialize(): void {
    if (this.initialized) {
      console.warn('[EntitySystem] Already initialized, skipping...');
      return;
    }

    console.warn('[EntitySystem] Initializing...');
    
    // Load entity configs
    this.loadEntityConfigs();
    
    // Subscribe to entity spawn events
    this.subscribeToSpawnEvents();
    
    // Also check existing entities (for world load)
    this.checkExistingEntities();
    
    this.initialized = true;
    console.warn('[EntitySystem] Initialized');
  }

  private static loadEntityConfigs(): void {
    for (const entityData of GENERATED_ENTITIES) {
      this.entityConfigs.set(entityData.entityId, entityData);
    }
    
    console.warn(`[EntitySystem] Loaded ${this.entityConfigs.size} entity configs`);
  }

  private static subscribeToSpawnEvents(): void {
    // Listen to entity spawn events
    world.afterEvents.entitySpawn.subscribe((event) => {
      try {
        const { entity } = event;
        
        // Skip if already processed
        if (this.processedEntities.has(entity)) return;
        
        // Apply attributes if config exists
        this.applyAttributesToEntity(entity);
        
        // Mark as processed
        this.processedEntities.add(entity);
      } catch (error) {
        console.warn('[EntitySystem] Error in spawn handler:', error);
      }
    });
  }

  private static checkExistingEntities(): void {
    // Delay to ensure world is fully loaded
    system.runTimeout(() => {
      try {
        for (const dimName of ['overworld', 'nether', 'the_end']) {
          const dimension = world.getDimension(dimName);
          const entities = dimension.getEntities();
          
          for (const entity of entities) {
            if (this.processedEntities.has(entity)) continue;
            
            this.applyAttributesToEntity(entity);
            this.processedEntities.add(entity);
          }
        }
      } catch (error) {
        console.warn('[EntitySystem] Error checking existing entities:', error);
      }
    }, 20); // 1 second delay
  }

  private static applyAttributesToEntity(entity: Entity): void {
    const config = this.entityConfigs.get(entity.typeId);
    if (!config) return;
    
    // Check if entity already has attributes (from previous spawn or transfer)
    const existingAttrs = EntityAttributeStorage.load(entity);
    const hasExisting = Object.keys(existingAttrs).length > 0;
    
    if (hasExisting) {
      // Entity already has attributes, don't override
      console.warn(`[EntitySystem] ${entity.typeId} already has attributes, skipping auto-apply`);
      return;
    }
    
    // Apply each attribute from config
    for (const attr of config.attributes) {
      EntityAttributeStorage.setAttribute(entity, attr.id, attr.config);
    }
    
    console.warn(`[EntitySystem] Applied ${config.attributes.length} attributes to ${entity.typeId}`);
  }

  /**
   * Manually apply attributes to an entity (for testing)
   */
  static applyAttributes(entity: Entity): boolean {
    try {
      this.applyAttributesToEntity(entity);
      this.processedEntities.add(entity);
      return true;
    } catch (error) {
      console.warn('[EntitySystem] Failed to apply attributes:', error);
      return false;
    }
  }
}
