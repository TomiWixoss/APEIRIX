import { OreRegistry } from "./blocks/OreRegistry";
import { TillableRegistry } from "./blocks/TillableRegistry";
import { ToolRegistry } from "./tools/ToolRegistry";

/**
 * GameData - Đăng ký tất cả game data
 */
export class GameData {
  static initialize(): void {
    this.registerOres();
    this.registerTools();
    this.registerTillables();
  }

  private static registerOres(): void {
    // Tin Ore
    OreRegistry.register({
      blockId: "apeirix:tin_ore",
      dropItem: "apeirix:raw_tin",
      dropCount: 1,
      fortuneEnabled: true
    });

    // Deepslate Tin Ore
    OreRegistry.register({
      blockId: "apeirix:deepslate_tin_ore",
      dropItem: "apeirix:raw_tin",
      dropCount: 1,
      fortuneEnabled: true
    });

    // Thêm ore mới ở đây...
  }

  private static registerTools(): void {
    // Bronze Tools
    ToolRegistry.register({
      id: "apeirix:bronze_pickaxe",
      type: "pickaxe",
      durability: 375
    });

    ToolRegistry.register({
      id: "apeirix:bronze_axe",
      type: "axe",
      durability: 375
    });

    ToolRegistry.register({
      id: "apeirix:bronze_shovel",
      type: "shovel",
      durability: 375
    });

    ToolRegistry.register({
      id: "apeirix:bronze_hoe",
      type: "hoe",
      durability: 375
    });

    ToolRegistry.register({
      id: "apeirix:bronze_sword",
      type: "sword",
      durability: 375
    });

        ToolRegistry.register({
      id: "apeirix:bronze_spear",
      type: "spear",
      durability: 375
    });

    // Thêm tool mới ở đây...
  }

  private static registerTillables(): void {
    // Vanilla tillable blocks
    TillableRegistry.registerVanillaTillables();

    // Thêm custom tillable blocks ở đây...
  }
}
