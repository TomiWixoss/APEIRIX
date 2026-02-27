/**
 * Crusher System - Nghiền quặng thành bụi
 * Hỗ trợ: Player interaction + Hopper automation
 */

import { world, system } from '@minecraft/server';
import { MachineStateManager } from '../shared/processing/MachineState';
import { PlayerInteractionHandler } from '../shared/processing/PlayerInteractionHandler';
import { ProcessingHandler } from '../shared/processing/ProcessingHandler';
import { HopperHandler } from '../shared/processing/HopperHandler';
import { ProcessingRecipeRegistry } from '../../data/processing/ProcessingRecipeRegistry';

export class CrusherSystem {
  private static readonly MACHINE_TYPE = 'crusher';
  private static readonly CRUSHER_OFF = 'apeirix:crusher';
  private static readonly CRUSHER_ON = 'apeirix:crusher_on';

  static initialize(): void {
    console.warn('[CrusherSystem] Initializing...');
    
    // Đăng ký machine state + set direction khi đặt block
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.CRUSHER_OFF) {
        MachineStateManager.add(event.block.dimension.id, event.block.location, this.MACHINE_TYPE);
        
        // Set direction dựa vào hướng player nhìn - NGAY LẬP TỨC
        const direction = this.getDirectionFromPlayer(event.player);
        const permutation = (event.block.permutation as any).withState('apeirix:direction', direction);
        event.block.setPermutation(permutation);
      }
    });
    
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      const blockId = event.brokenBlockPermutation.type.id;
      if (blockId === this.CRUSHER_OFF || blockId === this.CRUSHER_ON) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
    
    // Player interaction
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.CRUSHER_OFF) {
        const state = MachineStateManager.get(event.block.dimension.id, event.block.location);
        if (state) {
          const recipeGetter = (itemId: string) => ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
          PlayerInteractionHandler.handleInteraction(event, state, recipeGetter, this.CRUSHER_ON);
        }
      }
    });
    
    // Processing loop
    system.runInterval(() => {
      PlayerInteractionHandler.incrementTick();
      ProcessingHandler.processAll(this.CRUSHER_ON, this.CRUSHER_OFF, this.MACHINE_TYPE);
    }, 1);
    
    // Hopper input check
    system.runInterval(() => {
      this.checkHopperInputs();
    }, 20);
    
    console.warn('[CrusherSystem] Initialized');
  }

  /**
   * Chuyển đổi rotation của player thành direction state (0-3)
   * 0 = south, 1 = west, 2 = north, 3 = east
   * 
   * Block quay mặt về phía player (đối diện với hướng player nhìn)
   * Minecraft yaw: 0=south, 90=west, 180=north, 270=east
   */
  private static getDirectionFromPlayer(player: any): number {
    const rotation = player.getRotation();
    const yaw = rotation.y;
    
    // Normalize yaw to 0-360
    let normalizedYaw = yaw % 360;
    if (normalizedYaw < 0) normalizedYaw += 360;
    
    // Convert to direction (block faces player - opposite of player's facing)
    // Player yaw 0° (nhìn nam) → block direction 2 (mặt bắc)
    // Player yaw 90° (nhìn tây) → block direction 1 (mặt đông) - FIXED
    // Player yaw 180° (nhìn bắc) → block direction 0 (mặt nam)
    // Player yaw 270° (nhìn đông) → block direction 3 (mặt tây) - FIXED
    let direction: number;
    if (normalizedYaw >= 315 || normalizedYaw < 45) {
      direction = 2;  // Nhìn nam → mặt bắc
    } else if (normalizedYaw >= 45 && normalizedYaw < 135) {
      direction = 1;  // Nhìn tây → mặt đông (ĐÃ ĐỔI từ 3 sang 1)
    } else if (normalizedYaw >= 135 && normalizedYaw < 225) {
      direction = 0; // Nhìn bắc → mặt nam
    } else {
      direction = 3; // Nhìn đông → mặt tây (ĐÃ ĐỔI từ 1 sang 3)
    }
    
    return direction;
  }

  private static checkHopperInputs(): void {
    for (const [, state] of MachineStateManager.getAll().entries()) {
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== this.CRUSHER_OFF) continue;
        
        const recipeGetter = (itemId: string) => ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
        
        // Lưu direction trước khi bật máy
        const currentDirection = (block.permutation as any).getState('apeirix:direction');
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, recipeGetter)) {
          block.setType(this.CRUSHER_ON);
          try {
            const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
            block.setPermutation(onPermutation);
          } catch (e) {}
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, recipeGetter)) {
          block.setType(this.CRUSHER_ON);
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
