import { OreRegistry } from "./blocks/OreRegistry";
import { TillableRegistry } from "./blocks/TillableRegistry";
import { ToolRegistry } from "./tools/ToolRegistry";
import { FoodRegistry } from "./foods/FoodRegistry";
import { HammerRegistry } from "./mining/HammerRegistry";
import { BrassSifterRegistry } from "./mining/BrassSifterRegistry";
import { CompressorRegistry } from "./mining/CompressorRegistry";
import { GENERATED_ORES, GENERATED_TOOLS, GENERATED_FOODS, GENERATED_HAMMER_MINING, GENERATED_HAMMER_IDS, GENERATED_BRASS_SIFTER } from "./GeneratedGameData";

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
    this.registerBrassSifter();
    this.registerCompressor();
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

  private static registerBrassSifter(): void {
    // Register brass sifter recipes
    for (const recipe of GENERATED_BRASS_SIFTER) {
      BrassSifterRegistry.registerRecipe(recipe);
    }

    // Thêm custom brass sifter recipes ở đây (không được generate từ CLI)...
  }

  private static registerCompressor(): void {
    // Register compressor recipes
    // Steel Ingot → Steel Plate (3 seconds)
    CompressorRegistry.registerRecipe({
      inputId: 'apeirix:steel_alloy_ingot',
      outputId: 'apeirix:steel_alloy_base_plate',
      processingTime: 60 // 3 seconds (60 ticks)
    });

    // Thêm custom compressor recipes ở đây...
  }
}
