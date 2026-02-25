import { GameDataGenerator, ToolData, FoodData, OreData, WikiItemData } from '../../generators/GameDataGenerator.js';
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

    // Collect wiki items from all sources
    const wikiItems: WikiItemData[] = [];
    
    // Items
    if (config.items) {
      for (const item of config.items) {
        if (item.wiki) {
          wikiItems.push({
            id: `apeirix:${item.id}`,
            category: item.wiki.category || 'special',
            icon: item.wiki.icon,
            info: item.wiki.info
          });
        }
      }
    }

    // Tools
    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.wiki) {
          wikiItems.push({
            id: `apeirix:${tool.id}`,
            category: tool.wiki.category || 'tools',
            icon: tool.wiki.icon,
            info: tool.wiki.info
          });
        }
      }
    }

    // Foods
    if (config.foods) {
      for (const food of config.foods) {
        if (food.wiki) {
          wikiItems.push({
            id: `apeirix:${food.id}`,
            category: food.wiki.category || 'foods',
            icon: food.wiki.icon,
            info: food.wiki.info
          });
        }
      }
    }

    // Armor
    if (config.armor) {
      for (const armor of config.armor) {
        if (armor.wiki) {
          wikiItems.push({
            id: `apeirix:${armor.id}`,
            category: armor.wiki.category || 'armor',
            icon: armor.wiki.icon,
            info: armor.wiki.info
          });
        }
      }
    }

    // Blocks
    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.wiki) {
          wikiItems.push({
            id: `apeirix:${block.id}`,
            category: block.wiki.category || 'materials',
            icon: block.wiki.icon,
            info: block.wiki.info
          });
        }
      }
    }

    // Generate file to project root (for development)
    generator.generate(tools, foods, ores, wikiItems);
    
    // Also generate to build folder (for Regolith to copy)
    const buildGenerator = new GameDataGenerator(buildDir);
    buildGenerator.generate(tools, foods, ores, wikiItems, 'BP/scripts/data');
  }
}
