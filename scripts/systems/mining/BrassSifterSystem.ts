import { world, system, Block, ItemStack, Player } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { BrassSifterRegistry } from '../../data/mining/BrassSifterRegistry';

/**
 * BrassSifterSystem - Lọc bụi khoáng sản thành bụi tinh khiết
 * 
 * Cơ chế hao hụt khối lượng (Mass Loss):
 * - Player cầm bụi khoáng sản và tương tác với brass_sifter
 * - Mất 2 bụi khoáng sản từ tay (hao hụt khi tinh chế)
 * - Sinh ra 1 bụi tinh khiết + 2 bụi đá đã lọc
 * - 4 Bụi tinh khiết đem đi nung = 1 thỏi
 * 
 * Toán học cân bằng:
 * - Đập 1 quặng bằng búa: 9 bụi thường
 * - Rây 9 bụi (tỷ lệ 2:1): 4.5 bụi tinh khiết
 * - Ép 4.5 bụi (4 bụi = 1 thỏi): 1.125 thỏi
 * - Bonus: +12.5% so với đào thường (1 thỏi)
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
   * 
   * Cơ chế hao hụt: 2 Bụi Thường → 1 Bụi Tinh Khiết + 2 Bụi Đá
   * Toán học: 9 bụi từ búa → 4.5 bụi tinh khiết → 1.125 thỏi (bonus 12.5%)
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
      
      // --- BẮT ĐẦU CƠ CHẾ HAO HỤT 2:1 ---
      // Bắt buộc phải có từ 2 bụi trở lên mới đủ để rây ra 1 bụi tinh khiết
      if (heldItem.amount < 2) {
        player.onScreenDisplay.setActionBar("§cBạn cần ít nhất 2 Bụi khoáng sản để rây lọc!");
        try {
          player.playSound("note.bass", { volume: 0.5, pitch: 1.0 });
        } catch (e) {}
        return;
      }
      
      // Trừ đi 2 Bụi (Hao hụt khối lượng khi tinh chế)
      if (heldItem.amount > 2) {
        heldItem.amount -= 2;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        // Nếu có đúng 2 cái thì xóa luôn khỏi tay
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Spawn pure dust and stone dust at player location
      const spawnLocation = {
        x: player.location.x,
        y: player.location.y + 0.5,
        z: player.location.z
      };
      
      // Sinh ra 1 Bụi Tinh Khiết (từ 2 bụi thường)
      player.dimension.spawnItem(new ItemStack(recipe.pureDustId, 1), spawnLocation);
      
      // Vì sàng lọc 2 bụi, lượng đất đá rớt ra sẽ nhiều hơn -> Sinh ra 2 Bụi Đá
      player.dimension.spawnItem(new ItemStack(recipe.stoneDustId, 2), spawnLocation);
      // --- KẾT THÚC CƠ CHẾ HAO HỤT 2:1 ---
      
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
