/**
 * Hopper Handler - Xử lý input/output với hopper
 */

import { Block, ItemStack, Vector3 } from '@minecraft/server';
import { MachineState } from './MachineState';

export interface ProcessingRecipe {
  inputId: string;
  outputId: string;
  processingTime: number;
}

export class HopperHandler {
  /**
   * Kiểm tra và lấy item từ hopper phía trên
   */
  static checkHopperAbove(block: Block, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined): boolean {
    const hopperLoc: Vector3 = {
      x: block.location.x,
      y: block.location.y + 1,
      z: block.location.z
    };
    
    return this.tryTakeItemFromHopper(block, hopperLoc, state, recipeGetter);
  }

  /**
   * Kiểm tra và lấy item từ hopper 4 bên
   */
  static checkHoppersSides(block: Block, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined): boolean {
    const offsets = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 }
    ];
    
    for (const offset of offsets) {
      const hopperLoc: Vector3 = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z
      };
      
      if (this.tryTakeItemFromHopper(block, hopperLoc, state, recipeGetter)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Thử lấy item từ hopper tại vị trí
   */
  private static tryTakeItemFromHopper(block: Block, hopperLoc: Vector3, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined): boolean {
    try {
      const hopperBlock = block.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return false;
      
      const container = hopperBlock.getComponent('inventory')?.container;
      if (!container) return false;
      
      // Tìm item có thể nén
      for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        
        const recipe = recipeGetter(item.typeId);
        if (!recipe) continue;
        
        // Lấy 1 item từ hopper
        if (item.amount > 1) {
          item.amount -= 1;
          container.setItem(i, item);
        } else {
          container.setItem(i, undefined);
        }
        
        // Trả về recipe để bật máy
        state.inputItem = recipe.inputId;
        state.outputItem = recipe.outputId;
        state.ticksRemaining = recipe.processingTime;
        return true;
      }
      
      return false;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Thử chuyển output vào hopper xung quanh
   */
  static tryTransferToHopper(block: Block, outputId: string): boolean {
    // Thử hopper bên dưới trước
    const belowLoc: Vector3 = {
      x: block.location.x,
      y: block.location.y - 1,
      z: block.location.z
    };
    
    if (this.tryAddItemToHopper(block, belowLoc, outputId)) {
      return true;
    }
    
    // Thử hopper 4 bên
    const offsets = [
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 }
    ];
    
    for (const offset of offsets) {
      const hopperLoc: Vector3 = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z
      };
      
      if (this.tryAddItemToHopper(block, hopperLoc, outputId)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Thử thêm item vào hopper tại vị trí
   */
  private static tryAddItemToHopper(block: Block, hopperLoc: Vector3, itemId: string): boolean {
    try {
      const hopperBlock = block.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return false;
      
      const container = hopperBlock.getComponent('inventory')?.container;
      if (!container) return false;
      
      // Tìm slot trống hoặc stack cùng loại
      for (let i = 0; i < container.size; i++) {
        const existingItem = container.getItem(i);
        
        if (!existingItem) {
          // Slot trống
          container.setItem(i, new ItemStack(itemId, 1));
          return true;
        }
        
        if (existingItem.typeId === itemId && existingItem.amount < existingItem.maxAmount) {
          // Stack cùng loại chưa đầy
          existingItem.amount += 1;
          container.setItem(i, existingItem);
          return true;
        }
      }
      
      return false; // Container đầy
      
    } catch (error) {
      return false;
    }
  }
}
