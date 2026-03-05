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

export interface FuelItem {
  itemId: string;
  usesPerItem: number;
}

export class HopperHandler {
  /**
   * Kiểm tra và lấy item từ hopper phía trên
   */
  static checkHopperAbove(block: Block, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined, inputAmount: number = 1): boolean {
    const hopperLoc: Vector3 = {
      x: block.location.x,
      y: block.location.y + 1,
      z: block.location.z
    };
    
    return this.tryTakeItemFromHopper(block, hopperLoc, state, recipeGetter, inputAmount);
  }

  /**
   * Kiểm tra và lấy item từ hopper 4 bên (CHỈ HOPPER FACING VÀO MÁY)
   */
  static checkHoppersSides(block: Block, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined, inputAmount: number = 1): boolean {
    const offsets = [
      { x: 1, y: 0, z: 0, facing: 4 },   // Đông - hopper facing west (4)
      { x: -1, y: 0, z: 0, facing: 5 },  // Tây - hopper facing east (5)
      { x: 0, y: 0, z: 1, facing: 2 },   // Nam - hopper facing north (2)
      { x: 0, y: 0, z: -1, facing: 3 }   // Bắc - hopper facing south (3)
    ];
    
    for (const offset of offsets) {
      const hopperLoc: Vector3 = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z
      };
      
      // Kiểm tra hopper có facing vào máy không
      if (!this.isHopperFacingBlock(block, hopperLoc, offset.facing)) {
        continue;
      }
      
      if (this.tryTakeItemFromHopper(block, hopperLoc, state, recipeGetter, inputAmount)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Kiểm tra hopper có facing vào block máy không
   * Hopper facing_direction values:
   * 0 = down, 1 = up, 2 = north, 3 = south, 4 = west, 5 = east
   */
  private static isHopperFacingBlock(machineBlock: Block, hopperLoc: Vector3, expectedFacing: number): boolean {
    try {
      const hopperBlock = machineBlock.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return false;
      
      const facingDirection = hopperBlock.permutation.getState('facing_direction');
      
      // Kiểm tra hopper có facing đúng hướng vào máy không
      return facingDirection === expectedFacing;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Thử lấy item từ hopper tại vị trí (hỗ trợ inputAmount)
   */
  private static tryTakeItemFromHopper(block: Block, hopperLoc: Vector3, state: MachineState, recipeGetter: (itemId: string) => ProcessingRecipe | undefined, inputAmount: number = 1): boolean {
    try {
      const hopperBlock = block.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return false;
      
      const container = hopperBlock.getComponent('inventory')?.container;
      if (!container) return false;
      
      // Tìm item có thể xử lý
      for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        
        const recipe = recipeGetter(item.typeId);
        if (!recipe) continue;
        
        // Kiểm tra đủ số lượng
        if (item.amount < inputAmount) continue;
        
        // Lấy inputAmount items từ hopper
        if (item.amount > inputAmount) {
          item.amount -= inputAmount;
          container.setItem(i, item);
        } else {
          container.setItem(i, undefined);
        }
        
        // Trả về recipe để bật máy
        state.inputItem = recipe.inputId;
        state.outputItem = recipe.outputId;
        state.ticksRemaining = recipe.processingTime;
        state.totalProcessingTime = recipe.processingTime; // Lưu tổng thời gian
        return true;
      }
      
      return false;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Thử chuyển output vào hopper xung quanh (CHỈ HOPPER DƯỚI)
   */
  static tryTransferToHopper(block: Block, outputId: string, amount: number = 1): boolean {
    // CHỈ output vào hopper bên dưới
    const belowLoc: Vector3 = {
      x: block.location.x,
      y: block.location.y - 1,
      z: block.location.z
    };
    
    return this.tryAddItemToHopper(block, belowLoc, outputId, amount);
  }

  /**
   * Thử thêm item vào hopper tại vị trí (hỗ trợ nhiều items)
   */
  private static tryAddItemToHopper(block: Block, hopperLoc: Vector3, itemId: string, amount: number = 1): boolean {
    try {
      const hopperBlock = block.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return false;
      
      const container = hopperBlock.getComponent('inventory')?.container;
      if (!container) return false;
      
      let remaining = amount;
      
      // Tìm slot trống hoặc stack cùng loại
      for (let i = 0; i < container.size && remaining > 0; i++) {
        const existingItem = container.getItem(i);
        
        if (!existingItem) {
          // Slot trống
          const toAdd = Math.min(remaining, 64);
          container.setItem(i, new ItemStack(itemId, toAdd));
          remaining -= toAdd;
        } else if (existingItem.typeId === itemId && existingItem.amount < 64) {
          // Stack cùng loại chưa đầy
          const canAdd = 64 - existingItem.amount;
          const toAdd = Math.min(remaining, canAdd);
          existingItem.amount += toAdd;
          container.setItem(i, existingItem);
          remaining -= toAdd;
        }
      }
      
      return remaining === 0;
      
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra và lấy fuel từ hopper (trên + bên có facing vào máy)
   * @returns FuelItem nếu tìm thấy, undefined nếu không
   */
  static checkAndTakeFuel(block: Block, fuelItems: FuelItem[]): FuelItem | undefined {
    // Tạo Set để lookup nhanh
    const fuelMap = new Map<string, FuelItem>();
    for (const fuel of fuelItems) {
      fuelMap.set(fuel.itemId, fuel);
    }

    // Thử hopper trên trước
    const aboveLoc: Vector3 = {
      x: block.location.x,
      y: block.location.y + 1,
      z: block.location.z
    };
    
    const fuelFromAbove = this.tryTakeFuelFromHopper(block, aboveLoc, fuelMap, -1);
    if (fuelFromAbove) return fuelFromAbove;

    // Thử hopper 4 bên (chỉ hopper facing vào máy)
    const offsets = [
      { x: 1, y: 0, z: 0, facing: 4 },   // Đông - hopper facing west (4)
      { x: -1, y: 0, z: 0, facing: 5 },  // Tây - hopper facing east (5)
      { x: 0, y: 0, z: 1, facing: 2 },   // Nam - hopper facing north (2)
      { x: 0, y: 0, z: -1, facing: 3 }   // Bắc - hopper facing south (3)
    ];

    for (const offset of offsets) {
      const hopperLoc: Vector3 = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z
      };

      const fuelFromSide = this.tryTakeFuelFromHopper(block, hopperLoc, fuelMap, offset.facing);
      if (fuelFromSide) return fuelFromSide;
    }

    return undefined;
  }

  /**
   * Thử lấy fuel từ hopper tại vị trí
   * @param expectedFacing -1 = không check facing (hopper trên), số khác = check facing
   */
  private static tryTakeFuelFromHopper(
    machineBlock: Block, 
    hopperLoc: Vector3, 
    fuelMap: Map<string, FuelItem>,
    expectedFacing: number
  ): FuelItem | undefined {
    try {
      const hopperBlock = machineBlock.dimension.getBlock(hopperLoc);
      if (!hopperBlock || hopperBlock.typeId !== 'minecraft:hopper') return undefined;

      // Kiểm tra facing nếu cần (hopper bên)
      if (expectedFacing !== -1) {
        const facingDirection = hopperBlock.permutation.getState('facing_direction');
        if (facingDirection !== expectedFacing) return undefined;
      }

      const container = hopperBlock.getComponent('inventory')?.container;
      if (!container) return undefined;

      // Tìm fuel item trong hopper
      for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;

        const fuelConfig = fuelMap.get(item.typeId);
        if (!fuelConfig) continue;

        // Tìm thấy fuel, lấy 1 item
        if (item.amount > 1) {
          item.amount -= 1;
          container.setItem(i, item);
        } else {
          container.setItem(i, undefined);
        }

        return fuelConfig;
      }

      return undefined;

    } catch (error) {
      return undefined;
    }
  }
}
