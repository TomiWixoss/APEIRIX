/**
 * Ore Sieve System - Sàng sỏi và cát để lấy bụi quặng
 * 
 * Cơ chế: Gravel/Sand → Random Ore Dusts (theo tỉ lệ)
 * Hỗ trợ: Player interaction + Hopper automation
 * Texture: Animated flipbook (4 frames)
 * 
 * REFACTORED: Extends BaseMachineSystem but overrides interaction logic
 * for custom random output behavior
 */

import { world, system, Block } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { BaseMachineSystem } from '../shared/processing/BaseMachineSystem';
import { MachineStateManager } from '../shared/processing/MachineState';
import { PlayerInteractionHandler } from '../shared/processing/PlayerInteractionHandler';
import { ProcessingHandler } from '../shared/processing/ProcessingHandler';
import { HopperHandler, ProcessingRecipe } from '../shared/processing/HopperHandler';
import { GENERATED_ORE_SIEVE_RECIPES, OreSieveRecipe } from '../../data/GeneratedProcessingRecipes';

export class OreSieveSystem extends BaseMachineSystem {
  protected readonly MACHINE_TYPE = 'ore_sieve';
  protected readonly MACHINE_OFF = 'apeirix:ore_sieve';
  protected readonly MACHINE_ON = 'apeirix:ore_sieve_on';
  protected readonly INPUT_AMOUNT = 1;
  protected readonly PROCESSING_TIME = 60; // 3 giây
  
  private static recipeMap: Map<string, OreSieveRecipe> = new Map();

  static initialize(): void {
    const instance = new OreSieveSystem();
    instance.loadRecipes();
    instance.initialize();
  }

  private loadRecipes(): void {
    for (const recipe of GENERATED_ORE_SIEVE_RECIPES) {
      OreSieveSystem.recipeMap.set(recipe.inputId, recipe);
    }
    console.warn(`[OreSieveSystem] Loaded ${OreSieveSystem.recipeMap.size} sieve recipes`);
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
      processingTime: 60 // PROCESSING_TIME
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
   * Override: Custom player interaction for random output
   */
  protected override registerInteractEvent(): void {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.MACHINE_OFF) {
        this.handlePlayerInteraction(event);
      }
    });
  }

  /**
   * Xử lý player click với random output
   */
  private handlePlayerInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    if (!itemStack) return;
    
    const recipe = OreSieveSystem.getRecipe(itemStack.typeId);
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
   * Bắt đầu xử lý từ player với random output
   */
  private startProcessingFromPlayer(player: any, block: any, recipe: OreSieveRecipe, state: any): void {
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
      const output = OreSieveSystem.rollOutput(recipe);
      
      // Lưu direction và bật máy atomically
      const currentDirection = (block.permutation as any).getState('apeirix:direction') ?? 0;
      this.setBlockWithDirection(block, this.MACHINE_ON, currentDirection);
      
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
   * Override: Custom hopper check for random output
   */
  protected override checkHopperInputs(): void {
    for (const [, state] of MachineStateManager.getAll().entries()) {
      if (state.machineType !== this.MACHINE_TYPE) continue;
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || (block.typeId !== this.MACHINE_OFF && block.typeId !== this.MACHINE_ON)) continue;
        
        // Lưu direction
        const currentDirection = (block.permutation as any).getState('apeirix:direction') ?? 0;
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, OreSieveSystem.recipeGetter, this.INPUT_AMOUNT)) {
          this.setBlockWithDirection(block, this.MACHINE_ON, currentDirection);
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, OreSieveSystem.recipeGetter, this.INPUT_AMOUNT)) {
          this.setBlockWithDirection(block, this.MACHINE_ON, currentDirection);
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }
}
