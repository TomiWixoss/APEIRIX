/**
 * Food Registry - Quản lý food effects
 * Giống như OreRegistry và ToolRegistry
 */

export interface FoodEffect {
  name: string;
  duration: number; // ticks
  amplifier: number;
  chance?: number;
}

export interface FoodDefinition {
  itemId: string;
  effects?: FoodEffect[];
  removeEffects?: boolean; // Như milk bucket
}

export class FoodRegistry {
  private static foods: Map<string, FoodDefinition> = new Map();

  /**
   * Đăng ký food mới
   */
  static register(food: FoodDefinition): void {
    this.foods.set(food.itemId, food);
  }

  /**
   * Kiểm tra xem item có phải food với effects không
   */
  static isFood(itemId: string): boolean {
    return this.foods.has(itemId);
  }

  /**
   * Lấy thông tin food
   */
  static getFood(itemId: string): FoodDefinition | undefined {
    return this.foods.get(itemId);
  }
}
