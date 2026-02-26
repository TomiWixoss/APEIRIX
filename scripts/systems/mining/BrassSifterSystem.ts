import { world, system, Block, ItemStack, Player, Vector3 } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { BrassSifterRegistry } from '../../data/mining/BrassSifterRegistry';

/**
 * BrassSifterSystem - Lọc bụi khoáng sản thành bụi tinh khiết
 * 
 * Cơ chế:
 * - Player cầm bụi khoáng sản và tương tác với brass_sifter
 * - Mất 1 bụi khoáng sản từ tay
 * - Sinh ra 1 bụi tinh khiết + bụi đá đã lọc
 * - Bụi tinh khiết đem đi nung sẽ ra 1 thỏi
 * 
 * Sử dụng auto-generated data từ GeneratedGameData.ts
 */
export class BrassSifterSystem {
  private static readonly SIFTER_BLOCK_ID = 'apeirix:brass_sifter';

  static initialize(): void {
    console.warn('[BrassSifterSystem] Initializing...');
    
    // Listen to player interact with block
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      this.handleInteraction(event);
    });
    
    console.warn('[BrassSifterSystem] Initialized');
  }

  /**
   * Xử lý khi player tương tác với brass sifter
   */
  private static handleInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    // Check if block is brass sifter
    if (block.typeId !== this.SIFTER_BLOCK_ID) {
      return;
    }
    
    // Check if player is holding a dust item
    if (!itemStack) {
      return;
    }
    
    const dustId = itemStack.typeId;
    const recipe = BrassSifterRegistry.getRecipe(dustId);
    
    if (!recipe) {
      return;
    }
    
    // Cancel default interaction
    event.cancel = true;
    
    // Process sifting after a small delay
    system.runTimeout(() => {
      this.processSifting(player, block, recipe);
    }, 1);
  }

  /**
   * Xử lý quá trình lọc bụi
   */
  private static processSifting(
    player: Player, 
    block: Block, 
    recipe: { pureDustId: string; stoneDustId: string }
  ): void {
    try {
      // Get player's main hand item
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) {
        return;
      }
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || !BrassSifterRegistry.canSift(heldItem.typeId)) {
        return;
      }
      
      // Remove 1 dust from hand
      if (heldItem.amount > 1) {
        heldItem.amount -= 1;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Spawn pure dust and stone dust at player location
      const spawnLocation = {
        x: player.location.x,
        y: player.location.y + 0.5,
        z: player.location.z
      };
      
      player.dimension.spawnItem(new ItemStack(recipe.pureDustId, 1), spawnLocation);
      player.dimension.spawnItem(new ItemStack(recipe.stoneDustId, 1), spawnLocation);
      
      // Particle effect at sifter
      try {
        block.dimension.spawnParticle(
          'minecraft:crop_growth_emitter',
          {
            x: block.location.x + 0.5,
            y: block.location.y + 0.5,
            z: block.location.z + 0.5
          }
        );
      } catch (e) {
        // Particle không spawn được, không sao
      }
      
      // Play sound
      try {
        player.playSound('random.levelup', { volume: 0.5, pitch: 1.5 });
      } catch (e) {
        // Sound không play được, không sao
      }
      
      // Emit event for achievement tracking
      EventBus.emit("brasssifter:used", player);
      
    } catch (error) {
      console.warn('[BrassSifterSystem] Failed to process sifting:', error);
    }
  }
}
