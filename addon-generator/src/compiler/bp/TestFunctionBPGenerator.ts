import { TestFunctionGenerator } from '../../generators/TestFunctionGenerator.js';
import { RecipeTestFunctionGenerator } from '../../generators/RecipeTestFunctionGenerator.js';

/**
 * Generate BP test functions
 */
export class TestFunctionBPGenerator {
  static async generate(config: any, outputDir: string): Promise<number> {
    let count = 0;

    // Generate item test functions
    if (config.items) {
      for (const item of config.items) {
        if (item.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: item.id,
            displayName: item.name || item.id,
            commands: item.testCommands
          }, 'items');
          count++;
        }
      }
    }

    // Generate tool test functions
    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: tool.id,
            displayName: tool.name || tool.id,
            commands: tool.testCommands
          }, 'tools');
          count++;
        }
      }
    }

    // Generate food test functions
    if (config.foods) {
      for (const food of config.foods) {
        if (food.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: food.id,
            displayName: food.name || food.id,
            commands: food.testCommands
          }, 'foods');
          count++;
        }
      }
    }

    // Generate recipe test functions
    if (config.recipes) {
      for (const recipe of config.recipes) {
        if (recipe.testCommands) {
          const generator = new RecipeTestFunctionGenerator(outputDir);
          generator.generate({
            id: recipe.id,
            type: recipe.type,
            ingredients: recipe.ingredients || [],
            result: recipe.result,
            resultCount: recipe.resultCount
          });
          count++;
        }
      }
    }

    return count;
  }
}
