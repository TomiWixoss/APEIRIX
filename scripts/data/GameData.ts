import { OreRegistry } from "./blocks/OreRegistry";
import { TillableRegistry } from "./blocks/TillableRegistry";
import { ToolRegistry } from "./tools/ToolRegistry";
import { FoodRegistry } from "./foods/FoodRegistry";
import { HammerRegistry } from "./mining/HammerRegistry";
import { GENERATED_ORES, GENERATED_TOOLS, GENERATED_FOODS, GENERATED_HAMMER_MINING, GENERATED_HAMMER_IDS } from "./GeneratedGameData";

/**
 * GameData - Đăng ký tất cả game data
 */
export class GameData {
  static initialize(): void {
    this.registerOres();
    this.registerTools();
    this.registerTillables();
    this.registerFoods();
    this.registerHammerMining();
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

  private static registerHammerMining(): void {
    // Register hammer tool IDs
    for (const hammerId of GENERATED_HAMMER_IDS) {
      HammerRegistry.registerHammer(hammerId);
    }

    // Register hammer-mineable blocks
    for (const block of GENERATED_HAMMER_MINING) {
      HammerRegistry.registerBlock(block);
    }

    // Thêm custom hammer mining blocks ở đây (không được generate từ CLI)...
  }
}
