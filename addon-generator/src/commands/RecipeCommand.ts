import { RecipeGenerator } from '../generators/RecipeGenerator.js';

export interface ShapedOptions {
  id: string;
  pattern: string;
  key: string;
  result: string;
  resultCount?: string;
  unlock?: string;
  project: string;
}

export interface ShapelessOptions {
  id: string;
  ingredients: string;
  result: string;
  resultCount?: string;
  unlock?: string;
  project: string;
}

export interface SmeltingOptions {
  id: string;
  input: string;
  output: string;
  tags?: string;
  project: string;
}

/**
 * Command handler cho recipe generation - HOÀN TOÀN ĐỘNG
 */
export class RecipeCommand {
  executeShaped(options: ShapedOptions): void {
    console.log(`\n🚀 Đang tạo shaped recipe: ${options.id}...\n`);

    const generator = new RecipeGenerator(options.project);
    
    // Parse JSON inputs
    const pattern = JSON.parse(options.pattern);
    const key = JSON.parse(options.key);
    const unlock = options.unlock ? options.unlock.split(',').map(s => s.trim()) : undefined;

    generator.createShaped({
      id: options.id,
      pattern,
      key,
      result: options.result,
      resultCount: options.resultCount ? parseInt(options.resultCount) : undefined,
      unlock
    });

    console.log(`\n✨ Hoàn thành!\n`);
  }

  executeShapeless(options: ShapelessOptions): void {
    console.log(`\n🚀 Đang tạo shapeless recipe: ${options.id}...\n`);

    const generator = new RecipeGenerator(options.project);
    
    const ingredients = options.ingredients.split(',').map(s => s.trim());
    const unlock = options.unlock ? options.unlock.split(',').map(s => s.trim()) : undefined;

    generator.createShapeless({
      id: options.id,
      ingredients,
      result: options.result,
      resultCount: options.resultCount ? parseInt(options.resultCount) : undefined,
      unlock
    });

    console.log(`\n✨ Hoàn thành!\n`);
  }

  executeSmelting(options: SmeltingOptions): void {
    console.log(`\n🚀 Đang tạo smelting recipe: ${options.id}...\n`);

    const generator = new RecipeGenerator(options.project);
    
    const tags = options.tags ? options.tags.split(',').map(s => s.trim()) : undefined;

    generator.createSmelting({
      id: options.id,
      input: options.input,
      output: options.output,
      tags
    });

    console.log(`\n✨ Hoàn thành!\n`);
  }
}
