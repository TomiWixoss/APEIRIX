import { OreRegistry } from "./blocks/OreRegistry";
import { TillableRegistry } from "./blocks/TillableRegistry";
import { ToolRegistry } from "./tools/ToolRegistry";
import { FoodRegistry } from "./foods/FoodRegistry";
import { GENERATED_ORES, GENERATED_TOOLS, GENERATED_FOODS } from "./GeneratedGameData";

/**
 * GameData - Đăng ký tất cả game data
 */
export class GameData {
  static initialize(): void {
    this.registerOres();
    this.registerTools();
    this.registerTillables();
    this.registerFoods();
  }

  private static registerOres(): void {
    // Register generated ores
    for (const ore of GENERATED_ORES) {
      OreRegistry.register(ore);
    }

    // Thêm custom ore ở đây (không được generate từ CLI)...
  }

  private static registerTools(): void {
    // Register generated tools
    for (const tool of GENERATED_TOOLS) {
      ToolRegistry.register(tool);
    }

    // Thêm custom tool ở đây (không được generate từ CLI)...
  }

  private static registerTillables(): void {
    // Vanilla tillable blocks
    TillableRegistry.registerVanillaTillables();

    // Thêm custom tillable blocks ở đây...
  }

  private static registerFoods(): void {
    // Register generated foods
    for (const food of GENERATED_FOODS) {
      FoodRegistry.register(food);
    }

    // Thêm custom food ở đây (không được generate từ CLI)...
  }
}
