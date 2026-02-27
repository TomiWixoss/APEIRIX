/**
 * Compressor System - Nén vật phẩm thành plate
 * Hỗ trợ: Player interaction + Hopper automation
 */

import { world, system } from '@minecraft/server';
import { MachineStateManager } from '../shared/processing/MachineState';
import { PlayerInteractionHandler } from '../shared/processing/PlayerInteractionHandler';
import { ProcessingHandler } from '../shared/processing/ProcessingHandler';
import { HopperHandler } from '../shared/processing/HopperHandler';
import { ProcessingRecipeRegistry } from '../../data/processing/ProcessingRecipeRegistry';

export class CompressorSystem {
  private static readonly MACHINE_TYPE = 'compressor';
  private static readonly COMPRESSOR_OFF = 'apeirix:compressor';
  private static readonly COMPRESSOR_ON = 'apeirix:compressor_on';

  static initialize(): void {
    console.warn('[CompressorSystem] Initializing...');
    
    // Đăng ký machine state + set direction khi đặt block
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.COMPRESSOR_OFF) {
        MachineStateManager.add(event.block.dimension.id, event.block.location, this.MACHINE_TYPE);
        
        // Set direction dựa vào hướng player nhìn - NGAY LẬP TỨC
        const direction = this.getDirectionFromPlayer(event.player);
        const permutation = (event.block.permutation as any).withState('apeirix:direction', direction);
        event.block.setPermutation(permutation);
      }
    });
    
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      const blockId = event.brokenBlockPermutation.type.id;
      if (blockId === this.COMPRESSOR_OFF || blockId === this.COMPRESSOR_ON) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
    
    // Player interaction
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.COMPRESSOR_OFF) {
        const state = MachineStateManager.get(event.block.dimension.id, event.block.location);
        if (state) {
          const recipeGetter = (itemId: string) => ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
          PlayerInteractionHandler.handleInteraction(event, state, recipeGetter, this.COMPRESSOR_ON);
        }
      }
    });
    
    // Processing loop
    system.runInterval(() => {
      PlayerInteractionHandler.incrementTick();
      ProcessingHandler.processAll(this.COMPRESSOR_ON, this.COMPRESSOR_OFF, this.MACHINE_TYPE);
    }, 1);
    
    // Hopper input check
    system.runInterval(() => {
      this.checkHopperInputs();
    }, 20);
    
    console.warn('[CompressorSystem] Initialized');
  }

  /**
   * Chuyển đổi rotation của player thành direction state (0-3)
   * 0 = south, 1 = west, 2 = north, 3 = east
   */
  private static getDirectionFromPlayer(player: any): number {
    const rotation = player.getRotation();
    const yaw = rotation.y;
    
    // Normalize yaw to 0-360
    let normalizedYaw = yaw % 360;
    if (normalizedYaw < 0) normalizedYaw += 360;
    
    // Convert to direction (player faces opposite of block front)
    if (normalizedYaw >= 315 || normalizedYaw < 45) return 2;  // north
    if (normalizedYaw >= 45 && normalizedYaw < 135) return 3;  // east
    if (normalizedYaw >= 135 && normalizedYaw < 225) return 0; // south
    return 1; // west
  }

  private static checkHopperInputs(): void {
    for (const [key, state] of MachineStateManager.getAll().entries()) {
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== this.COMPRESSOR_OFF) continue;
        
        const recipeGetter = (itemId: string) => ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
        
        // Lưu direction trước khi bật máy
        const currentDirection = (block.permutation as any).getState('apeirix:direction');
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, recipeGetter)) {
          block.setType(this.COMPRESSOR_ON);
          try {
            const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
            block.setPermutation(onPermutation);
          } catch (e) {}
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, recipeGetter)) {
          block.setType(this.COMPRESSOR_ON);
          try {
            const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
            block.setPermutation(onPermutation);
          } catch (e) {}
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }
}
