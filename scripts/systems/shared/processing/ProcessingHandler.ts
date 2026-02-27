/**
 * Processing Handler - Xử lý quá trình processing
 */

import { world, ItemStack } from '@minecraft/server';
import { MachineStateManager, MachineState } from './MachineState';
import { HopperHandler } from './HopperHandler';

export class ProcessingHandler {
  /**
   * Xử lý tất cả machines đang chạy
   */
  static processAll(onBlockId: string, offBlockId: string): void {
    for (const [key, state] of MachineStateManager.getAll().entries()) {
      if (!state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== onBlockId) {
          state.isProcessing = false;
          continue;
        }
        
        state.ticksRemaining--;
        
        if (state.ticksRemaining <= 0) {
          this.finishProcessing(block, state, offBlockId);
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }

  /**
   * Hoàn thành quá trình xử lý
   */
  private static finishProcessing(block: any, state: MachineState, offBlockId: string): void {
    const outputId = state.outputItem;
    
    const transferredToHopper = HopperHandler.tryTransferToHopper(block, outputId);
    
    if (!transferredToHopper) {
      const spawnLocation = {
        x: block.location.x + 0.5,
        y: block.location.y + 1.0,
        z: block.location.z + 0.5
      };
      
      block.dimension.spawnItem(new ItemStack(outputId, 1), spawnLocation);
    }
    
    const permutation = block.permutation;
    const direction = permutation.getState('minecraft:cardinal_direction');
    block.setType(offBlockId);
    if (direction) {
      const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
      block.setPermutation(newPermutation);
    }
    state.isProcessing = false;
    state.ticksRemaining = 0;
    state.inputItem = '';
    state.outputItem = '';
    
    try {
      block.dimension.playSound('random.levelup', block.location);
    } catch (e) {}
    
    try {
      const particleLocation = {
        x: block.location.x + 0.5,
        y: block.location.y + 1.0,
        z: block.location.z + 0.5
      };
      block.dimension.spawnParticle('minecraft:crop_growth_emitter', particleLocation);
    } catch (e) {}
  }
}
