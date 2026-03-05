/**
 * GameData - Initialize all game data and registries
 * Better SB
 */

import { GENERATED_ORES, GENERATED_TOOLS, GENERATED_FOODS } from "./GeneratedGameData";

export class GameData {
  /**
   * Initialize all game data
   */
  static initialize(): void {
    this.registerOres();
    this.registerTools();
    this.registerFoods();
    this.registerBlocks();
  }

  /**
   * Register ores
   */
  private static registerOres(): void {
    // TODO: Register generated ores when available
    // for (const ore of GENERATED_ORES) {
    //   OreRegistry.register(ore);
    // }
  }

  /**
   * Register tools
   */
  private static registerTools(): void {
    // TODO: Register generated tools when available
    // for (const tool of GENERATED_TOOLS) {
    //   ToolRegistry.register(tool);
    // }
  }

  /**
   * Register foods
   */
  private static registerFoods(): void {
    // TODO: Register generated foods when available
    // for (const food of GENERATED_FOODS) {
    //   FoodRegistry.register(food);
    // }
  }

  /**
   * Register blocks
   */
  private static registerBlocks(): void {
    // TODO: Register custom blocks when available
  }
}
