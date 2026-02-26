import { FileManager } from '../../core/FileManager.js';
import { join } from 'path';
import { ToolRegistryHelper } from './ToolRegistryHelper.js';

export interface SpearConfig {
  id: string;
  name: string;
  texturePath: string;
  materialId: string;
  
  // Stats
  durability?: number;
  damage?: number;
  enchantability?: number;
  reach?: { min: number; max: number };
  creativeReach?: { min: number; max: number };
  tier?: string; // Material tier tag (e.g., "iron_tier", "diamond_tier")
}

/**
 * Generator cho Spear - CHỈ tạo item, KHÔNG tạo recipe
 */
export class SpearGenerator {
  constructor(private projectRoot: string) {}

  generate(config: SpearConfig): void {
    const durability = config.durability || 250;
    const damage = config.damage || 3;
    const enchantability = config.enchantability || 14;
    const reach = config.reach || { min: 2.0, max: 4.5 };
    const creativeReach = config.creativeReach || { min: 2.0, max: 7.5 };
    
    // Build tags array
    const tags = ["minecraft:is_spear"];
    if (config.tier) {
      tags.unshift(`minecraft:${config.tier}`);
    }

    const itemData = {
      format_version: "1.21.100",
      "minecraft:item": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: "equipment",
            group: "minecraft:itemGroup.name.weapon"
          }
        },
        components: {
          "minecraft:icon": {
            textures: {
              default: config.id
            }
          },
          "minecraft:display_name": {
            value: `item.apeirix.${config.id}.name`
          },
          "minecraft:tags": {
            tags: tags
          },
          "minecraft:max_stack_size": 1,
          "minecraft:durability": {
            max_durability: durability,
            damage_chance: {
              min: 0,
              max: 100
            }
          },
          "minecraft:repairable": {
            repair_items: [
              {
                items: [`apeirix:${config.id}`],
                repair_amount: "context.other->query.remaining_durability"
              },
              {
                items: [config.materialId],
                repair_amount: "query.max_durability * 0.25"
              }
            ]
          },
          "minecraft:enchantable": {
            slot: "melee_spear",
            value: enchantability
          },
          "minecraft:hand_equipped": true,
          "minecraft:use_modifiers": {
            use_duration: 72000,
            emit_vibrations: false,
            start_sound: "item.iron_spear.use",
            movement_modifier: 1.0
          },
          "minecraft:cooldown": {
            category: "spear",
            duration: 0.95,
            type: "attack"
          },
          "minecraft:swing_duration": {
            value: 0.95
          },
          "minecraft:swing_sounds": {
            attack_miss: "item.iron_spear.attack_miss",
            attack_hit: "item.iron_spear.attack_hit"
          },
          "minecraft:damage": {
            value: damage
          },
          "minecraft:piercing_weapon": {
            reach: reach,
            creative_reach: creativeReach,
            hitbox_margin: 0.25
          },
          "minecraft:kinetic_weapon": {
            delay: 12,
            reach: reach,
            creative_reach: creativeReach,
            hitbox_margin: 0.25,
            damage_multiplier: 0.95,
            damage_conditions: {
              max_duration: 225,
              min_relative_speed: 4.6
            },
            knockback_conditions: {
              max_duration: 135,
              min_speed: 5.1
            },
            dismount_conditions: {
              max_duration: 50,
              min_speed: 11.0
            }
          }
        }
      }
    };

    const outputPath = join(this.projectRoot, `items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: BP/items/${config.id}.json`);

    // Auto-registration disabled - using GeneratedGameData.ts instead
    // ToolRegistryHelper.addToGameData(this.projectRoot, config.id, 'spear', durability);
  }
}
