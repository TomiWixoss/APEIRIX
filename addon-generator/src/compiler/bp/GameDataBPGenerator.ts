import { GameDataGenerator, ToolData, FoodData, OreData, WikiItemData, HammerMiningData } from '../../generators/GameDataGenerator.js';
import { WikiDataBPGenerator } from './WikiDataBPGenerator.js';
import path from 'path';

/**
 * Generate BP GameData file
 */
export class GameDataBPGenerator {
  static async generate(config: any, buildDir: string, configDir: string): Promise<void> {
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

    // Collect hammer mining data
    const hammerMining: HammerMiningData[] = [];
    
    // Vanilla stone blocks
    hammerMining.push(
      { blockId: 'minecraft:stone', stoneDust: 'apeirix:cobblestone_dust', stoneDustCount: 4 },
      { blockId: 'minecraft:cobblestone', stoneDust: 'apeirix:cobblestone_dust', stoneDustCount: 4 },
      { blockId: 'minecraft:deepslate', stoneDust: 'apeirix:deepslate_dust', stoneDustCount: 4 },
      { blockId: 'minecraft:cobbled_deepslate', stoneDust: 'apeirix:deepslate_dust', stoneDustCount: 4 },
      { blockId: 'minecraft:netherrack', stoneDust: 'apeirix:netherrack_dust', stoneDustCount: 4 }
    );
    
    // Vanilla ores with dust mapping
    const vanillaOreDustMap: Record<string, { oreDust: string; stoneDust: string }> = {
      'coal': { oreDust: 'coal_dust', stoneDust: 'cobblestone_dust' },
      'iron': { oreDust: 'iron_ingot_dust', stoneDust: 'cobblestone_dust' },
      'copper': { oreDust: 'copper_ingot_dust', stoneDust: 'cobblestone_dust' },
      'gold': { oreDust: 'gold_ingot_dust', stoneDust: 'cobblestone_dust' },
      'diamond': { oreDust: 'diamond_dust', stoneDust: 'cobblestone_dust' },
      'emerald': { oreDust: 'emerald_dust', stoneDust: 'cobblestone_dust' },
      'lapis': { oreDust: 'lapis_block_dust', stoneDust: 'cobblestone_dust' },
      'redstone': { oreDust: '', stoneDust: 'cobblestone_dust' } // Redstone drops normally
    };
    
    for (const [oreType, dustInfo] of Object.entries(vanillaOreDustMap)) {
      // Normal ore
      hammerMining.push({
        blockId: `minecraft:${oreType}_ore`,
        stoneDust: `apeirix:${dustInfo.stoneDust}`,
        stoneDustCount: 4,
        oreDust: dustInfo.oreDust ? `apeirix:${dustInfo.oreDust}` : undefined,
        oreDustCount: dustInfo.oreDust ? 9 : undefined
      });
      
      // Deepslate variant
      hammerMining.push({
        blockId: `minecraft:deepslate_${oreType}_ore`,
        stoneDust: 'apeirix:deepslate_dust',
        stoneDustCount: 4,
        oreDust: dustInfo.oreDust ? `apeirix:${dustInfo.oreDust}` : undefined,
        oreDustCount: dustInfo.oreDust ? 9 : undefined
      });
    }
    
    // Custom ores from config (auto-read from ore YAML)
    if (config.ores) {
      for (const ore of config.ores) {
        // Check if ore has hammer dust configuration
        if (ore.dustItemId) {
          const stoneDustCount = ore.stoneDustCount || 4;
          const oreDustCount = ore.oreDustCount || 9;
          
          // Main ore
          hammerMining.push({
            blockId: `apeirix:${ore.id}`,
            stoneDust: 'apeirix:cobblestone_dust',
            stoneDustCount: stoneDustCount,
            oreDust: `apeirix:${ore.dustItemId}`,
            oreDustCount: oreDustCount
          });
          
          // Deepslate variant (if exists)
          if (ore.deepslateTexturePath) {
            hammerMining.push({
              blockId: `apeirix:deepslate_${ore.id}`,
              stoneDust: 'apeirix:deepslate_dust',
              stoneDustCount: stoneDustCount,
              oreDust: `apeirix:${ore.dustItemId}`,
              oreDustCount: oreDustCount
            });
          }
        }
      }
    }

    // Collect wiki items from script-lang YAML files
    const wikiItems = await WikiDataBPGenerator.generate(configDir, buildDir);

    // Generate file to project root (for development)
    generator.generate(tools, foods, ores, wikiItems, hammerMining);
    
    // Also generate to build folder (for Regolith to copy)
    const buildGenerator = new GameDataGenerator(buildDir);
    buildGenerator.generate(tools, foods, ores, wikiItems, hammerMining, 'BP/scripts/data');
  }
}
