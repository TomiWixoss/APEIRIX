import { FileManager } from '../core/FileManager.js';
import { PickaxeScanner } from '../core/PickaxeScanner.js';
import { join } from 'path';

export interface BlockConfig {
  id: string;
  name: string;
  texturePath: string;
  category?: 'construction' | 'nature' | 'equipment' | 'items';
  destroyTime?: number;
  explosionResistance?: number;
  mapColor?: string;
  requiresTool?: boolean;
  toolTier?: 'stone' | 'copper' | 'iron' | 'diamond' | 'netherite';
}

/**
 * Generator cho Block - tạo BP block JSON + loot table
 */
export class BlockGenerator {
  constructor(private projectRoot: string) {}

  generate(config: BlockConfig): void {
    const blockData = {
      format_version: "1.21.80",
      "minecraft:block": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: config.category || "construction"
          }
        },
        components: {
          "minecraft:loot": `loot_tables/blocks/${config.id}.json`,
          "minecraft:destructible_by_mining": this.getMiningComponent(config),
          "minecraft:destructible_by_explosion": {
            explosion_resistance: config.explosionResistance || 6.0
          },
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:map_color": config.mapColor || "#d4d4d4",
          "minecraft:material_instances": {
            "*": {
              texture: config.id,
              render_method: "opaque"
            }
          }
        }
      }
    };

    const outputPath = join(this.projectRoot, `packs/BP/blocks/${config.id}.json`);
    FileManager.writeJSON(outputPath, blockData);
    console.log(`✅ Đã tạo: packs/BP/blocks/${config.id}.json`);

    // Tạo loot table
    this.generateLootTable(config);
  }

  private getMiningComponent(config: BlockConfig) {
    const destroyTime = config.destroyTime || 16.65;
    const destroySpeed = 5.0;

    if (!config.requiresTool) {
      return {
        seconds_to_destroy: destroyTime
      };
    }

    const tiers = ['stone', 'copper', 'iron', 'diamond', 'netherite'];
    const minTierIndex = tiers.indexOf(config.toolTier || 'stone');
    const allowedTiers = tiers.slice(minTierIndex);

    // Quét custom pickaxes
    const scanner = new PickaxeScanner(this.projectRoot);
    const customPickaxeEntries = scanner.generatePickaxeEntries(destroySpeed);

    return {
      seconds_to_destroy: destroyTime * 3.33,
      item_specific_speeds: [
        {
          item: {
            tags: `q.any_tag('minecraft:is_pickaxe') && q.any_tag(${allowedTiers.map(t => `'minecraft:${t}_tier'`).join(', ')})`
          },
          destroy_speed: destroySpeed
        },
        ...customPickaxeEntries
      ]
    };
  }

  private generateLootTable(config: BlockConfig): void {
    const lootTable = {
      pools: [
        {
          rolls: 1,
          entries: [
            {
              type: "item",
              name: `apeirix:${config.id}`,
              weight: 1
            }
          ]
        }
      ]
    };

    const outputPath = join(this.projectRoot, `packs/BP/loot_tables/blocks/${config.id}.json`);
    FileManager.writeJSON(outputPath, lootTable);
    console.log(`✅ Đã tạo: packs/BP/loot_tables/blocks/${config.id}.json`);
  }

  updateTerrainTextureRegistry(blockId: string): void {
    const filePath = join(this.projectRoot, 'packs/RP/textures/terrain_texture.json');
    const data = FileManager.readJSON(filePath) || {
      resource_pack_name: 'APEIRIX',
      texture_name: 'atlas.terrain',
      padding: 8,
      num_mip_levels: 4,
      texture_data: {}
    };

    if (!data.texture_data[blockId]) {
      data.texture_data[blockId] = {
        textures: `textures/blocks/${blockId}`
      };
      FileManager.writeJSON(filePath, data);
      console.log(`✅ Đã thêm "${blockId}" vào terrain_texture.json`);
    } else {
      console.log(`⚠️  Texture "${blockId}" đã tồn tại trong terrain_texture.json`);
    }
  }
}
