import { ConfigLoader, ContentConfig } from '../core/ConfigLoader.js';
import { ItemCommand } from './ItemCommand.js';
import { BlockCommand } from './BlockCommand.js';
import { OreCommand } from './OreCommand.js';
import { ToolCommand } from './ToolCommand.js';
import { ArmorCommand } from './ArmorCommand.js';
import { RecipeCommand } from './RecipeCommand.js';
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

    // Process items
    if (config.items && config.items.length > 0) {
      console.log(`\n📦 Tạo ${config.items.length} items...\n`);
      config.items.forEach(item => {
        try {
          new ItemCommand().execute({
            id: item.id,
            name: item.name,
            texture: item.texture,
            category: item.category,
            stackSize: item.stackSize?.toString(),
            project: options.project,
            dryRun: false // Đã enable ở trên
          });
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo item ${item.id}: ${error}`);
        }
      });
    }

    // Process blocks
    if (config.blocks && config.blocks.length > 0) {
      console.log(`\n🧱 Tạo ${config.blocks.length} blocks...\n`);
      config.blocks.forEach(block => {
        try {
          new BlockCommand().execute({
            id: block.id,
            name: block.name,
            texture: block.texture,
            category: block.category,
            destroyTime: block.destroyTime?.toString(),
            explosionResistance: block.explosionResistance?.toString(),
            requiresTool: block.requiresTool,
            toolTier: block.toolTier,
            project: options.project,
            dryRun: false
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
            project: options.project,
            dryRun: false
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
          new ToolCommand().execute({
            id: tool.id,
            name: tool.name,
            texture: tool.texture,
            type: tool.type,
            material: tool.materialId,
            durability: tool.durability?.toString(),
            damage: tool.damage?.toString(),
            efficiency: tool.efficiency?.toString(),
            project: options.project,
            dryRun: false
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
          new ArmorCommand().execute({
            baseName: armor.baseName,
            displayName: armor.displayNamePrefix,
            material: armor.materialId,
            icons: armor.iconTexturesPath,
            layer1: armor.armorLayer1,
            layer2: armor.armorLayer2,
            durabilityMultiplier: armor.durabilityMultiplier?.toString(),
            protectionMultiplier: armor.protectionMultiplier?.toString(),
            project: options.project,
            dryRun: false
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
      config.recipes.forEach(recipe => {
        try {
          const recipeCmd = new RecipeCommand();
          
          if (recipe.type === 'shaped') {
            recipeCmd.executeShaped({
              id: recipe.id,
              pattern: JSON.stringify(recipe.pattern),
              key: JSON.stringify(recipe.key),
              result: recipe.result,
              resultCount: recipe.resultCount?.toString(),
              unlock: recipe.unlock?.join(','),
              project: options.project
            });
          } else if (recipe.type === 'shapeless') {
            recipeCmd.executeShapeless({
              id: recipe.id,
              ingredients: recipe.ingredients!.join(','),
              result: recipe.result,
              resultCount: recipe.resultCount?.toString(),
              unlock: recipe.unlock?.join(','),
              project: options.project
            });
          } else if (recipe.type === 'smelting') {
            recipeCmd.executeSmelting({
              id: recipe.id,
              input: recipe.input!,
              output: recipe.output!,
              project: options.project
            });
          }
          
          totalCreated++;
        } catch (error) {
          console.error(`❌ Lỗi tạo recipe ${recipe.id}: ${error}`);
        }
      });
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
