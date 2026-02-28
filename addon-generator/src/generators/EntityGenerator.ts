import { FileManager } from '../core/FileManager.js';
import { Validator } from '../core/Validator.js';
import { SpawnRuleGenerator } from './SpawnRuleGenerator.js';
import { join } from 'path';
import { Logger } from '../utils/Logger.js';

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
  renderScale?: number;
  
  // NEW: 1.21.130+ Components
  rotationLockedToVehicle?: boolean;
  burnsInDaylight?: {
    protectionSlot?: 'slot.weapon.offhand' | 'slot.armor.head' | 'slot.armor.chest' | 'slot.armor.legs' | 'slot.armor.feet' | 'slot.armor.body';
  };
  breathable?: {
    canDehydrate?: boolean;
    breatheBlocks?: string[];
    suffocateTime?: number;
    breathesAir?: boolean;
    breathesWater?: boolean;
    breathesLava?: boolean;
    breathesSolids?: boolean;
    generatesBubbles?: boolean;
    inhaleTime?: number;
    totalSupply?: number;
  };
  rideable?: {
    seatCount?: number;
    familyTypes?: string[];
    interactText?: string;
    riders?: Array<{
      entityType: string;
      spawnEvent?: string;
    }>;
  };
  
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
  behaviors?: {
    float?: boolean | {
      priority?: number;
      chancePerTickToFloat?: number;
      timeUnderWaterToDismountPassengers?: number;
    };
    panic?: boolean | {
      priority?: number;
      speed?: number;
    };
    randomStroll?: boolean | {
      priority?: number;
      speed?: number;
    };
    lookAtPlayer?: boolean | {
      priority?: number;
      lookDistance?: number;
      probability?: number;
    };
    randomLookAround?: boolean | {
      priority?: number;
    };
    meleeAttack?: boolean | {
      priority?: number;
      speedMultiplier?: number;
      trackTarget?: boolean;
    };
    nearestAttackableTarget?: {
      priority?: number;
      withinRadius?: number;
      reselectTargets?: boolean;
      entityTypes?: any[];
      targetAcquisitionProbability?: number;
      attackInterval?: {
        rangeMin?: number;
        rangeMax?: number;
      } | number;
    };
    hurtByTarget?: boolean | {
      priority?: number;
    };
    useKineticWeapon?: {
      priority?: number;
      approachDistance?: number;
      repositionDistance?: number;
      cooldownDistance?: number;
      weaponReachMultiplier?: number;
      hijackMountNavigation?: boolean;
    };
  };
}

/**
 * Generator cho Entity (Mobs)
 * Updated to support Minecraft Bedrock 1.21.70+ features
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
      format_version: "1.21.70", // Updated to latest
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

    // NEW: Rotation locked to vehicle (1.21.130+)
    if (config.rotationLockedToVehicle) {
      entityData["minecraft:entity"].components["minecraft:rotation_locked_to_vehicle"] = {};
    }

    // NEW: Burns in daylight with protection slot (1.21.130+)
    if (config.burnsInDaylight) {
      const component: any = {};
      if (config.burnsInDaylight.protectionSlot) {
        component.protection_slot = config.burnsInDaylight.protectionSlot;
      }
      entityData["minecraft:entity"].components["minecraft:burns_in_daylight"] = component;
    }

    // NEW: Breathable with dehydration (1.21.130+)
    if (config.breathable) {
      const breathableComponent: any = {
        breathe_blocks: config.breathable.breatheBlocks || [],
        suffocate_time: config.breathable.suffocateTime ?? 0,
        breathes_air: config.breathable.breathesAir ?? true,
        breathes_water: config.breathable.breathesWater ?? false,
        breathes_lava: config.breathable.breathesLava ?? false,
        breathes_solids: config.breathable.breathesSolids ?? false,
        generates_bubbles: config.breathable.generatesBubbles ?? true,
        inhale_time: config.breathable.inhaleTime ?? 0,
        total_supply: config.breathable.totalSupply ?? 15
      };
      
      if (config.breathable.canDehydrate !== undefined) {
        breathableComponent.can_dehydrate = config.breathable.canDehydrate;
      }
      
      entityData["minecraft:entity"].components["minecraft:breathable"] = breathableComponent;
    }

    // NEW: Rideable with multiple riders (1.21.130+)
    if (config.rideable) {
      const rideableComponent: any = {
        seat_count: config.rideable.seatCount || 1,
        family_types: config.rideable.familyTypes || ["player"],
        interact_text: config.rideable.interactText || "action.interact.ride"
      };
      
      if (config.rideable.riders && config.rideable.riders.length > 0) {
        rideableComponent.riders = config.rideable.riders.map(rider => ({
          entity_type: rider.entityType,
          spawn_event: rider.spawnEvent
        }));
      }
      
      entityData["minecraft:entity"].components["minecraft:rideable"] = rideableComponent;
    }

    // Add behaviors
    if (config.behaviors) {
      // Float behavior with new fields (1.21.130+)
      if (config.behaviors.float) {
        const floatConfig = typeof config.behaviors.float === 'object' 
          ? config.behaviors.float 
          : { priority: 1 };
        
        const floatComponent: any = {
          priority: floatConfig.priority ?? 1
        };
        
        if (floatConfig.chancePerTickToFloat !== undefined) {
          floatComponent.chance_per_tick_to_float = floatConfig.chancePerTickToFloat;
        }
        
        if (floatConfig.timeUnderWaterToDismountPassengers !== undefined) {
          floatComponent.time_under_water_to_dismount_passengers = floatConfig.timeUnderWaterToDismountPassengers;
        }
        
        entityData["minecraft:entity"].components["minecraft:behavior.float"] = floatComponent;
      }
      
      if (config.behaviors.panic) {
        const panicConfig = typeof config.behaviors.panic === 'object' 
          ? config.behaviors.panic 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.panic"] = {
          priority: panicConfig.priority ?? 2,
          speed_multiplier: panicConfig.speed ?? 1.25
        };
      }
      
      if (config.behaviors.randomStroll) {
        const strollConfig = typeof config.behaviors.randomStroll === 'object' 
          ? config.behaviors.randomStroll 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.random_stroll"] = {
          priority: strollConfig.priority ?? 5,
          speed_multiplier: strollConfig.speed ?? 1.0
        };
      }
      
      if (config.behaviors.lookAtPlayer) {
        const lookConfig = typeof config.behaviors.lookAtPlayer === 'object' 
          ? config.behaviors.lookAtPlayer 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.look_at_player"] = {
          priority: lookConfig.priority ?? 8,
          look_distance: lookConfig.lookDistance ?? 6.0,
          probability: lookConfig.probability ?? 0.02
        };
      }
      
      if (config.behaviors.randomLookAround) {
        const lookAroundConfig = typeof config.behaviors.randomLookAround === 'object' 
          ? config.behaviors.randomLookAround 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.random_look_around"] = {
          priority: lookAroundConfig.priority ?? 7
        };
      }
      
      if (config.behaviors.meleeAttack) {
        const meleeConfig = typeof config.behaviors.meleeAttack === 'object' 
          ? config.behaviors.meleeAttack 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.melee_attack"] = {
          priority: meleeConfig.priority ?? 3,
          speed_multiplier: meleeConfig.speedMultiplier ?? 1.0,
          track_target: meleeConfig.trackTarget ?? true
        };
      }
      
      if (config.behaviors.hurtByTarget) {
        const hurtConfig = typeof config.behaviors.hurtByTarget === 'object' 
          ? config.behaviors.hurtByTarget 
          : {};
        
        entityData["minecraft:entity"].components["minecraft:behavior.hurt_by_target"] = {
          priority: hurtConfig.priority ?? 1
        };
      }
      
      // Nearest attackable target with new fields (1.21.130+)
      if (config.behaviors.nearestAttackableTarget) {
        const targetConfig = config.behaviors.nearestAttackableTarget;
        const targetComponent: any = {
          priority: targetConfig.priority ?? 2,
          within_radius: targetConfig.withinRadius ?? 25,
          reselect_targets: targetConfig.reselectTargets ?? true,
          entity_types: targetConfig.entityTypes || []
        };
        
        if (targetConfig.targetAcquisitionProbability !== undefined) {
          targetComponent.target_acquisition_probability = targetConfig.targetAcquisitionProbability;
        }
        
        if (targetConfig.attackInterval !== undefined) {
          if (typeof targetConfig.attackInterval === 'object') {
            targetComponent.attack_interval = {
              range_min: targetConfig.attackInterval.rangeMin ?? 0,
              range_max: targetConfig.attackInterval.rangeMax ?? 0
            };
          } else {
            targetComponent.attack_interval = targetConfig.attackInterval;
          }
        }
        
        entityData["minecraft:entity"].components["minecraft:behavior.nearest_attackable_target"] = targetComponent;
      }
      
      // NEW: Use kinetic weapon behavior (1.21.130+)
      if (config.behaviors.useKineticWeapon) {
        const kineticConfig = config.behaviors.useKineticWeapon;
        entityData["minecraft:entity"].components["minecraft:behavior.use_kinetic_weapon"] = {
          priority: kineticConfig.priority ?? 0,
          approach_distance: kineticConfig.approachDistance ?? 10,
          reposition_distance: kineticConfig.repositionDistance ?? 3,
          cooldown_distance: kineticConfig.cooldownDistance ?? 15,
          weapon_reach_multiplier: kineticConfig.weaponReachMultiplier ?? 1.0,
          hijack_mount_navigation: kineticConfig.hijackMountNavigation ?? false
        };
      }
    }

    const outputPath = join(this.projectRoot, `entities/${config.id}.json`);
    FileManager.writeJSON(outputPath, entityData);
    Logger.log(`✅ Đã tạo: BP/entities/${config.id}.json`);
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
    Logger.log(`✅ Đã tạo: BP/loot_tables/entities/${config.id}.json`);
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
