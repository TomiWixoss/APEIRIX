import { FileManager } from '../core/FileManager.js';
import path from 'path';
import { Logger } from '../utils/Logger.js';

export interface SpawnRuleConfig {
  id: string;
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
}

/**
 * Generator cho Spawn Rules
 * Tạo spawn_rules JSON files để entity spawn tự nhiên trong thế giới
 */
export class SpawnRuleGenerator {
  constructor(private projectRoot: string) {}

  /**
   * Generate spawn rule file
   */
  generate(config: SpawnRuleConfig): void {
    const spawnRuleData: any = {
      format_version: "1.8.0",
      "minecraft:spawn_rules": {
        description: {
          identifier: `apeirix:${config.id}`,
          population_control: config.populationControl || "monster"
        },
        conditions: []
      }
    };

    const condition: any = {};

    // Surface or underground spawning
    if (config.conditions?.surface) {
      condition["minecraft:spawns_on_surface"] = {};
    }
    if (config.conditions?.underground) {
      condition["minecraft:spawns_underground"] = {};
    }

    // Brightness filter
    if (config.conditions?.brightnessMin !== undefined || config.conditions?.brightnessMax !== undefined) {
      condition["minecraft:brightness_filter"] = {
        min: config.conditions.brightnessMin ?? 0,
        max: config.conditions.brightnessMax ?? 15,
        adjust_for_weather: false
      };
    }

    // Weight
    if (config.weight !== undefined) {
      condition["minecraft:weight"] = {
        default: config.weight
      };
    }

    // Herd/Group size
    if (config.minGroupSize !== undefined || config.maxGroupSize !== undefined) {
      condition["minecraft:herd"] = {
        min_size: config.minGroupSize ?? 1,
        max_size: config.maxGroupSize ?? 1
      };
    }

    // Biome filter
    if (config.conditions?.biomes && config.conditions.biomes.length > 0) {
      condition["minecraft:biome_filter"] = {
        any_of: config.conditions.biomes.map(biome => ({
          test: "has_biome_tag",
          value: biome
        }))
      };
    }

    // Near blocks filter (custom - requires script)
    // Note: Minecraft doesn't have native "near blocks" filter
    // This will be handled by TypeScript system
    if (config.conditions?.nearBlocks && config.conditions.nearBlocks.length > 0) {
      // Add a comment in the JSON for documentation
      condition["_comment_nearBlocks"] = `Spawn near: ${config.conditions.nearBlocks.join(', ')} (handled by script)`;
    }

    spawnRuleData["minecraft:spawn_rules"].conditions.push(condition);

    const outputPath = path.join(this.projectRoot, `spawn_rules/${config.id}.json`);
    FileManager.writeJSON(outputPath, spawnRuleData);
    Logger.log(`  ✅ Đã tạo: BP/spawn_rules/${config.id}.json`);
  }
}
