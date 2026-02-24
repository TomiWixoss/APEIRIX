import { RecipeGenerator } from '../../generators/RecipeGenerator.js';

/**
 * Generate BP recipes
 */
export class RecipeBPGenerator {
  static async generate(recipes: any[], outputDir: string): Promise<number> {
    const generator = new RecipeGenerator(outputDir);
    let count = 0;

    for (const recipe of recipes) {
      try {
        switch (recipe.type) {
          case 'shaped':
            generator.createShaped({
              id: recipe.id,
              pattern: recipe.pattern,
              key: recipe.key || recipe.ingredients,
              result: recipe.result,
              resultCount: recipe.resultCount || recipe.count,
              resultExtra: recipe.resultExtra,
              unlock: recipe.unlock
            });
            break;
          case 'shapeless':
            generator.createShapeless({
              id: recipe.id,
              ingredients: recipe.ingredients,
              result: recipe.result,
              resultCount: recipe.resultCount || recipe.count,
              resultExtra: recipe.resultExtra,
              unlock: recipe.unlock
            });
            break;
          case 'smelting':
          case 'blasting':
            generator.createSmelting({
              id: recipe.id,
              input: recipe.input,
              output: recipe.output || recipe.result,
              tags: recipe.tags || (recipe.type === 'blasting' ? ['blast_furnace'] : ['furnace', 'blast_furnace', 'soul_campfire', 'campfire'])
            });
            break;
          default:
            console.warn(`  ⚠ Unknown recipe type: ${recipe.type}`);
            continue;
        }
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate recipe ${recipe.id}: ${error}`);
      }
    }

    return count;
  }
}
