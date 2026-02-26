/**
 * Brass Sifter Registry - Quản lý brass sifter recipes
 */

export interface BrassSifterRecipe {
  dustId: string;
  pureDustId: string;
  stoneDustId: string;
}

export class BrassSifterRegistry {
  private static recipes: Map<string, BrassSifterRecipe> = new Map();

  /**
   * Đăng ký recipe lọc bụi
   */
  static registerRecipe(recipe: BrassSifterRecipe): void {
    this.recipes.set(recipe.dustId, recipe);
  }

  /**
   * Lấy recipe cho dust ID
   */
  static getRecipe(dustId: string): BrassSifterRecipe | undefined {
    return this.recipes.get(dustId);
  }

  /**
   * Kiểm tra xem dust có thể lọc không
   */
  static canSift(dustId: string): boolean {
    return this.recipes.has(dustId);
  }

  /**
   * Lấy tất cả dust IDs có thể lọc
   */
  static getAllDustIds(): string[] {
    return Array.from(this.recipes.keys());
  }
}
