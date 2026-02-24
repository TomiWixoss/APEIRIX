import { RecipeGenerator } from '../generators/RecipeGenerator.js';
import { RecipeTestFunctionGenerator } from '../generators/RecipeTestFunctionGenerator.js';
import { HistoryManager } from '../core/HistoryManager.js';

export interface ShapedOptions {
  id: string;
  pattern: string;
  key: string;
  result: string;
  resultCount?: string;
  resultExtra?: string; // Trả về thêm items (như bucket)
  unlock?: string;
  generateTest?: boolean;
  project: string;
  skipHistory?: boolean;
}

export interface ShapelessOptions {
  id: string;
  ingredients: string;
  result: string;
  resultCount?: string;
  resultExtra?: string; // Trả về thêm items (như bucket)
  unlock?: string;
  generateTest?: boolean;
  project: string;
  skipHistory?: boolean;
}

export interface SmeltingOptions {
  id: string;
  input: string;
  output: string;
  tags?: string;
  generateTest?: boolean;
  project: string;
  skipHistory?: boolean;
}

/**
 * Command handler cho recipe generation - HOÀN TOÀN ĐỘNG
 */
export class RecipeCommand {
  executeShaped(options: ShapedOptions): void {
    console.log(`\n🚀 Đang tạo shaped recipe: ${options.id}...\n`);

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`recipe:shaped ${options.id}`);
      history.trackCreate(`packs/BP/recipes/${options.id}.json`);
      if (options.generateTest) {
        history.trackCreate(`packs/BP/functions/tests/recipes/${options.id}.mcfunction`);
      }
    }

    const generator = new RecipeGenerator(options.project);
    
    // Parse JSON inputs
    const pattern = JSON.parse(options.pattern);
    const key = JSON.parse(options.key);
    const unlock = options.unlock ? options.unlock.split(',').map(s => s.trim()) : undefined;
    const resultExtra = options.resultExtra ? options.resultExtra.split(',').map(s => s.trim()) : undefined;

    generator.createShaped({
      id: options.id,
      pattern,
      key,
      result: options.result,
      resultCount: options.resultCount ? parseInt(options.resultCount) : undefined,
      resultExtra,
      unlock
    });

    // Generate test function if requested
    if (options.generateTest) {
      const testGen = new RecipeTestFunctionGenerator(options.project);
      
      // Extract all ingredients from key
      const ingredients: string[] = [];
      pattern.forEach((row: string) => {
        row.split('').forEach((char: string) => {
          if (char !== ' ' && key[char]) {
            ingredients.push(key[char]);
          }
        });
      });
      
      testGen.generate({
        id: options.id,
        type: 'shaped',
        ingredients,
        result: options.result,
        resultCount: options.resultCount ? parseInt(options.resultCount) : undefined
      });
    }

    if (history) {
      history.commitOperation();
    }
    console.log(`\n✨ Hoàn thành!\n`);
  }

  executeShapeless(options: ShapelessOptions): void {
    console.log(`\n🚀 Đang tạo shapeless recipe: ${options.id}...\n`);

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`recipe:shapeless ${options.id}`);
      history.trackCreate(`packs/BP/recipes/${options.id}.json`);
      if (options.generateTest) {
        history.trackCreate(`packs/BP/functions/tests/recipes/${options.id}.mcfunction`);
      }
    }

    const generator = new RecipeGenerator(options.project);
    
    const ingredients = options.ingredients.split(',').map(s => s.trim());
    const unlock = options.unlock ? options.unlock.split(',').map(s => s.trim()) : undefined;
    const resultExtra = options.resultExtra ? options.resultExtra.split(',').map(s => s.trim()) : undefined;

    generator.createShapeless({
      id: options.id,
      ingredients,
      result: options.result,
      resultCount: options.resultCount ? parseInt(options.resultCount) : undefined,
      resultExtra,
      unlock
    });

    // Generate test function if requested
    if (options.generateTest) {
      const testGen = new RecipeTestFunctionGenerator(options.project);
      testGen.generate({
        id: options.id,
        type: 'shapeless',
        ingredients,
        result: options.result,
        resultCount: options.resultCount ? parseInt(options.resultCount) : undefined
      });
    }

    if (history) {
      history.commitOperation();
    }
    console.log(`\n✨ Hoàn thành!\n`);
  }

  executeSmelting(options: SmeltingOptions): void {
    console.log(`\n🚀 Đang tạo smelting recipe: ${options.id}...\n`);

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`recipe:smelting ${options.id}`);
      history.trackCreate(`packs/BP/recipes/${options.id}.json`);
      if (options.generateTest) {
        history.trackCreate(`packs/BP/functions/tests/recipes/${options.id}.mcfunction`);
      }
    }

    const generator = new RecipeGenerator(options.project);
    
    const tags = options.tags ? options.tags.split(',').map(s => s.trim()) : undefined;

    generator.createSmelting({
      id: options.id,
      input: options.input,
      output: options.output,
      tags
    });

    // Generate test function if requested
    if (options.generateTest) {
      const testGen = new RecipeTestFunctionGenerator(options.project);
      testGen.generate({
        id: options.id,
        type: 'smelting',
        ingredients: [options.input],
        result: options.output
      });
    }

    if (history) {
      history.commitOperation();
    }
    console.log(`\n✨ Hoàn thành!\n`);
  }
}
