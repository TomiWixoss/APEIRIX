/**
 * Ore Washer System - Rửa bụi khoáng sản thành bụi tinh khiết
 * 
 * Cơ chế: 2 Bụi Thường → 1 Bụi Tinh Khiết + 2 Bụi Đá
 * Hỗ trợ: Player interaction + Hopper automation
 * 
 * Note: Không có block ON riêng, ON và OFF đều dùng ore_washer
 * 
 * REFACTORED: Extends BaseMachineSystem but overrides interaction logic
 * for 2-input requirement
 */

import { world, system } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { BaseMachineSystem } from '../shared/processing/BaseMachineSystem';
import { MachineStateManager } from '../shared/processing/MachineState';
import { HopperHandler, ProcessingRecipe } from '../shared/processing/HopperHandler';
import { GENERATED_ORE_WASHER_RECIPES, OreWasherRecipe } from '../../data/GeneratedProcessingRecipes';

export class OreWasherSystem extends BaseMachineSystem {
  protected readonly MACHINE_TYPE = 'ore_washer';
  protected readonly MACHINE_OFF = 'apeirix:ore_washer';
  protected readonly MACHINE_ON = 'apeirix:ore_washer'; // Same as OFF
  protected readonly INPUT_AMOUNT = 2; // Requires 2 dusts
  protected readonly PROCESSING_TIME = 40; // 2 giây
  
  private static recipeMap: Map<string, OreWasherRecipe> = new Map();

  static initialize(): void {
    const instance = new OreWasherSystem();
    instance.loadRecipes();
    instance.initialize();
  }

  private loadRecipes(): void {
    for (const recipe of GENERATED_ORE_WASHER_RECIPES) {
      OreWasherSystem.recipeMap.set(recipe.inputId, recipe);
    }
    console.warn(`[OreWasherSystem] Loaded ${OreWasherSystem.recipeMap.size} washer recipes`);
  }

  private static getRecipe(itemId: string): OreWasherRecipe | undefined {
    return this.recipeMap.get(itemId);
  }

  /**
   * Convert OreWasherRecipe to ProcessingRecipe adapter
   */
  private static toProcessingRecipe(recipe: OreWasherRecipe): ProcessingRecipe {
    return {
      inputId: recipe.inputId,
      outputId: `${recipe.pureDust},1;${recipe.stoneDust},2`,
      processingTime: 40 // PROCESSING_TIME
    };
  }

  /**
   * Recipe getter cho HopperHandler
   */
  private static recipeGetter = (itemId: string): ProcessingRecipe | undefined => {
    const recipe = OreWasherSystem.getRecipe(itemId);
    return recipe ? OreWasherSystem.toProcessingRecipe(recipe) : undefined;
  };

  /**
   * Override: Custom player interaction for 2-input requirement
   */
  protected override registerInteractEvent(): void {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.MACHINE_OFF) {
        this.handlePlayerInteraction(event);
      }
    });
  }

  /**
   * Xử lý player click với 2-input requirement
   */
  private handlePlayerInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    if (!itemStack) return;
    
    const recipe = OreWasherSystem.getRecipe(itemStack.typeId);
    if (!recipe) return;
    
    const state = MachineStateManager.get(block.dimension.id, block.location);
    if (!state) return;
    
    if (state.isProcessing) {
      player.sendMessage("§cMáy rửa đang hoạt động!");
      event.cancel = true;
      return;
    }
    
    event.cancel = true;
    
    system.runTimeout(() => {
      this.startProcessingFromPlayer(player, block, recipe, state);
    }, 1);
  }

  /**
   * Bắt đầu xử lý từ player với 2-input requirement
   */
  private startProcessingFromPlayer(player: any, block: any, recipe: OreWasherRecipe, state: any): void {
    try {
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) return;
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || heldItem.typeId !== recipe.inputId) return;
      
      // Cần ít nhất 2 bụi
      if (heldItem.amount < this.INPUT_AMOUNT) {
        player.sendMessage("§cBạn cần ít nhất 2 Bụi khoáng sản để rửa!");
        try {
          player.playSound("note.bass", { volume: 0.5, pitch: 1.0 });
        } catch (e) {}
        return;
      }
      
      // Trừ 2 bụi
      if (heldItem.amount > this.INPUT_AMOUNT) {
        heldItem.amount -= this.INPUT_AMOUNT;
        inventory.container.setItem(selectedSlot, heldItem);
      } else {
        inventory.container.setItem(selectedSlot, undefined);
      }
      
      // Bật máy (không cần change block type vì ON = OFF)
      state.isProcessing = true;
      state.inputItem = recipe.inputId;
      state.outputItem = `${recipe.pureDust},1;${recipe.stoneDust},2`;
      state.ticksRemaining = this.PROCESSING_TIME;
      
      EventBus.emit("orewasher:used", player);
      
    } catch (error) {
      // Failed to start processing
    }
  }

  /**
   * Override: Custom hopper check for 2-input requirement
   */
  protected override checkHopperInputs(): void {
    for (const [, state] of MachineStateManager.getAll().entries()) {
      if (state.machineType !== this.MACHINE_TYPE) continue;
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== this.MACHINE_OFF) continue;
        
        // Thử lấy từ hopper trên (cần 2 items)
        if (HopperHandler.checkHopperAbove(block, state, OreWasherSystem.recipeGetter, this.INPUT_AMOUNT)) {
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên (cần 2 items)
        if (HopperHandler.checkHoppersSides(block, state, OreWasherSystem.recipeGetter, this.INPUT_AMOUNT)) {
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }
}
