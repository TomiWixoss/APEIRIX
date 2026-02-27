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
    
    // Đăng ký machine state
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.COMPRESSOR_OFF) {
        MachineStateManager.add(event.block.dimension.id, event.block.location);
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
      ProcessingHandler.processAll(this.COMPRESSOR_ON, this.COMPRESSOR_OFF);
    }, 1);
    
    // Hopper input check
    system.runInterval(() => {
      this.checkHopperInputs();
    }, 20);
    
    console.warn('[CompressorSystem] Initialized');
  }

  private static checkHopperInputs(): void {
    for (const [key, state] of MachineStateManager.getAll().entries()) {
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== this.COMPRESSOR_OFF) continue;
        
        const recipeGetter = (itemId: string) => ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, recipeGetter)) {
          const permutation = block.permutation;
          const direction = permutation.getState('minecraft:cardinal_direction');
          block.setType(this.COMPRESSOR_ON);
          if (direction) {
            const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
            block.setPermutation(newPermutation);
          }
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, recipeGetter)) {
          const permutation = block.permutation;
          const direction = permutation.getState('minecraft:cardinal_direction');
          block.setType(this.COMPRESSOR_ON);
          if (direction) {
            const newPermutation = block.permutation.withState('minecraft:cardinal_direction', direction);
            block.setPermutation(newPermutation);
          }
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }
}
