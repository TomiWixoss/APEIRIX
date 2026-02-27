/**
 * Player Interaction Handler - Xử lý tương tác của player
 */

import { Player, Block, system } from '@minecraft/server';
import { MachineState } from './MachineState';
import { ProcessingRecipe } from './HopperHandler';

export class PlayerInteractionHandler {
  private static readonly INTERACTION_COOLDOWN = 10; // 10 ticks = 0.5 giây
  private static currentTick: number = 0;

  static incrementTick(): void {
    this.currentTick++;
  }

  /**
   * Xử lý player click vào machine
   */
  static handleInteraction(event: any, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined, onBlockId: string): void {
    const { block, player, itemStack } = event;
    
    if (!itemStack) return;
    
    const recipe = recipeGetter(itemStack.typeId);
    if (!recipe) return;
    
    // Đang chạy thì không cho bỏ thêm
    if (state.isProcessing) {
      player.sendMessage("§cMáy đang hoạt động!");
      event.cancel = true;
      return;
    }
    
    // Kiểm tra cooldown để tránh xử lý nhiều lần
    const ticksSinceLastInteraction = this.currentTick - state.lastInteractionTick;
    if (ticksSinceLastInteraction < this.INTERACTION_COOLDOWN) {
      event.cancel = true;
      return;
    }
    
    event.cancel = true;
    
    // Cập nhật thời điểm interaction
    state.lastInteractionTick = this.currentTick;
    
    // Bắt đầu xử lý
    system.runTimeout(() => {
      this.startProcessing(player, block, recipe, state, onBlockId);
    }, 1);
  }

  /**
   * Bắt đầu quá trình xử lý
   */
  private static startProcessing(
    player: Player,
    block: Block,
    recipe: ProcessingRecipe,
    state: MachineState,
    onBlockId: string
  ): void {
    try {
      // Lấy item từ tay player
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) return;
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || heldItem.typeId !== recipe.inputId) return;
      
      // Trừ 1 item
      if (heldItem.amount > 1) {
        heldItem.amount -= 1;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Lưu direction trước khi bật máy
      const currentDirection = (block.permutation as any).getState('apeirix:direction');
      
      // Bật máy và preserve direction
      state.inputItem = recipe.inputId;
      state.outputItem = recipe.outputId;
      state.ticksRemaining = recipe.processingTime;
      
      block.setType(onBlockId);
      
      // Set lại direction sau khi đổi type
      try {
        const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
        block.setPermutation(onPermutation);
      } catch (e) {
        // Nếu block không có direction state thì bỏ qua
      }
      
      state.isProcessing = true;
      
      // Sound
      try {
        block.dimension.playSound('random.anvil_use', block.location);
      } catch (e) {}
      
    } catch (error) {
      // Failed to start processing
    }
  }
}
