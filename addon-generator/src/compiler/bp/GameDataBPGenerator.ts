import { GameDataGenerator, ToolData, FoodData, OreData } from '../../generators/GameDataGenerator.js';
import path from 'path';

/**
 * Generate BP GameData file
 */
export class GameDataBPGenerator {
  static async generate(config: any, buildDir: string): Promise<void> {
    // buildDir is "build" inside addon-generator
    // We need to go to APEIRIX root: "../.." from build
    const projectRoot = path.resolve(buildDir, '../..');
    const generator = new GameDataGenerator(projectRoot);

    // Collect tools
    const tools: ToolData[] = [];
    if (config.tools) {
      for (const tool of config.tools) {
        tools.push({
          id: `apeirix:${tool.id}`,
          type: tool.type,
          durability: tool.durability || 250
        });
      }
    }

    // Collect foods (only those with effects or removeEffects)
    const foods: FoodData[] = [];
    if (config.foods) {
      for (const food of config.foods) {
        if (food.effects || food.removeEffects) {
          const foodData: FoodData = {
            id: `apeirix:${food.id}`
          };

          if (food.effects) {
            foodData.effects = food.effects.map((effect: any) => ({
              name: effect.name,
              duration: effect.duration,
              amplifier: effect.amplifier ?? 0,
              chance: effect.chance
            }));
          }

          if (food.removeEffects) {
            foodData.removeEffects = true;
          }

          foods.push(foodData);
        }
      }
    }

    // Collect ores
    const ores: OreData[] = [];
    if (config.ores) {
      for (const ore of config.ores) {
        // Main ore
        ores.push({
          blockId: `apeirix:${ore.id}`,
          dropItem: `apeirix:${ore.rawItemId}`,
          dropCount: 1,
          fortuneEnabled: true
        });

        // Deepslate variant
        ores.push({
          blockId: `apeirix:deepslate_${ore.id}`,
          dropItem: `apeirix:${ore.rawItemId}`,
          dropCount: 1,
          fortuneEnabled: true
        });
      }
    }

    // Generate file
    generator.generate(tools, foods, ores);
  }
}
