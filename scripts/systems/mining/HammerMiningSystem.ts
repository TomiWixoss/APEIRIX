import { world, Block, ItemStack, system } from '@minecraft/server';
import { HammerRegistry } from '../../data/mining/HammerRegistry';

/**
 * HammerMiningSystem - Override vanilla block drops when using hammer
 * 
 * Since Bedrock doesn't allow overriding vanilla block loot tables,
 * we use script API to intercept mining and provide custom drops.
 * 
 * Uses auto-generated data from GeneratedGameData.ts via HammerRegistry.
 */
export class HammerMiningSystem {
  static initialize(): void {
    console.warn('[HammerMiningSystem] Initializing...');
    
    // Listen to block break events AFTER they happen
    // We can't cancel vanilla block drops, so we need to remove them and spawn custom drops
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
    
    console.warn('[HammerMiningSystem] Initialized');
  }

  private static handleBlockBreak(event: any): void {
    const { block, brokenBlockPermutation, itemStackBeforeBreak } = event;
    
    // Check if player was using a hammer
    if (!itemStackBeforeBreak || !HammerRegistry.isHammer(itemStackBeforeBreak.typeId)) {
      return;
    }
    
    // Check if block has custom dust drops
    const blockId = brokenBlockPermutation.type.id;
    const dustDrop = HammerRegistry.getDrops(blockId);
    
    if (!dustDrop) {
      return;
    }
    
    // Schedule cleanup and custom drops
    system.runTimeout(() => {
      // First: Remove vanilla drops
      this.removeVanillaDrops(block);
      
      // Then: Spawn custom drops after a small delay
      system.runTimeout(() => {
        this.spawnCustomDrops(block, dustDrop);
      }, 1);
    }, 1); // Wait 1 tick for vanilla drops to spawn
  }

  private static removeVanillaDrops(block: Block): void {
    // Get all entities near the broken block location
    const location = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5
    };
    
    try {
      // Kill all item entities within 2 blocks radius
      block.dimension.runCommand(
        `kill @e[type=item,r=2,x=${location.x},y=${location.y},z=${location.z}]`
      );
    } catch (error) {
      console.warn('[HammerMiningSystem] Failed to remove vanilla drops:', error);
    }
  }

  private static spawnCustomDrops(block: Block, dustDrop: any): void {
    const location = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5
    };
    
    // Spawn stone dust
    block.dimension.spawnItem(
      new ItemStack(dustDrop.stoneDust, dustDrop.stoneDustCount),
      location
    );
    
    // Spawn ore dust if exists
    if (dustDrop.oreDust && dustDrop.oreDustCount) {
      block.dimension.spawnItem(
        new ItemStack(dustDrop.oreDust, dustDrop.oreDustCount),
        location
      );
    }
  }
}
