import { FileManager } from '../../core/FileManager.js';
import { join } from 'path';
import { ToolRegistryHelper } from './ToolRegistryHelper.js';
import { Logger } from '../../utils/Logger.js';

export interface HammerConfig {
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
  
  // Block tags để smash
  blockTags?: string;
  diggerTags?: string[];
}

/**
 * Generator cho Hammer - CHỈ tạo item, KHÔNG tạo recipe
 */
export class HammerGenerator {
  constructor(private projectRoot: string) {}

  generate(config: HammerConfig): void {
    const durability = config.durability || 250;
    const damage = config.damage || 5;
    const efficiency = config.efficiency || 4;
    const enchantability = config.enchantability || 14;
    
    // Build blockTags from diggerTags array or use blockTags string or default
    let blockTags: string;
    if (config.diggerTags && config.diggerTags.length > 0) {
      const tagList = config.diggerTags.map(tag => `'${tag}'`).join(', ');
      blockTags = `q.any_tag(${tagList})`;
    } else {
      blockTags = config.blockTags || "q.any_tag('stone', 'metal', 'rock', 'wood', 'log')";
    }

    // Build tags array
    const tags = ["minecraft:is_tool", "minecraft:is_pickaxe"];
    if (config.tier) {
      tags.unshift(`minecraft:${config.tier}_tier`);
    }
    
    // Add transformable_items tag for diamond tier (để có thể nâng cấp lên netherite)
    if (config.tier === 'diamond') {
      tags.push('minecraft:transformable_items');
    }

    const itemData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: "equipment",
            group: "itemGroup.name.tool"
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
            slot: "pickaxe",
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
    Logger.log(`✅ Đã tạo: BP/items/${config.id}.json`);
    Logger.incrementFileCount();

    // Auto-registration disabled - using GeneratedGameData.ts instead
    // ToolRegistryHelper.addToGameData(this.projectRoot, config.id, 'hammer', durability);
  }
}
