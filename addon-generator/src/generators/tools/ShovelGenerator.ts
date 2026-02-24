import { FileManager } from '../../core/FileManager.js';
import { join } from 'path';
import { ToolRegistryHelper } from './ToolRegistryHelper.js';

export interface ShovelConfig {
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
  
  // Block tags để dig
  blockTags?: string;
}

/**
 * Generator cho Shovel - CHỈ tạo item, KHÔNG tạo recipe
 */
export class ShovelGenerator {
  constructor(private projectRoot: string) {}

  generate(config: ShovelConfig): void {
    const durability = config.durability || 250;
    const damage = config.damage || 3;
    const efficiency = config.efficiency || 6;
    const enchantability = config.enchantability || 14;
    const blockTags = config.blockTags || "q.any_tag('dirt', 'sand', 'gravel', 'snow', 'clay', 'soul_sand', 'soul_soil', 'powder_snow')";

    // Build tags array
    const tags = ["minecraft:is_shovel"];
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
            group: "itemGroup.name.shovel"
          }
        },
        components: {
          "minecraft:icon": config.id,
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
              min: 60,
              max: 100
            }
          },
          "minecraft:enchantable": {
            slot: "shovel",
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

    // Thêm vào GameData.ts
    ToolRegistryHelper.addToGameData(this.projectRoot, config.id, 'shovel', durability);
  }
}
