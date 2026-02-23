import { world, ItemStack, Player, Block, EquipmentSlot } from "@minecraft/server";

/**
 * System xử lý Fortune enchantment cho custom ore blocks
 */
export class FortuneSystem {
  private static instance: FortuneSystem;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): FortuneSystem {
    if (!FortuneSystem.instance) {
      FortuneSystem.instance = new FortuneSystem();
    }
    return FortuneSystem.instance;
  }

  private initialize(): void {
    // Listen to block break events
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
  }

  private handleBlockBreak(event: {
    player: Player;
    block: Block;
    brokenBlockPermutation: any;
  }): void {
    const { player, block, brokenBlockPermutation } = event;
    const blockId = brokenBlockPermutation.type.id;

    // Chỉ xử lý tin ore blocks
    if (
      blockId !== "apeirix:tin_ore" &&
      blockId !== "apeirix:deepslate_tin_ore"
    ) {
      return;
    }

    // Get tool in hand
    const equipment = player.getComponent("minecraft:equippable");
    if (!equipment) return;

    const tool = equipment.getEquipment(EquipmentSlot.Mainhand);
    if (!tool) return;

    // Check for Silk Touch (không spawn thêm nếu có Silk Touch)
    const enchantable = tool.getComponent("minecraft:enchantable");
    if (!enchantable) return;

    const silkTouch = enchantable.getEnchantment("silk_touch");
    if (silkTouch) return; // Silk Touch đã ra nguyên khối, không cần Fortune

    // Check for Fortune
    const fortune = enchantable.getEnchantment("fortune");
    if (!fortune) return; // Không có Fortune, drop bình thường

    // Calculate bonus drops based on Fortune level
    const fortuneLevel = fortune.level;
    const bonusDrops = this.calculateBonusDrops(fortuneLevel);

    if (bonusDrops > 0) {
      // Spawn thêm raw tin
      const dropLocation = {
        x: block.location.x + 0.5,
        y: block.location.y + 0.5,
        z: block.location.z + 0.5,
      };

      block.dimension.spawnItem(
        new ItemStack("apeirix:raw_tin", bonusDrops),
        dropLocation
      );
    }
  }

  private calculateBonusDrops(fortuneLevel: number): number {
    // Fortune mechanics: có cơ hội drop thêm
    // Fortune I: 0-1 bonus (33% chance each)
    // Fortune II: 0-2 bonus (25% chance each)
    // Fortune III: 0-3 bonus (20% chance each)

    const maxBonus = fortuneLevel;
    const random = Math.random();
    const chance = 1 / (maxBonus + 1);

    for (let i = maxBonus; i > 0; i--) {
      if (random < chance * i) {
        return i;
      }
    }

    return 0;
  }
}
