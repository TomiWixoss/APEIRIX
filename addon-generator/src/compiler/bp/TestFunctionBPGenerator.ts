import { TestFunctionGenerator } from '../../generators/TestFunctionGenerator.js';
import { RecipeTestFunctionGenerator } from '../../generators/RecipeTestFunctionGenerator.js';

/**
 * Generate BP test functions
 */
export class TestFunctionBPGenerator {
  static async generate(config: any, outputDir: string): Promise<number> {
    let count = 0;

    // Track entities by category for group tests (top-level)
    const categoryGroups: Record<string, Array<{id: string, name: string, commands: string[]}>> = {};
    
    // Track entities by sub-category for nested group tests
    const subCategoryGroups: Record<string, Array<{id: string, name: string, commands: string[]}>> = {};

    // Helper function to get sub-category path from entity's _sourceDir
    const getSubCategoryPath = (entity: any, category: string): string | null => {
      if (!entity._sourceDir) return null;
      
      // _sourceDir format: "materials/tin", "tools/bronze", "foods/canned-food", etc.
      const sourcePath = entity._sourceDir;
      
      // If sourcePath is not empty, use it as sub-category
      if (sourcePath && sourcePath.trim() !== '') {
        // Check if sourcePath already starts with category
        // Example: tools/bronze already starts with "tools"
        if (sourcePath.startsWith(`${category}/`)) {
          // Already has category prefix, return as-is
          return sourcePath;
        }
        
        // Otherwise prepend category
        return `${category}/${sourcePath}`;
      }
      
      return null;
    };

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
          
          // Track for top-level group test
          if (!categoryGroups['items']) categoryGroups['items'] = [];
          categoryGroups['items'].push({
            id: item.id,
            name: item.name || item.id,
            commands: item.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(item, 'items');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: item.id,
              name: item.name || item.id,
              commands: item.testCommands
            });
          }
        }
      }
    }

    // Generate block test functions
    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: block.id,
            displayName: block.name || block.id,
            commands: block.testCommands
          }, 'blocks');
          count++;
          
          // Track for top-level group test
          if (!categoryGroups['blocks']) categoryGroups['blocks'] = [];
          categoryGroups['blocks'].push({
            id: block.id,
            name: block.name || block.id,
            commands: block.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(block, 'blocks');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: block.id,
              name: block.name || block.id,
              commands: block.testCommands
            });
          }
        }
      }
    }

    // Generate ore test functions
    if (config.ores) {
      for (const ore of config.ores) {
        if (ore.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: ore.id,
            displayName: ore.name || ore.id,
            commands: ore.testCommands
          }, 'ores');
          count++;
          
          // Track for top-level group test
          if (!categoryGroups['ores']) categoryGroups['ores'] = [];
          categoryGroups['ores'].push({
            id: ore.id,
            name: ore.name || ore.id,
            commands: ore.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(ore, 'ores');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: ore.id,
              name: ore.name || ore.id,
              commands: ore.testCommands
            });
          }
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
          
          // Track for top-level group test
          if (!categoryGroups['tools']) categoryGroups['tools'] = [];
          categoryGroups['tools'].push({
            id: tool.id,
            name: tool.name || tool.id,
            commands: tool.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(tool, 'tools');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: tool.id,
              name: tool.name || tool.id,
              commands: tool.testCommands
            });
          }
        }
      }
    }

    // Generate armor test functions
    if (config.armor) {
      for (const armor of config.armor) {
        if (armor.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: armor.id,
            displayName: armor.name || armor.id,
            commands: armor.testCommands
          }, 'armor');
          count++;
          
          // Track for top-level group test
          if (!categoryGroups['armor']) categoryGroups['armor'] = [];
          categoryGroups['armor'].push({
            id: armor.id,
            name: armor.name || armor.id,
            commands: armor.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(armor, 'armor');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: armor.id,
              name: armor.name || armor.id,
              commands: armor.testCommands
            });
          }
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
          
          // Track for top-level group test
          if (!categoryGroups['foods']) categoryGroups['foods'] = [];
          categoryGroups['foods'].push({
            id: food.id,
            name: food.name || food.id,
            commands: food.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(food, 'foods');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: food.id,
              name: food.name || food.id,
              commands: food.testCommands
            });
          }
        }
      }
    }

    // Generate entity test functions
    if (config.entities) {
      for (const entity of config.entities) {
        if (entity.testCommands) {
          const generator = new TestFunctionGenerator(outputDir);
          generator.generate({
            id: entity.id,
            displayName: entity.name || entity.id,
            commands: entity.testCommands
          }, 'entities');
          count++;
          
          // Track for top-level group test
          if (!categoryGroups['entities']) categoryGroups['entities'] = [];
          categoryGroups['entities'].push({
            id: entity.id,
            name: entity.name || entity.id,
            commands: entity.testCommands
          });
          
          // Track for sub-category group test (dynamic)
          const subCatPath = getSubCategoryPath(entity, 'entities');
          if (subCatPath) {
            if (!subCategoryGroups[subCatPath]) subCategoryGroups[subCatPath] = [];
            subCategoryGroups[subCatPath].push({
              id: entity.id,
              name: entity.name || entity.id,
              commands: entity.testCommands
            });
          }
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

    // Generate top-level group test functions
    for (const [category, entities] of Object.entries(categoryGroups)) {
      if (entities.length > 0) {
        const generator = new TestFunctionGenerator(outputDir);
        generator.generateGroupTest(entities, category);
      }
    }

    // Generate sub-category group test functions
    for (const [subCategory, entities] of Object.entries(subCategoryGroups)) {
      if (entities.length > 0) {
        const generator = new TestFunctionGenerator(outputDir);
        generator.generateGroupTest(entities, subCategory);
      }
    }

    return count;
  }
}
