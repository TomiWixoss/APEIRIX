/**
 * Anvil Interaction System - Gõ Thỏi Thép trên Đe để tạo Tấm Thép
 * 
 * Cơ chế:
 * - Player cầm Steel Ingot và tương tác (chuột phải) vào Anvil
 * - Trừ 1 Steel Ingot từ tay
 * - Spawn 1 Steel Plate
 * - Anvil có 12% tỷ lệ bị nứt/vỡ (giống cơ chế rèn đồ của Minecraft)
 */

import { world, system, Block, ItemStack, Player } from '@minecraft/server';

export class AnvilInteractionSystem {
  private static readonly ANVIL_BLOCK_IDS = [
    'minecraft:anvil',
    'minecraft:chipped_anvil',
    'minecraft:damaged_anvil'
  ];
  
  private static readonly STEEL_INGOT_ID = 'apeirix:steel_alloy_ingot';
  private static readonly STEEL_PLATE_ID = 'apeirix:steel_alloy_base_plate';
  private static readonly DAMAGE_CHANCE = 0.12; // 12% tỷ lệ nứt đe

  static initialize(): void {
    console.warn('[AnvilInteractionSystem] Initializing...');
    
    // Listen to player interact with block
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      this.handleInteraction(event);
    });
    
    console.warn('[AnvilInteractionSystem] Initialized');
  }

  /**
   * Xử lý khi player tương tác với anvil
   */
  private static handleInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    // Check if block is anvil
    if (!this.ANVIL_BLOCK_IDS.includes(block.typeId)) {
      return;
    }
    
    // Check if player is holding steel ingot
    if (!itemStack || itemStack.typeId !== this.STEEL_INGOT_ID) {
      return;
    }
    
    // Cancel default interaction
    event.cancel = true;
    
    // Process forging after a small delay
    system.runTimeout(() => {
      this.processForging(player, block);
    }, 1);
  }

  /**
   * Xử lý quá trình gõ thép trên đe
   */
  private static processForging(player: Player, block: Block): void {
    try {
      // Get player's main hand item
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) {
        return;
      }
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || heldItem.typeId !== this.STEEL_INGOT_ID) {
        return;
      }
      
      // Trừ 1 Steel Ingot
      if (heldItem.amount > 1) {
        heldItem.amount -= 1;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        // Nếu chỉ có 1 cái thì xóa luôn khỏi tay
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Spawn Steel Plate tại vị trí player
      const spawnLocation = {
        x: player.location.x,
        y: player.location.y + 0.5,
        z: player.location.z
      };
      
      player.dimension.spawnItem(new ItemStack(this.STEEL_PLATE_ID, 1), spawnLocation);
      
      // Play anvil sound
      try {
        block.dimension.playSound('random.anvil_use', block.location, { volume: 1.0, pitch: 1.0 });
      } catch (e) {
        // Sound không play được, không sao
      }
      
      // Particle effect at anvil
      try {
        block.dimension.spawnParticle(
          'minecraft:lava_particle',
          {
            x: block.location.x + 0.5,
            y: block.location.y + 1.0,
            z: block.location.z + 0.5
          }
        );
      } catch (e) {
        // Particle không spawn được, không sao
      }
      
      // 12% tỷ lệ làm nứt đe
      if (Math.random() < this.DAMAGE_CHANCE) {
        this.damageAnvil(block);
      }
      
    } catch (error) {
      console.warn('[AnvilInteractionSystem] Failed to process forging:', error);
    }
  }

  /**
   * Làm nứt đe (giống cơ chế rèn đồ của Minecraft)
   */
  private static damageAnvil(block: Block): void {
    try {
      const currentType = block.typeId;
      let newType: string | null = null;
      
      if (currentType === 'minecraft:anvil') {
        newType = 'minecraft:chipped_anvil';
      } else if (currentType === 'minecraft:chipped_anvil') {
        newType = 'minecraft:damaged_anvil';
      } else if (currentType === 'minecraft:damaged_anvil') {
        // Đe vỡ hoàn toàn - xóa block
        block.setType('minecraft:air');
        
        // Play break sound
        try {
          block.dimension.playSound('random.anvil_break', block.location, { volume: 1.0, pitch: 1.0 });
        } catch (e) {}
        
        return;
      }
      
      if (newType) {
        // Lưu lại hướng của đe
        const permutation = block.permutation;
        const direction = permutation.getState('minecraft:cardinal_direction');
        
        // Đổi sang loại đe mới
        block.setType(newType);
        
        // Khôi phục hướng
        if (direction) {
          const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
          block.setPermutation(newPermutation);
        }
        
        // Play land sound (tiếng đe bị nứt)
        try {
          block.dimension.playSound('random.anvil_land', block.location, { volume: 1.0, pitch: 0.8 });
        } catch (e) {}
      }
      
    } catch (error) {
      console.warn('[AnvilInteractionSystem] Failed to damage anvil:', error);
    }
  }
}
