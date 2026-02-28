import { FileManager } from '../core/FileManager.js';
import { PickaxeScanner } from '../core/PickaxeScanner.js';
import { join } from 'path';
import { Logger } from '../utils/Logger.js';

export interface OreConfig {
  id: string;
  name: string;
  texturePath: string;
  deepslateTexturePath?: string;
  rawItemId: string;
  
  // Mining properties
  destroyTime?: number;
  deepslateDestroyTime?: number;
  explosionResistance?: number;
  toolTier?: 'stone' | 'copper' | 'iron' | 'diamond' | 'netherite';
  
  // World generation
  minY?: number;
  maxY?: number;
  veinSize?: number;
  veinsPerChunk?: number;
  
  // Fortune support
  fortuneMultiplier?: number;
  
  // Hammer dust drops
  dustItemId?: string; // ID của dust khi dùng hammer
  stoneDustCount?: number; // Số lượng stone/deepslate dust
  oreDustCount?: number; // Số lượng ore dust
}

/**
 * Generator cho Ore - tạo ore + deepslate variant + loot tables + world gen + Fortune registry
 */
export class OreGenerator {
  constructor(private projectRoot: string) {}

  generate(config: OreConfig): void {
    // 1. Tạo normal ore
    this.generateOreBlock(config, false);
    
    // 2. Tạo deepslate ore (nếu có texture)
    if (config.deepslateTexturePath) {
      this.generateOreBlock(config, true);
    }
    
    // 3. Tạo world generation
    this.generateWorldGen(config);
    
    // Auto-registration disabled - using GeneratedGameData.ts instead
    // this.addToFortuneRegistry(config);
  }

  private generateOreBlock(config: OreConfig, isDeepslate: boolean): void {
    const id = isDeepslate ? `deepslate_${config.id}` : config.id;
    const destroyTime = isDeepslate 
      ? (config.deepslateDestroyTime || 14.985)
      : (config.destroyTime || 9.99);
    const destroySpeed = isDeepslate ? 4.5 : 3.0;

    const tiers = ['wooden', 'stone', 'copper', 'iron', 'golden', 'diamond', 'netherite'];
    const minTierIndex = tiers.indexOf(config.toolTier || 'stone');
    const allowedTiers = tiers.slice(minTierIndex);

    // Auto-scan custom pickaxes from BP/items
    const scanner = new PickaxeScanner(this.projectRoot);
    const customPickaxeEntries = scanner.generatePickaxeEntries(destroySpeed);

    const blockData = {
      format_version: "1.21.80",
      "minecraft:block": {
        description: {
          identifier: `apeirix:${id}`,
          menu_category: {
            category: "nature"
          }
        },
        components: {
          "minecraft:destructible_by_mining": {
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
          },
          "minecraft:destructible_by_explosion": {
            explosion_resistance: config.explosionResistance || 3.0
          },
          "minecraft:geometry": "minecraft:geometry.full_block",
          "minecraft:loot": `loot_tables/blocks/${id}.json`,
          "minecraft:map_color": isDeepslate ? "#4d4d4d" : "#8c8c8c",
          "minecraft:material_instances": {
            "*": {
              texture: id,
              render_method: "opaque"
            }
          }
        }
      }
    };

    const blockPath = join(this.projectRoot, `blocks/${id}.json`);
    FileManager.writeJSON(blockPath, blockData);
    Logger.log(`✅ Đã tạo: BP/blocks/${id}.json`);

    // Tạo loot table
    this.generateOreLootTable(config, id);
  }

  private generateOreLootTable(config: OreConfig, oreId: string): void {
    const tiers = ['wooden', 'stone', 'copper', 'iron', 'golden', 'diamond', 'netherite'];
    const minTierIndex = tiers.indexOf(config.toolTier || 'stone');
    const allowedTiers = tiers.slice(minTierIndex);

    // Auto-scan custom pickaxes from BP/items
    const pickaxeScanner = new PickaxeScanner(this.projectRoot);
    const customPickaxes = pickaxeScanner.scanPickaxes();

    const pools: any[] = [];
    
    // Add vanilla pickaxe pool
    pools.push({
      rolls: 1,
      conditions: [
        {
          condition: "match_tool",
          count: 1,
          "minecraft:match_tool_filter_all": [
            "minecraft:is_tool",
            "minecraft:is_pickaxe"
          ],
          "minecraft:match_tool_filter_any": allowedTiers.map(t => `minecraft:${t}_tier`)
        }
      ],
      entries: [
        {
          type: "item",
          name: `apeirix:${config.rawItemId}`,
          weight: 1
        }
      ]
    });

    // Add pool for each custom pickaxe (excluding hammers)
    customPickaxes.forEach((pickaxe: any) => {
      // Skip hammers
      if (pickaxe.id.includes('hammer')) return;
      
      pools.push({
        rolls: 1,
        conditions: [
          {
            condition: "match_tool",
            item: pickaxe.id
          }
        ],
        entries: [
          {
            type: "item",
            name: `apeirix:${config.rawItemId}`,
            weight: 1
          }
        ]
      });
    });

    // NOTE: Hammer drops are handled by HammerMiningSystem script
    // No loot table entries needed for hammers

    const lootTable = { pools };

    const lootPath = join(this.projectRoot, `loot_tables/blocks/${oreId}.json`);
    FileManager.writeJSON(lootPath, lootTable);
    Logger.log(`✅ Đã tạo: BP/loot_tables/blocks/${oreId}.json`);
  }

  private generateWorldGen(config: OreConfig): void {
    const featureId = `${config.id}_scatter`;
    const ruleId = `${config.id}_feature`;

    // Feature
    const feature: any = {
      format_version: "1.21.80",
      "minecraft:ore_feature": {
        description: {
          identifier: `apeirix:${featureId}`
        },
        count: config.veinSize || 9,
        replace_rules: [
          {
            places_block: {
              name: `apeirix:${config.id}`,
              states: {}
            },
            may_replace: [
              { name: "minecraft:stone", states: { stone_type: "stone" } },
              { name: "minecraft:stone", states: { stone_type: "andesite" } },
              { name: "minecraft:stone", states: { stone_type: "granite" } },
              { name: "minecraft:stone", states: { stone_type: "diorite" } }
            ]
          }
        ]
      }
    };

    // Thêm deepslate rule nếu có
    if (config.deepslateTexturePath) {
      feature["minecraft:ore_feature"].replace_rules.push({
        places_block: {
          name: `apeirix:deepslate_${config.id}`,
          states: {}
        },
        may_replace: [
          { name: "minecraft:deepslate", states: {} }
        ]
      });
    }

    const featurePath = join(this.projectRoot, `features/${featureId}.json`);
    FileManager.writeJSON(featurePath, feature);
    Logger.log(`✅ Đã tạo: BP/features/${featureId}.json`);

    // Feature Rule
    const minY = config.minY || 0;
    const maxY = config.maxY || 64;
    const iterations = config.veinsPerChunk || 20;

    const featureRule = {
      format_version: "1.21.80",
      "minecraft:feature_rules": {
        description: {
          identifier: `apeirix:${ruleId}`,
          places_feature: `apeirix:${featureId}`
        },
        conditions: {
          placement_pass: "underground_pass",
          "minecraft:biome_filter": [
            {
              any_of: [
                { test: "has_biome_tag", operator: "==", value: "overworld" },
                { test: "has_biome_tag", operator: "==", value: "overworld_generation" }
              ]
            }
          ]
        },
        distribution: {
          iterations: iterations,
          coordinate_eval_order: "zyx",
          x: { distribution: "uniform", extent: [0, 16] },
          y: { distribution: "uniform", extent: [minY, maxY] },
          z: { distribution: "uniform", extent: [0, 16] }
        }
      }
    };

    const rulePath = join(this.projectRoot, `feature_rules/${ruleId}.json`);
    FileManager.writeJSON(rulePath, featureRule);
    Logger.log(`✅ Đã tạo: BP/feature_rules/${ruleId}.json`);
  }

  private addToFortuneRegistry(config: OreConfig): void {
    const registryPath = join(this.projectRoot, 'scripts/data/blocks/OreRegistry.ts');
    const content = FileManager.readText(registryPath);
    
    if (!content) {
      Logger.log(`⚠️  Không tìm thấy OreRegistry.ts`);
      return;
    }

    const multiplier = config.fortuneMultiplier || 2;
    const registerCode = `    OreRegistry.register({
      blockId: "apeirix:${config.id}",
      dropItemId: "apeirix:${config.rawItemId}",
      baseDropCount: 1,
      fortuneMultiplier: ${multiplier}
    });`;

    // Tìm vị trí insert (sau registerOres() {)
    const insertMarker = 'static registerOres(): void {';
    const insertIndex = content.indexOf(insertMarker);
    
    if (insertIndex === -1) {
      Logger.log(`⚠️  Không tìm thấy registerOres() trong OreRegistry.ts`);
      return;
    }

    const insertPos = content.indexOf('\n', insertIndex) + 1;
    const newContent = content.slice(0, insertPos) + registerCode + '\n' + content.slice(insertPos);
    
    FileManager.writeText(registryPath, newContent);
    Logger.log(`✅ Đã thêm "${config.id}" vào OreRegistry.ts`);
  }

  updateTerrainTextureRegistry(oreId: string, hasDeepslate: boolean): void {
    const filePath = join(this.projectRoot, 'RP/textures/terrain_texture.json');
    const data = FileManager.readJSON(filePath) || {
      resource_pack_name: 'APEIRIX',
      texture_name: 'atlas.terrain',
      padding: 8,
      num_mip_levels: 4,
      texture_data: {}
    };

    if (!data.texture_data[oreId]) {
      data.texture_data[oreId] = {
        textures: `textures/blocks/${oreId}`
      };
    }

    if (hasDeepslate && !data.texture_data[`deepslate_${oreId}`]) {
      data.texture_data[`deepslate_${oreId}`] = {
        textures: `textures/blocks/deepslate_${oreId}`
      };
    }

    FileManager.writeJSON(filePath, data);
    Logger.log(`✅ Đã cập nhật terrain_texture.json`);
  }
}
