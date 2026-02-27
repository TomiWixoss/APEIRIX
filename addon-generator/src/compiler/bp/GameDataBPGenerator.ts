import { GameDataGenerator, ToolData, FoodData, OreData, WikiItemData } from '../../generators/GameDataGenerator.js';
import { ProcessingRecipeGenerator, ProcessingRecipeData } from '../../generators/ProcessingRecipeGenerator.js';
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

    // Collect wiki items from script-lang YAML files
    const wikiItems = await WikiDataBPGenerator.generate(configDir, buildDir);
    
    // Collect all items for wiki
    const allItems: string[] = [];
    const edibleItems: string[] = []; // Items edible by Rust Mite
    
    if (config.items) {
      for (const item of config.items) {
        allItems.push(`apeirix:${item.id}`);
        // Collect items with edibleByRustMite: true
        if (item.edibleByRustMite === true) {
          edibleItems.push(`apeirix:${item.id}`);
        }
      }
    }
    
    // Add foods to allItems (foods are always edible by Rust Mite)
    if (config.foods) {
      for (const food of config.foods) {
        allItems.push(`apeirix:${food.id}`);
        // Foods are always edible by Rust Mite
        edibleItems.push(`apeirix:${food.id}`);
      }
    }

    // Generate file to project root (for development)
    // Note: hammerMining and brassSifter are now empty arrays - data moved to YAML
    generator.generate(tools, foods, ores, wikiItems, [], [], allItems, edibleItems);
    
    // Collect processing recipes
    const processingRecipes: ProcessingRecipeData[] = [];
    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.processingRecipes && Array.isArray(block.processingRecipes)) {
          for (const recipe of block.processingRecipes) {
            // OreSieve-style recipe (input -> random outputs) - CHECK THIS FIRST
            if (recipe.input && recipe.outputs && Array.isArray(recipe.outputs)) {
              processingRecipes.push({
                machineType: block.id,
                input: recipe.input,
                output: '', // No fixed output
                processingTime: recipe.processingTime || 60,
                outputs: recipe.outputs, // Array of {item, chance}
                fuelConfig: block.fuel ? {
                  blockId: block.fuel.blockId,
                  usesPerBlock: block.fuel.usesPerBlock,
                  detectFaces: block.fuel.detectFaces || 'bottom'
                } : undefined
              });
            }
            // BrassSifter/OreWasher-style recipe (input -> pureDust + stoneDust)
            else if (recipe.input && recipe.pureDust && recipe.stoneDust) {
              processingRecipes.push({
                machineType: block.id,
                input: recipe.input,
                output: recipe.pureDust, // Primary output
                processingTime: 1, // Instant for washer
                stoneDust: recipe.stoneDust,
                pureDust: recipe.pureDust,
                fuelConfig: block.fuel ? {
                  blockId: block.fuel.blockId,
                  usesPerBlock: block.fuel.usesPerBlock,
                  detectFaces: block.fuel.detectFaces || 'bottom'
                } : undefined
              });
            }
            // OreCrusher-style recipe (input -> stoneDust + oreDust)
            else if (recipe.input && recipe.stoneDust && recipe.stoneDustCount) {
              processingRecipes.push({
                machineType: block.id,
                input: recipe.input,
                output: recipe.stoneDust, // Primary output
                processingTime: 1, // Instant for ore crusher
                stoneDustCount: recipe.stoneDustCount,
                oreDust: recipe.oreDust,
                oreDustCount: recipe.oreDustCount,
                fuelConfig: block.fuel ? {
                  blockId: block.fuel.blockId,
                  usesPerBlock: block.fuel.usesPerBlock,
                  detectFaces: block.fuel.detectFaces || 'bottom'
                } : undefined
              });
            }
            // Compressor-style recipe (input -> output)
            else if (recipe.input && recipe.output) {
              processingRecipes.push({
                machineType: block.id,
                input: recipe.input,
                output: recipe.output,
                processingTime: recipe.processingTime || 60,
                fuelConfig: block.fuel ? {
                  blockId: block.fuel.blockId,
                  usesPerBlock: block.fuel.usesPerBlock,
                  detectFaces: block.fuel.detectFaces || 'bottom'
                } : undefined
              });
            }
          }
        }
      }
    }
    
    // Generate processing recipes file
    if (processingRecipes.length > 0) {
      const processingGenerator = new ProcessingRecipeGenerator(projectRoot);
      processingGenerator.generate(processingRecipes);
    }
    
    // Also generate to build folder (for Regolith to copy)
    const buildGenerator = new GameDataGenerator(buildDir);
    buildGenerator.generate(tools, foods, ores, wikiItems, [], [], allItems, edibleItems, 'BP/scripts/data');
  }
}
