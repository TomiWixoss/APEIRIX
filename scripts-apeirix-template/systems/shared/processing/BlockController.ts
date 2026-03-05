/**
 * Block Controller - Điều khiển block state (ON/OFF)
 */

import { Block } from '@minecraft/server';
import { MachineState } from './MachineState';

export class BlockController {
  /**
   * Bật máy (chuyển sang ON state)
   */
  static turnOn(block: Block, state: MachineState, onBlockId: string): void {
    // Lưu hướng của block
    const permutation = block.permutation;
    const direction = permutation.getState('minecraft:cardinal_direction');
    
    // Chuyển sang ON
    block.setType(onBlockId);
    
    // Khôi phục hướng
    if (direction) {
      const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
      block.setPermutation(newPermutation);
    }
    
    // Update state
    state.isProcessing = true;
  }

  /**
   * Tắt máy (chuyển về OFF state)
   */
  static turnOff(block: Block, state: MachineState, offBlockId: string): void {
    // Lưu hướng
    const permutation = block.permutation;
    const direction = permutation.getState('minecraft:cardinal_direction');
    
    // Chuyển về OFF
    block.setType(offBlockId);
    
    // Khôi phục hướng
    if (direction) {
      const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
      block.setPermutation(newPermutation);
    }
    
    // Reset state (giữ lastInteractionTick để cooldown vẫn hoạt động)
    state.isProcessing = false;
    state.ticksRemaining = 0;
    state.inputItem = '';
    state.outputItem = '';
  }
}
