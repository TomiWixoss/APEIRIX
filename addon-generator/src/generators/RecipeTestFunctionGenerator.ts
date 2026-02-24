import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

export interface RecipeTestConfig {
  id: string;
  type: 'shaped' | 'shapeless' | 'smelting';
  ingredients: string[]; // List of all ingredients needed
  result: string;
  resultCount?: number;
}

/**
 * Recipe Test Function Generator
 * Tạo test functions cho recipes - give tất cả ingredients cần thiết
 */
export class RecipeTestFunctionGenerator {
  constructor(private projectRoot: string) {}

  /**
   * Generate test function cho recipe
   */
  generate(config: RecipeTestConfig): void {
    const functionPath = join(
      this.projectRoot,
      'functions/tests/recipes',
      `${config.id}.mcfunction`
    );

    // Tạo folder nếu chưa có
    FileManager.ensureDir(join(this.projectRoot, 'functions/tests/recipes'));

    const commands: string[] = [];
    
    // Header
    commands.push(`# Test Recipe: ${config.id}`);
    commands.push(`# Type: ${config.type}`);
    commands.push(`# Result: ${config.result}${config.resultCount ? ` x${config.resultCount}` : ''}`);
    commands.push('');
    
    // Clear inventory
    commands.push('clear @s');
    commands.push('');
    
    // Give all ingredients
    commands.push('# Give ingredients:');
    const uniqueIngredients = this.getUniqueIngredients(config.ingredients);
    
    uniqueIngredients.forEach(ingredient => {
      const count = this.countIngredient(config.ingredients, ingredient);
      const itemId = this.formatItemId(ingredient);
      commands.push(`give @s ${itemId} ${count}`);
    });
    
    commands.push('');
    
    // Instructions
    commands.push('# Instructions:');
    if (config.type === 'shaped') {
      commands.push('tellraw @s {"text":"=== Test Shaped Recipe ===","color":"gold"}');
      commands.push(`tellraw @s {"text":"Recipe: ${config.id}","color":"aqua"}`);
      commands.push('tellraw @s {"text":"Open crafting table and arrange items","color":"yellow"}');
    } else if (config.type === 'shapeless') {
      commands.push('tellraw @s {"text":"=== Test Shapeless Recipe ===","color":"gold"}');
      commands.push(`tellraw @s {"text":"Recipe: ${config.id}","color":"aqua"}`);
      commands.push('tellraw @s {"text":"Open crafting table and place items","color":"yellow"}');
    } else if (config.type === 'smelting') {
      commands.push('tellraw @s {"text":"=== Test Smelting Recipe ===","color":"gold"}');
      commands.push(`tellraw @s {"text":"Recipe: ${config.id}","color":"aqua"}`);
      commands.push('tellraw @s {"text":"Place in furnace/blast furnace/smoker","color":"yellow"}');
    }
    
    commands.push(`tellraw @s {"text":"Expected result: ${config.result}${config.resultCount ? ` x${config.resultCount}` : ''}","color":"green"}`);
    commands.push('playsound random.levelup @s');

    const content = commands.join('\n') + '\n';
    FileManager.writeText(functionPath, content);
    
    console.log(`✅ Đã tạo recipe test function: BP/functions/tests/recipes/${config.id}.mcfunction`);
  }

  /**
   * Generate 1 test function tổng hợp cho TẤT CẢ recipes
   */
  generateBulkTest(recipes: RecipeTestConfig[], fileName: string = 'all_recipes'): void {
    const functionPath = join(
      this.projectRoot,
      'functions/tests/recipes',
      `${fileName}.mcfunction`
    );

    // Tạo folder nếu chưa có
    FileManager.ensureDir(join(this.projectRoot, 'functions/tests/recipes'));

    const commands: string[] = [];
    
    // Header
    commands.push(`# Test All Recipes - Bulk Test`);
    commands.push(`# Total recipes: ${recipes.length}`);
    commands.push('');
    
    // Clear inventory
    commands.push('clear @s');
    commands.push('');
    
    // Collect ALL unique ingredients from ALL recipes
    const allIngredients: string[] = [];
    recipes.forEach(recipe => {
      allIngredients.push(...recipe.ingredients);
    });
    
    const uniqueIngredients = this.getUniqueIngredients(allIngredients);
    
    // Give all ingredients
    commands.push('# Give ALL ingredients for ALL recipes:');
    uniqueIngredients.forEach(ingredient => {
      const count = this.countIngredient(allIngredients, ingredient);
      const itemId = this.formatItemId(ingredient);
      commands.push(`give @s ${itemId} ${count}`);
    });
    
    commands.push('');
    commands.push('# Recipe List:');
    
    // List all recipes
    recipes.forEach((recipe, index) => {
      commands.push(`# ${index + 1}. ${recipe.id} (${recipe.type}) -> ${recipe.result}${recipe.resultCount ? ` x${recipe.resultCount}` : ''}`);
    });
    
    commands.push('');
    commands.push('# Instructions:');
    commands.push('tellraw @s {"text":"=== Test All Recipes ===","color":"gold"}');
    commands.push(`tellraw @s {"text":"Total: ${recipes.length} recipes","color":"aqua"}`);
    commands.push('tellraw @s {"text":"All ingredients provided!","color":"yellow"}');
    commands.push('tellraw @s {"text":"Craft each recipe to test","color":"green"}');
    commands.push('playsound random.levelup @s');

    const content = commands.join('\n') + '\n';
    FileManager.writeText(functionPath, content);
    
    console.log(`✅ Đã tạo bulk recipe test function: BP/functions/tests/recipes/${fileName}.mcfunction`);
  }

  /**
   * Get unique ingredients (remove duplicates)
   */
  private getUniqueIngredients(ingredients: string[]): string[] {
    return [...new Set(ingredients)];
  }

  /**
   * Count how many times an ingredient appears
   */
  private countIngredient(ingredients: string[], target: string): number {
    return ingredients.filter(ing => ing === target).length;
  }

  /**
   * Format item ID - add minecraft: or apeirix: prefix if needed
   */
  private formatItemId(itemId: string): string {
    // Nếu đã có namespace, return as-is
    if (itemId.includes(':')) {
      return itemId;
    }
    
    // Nếu không có namespace, assume là custom item (apeirix:)
    return `apeirix:${itemId}`;
  }
}
