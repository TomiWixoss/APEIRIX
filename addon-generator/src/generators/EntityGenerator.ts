import { FileManager } from '../core/FileManager.js';
import { Validator } from '../core/Validator.js';
import { SpawnRuleGenerator } from './SpawnRuleGenerator.js';
import { join } from 'path';

export interface EntityConfig {
  id: string;
  name: string;
  spawnEgg?: {
    texture: string;
    baseColor?: string;
    overlayColor?: string;
  };
  model: string;
  texture: string;
  animation?: string;
  animationName?: string;
  health?: number;
  movement?: number;
  attack?: number;
  collisionBox?: {
    width: number;
    height: number;
  };
  spawnCategory?: 'monster' | 'creature' | 'ambient' | 'water_creature';
  isSpawnable?: boolean;
  isSummonable?: boolean;
  spawnRules?: {
    populationControl?: string;
    weight?: number;
    minGroupSize?: number;
    maxGroupSize?: number;
    conditions?: {
      surface?: boolean;
      underground?: boolean;
      brightnessMin?: number;
      brightnessMax?: number;
      biomes?: string[];
      nearBlocks?: string[];
      nearBlocksRadius?: number;
    };
  };
  lootTable?: any;
  behaviors?: any;
}

/**
 * Generator cho Entity (Mobs)
 */
export class EntityGenerator {
  constructor(private projectRoot: string) {}

  generate(config: EntityConfig): void {
    if (!config.name) {
      return;
    }
    
    if (!Validator.validateItemId(config.id)) {
      throw new Error(`Entity ID không hợp lệ: "${config.id}"`);
    }

    if (!Validator.validateDisplayName(config.name)) {
      throw new Error('Display name không được rỗng');
    }

    const entityData: any = {
      format_version: "1.21.0",
      "minecraft:entity": {
        description: {
          identifier: `apeirix:${config.id}`,
          spawn_category: config.spawnCategory || "monster",
          is_spawnable: config.isSpawnable !== false,
          is_summonable: config.isSummonable !== false
        },
        components: {
          "minecraft:type_family": {
            family: [config.id, config.spawnCategory || "monster", "mob"]
          },
          "minecraft:health": {
            value: config.health || 10,
            max: config.health || 10
          },
          "minecraft:movement": {
            value: config.movement || 0.25
          },
          "minecraft:navigation.walk": {
            can_path_over_water: true
          },
          "minecraft:movement.basic": {},
          "minecraft:jump.static": {},
          "minecraft:collision_box": {
            width: config.collisionBox?.width || 0.4,
            height: config.collisionBox?.height || 0.3
          },
          "minecraft:physics": {},
          "minecraft:pushable": {
            is_pushable: true,
            is_pushable_by_piston: true
          }
        }
      }
    };

    // Add attack if specified
    if (config.attack) {
      entityData["minecraft:entity"].components["minecraft:attack"] = {
        damage: config.attack
      };
    }

    // Add loot table if specified
    if (config.lootTable) {
      entityData["minecraft:entity"].components["minecraft:loot"] = {
        table: `loot_tables/entities/${config.id}.json`
      };
    }

    // Add behaviors
    if (config.behaviors) {
      if (config.behaviors.float) {
        entityData["minecraft:entity"].components["minecraft:behavior.float"] = {
          priority: 1
        };
      }
      if (config.behaviors.panic) {
        entityData["minecraft:entity"].components["minecraft:behavior.panic"] = {
          priority: 2,
          speed_multiplier: 1.25
        };
      }
      if (config.behaviors.randomStroll) {
        const strollConfig = typeof config.behaviors.randomStroll === 'object' 
          ? config.behaviors.randomStroll 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.random_stroll"] = {
          priority: strollConfig.priority || 5,
          speed_multiplier: strollConfig.speed || 1.0
        };
      }
      if (config.behaviors.lookAtPlayer) {
        entityData["minecraft:entity"].components["minecraft:behavior.look_at_player"] = {
          priority: 8,
          look_distance: 6.0
        };
      }
      if (config.behaviors.meleeAttack) {
        entityData["minecraft:entity"].components["minecraft:behavior.melee_attack"] = {
          priority: 3,
          speed_multiplier: 1.0,
          track_target: true
        };
      }
      if (config.behaviors.nearestAttackableTarget) {
        const targetConfig = config.behaviors.nearestAttackableTarget;
        entityData["minecraft:entity"].components["minecraft:behavior.nearest_attackable_target"] = {
          priority: 2,
          entity_types: targetConfig.entityTypes || []
        };
      }
    }

    const outputPath = join(this.projectRoot, `entities/${config.id}.json`);
    FileManager.writeJSON(outputPath, entityData);
    console.log(`✅ Đã tạo: BP/entities/${config.id}.json`);
  }

  /**
   * Generate loot table for entity
   */
  generateLootTable(config: EntityConfig): void {
    if (!config.lootTable) return;

    const lootData = {
      pools: config.lootTable.pools || []
    };

    const outputPath = join(this.projectRoot, `loot_tables/entities/${config.id}.json`);
    FileManager.writeJSON(outputPath, lootData);
    console.log(`✅ Đã tạo: BP/loot_tables/entities/${config.id}.json`);
  }

  /**
   * Generate spawn rules for entity
   */
  generateSpawnRules(config: EntityConfig): void {
    if (!config.spawnRules) return;

    const spawnRuleGenerator = new SpawnRuleGenerator(this.projectRoot);
    spawnRuleGenerator.generate({
      id: config.id,
      populationControl: config.spawnRules.populationControl,
      weight: config.spawnRules.weight,
      minGroupSize: config.spawnRules.minGroupSize,
      maxGroupSize: config.spawnRules.maxGroupSize,
      conditions: config.spawnRules.conditions
    });
  }
}
