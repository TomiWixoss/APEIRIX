import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

/**
 * Recipe Generator - HOÀN TOÀN ĐỘNG từ CLI
 * Không có template, tất cả từ parameters
 */

export interface ShapedRecipeConfig {
  id: string;
  pattern: string[];
  key: Record<string, string>;
  result: string;
  resultCount?: number;
  resultExtra?: string[]; // Trả về thêm items (như bucket)
  unlock?: string[];
  craftingTags?: string[]; // Custom crafting tags
}

export interface ShapelessRecipeConfig {
  id: string;
  ingredients: string[];
  result: string;
  resultCount?: number;
  resultExtra?: string[]; // Trả về thêm items (như bucket)
  unlock?: string[];
  craftingTags?: string[]; // Custom crafting tags
}

export interface SmeltingRecipeConfig {
  id: string;
  input: string;
  output: string;
  tags?: string[];
}

export class RecipeGenerator {
  constructor(private projectRoot: string) {}

  /**
   * Tạo shaped recipe (có pattern)
   */
  createShaped(config: ShapedRecipeConfig): void {
    const key: Record<string, { item: string }> = {};
    for (const [symbol, item] of Object.entries(config.key)) {
      key[symbol] = { item: this.formatItem(item) };
    }

    const recipeData: any = {
      format_version: "1.21.0",
      "minecraft:recipe_shaped": {
        description: {
          identifier: `apeirix:${config.id}`
        },
        tags: config.craftingTags || ["crafting_table"],
        pattern: config.pattern,
        key: key,
        result: {
          item: this.formatItem(config.result),
          ...(config.resultCount && config.resultCount > 1 ? { count: config.resultCount } : {})
        },
        unlock: config.unlock ? config.unlock.map(item => ({ item: this.formatItem(item) })) : []
      }
    };

    // Thêm resultExtra nếu có (trả về thêm items như bucket)
    if (config.resultExtra && config.resultExtra.length > 0) {
      recipeData["minecraft:recipe_shaped"].result = [
        recipeData["minecraft:recipe_shaped"].result,
        ...config.resultExtra.map(item => ({ item: this.formatItem(item) }))
      ];
    }

    // Strip "apeirix:" prefix từ ID để tạo filename hợp lệ
    const filename = config.id.replace(/^apeirix:/, '');
    
    // Validate filename không rỗng
    if (!filename || filename.trim() === '') {
      console.error(`❌ Recipe ID không hợp lệ: "${config.id}" -> filename rỗng`);
      return;
    }
    
    const path = join(this.projectRoot, `recipes/${filename}.json`);
    FileManager.writeJSON(path, recipeData);
    console.log(`✅ Đã tạo shaped recipe: ${config.id}`);
  }

  /**
   * Tạo shapeless recipe (không có pattern)
   */
  createShapeless(config: ShapelessRecipeConfig): void {
    const recipeData: any = {
      format_version: "1.21.0",
      "minecraft:recipe_shapeless": {
        description: {
          identifier: `apeirix:${config.id}`
        },
        tags: config.craftingTags || ["crafting_table"],
        ingredients: config.ingredients.map(item => ({ item: this.formatItem(item) })),
        result: {
          item: this.formatItem(config.result),
          count: config.resultCount || 1
        },
        unlock: config.unlock ? config.unlock.map(item => ({ item: this.formatItem(item) })) : []
      }
    };

    // Thêm resultExtra nếu có (trả về thêm items như bucket)
    if (config.resultExtra && config.resultExtra.length > 0) {
      recipeData["minecraft:recipe_shapeless"].result = [
        recipeData["minecraft:recipe_shapeless"].result,
        ...config.resultExtra.map(item => ({ item: this.formatItem(item) }))
      ];
    }

    // Strip "apeirix:" prefix từ ID để tạo filename hợp lệ
    const filename = config.id.replace(/^apeirix:/, '');
    
    // Validate filename không rỗng
    if (!filename || filename.trim() === '') {
      console.error(`❌ Recipe ID không hợp lệ: "${config.id}" -> filename rỗng`);
      return;
    }
    
    const path = join(this.projectRoot, `recipes/${filename}.json`);
    FileManager.writeJSON(path, recipeData);
    console.log(`✅ Đã tạo shapeless recipe: ${config.id}`);
  }

  /**
   * Tạo smelting recipe
   */
  createSmelting(config: SmeltingRecipeConfig): void {
    const recipe = {
      format_version: "1.21.0",
      "minecraft:recipe_furnace": {
        description: {
          identifier: `apeirix:${config.id}`
        },
        tags: config.tags || ["furnace", "blast_furnace", "soul_campfire", "campfire"],
        input: this.formatItem(config.input),
        output: this.formatItem(config.output)
      }
    };

    // Strip "apeirix:" prefix từ ID để tạo filename hợp lệ
    const filename = config.id.replace(/^apeirix:/, '');
    
    // Validate filename không rỗng
    if (!filename || filename.trim() === '') {
      console.error(`❌ Recipe ID không hợp lệ: "${config.id}" -> filename rỗng`);
      return;
    }
    
    const path = join(this.projectRoot, `recipes/${filename}.json`);
    FileManager.writeJSON(path, recipe);
    console.log(`✅ Đã tạo smelting recipe: ${config.id}`);
  }

  private formatItem(item: string): string {
    // Pass through - không thêm prefix, YAML đã có sẵn
    return item;
  }
}
