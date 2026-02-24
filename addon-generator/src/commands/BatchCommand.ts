import { ConfigLoader } from '../core/ConfigLoader.js';
import { ItemCommand } from './ItemCommand.js';
import { FoodCommand } from './FoodCommand.js';
import { BlockCommand } from './BlockCommand.js';
import { OreCommand } from './OreCommand.js';
import { ToolCommand } from './ToolCommand.js';
import { ArmorCommand } from './ArmorCommand.js';
import { RecipeCommand } from './RecipeCommand.js';
import { RecipeTestFunctionGenerator } from '../generators/RecipeTestFunctionGenerator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface BatchCommandOptions {
  file: string;
  project: string;
  dryRun?: boolean;
}

/**
 * Batch Command - Tạo nhiều content từ config file
 */
export class BatchCommand {
  execute(options: BatchCommandOptions): void {
    console.log(`\n📦 Đang load config từ: ${options.file}...\n`);

    const config = ConfigLoader.load(options.file);
    
    if (options.dryRun) {
      DryRunManager.enable();
    }

    const history = new HistoryManager(options.project);
    history.startOperation(`batch -f ${options.file}`);

    let totalCreated = 0;
    
    // Check if test generation is disabled
    const skipTests = config.skipTestGeneration ?? false;
    if (skipTests) {
      console.log('⚠️  Test generation disabled (skipTestGeneration: true)\n');
    }

    // Process items (CHỈ item thường, KHÔNG phải food)
    if (config.items && config.items.length > 0) {
      console.log(`\n📦 Tạo ${config.items.length} items...\n`);
      config.items.forEach(item => {
        try {
          // Track files trước khi tạo
          history.trackCreate(`packs/BP/items/${item.id}.json`);
          history.trackCreate(`packs/RP/textures/items/${item.id}.png`);
          history.trackModify('packs/RP/textures/item_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          history.trackCreate(`packs/BP/functions/tests/items/${item.id}.mcfunction`);
          
          if (!skipTests) {
            history.trackCreate(`tests/items/materials/${item.id}.md`);
            history.trackCreate(`tests/items/materials/${item.id}.test.ts`);
          }
          
          new ItemCommand().execute({
            id: item.id,
            name: item.name,
            texture: item.texture,
            category: item.category,
            stackSize: item.stackSize?.toString(),
            testCommands: item.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo item ${item.id}: ${error}`);
        }
      });
    }

    // Process foods (CHỈ food items)
    if (config.foods && config.foods.length > 0) {
      console.log(`\n🍎 Tạo ${config.foods.length} foods...\n`);
      config.foods.forEach(food => {
        try {
          // Track files
          history.trackCreate(`packs/BP/items/${food.id}.json`);
          history.trackCreate(`packs/RP/textures/items/${food.id}.png`);
          history.trackModify('packs/RP/textures/item_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          history.trackCreate(`packs/BP/functions/tests/food/${food.id}.mcfunction`);
          
          if (!skipTests) {
            history.trackCreate(`tests/items/materials/${food.id}.md`);
            history.trackCreate(`tests/items/materials/${food.id}.test.ts`);
          }
          
          new FoodCommand().execute({
            id: food.id,
            name: food.name,
            texture: food.texture,
            category: food.category,
            stackSize: food.stackSize?.toString(),
            nutrition: food.nutrition,
            saturation: food.saturation,
            canAlwaysEat: food.canAlwaysEat,
            usingConvertsTo: food.usingConvertsTo,
            effects: food.effects,
            removeEffects: food.removeEffects,
            testCommands: food.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo food ${food.id}: ${error}`);
        }
      });
    }

    // Process blocks
    if (config.blocks && config.blocks.length > 0) {
      console.log(`\n🧱 Tạo ${config.blocks.length} blocks...\n`);
      config.blocks.forEach(block => {
        try {
          // Track files
          history.trackCreate(`packs/BP/blocks/${block.id}.json`);
          history.trackCreate(`packs/BP/loot_tables/blocks/${block.id}.json`);
          history.trackCreate(`packs/RP/textures/blocks/${block.id}.png`);
          history.trackModify('packs/RP/textures/terrain_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          history.trackCreate(`packs/BP/functions/tests/blocks/${block.id}.mcfunction`);
          
          if (!skipTests) {
            history.trackCreate(`tests/blocks/${block.id}.md`);
            history.trackCreate(`tests/blocks/${block.id}.test.ts`);
          }
          
          new BlockCommand().execute({
            id: block.id,
            name: block.name,
            texture: block.texture,
            category: block.category,
            destroyTime: block.destroyTime?.toString(),
            explosionResistance: block.explosionResistance?.toString(),
            requiresTool: block.requiresTool,
            toolTier: block.toolTier,
            testCommands: block.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo block ${block.id}: ${error}`);
        }
      });
    }

    // Process ores
    if (config.ores && config.ores.length > 0) {
      console.log(`\n⛏️  Tạo ${config.ores.length} ores...\n`);
      config.ores.forEach(ore => {
        try {
          // Track files
          history.trackCreate(`packs/BP/blocks/${ore.id}.json`);
          history.trackCreate(`packs/BP/loot_tables/blocks/${ore.id}.json`);
          history.trackCreate(`packs/BP/features/${ore.id}_scatter.json`);
          history.trackCreate(`packs/BP/feature_rules/${ore.id}_feature.json`);
          history.trackCreate(`packs/RP/textures/blocks/${ore.id}.png`);
          if (ore.deepslateTexture) {
            history.trackCreate(`packs/BP/blocks/deepslate_${ore.id}.json`);
            history.trackCreate(`packs/BP/loot_tables/blocks/deepslate_${ore.id}.json`);
            history.trackCreate(`packs/RP/textures/blocks/deepslate_${ore.id}.png`);
          }
          history.trackModify('packs/RP/textures/terrain_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          history.trackModify('scripts/data/GameData.ts');
          history.trackCreate(`packs/BP/functions/tests/ores/${ore.id}.mcfunction`);
          
          if (!skipTests) {
            history.trackCreate(`tests/blocks/${ore.id}.md`);
            history.trackCreate(`tests/blocks/${ore.id}.test.ts`);
          }
          
          new OreCommand().execute({
            id: ore.id,
            name: ore.name,
            texture: ore.texture,
            deepslateTexture: ore.deepslateTexture,
            rawItem: ore.rawItemId,
            minY: ore.minY?.toString(),
            maxY: ore.maxY?.toString(),
            veinSize: ore.veinSize?.toString(),
            veinsPerChunk: ore.veinsPerChunk?.toString(),
            toolTier: ore.toolTier,
            testCommands: ore.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo ore ${ore.id}: ${error}`);
        }
      });
    }

    // Process tools
    if (config.tools && config.tools.length > 0) {
      console.log(`\n🔨 Tạo ${config.tools.length} tools...\n`);
      config.tools.forEach(tool => {
        try {
          // Track files
          history.trackCreate(`packs/BP/items/${tool.id}.json`);
          history.trackCreate(`packs/RP/textures/items/${tool.id}.png`);
          history.trackModify('packs/RP/textures/item_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          history.trackModify('scripts/data/GameData.ts');
          history.trackCreate(`packs/BP/functions/tests/tools/${tool.id}.mcfunction`);
          
          if (!skipTests) {
            history.trackCreate(`tests/items/tools/${tool.id}.md`);
            history.trackCreate(`tests/items/tools/${tool.id}.test.ts`);
          }
          
          new ToolCommand().execute({
            id: tool.id,
            name: tool.name,
            texture: tool.texture,
            type: tool.type,
            material: tool.materialId,
            durability: tool.durability?.toString(),
            damage: tool.damage?.toString(),
            efficiency: tool.efficiency?.toString(),
            enchantability: tool.enchantability?.toString(),
            tier: tool.tier,
            testCommands: tool.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo tool ${tool.id}: ${error}`);
        }
      });
    }

    // Process armor
    if (config.armor && config.armor.length > 0) {
      console.log(`\n🛡️  Tạo ${config.armor.length} armor sets...\n`);
      config.armor.forEach(armor => {
        try {
          // Track files
          const pieces = ['helmet', 'chestplate', 'leggings', 'boots'];
          pieces.forEach(piece => {
            history.trackCreate(`packs/BP/items/${armor.baseName}_${piece}.json`);
            history.trackCreate(`packs/RP/attachables/${armor.baseName}_${piece}.json`);
            history.trackCreate(`packs/RP/textures/items/${armor.baseName}_${piece}.png`);
            history.trackCreate(`packs/BP/functions/tests/armor/${armor.baseName}_${piece}.mcfunction`);
            
            if (!skipTests) {
              history.trackCreate(`tests/items/armor/${armor.baseName}_${piece}.md`);
              history.trackCreate(`tests/items/armor/${armor.baseName}_${piece}.test.ts`);
            }
          });
          history.trackCreate(`packs/RP/textures/models/armor/${armor.baseName}_layer_1.png`);
          history.trackCreate(`packs/RP/textures/models/armor/${armor.baseName}_layer_2.png`);
          history.trackModify('packs/RP/textures/item_texture.json');
          history.trackModify('packs/BP/texts/en_US.lang');
          history.trackModify('packs/RP/texts/en_US.lang');
          
          new ArmorCommand().execute({
            baseName: armor.baseName,
            displayName: armor.displayNamePrefix,
            material: armor.materialId,
            icons: armor.iconTexturesPath,
            layer1: armor.armorLayer1,
            layer2: armor.armorLayer2,
            durabilityMultiplier: armor.durabilityMultiplier?.toString(),
            protectionMultiplier: armor.protectionMultiplier?.toString(),
            enchantability: armor.enchantability?.toString(),
            testCommands: armor.testCommands,
            project: options.project,
            dryRun: false,
            skipHistory: true,
            skipTests: skipTests
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo armor ${armor.baseName}: ${error}`);
        }
      });
    }

    // Process recipes
    if (config.recipes && config.recipes.length > 0) {
      console.log(`\n📜 Tạo ${config.recipes.length} recipes...\n`);
      
      // Collect recipe test configs for bulk test
      const recipeTestConfigs: any[] = [];
      
      config.recipes.forEach(recipe => {
        try {
          // Track recipe file
          history.trackCreate(`packs/BP/recipes/${recipe.id}.json`);
          if (!skipTests && recipe.generateTest) {
            history.trackCreate(`packs/BP/functions/tests/recipes/${recipe.id}.mcfunction`);
          }
          
          const recipeCmd = new RecipeCommand();
          
          if (recipe.type === 'shaped') {
            // Extract ingredients for bulk test
            const ingredients: string[] = [];
            recipe.pattern!.forEach((row: string) => {
              row.split('').forEach((char: string) => {
                if (char !== ' ' && recipe.key![char]) {
                  ingredients.push(recipe.key![char]);
                }
              });
            });
            
            recipeTestConfigs.push({
              id: recipe.id,
              type: 'shaped',
              ingredients,
              result: recipe.result,
              resultCount: recipe.resultCount
            });
            
            recipeCmd.executeShaped({
              id: recipe.id,
              pattern: JSON.stringify(recipe.pattern),
              key: JSON.stringify(recipe.key),
              result: recipe.result,
              resultCount: recipe.resultCount?.toString(),
              unlock: recipe.unlock?.join(','),
              generateTest: recipe.generateTest,
              project: options.project,
              skipHistory: true
            });
          } else if (recipe.type === 'shapeless') {
            recipeTestConfigs.push({
              id: recipe.id,
              type: 'shapeless',
              ingredients: recipe.ingredients!,
              result: recipe.result,
              resultCount: recipe.resultCount
            });
            
            recipeCmd.executeShapeless({
              id: recipe.id,
              ingredients: recipe.ingredients!.join(','),
              result: recipe.result,
              resultCount: recipe.resultCount?.toString(),
              resultExtra: recipe.resultExtra?.join(','),
              unlock: recipe.unlock?.join(','),
              generateTest: recipe.generateTest,
              project: options.project,
              skipHistory: true
            });
          } else if (recipe.type === 'smelting') {
            recipeTestConfigs.push({
              id: recipe.id,
              type: 'smelting',
              ingredients: [recipe.input!],
              result: recipe.output!
            });
            
            recipeCmd.executeSmelting({
              id: recipe.id,
              input: recipe.input!,
              output: recipe.output!,
              tags: recipe.tags?.join(','),
              generateTest: recipe.generateTest,
              project: options.project,
              skipHistory: true
            });
          }
          
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo recipe ${recipe.id}: ${error}`);
        }
      });
      
      // Generate bulk test if requested
      if (!skipTests && config.generateBulkRecipeTest && recipeTestConfigs.length > 0) {
        const fileName = typeof config.generateBulkRecipeTest === 'string' 
          ? config.generateBulkRecipeTest 
          : 'all_recipes';
        
        history.trackCreate(`packs/BP/functions/tests/recipes/${fileName}.mcfunction`);
        
        const testGen = new RecipeTestFunctionGenerator(options.project);
        testGen.generateBulkTest(recipeTestConfigs, fileName);
      }
    }

    if (!DryRunManager.isEnabled()) {
      history.commitOperation();
      console.log(`\n✨ Hoàn thành! Đã tạo ${totalCreated} items từ config file.\n`);
    } else {
      DryRunManager.showSummary();
      DryRunManager.disable();
      history.cancelOperation();
    }
  }
}
