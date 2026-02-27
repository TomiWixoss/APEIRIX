/**
 * Ore Sieve System - Sàng sỏi và cát để lấy bụi quặng
 * 
 * Cơ chế: Gravel/Sand → Random Ore Dusts (theo tỉ lệ)
 * Hỗ trợ: Player interaction + Hopper automation
 * Texture: Animated flipbook (4 frames)
 */

import { world, system } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { MachineStateManager } from '../shared/processing/MachineState';
import { PlayerInteractionHandler } from '../shared/processing/PlayerInteractionHandler';
import { ProcessingHandler } from '../shared/processing/ProcessingHandler';
import { HopperHandler, ProcessingRecipe } from '../shared/processing/HopperHandler';
import { GENERATED_ORE_SIEVE_RECIPES, OreSieveRecipe } from '../../data/GeneratedProcessingRecipes';

export class OreSieveSystem {
  private static readonly MACHINE_TYPE = 'ore_sieve';
  private static readonly SIEVE_BLOCK = 'apeirix:ore_sieve';
  private static readonly SIEVE_BLOCK_ON = 'apeirix:ore_sieve_on';
  private static readonly INPUT_AMOUNT = 1;
  private static readonly PROCESSING_TIME = 60; // 3 giây
  
  private static recipeMap: Map<string, OreSieveRecipe> = new Map();

  /**
   * Chuyển đổi rotation của player thành direction state (0-3)
   */
  private static getDirectionFromPlayer(player: any): number {
    const rotation = player.getRotation();
    const yaw = rotation.y;
    
    let normalizedYaw = yaw % 360;
    if (normalizedYaw < 0) normalizedYaw += 360;
    
    let direction: number;
    if (normalizedYaw >= 315 || normalizedYaw < 45) {
      direction = 2;
    } else if (normalizedYaw >= 45 && normalizedYaw < 135) {
      direction = 1;
    } else if (normalizedYaw >= 135 && normalizedYaw < 225) {
      direction = 0;
    } else {
      direction = 3;
    }
    
    return direction;
  }

  static initialize(): void {
    console.warn('[OreSieveSystem] Initializing...');
    
    this.loadRecipes();
    
    // Đăng ký machine state + set direction khi đặt block
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.SIEVE_BLOCK) {
        MachineStateManager.add(event.block.dimension.id, event.block.location, this.MACHINE_TYPE);
        
        const direction = this.getDirectionFromPlayer(event.player);
        const permutation = (event.block.permutation as any).withState('apeirix:direction', direction);
        event.block.setPermutation(permutation);
      }
    });
    
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      if (event.brokenBlockPermutation.type.id === this.SIEVE_BLOCK) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
    
    // Player interaction
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.SIEVE_BLOCK) {
        this.handlePlayerInteraction(event);
      }
    });
    
    // Processing loop
    system.runInterval(() => {
      PlayerInteractionHandler.incrementTick();
      ProcessingHandler.processAll(this.SIEVE_BLOCK_ON, this.SIEVE_BLOCK, this.MACHINE_TYPE);
    }, 1);
    
    // Hopper input check
    system.runInterval(() => {
      this.checkHopperInputs();
    }, 20);
    
    console.warn('[OreSieveSystem] Initialized');
  }

  private static loadRecipes(): void {
    for (const recipe of GENERATED_ORE_SIEVE_RECIPES) {
      this.recipeMap.set(recipe.inputId, recipe);
    }
    console.warn(`[OreSieveSystem] Loaded ${this.recipeMap.size} sieve recipes`);
  }

  private static getRecipe(itemId: string): OreSieveRecipe | undefined {
    return this.recipeMap.get(itemId);
  }

  /**
   * Roll random output dựa trên chance
   */
  private static rollOutput(recipe: OreSieveRecipe): string | null {
    const roll = Math.random();
    let cumulative = 0;
    
    for (const output of recipe.outputs) {
      cumulative += output.chance;
      if (roll < cumulative) {
        return output.item;
      }
    }
    
    return null; // Không ra gì
  }

  /**
   * Convert OreSieveRecipe to ProcessingRecipe adapter
   */
  private static toProcessingRecipe(recipe: OreSieveRecipe, outputItem: string | null): ProcessingRecipe {
    return {
      inputId: recipe.inputId,
      outputId: outputItem || '', // Empty nếu không ra gì
      processingTime: this.PROCESSING_TIME
    };
  }

  /**
   * Recipe getter cho HopperHandler (với random output)
   */
  private static recipeGetter = (itemId: string): ProcessingRecipe | undefined => {
    const recipe = OreSieveSystem.getRecipe(itemId);
    if (!recipe) return undefined;
    
    const output = OreSieveSystem.rollOutput(recipe);
    return OreSieveSystem.toProcessingRecipe(recipe, output);
  };

  /**
   * Xử lý player click
   */
  private static handlePlayerInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    if (!itemStack) return;
    
    const recipe = this.getRecipe(itemStack.typeId);
    if (!recipe) return;
    
    const state = MachineStateManager.get(block.dimension.id, block.location);
    if (!state) return;
    
    if (state.isProcessing) {
      player.sendMessage("§cRây sàng đang hoạt động!");
      event.cancel = true;
      return;
    }
    
    event.cancel = true;
    
    system.runTimeout(() => {
      this.startProcessingFromPlayer(player, block, recipe, state);
    }, 1);
  }

  /**
   * Bắt đầu xử lý từ player
   */
  private static startProcessingFromPlayer(player: any, block: any, recipe: OreSieveRecipe, state: any): void {
    try {
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) return;
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || heldItem.typeId !== recipe.inputId) return;
      
      // Trừ 1 item
      if (heldItem.amount > this.INPUT_AMOUNT) {
        heldItem.amount -= this.INPUT_AMOUNT;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Roll output
      const output = this.rollOutput(recipe);
      
      // Lưu direction trước khi bật máy
      const currentDirection = (block.permutation as any).getState('apeirix:direction');
      
      // Bật máy (chuyển sang ON)
      block.setType(this.SIEVE_BLOCK_ON);
      try {
        const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
        block.setPermutation(onPermutation);
      } catch (e) {
        // Nếu block không có direction state thì bỏ qua
      }
      
      state.isProcessing = true;
      state.inputItem = recipe.inputId;
      state.outputItem = output || '';
      state.ticksRemaining = this.PROCESSING_TIME;
      
      EventBus.emit("oresieve:used", player);
      
    } catch (error) {
      // Failed to start processing
    }
  }

  /**
   * Kiểm tra hopper inputs
   */
  private static checkHopperInputs(): void {
    for (const [key, state] of MachineStateManager.getAll().entries()) {
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || (block.typeId !== this.SIEVE_BLOCK && block.typeId !== this.SIEVE_BLOCK_ON)) continue;
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, this.recipeGetter, this.INPUT_AMOUNT)) {
          // Lưu direction và bật máy
          const currentDirection = (block.permutation as any).getState('apeirix:direction');
          block.setType(this.SIEVE_BLOCK_ON);
          try {
            const onPermutation = (block.permutation as any).withState('apeirix:direction', currentDirection ?? 0);
            block.setPermutation(onPermutation);
          } catch (e) {}
          
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, this.recipeGetter, this.INPUT_AMOUNT)) {
          // Lưu direction và bật máy
          const currentDirection = (block.permutation as any).getState('apeirix:direction');
          block.setType(this.SIEVE_BLOCK_ON);
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
