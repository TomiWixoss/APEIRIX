/**
 * Compressor Registry - Quản lý compressor recipes
 */

export interface CompressorRecipe {
  inputId: string;
  outputId: string;
  processingTime: number; // ticks
}

export class CompressorRegistry {
  private static recipes: Map<string, CompressorRecipe> = new Map();

  /**
   * Đăng ký recipe nén
   */
  static registerRecipe(recipe: CompressorRecipe): void {
    this.recipes.set(recipe.inputId, recipe);
  }

  /**
   * Lấy recipe cho input ID
   */
  static getRecipe(inputId: string): CompressorRecipe | undefined {
    return this.recipes.get(inputId);
  }

  /**
   * Kiểm tra xem item có thể nén không
   */
  static canCompress(inputId: string): boolean {
    return this.recipes.has(inputId);
  }

  /**
   * Lấy tất cả input IDs có thể nén
   */
  static getAllInputIds(): string[] {
    return Array.from(this.recipes.keys());
  }
}
