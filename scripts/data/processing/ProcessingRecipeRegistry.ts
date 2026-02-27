/**
 * Processing Recipe Registry - Quản lý recipes cho processing machines
 */

export interface ProcessingRecipe {
  inputId: string;
  outputId: string;
  processingTime: number;
}

export class ProcessingRecipeRegistry {
  private static recipes: Map<string, Map<string, ProcessingRecipe>> = new Map();

  /**
   * Đăng ký recipe cho machine type
   */
  static registerRecipe(machineType: string, recipe: ProcessingRecipe): void {
    if (!this.recipes.has(machineType)) {
      this.recipes.set(machineType, new Map());
    }
    
    const machineRecipes = this.recipes.get(machineType)!;
    machineRecipes.set(recipe.inputId, recipe);
  }

  /**
   * Lấy recipe cho machine type và input ID
   */
  static getRecipe(machineType: string, inputId: string): ProcessingRecipe | undefined {
    const machineRecipes = this.recipes.get(machineType);
    return machineRecipes?.get(inputId);
  }

  /**
   * Kiểm tra xem item có thể xử lý không
   */
  static canProcess(machineType: string, inputId: string): boolean {
    return this.recipes.get(machineType)?.has(inputId) ?? false;
  }

  /**
   * Lấy tất cả input IDs cho machine type
   */
  static getAllInputIds(machineType: string): string[] {
    const machineRecipes = this.recipes.get(machineType);
    return machineRecipes ? Array.from(machineRecipes.keys()) : [];
  }

  /**
   * Load recipes từ generated data
   */
  static loadFromGenerated(generatedRecipes: Record<string, Array<{input: string; output: string; processingTime: number}>>): void {
    for (const [machineType, recipes] of Object.entries(generatedRecipes)) {
      for (const recipe of recipes) {
        this.registerRecipe(machineType, {
          inputId: recipe.input,
          outputId: recipe.output,
          processingTime: recipe.processingTime
        });
      }
    }
  }
}
