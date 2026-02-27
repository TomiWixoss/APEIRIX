/**
 * Processing Handler - Xử lý quá trình processing (hỗ trợ nhiều input/output)
 */

import { world, ItemStack } from '@minecraft/server';
import { MachineStateManager, MachineState } from './MachineState';
import { HopperHandler } from './HopperHandler';

export interface ProcessingOutput {
  itemId: string;
  amount: number;
}

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
   * Hoàn thành quá trình xử lý (hỗ trợ nhiều outputs)
   */
  private static finishProcessing(block: any, state: MachineState, offBlockId: string): void {
    // Parse outputs từ state.outputItem (format: "item1:count1,item2:count2")
    const outputs = this.parseOutputs(state.outputItem);
    
    // Spawn từng output
    for (const output of outputs) {
      const transferredToHopper = HopperHandler.tryTransferToHopper(block, output.itemId, output.amount);
      
      if (!transferredToHopper) {
        const spawnLocation = {
          x: block.location.x + 0.5,
          y: block.location.y + 1.0,
          z: block.location.z + 0.5
        };
        
        block.dimension.spawnItem(new ItemStack(output.itemId, output.amount), spawnLocation);
      }
    }
    
    // Tắt máy
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
    
    // Effects
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

  /**
   * Parse output string thành array of outputs
   * Format: "item1:count1,item2:count2" hoặc "item1" (count = 1)
   */
  private static parseOutputs(outputStr: string): ProcessingOutput[] {
    if (!outputStr) return [];
    
    const outputs: ProcessingOutput[] = [];
    const parts = outputStr.split(',');
    
    for (const part of parts) {
      const [itemId, countStr] = part.split(':');
      const amount = countStr ? parseInt(countStr) : 1;
      outputs.push({ itemId: itemId.trim(), amount });
    }
    
    return outputs;
  }

  /**
   * Encode outputs thành string để lưu vào state
   */
  static encodeOutputs(outputs: ProcessingOutput[]): string {
    return outputs.map(o => `${o.itemId}:${o.amount}`).join(',');
  }
}
