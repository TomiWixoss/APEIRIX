import { GameDataGenerator, ToolData, FoodData, OreData, WikiItemData, BlockInfoData } from '../../generators/GameDataGenerator.js';
import { ProcessingRecipeGenerator, ProcessingRecipeData } from '../../generators/ProcessingRecipeGenerator.js';
import { AttributeGenerator, AttributeMapping } from '../../generators/AttributeGenerator.js';
import { WikiDataBPGenerator } from './WikiDataBPGenerator.js';
import { langLoader } from '../../core/loaders/LangLoader.js';
import { Logger } from '../../utils/Logger.js';
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

    // Load lang data for resolving display names
    const language = config.language || 'vi_VN';
    langLoader.setLanguage(language);
    const langData = langLoader.loadLanguage(configDir, language);

    // Collect wiki items from entity configs + wiki descriptions
    const wikiItems = await WikiDataBPGenerator.generate(config, configDir, buildDir, language);
    
    // Collect block info for DisplayHandler
    // ONLY blocks with explicit displayType in YAML will be included
    const blocks: BlockInfoData[] = [];
    
    // Collect from config.ores (auto-assign displayType: 'ore')
    if (config.ores) {
      for (const ore of config.ores) {
        // Main ore
        const oreKey = `materials.${ore.id}`;
        const oreName = langLoader.get(oreKey, configDir, ore.id);
        blocks.push({
          blockId: `apeirix:${ore.id}`,
          blockType: 'ore',
          displayName: oreName
        });
        
        // Deepslate variant
        const deepslateKey = `materials.deepslate_${ore.id}`;
        const deepslateName = langLoader.get(deepslateKey, configDir, `deepslate_${ore.id}`);
        blocks.push({
          blockId: `apeirix:deepslate_${ore.id}`,
          blockType: 'ore',
          displayName: deepslateName
        });
      }
    }
    
    // Collect from config.blocks (ONLY if displayType is specified)
    if (config.blocks) {
      for (const block of config.blocks) {
        // Skip if no displayType specified
        if (!block.displayType) continue;
        
        const blockId = `apeirix:${block.id}`;
        const displayType = block.displayType as 'machine' | 'ore' | 'storage' | 'other';
        
        // Determine lang key and resolve display name
        let langKey: string;
        if (displayType === 'machine') {
          // Both OFF and ON blocks use same langKey (remove _on suffix for display name)
          const baseMachineId = block.id.replace('_on', '');
          langKey = `blocks.${baseMachineId}`;
        } else {
          langKey = `materials.${block.id}`;
        }
        
        // Resolve display name from lang data
        const displayName = langLoader.get(langKey, configDir, block.id);
        
        // Add block
        const blockInfo: BlockInfoData = {
          blockId: blockId,
          blockType: displayType,
          displayName: displayName
        };
        
        // If machine, add machineType
        // Both OFF and ON blocks need SAME machineType for MachineStateManager lookup
        if (displayType === 'machine') {
          blockInfo.machineType = block.id.replace('_on', '');
        }
        
        blocks.push(blockInfo);
      }
    }
    
    Logger.log(`✅ Collected ${blocks.length} blocks for DisplayHandler (only blocks with displayType)`);
    
    // Collect all items for wiki
    const allItems: string[] = [];
    
    // Collect attributes from all entities
    const attributeMapping: AttributeMapping = {};
    
    // Helper to add attribute
    const addAttribute = (itemId: string, attributes: string[] | undefined) => {
      if (!attributes || !Array.isArray(attributes)) return;
      
      for (const attr of attributes) {
        if (!attributeMapping[attr]) {
          attributeMapping[attr] = [];
        }
        if (!attributeMapping[attr].includes(itemId)) {
          attributeMapping[attr].push(itemId);
        }
      }
    };
    
    if (config.items) {
      for (const item of config.items) {
        allItems.push(`apeirix:${item.id}`);
        addAttribute(`apeirix:${item.id}`, item.attributes);
      }
    }
    
    // Add foods to allItems
    if (config.foods) {
      for (const food of config.foods) {
        allItems.push(`apeirix:${food.id}`);
        addAttribute(`apeirix:${food.id}`, food.attributes);
      }
    }
    
    // Collect attributes from tools
    if (config.tools) {
      for (const tool of config.tools) {
        addAttribute(`apeirix:${tool.id}`, tool.attributes);
      }
    }
    
    // Collect attributes from armor
    if (config.armor) {
      for (const armor of config.armor) {
        addAttribute(`apeirix:${armor.id}`, armor.attributes);
      }
    }
    
    // Collect attributes from blocks
    if (config.blocks) {
      for (const block of config.blocks) {
        addAttribute(`apeirix:${block.id}`, block.attributes);
      }
    }
    
    // Collect attributes from entities
    if (config.entities) {
      for (const entity of config.entities) {
        addAttribute(`apeirix:${entity.id}`, entity.attributes);
      }
    }

    // Generate file to project root (for development)
    generator.generate(tools, foods, ores, wikiItems, [], [], allItems, [], blocks);
    
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
    
    // Generate attributes file
    const attributeGenerator = new AttributeGenerator(projectRoot);
    attributeGenerator.generate(attributeMapping);
    
    // Also generate to build folder (for Regolith to copy)
    const buildGenerator = new GameDataGenerator(buildDir);
    buildGenerator.generate(tools, foods, ores, wikiItems, [], [], allItems, [], blocks, 'BP/scripts/data');
    
    const buildAttributeGenerator = new AttributeGenerator(buildDir);
    buildAttributeGenerator.generate(attributeMapping, 'BP/scripts/data');
  }
}
