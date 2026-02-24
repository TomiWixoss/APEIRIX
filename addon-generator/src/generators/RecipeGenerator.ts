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
  unlock?: string[];
}

export interface ShapelessRecipeConfig {
  id: string;
  ingredients: string[];
  result: string;
  resultCount?: number;
  unlock?: string[];
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

    const recipe = {
      format_version: "1.21.0",
      "minecraft:recipe_shaped": {
        description: {
          identifier: `apeirix:${config.id}`
        },
        tags: ["crafting_table"],
        pattern: config.pattern,
        key: key,
        result: {
          item: this.formatItem(config.result),
          ...(config.resultCount && config.resultCount > 1 ? { count: config.resultCount } : {})
        },
        unlock: config.unlock ? config.unlock.map(item => ({ item: this.formatItem(item) })) : []
      }
    };

    const path = join(this.projectRoot, `packs/BP/recipes/${config.id}.json`);
    FileManager.writeJSON(path, recipe);
    console.log(`✅ Đã tạo shaped recipe: ${config.id}`);
  }

  /**
   * Tạo shapeless recipe (không có pattern)
   */
  createShapeless(config: ShapelessRecipeConfig): void {
    const recipe = {
      format_version: "1.21.0",
      "minecraft:recipe_shapeless": {
        description: {
          identifier: `apeirix:${config.id}`
        },
        tags: ["crafting_table"],
        ingredients: config.ingredients.map(item => ({ item: this.formatItem(item) })),
        result: {
          item: this.formatItem(config.result),
          ...(config.resultCount && config.resultCount > 1 ? { count: config.resultCount } : {})
        },
        unlock: config.unlock ? config.unlock.map(item => ({ item: this.formatItem(item) })) : []
      }
    };

    const path = join(this.projectRoot, `packs/BP/recipes/${config.id}.json`);
    FileManager.writeJSON(path, recipe);
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

    const path = join(this.projectRoot, `packs/BP/recipes/${config.id}.json`);
    FileManager.writeJSON(path, recipe);
    console.log(`✅ Đã tạo smelting recipe: ${config.id}`);
  }

  private formatItem(item: string): string {
    return item.startsWith('minecraft:') ? item : `apeirix:${item}`;
  }
}
