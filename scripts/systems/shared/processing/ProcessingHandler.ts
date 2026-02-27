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
   * Xử lý tất cả machines đang chạy của một loại cụ thể
   */
  static processAll(onBlockId: string, offBlockId: string, machineType?: string): void {
    for (const [key, state] of MachineStateManager.getAll().entries()) {
      if (!state.isProcessing) continue;
      
      // Filter by machine type if specified
      if (machineType && state.machineType !== machineType) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || (block.typeId !== onBlockId && block.typeId !== offBlockId)) {
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
    const outputs = this.parseOutputs(state.outputItem);
    
    // Lưu direction trước khi tắt máy
    const currentDirection = (block.permutation as any).getState('apeirix:direction');
    
    // Tắt máy và preserve direction
    block.setType(offBlockId);
    try {
      const offPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
      block.setPermutation(offPermutation);
    } catch (e) {
      // Nếu block không có direction state thì bỏ qua
    }
    
    // Reset state
    state.isProcessing = false;
    state.ticksRemaining = 0;
    state.inputItem = '';
    state.outputItem = '';
    
    // Spawn items SAU KHI đã tắt máy
    for (const output of outputs) {
      const transferredToHopper = HopperHandler.tryTransferToHopper(block, output.itemId, output.amount);
      
      if (!transferredToHopper) {
        const spawnLocation = {
          x: block.location.x + 0.5,
          y: block.location.y + 1.0,
          z: block.location.z + 0.5
        };
        
        try {
          block.dimension.spawnItem(new ItemStack(output.itemId, output.amount), spawnLocation);
        } catch (e) {
          // Failed to spawn item
        }
      }
    }
    
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
   * Format: "item1,count1;item2,count2" hoặc "item1" (count = 1)
   * VD: "apeirix:iron_ingot,2;apeirix:cobblestone_dust,3"
   */
  private static parseOutputs(outputStr: string): ProcessingOutput[] {
    if (!outputStr) return [];
    
    const outputs: ProcessingOutput[] = [];
    const parts = outputStr.split(';'); // Split by semicolon for multiple outputs
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      const [itemId, countStr] = trimmed.split(','); // Split by comma for item,count
      const amount = countStr ? parseInt(countStr) : 1;
      
      if (itemId && !isNaN(amount)) {
        outputs.push({ itemId: itemId.trim(), amount });
      }
    }
    
    return outputs;
  }

  /**
   * Encode outputs thành string để lưu vào state
   * Format: "item1,count1;item2,count2"
   */
  static encodeOutputs(outputs: ProcessingOutput[]): string {
    return outputs.map(o => `${o.itemId},${o.amount}`).join(';');
  }
}
