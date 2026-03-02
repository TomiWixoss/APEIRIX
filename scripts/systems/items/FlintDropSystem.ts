import { world, ItemStack, Player, Block } from "@minecraft/server";

/**
 * System xử lý custom drops cho Flint materials
 * - Grass/Tallgrass → Plant Fiber (40% chance)
 * - Gravel → Flint Shard (30% chance)
 * - Leaves → Stick (15% chance)
 */
export class FlintDropSystem {
  private static instance: FlintDropSystem;

  // Drop configurations
  private static readonly GRASS_BLOCKS = [
    "minecraft:grass",
    "minecraft:tall_grass",
    "minecraft:short_grass",
    "minecraft:fern",
    "minecraft:large_fern",
  ];

  private static readonly LEAVES_BLOCKS = [
    "minecraft:oak_leaves",
    "minecraft:spruce_leaves",
    "minecraft:birch_leaves",
    "minecraft:jungle_leaves",
    "minecraft:acacia_leaves",
    "minecraft:dark_oak_leaves",
    "minecraft:mangrove_leaves",
    "minecraft:cherry_leaves",
    "minecraft:azalea_leaves",
    "minecraft:azalea_leaves_flowered",
  ];

  private static readonly GRAVEL_BLOCK = "minecraft:gravel";
  
  private static readonly FIBER_DROP_CHANCE = 0.4; // 40%
  private static readonly SHARD_DROP_CHANCE = 0.3; // 30%
  private static readonly STICK_DROP_CHANCE = 0.15; // 15%

  private constructor() {
    this.initialize();
  }

  public static getInstance(): FlintDropSystem {
    if (!FlintDropSystem.instance) {
      FlintDropSystem.instance = new FlintDropSystem();
    }
    return FlintDropSystem.instance;
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

    // Validate player is still valid
    try {
      if (!player.isValid) {
        return;
      }
    } catch {
      return; // Player entity removed
    }

    // Check for grass blocks → Plant Fiber
    if (FlintDropSystem.GRASS_BLOCKS.includes(blockId)) {
      if (Math.random() < FlintDropSystem.FIBER_DROP_CHANCE) {
        this.spawnDrop(block, "apeirix:plant_fiber", 1);
      }
      return;
    }

    // Check for gravel → Flint Shard
    if (blockId === FlintDropSystem.GRAVEL_BLOCK) {
      if (Math.random() < FlintDropSystem.SHARD_DROP_CHANCE) {
        this.spawnDrop(block, "apeirix:flint_shard", 1);
      }
      return;
    }

    // Check for leaves → Stick
    if (FlintDropSystem.LEAVES_BLOCKS.includes(blockId)) {
      if (Math.random() < FlintDropSystem.STICK_DROP_CHANCE) {
        this.spawnDrop(block, "minecraft:stick", 1);
      }
      return;
    }
  }

  private spawnDrop(block: Block, itemId: string, count: number): void {
    const dropLocation = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5,
    };

    try {
      block.dimension.spawnItem(new ItemStack(itemId, count), dropLocation);
    } catch (error) {
      console.warn(`[FlintDropSystem] Failed to spawn ${itemId}:`, error);
    }
  }
}
