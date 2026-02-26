import { FileManager } from '../../core/FileManager.js';
import { join } from 'path';
import { ToolRegistryHelper } from './ToolRegistryHelper.js';

export interface AxeConfig {
  id: string;
  name: string;
  texturePath: string;
  materialId: string;
  
  // Stats
  durability?: number;
  damage?: number;
  efficiency?: number;
  enchantability?: number;
  tier?: string;
  
  // Block tags để chop
  blockTags?: string;
}

/**
 * Generator cho Axe - CHỈ tạo item, KHÔNG tạo recipe
 */
export class AxeGenerator {
  constructor(private projectRoot: string) {}

  generate(config: AxeConfig): void {
    const durability = config.durability || 250;
    const damage = config.damage || 5;
    const efficiency = config.efficiency || 6;
    const enchantability = config.enchantability || 14;
    const blockTags = config.blockTags || "q.any_tag('wood', 'log', 'pumpkin', 'plant_stem')";

    // Build tags array
    const tags = ["minecraft:is_axe"];
    if (config.tier) {
      tags.unshift(`minecraft:${config.tier}`);
    }

    const itemData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: "equipment",
            group: "itemGroup.name.axe"
          }
        },
        components: {
          "minecraft:icon": config.id,
          "minecraft:display_name": {
            value: `item.apeirix.${config.id}.name`
          },
          "minecraft:hand_equipped": true,
          "minecraft:tags": {
            tags: tags
          },
          "minecraft:max_stack_size": 1,
          "minecraft:durability": {
            max_durability: durability,
            damage_chance: {
              min: 60,
              max: 100
            }
          },
          "minecraft:enchantable": {
            slot: "axe",
            value: enchantability
          },
          "minecraft:repairable": {
            repair_items: [
              {
                items: [`apeirix:${config.id}`],
                repair_amount: "context.other->query.remaining_durability + 0.12 * context.other->query.max_durability"
              },
              {
                items: [config.materialId],
                repair_amount: "context.other->query.remaining_durability * 0.25"
              }
            ]
          },
          "minecraft:digger": {
            use_efficiency: true,
            destroy_speeds: [
              {
                block: {
                  tags: blockTags
                },
                speed: efficiency
              }
            ]
          },
          "minecraft:damage": damage
        }
      }
    };

    const outputPath = join(this.projectRoot, `items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: BP/items/${config.id}.json`);

    // Auto-registration disabled - using GeneratedGameData.ts instead
    // ToolRegistryHelper.addToGameData(this.projectRoot, config.id, 'axe', durability);
  }
}
