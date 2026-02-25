import { FileManager } from '../core/FileManager.js';
import { PickaxeScanner } from '../core/PickaxeScanner.js';
import { join } from 'path';

export interface BlockConfig {
  id: string;
  name: string;
  texturePath: string;
  textureTop?: string;
  textureSide?: string;
  textureFront?: string;
  category?: 'construction' | 'nature' | 'equipment' | 'items';
  destroyTime?: number;
  explosionResistance?: number;
  mapColor?: string;
  requiresTool?: boolean;
  toolTier?: 'wooden' | 'stone' | 'copper' | 'iron' | 'golden' | 'diamond' | 'netherite';
  // Crafting table component (optional)
  craftingTable?: {
    gridSize?: 3 | 2;
    craftingTags?: string[];
    customDescription?: string;
    tableName?: string;
  };
}

/**
 * Generator cho Block - tạo BP block JSON + loot table
 */
export class BlockGenerator {
  constructor(private projectRoot: string) {}

  generate(config: BlockConfig): void {
    // Determine material instances based on available textures
    let materialInstances: any;
    
    if (config.textureTop || config.textureSide || config.textureFront) {
      // Multi-face textures
      materialInstances = {
        "up": {
          texture: config.textureTop ? `${config.id}_top` : config.id,
          render_method: "opaque"
        },
        "down": {
          texture: config.textureTop ? `${config.id}_top` : config.id,
          render_method: "opaque"
        },
        "north": {
          texture: config.textureFront ? `${config.id}_front` : config.id,
          render_method: "opaque"
        },
        "south": {
          texture: config.textureFront ? `${config.id}_front` : config.id,
          render_method: "opaque"
        },
        "east": {
          texture: config.textureSide ? `${config.id}_side` : config.id,
          render_method: "opaque"
        },
        "west": {
          texture: config.textureSide ? `${config.id}_side` : config.id,
          render_method: "opaque"
        }
      };
    } else {
      // Single texture for all faces
      materialInstances = {
        "*": {
          texture: config.id,
          render_method: "opaque"
        }
      };
    }

    const components: any = {
      "minecraft:loot": `loot_tables/blocks/${config.id}.json`,
      "minecraft:destructible_by_mining": this.getMiningComponent(config),
      "minecraft:destructible_by_explosion": {
        explosion_resistance: config.explosionResistance || 6.0
      },
      "minecraft:geometry": "minecraft:geometry.full_block",
      "minecraft:map_color": config.mapColor || "#d4d4d4",
      "minecraft:material_instances": materialInstances
    };

    // Add crafting table component if specified
    if (config.craftingTable) {
      components["minecraft:crafting_table"] = {
        grid_size: config.craftingTable.gridSize || 3,
        custom_description: config.craftingTable.customDescription || config.name,
        crafting_tags: config.craftingTable.craftingTags || [`${config.id}_crafting`],
        table_name: config.craftingTable.tableName || config.name
      };
    }

    const blockData = {
      format_version: "1.21.50",
      "minecraft:block": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: config.category || "construction"
          }
        },
        components
      }
    };

    const outputPath = join(this.projectRoot, `blocks/${config.id}.json`);
    FileManager.writeJSON(outputPath, blockData);
    console.log(`✅ Đã tạo: BP/blocks/${config.id}.json`);

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

    const tiers = ['wooden', 'stone', 'copper', 'iron', 'golden', 'diamond', 'netherite'];
    const minTierIndex = tiers.indexOf(config.toolTier || 'stone');
    const allowedTiers = tiers.slice(minTierIndex);

    // Quét custom pickaxes
    const scanner = new PickaxeScanner(this.projectRoot);
    const customPickaxeEntries = scanner.generatePickaxeEntries(destroySpeed);

    // Build tier condition with OR logic
    const tierCondition = allowedTiers.map(t => `q.any_tag('minecraft:${t}_tier')`).join(' || ');
    
    return {
      seconds_to_destroy: destroyTime * 3.33,
      item_specific_speeds: [
        {
          item: {
            tags: `q.any_tag('minecraft:is_pickaxe') && (${tierCondition})`
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
              name: `apeirix:${config.id}`
            }
          ]
        }
      ]
    };

    const outputPath = join(this.projectRoot, `loot_tables/blocks/${config.id}.json`);
    FileManager.writeJSON(outputPath, lootTable);
    console.log(`✅ Đã tạo: BP/loot_tables/blocks/${config.id}.json`);
  }

  updateTerrainTextureRegistry(blockId: string): void {
    const filePath = join(this.projectRoot, 'RP/textures/terrain_texture.json');
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
