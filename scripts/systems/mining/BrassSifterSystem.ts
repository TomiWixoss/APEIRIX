/**
 * Brass Sifter System - Lọc bụi khoáng sản thành bụi tinh khiết
 * 
 * Cơ chế: 2 Bụi Thường → 1 Bụi Tinh Khiết + 2 Bụi Đá
 * Hỗ trợ: Player interaction + Hopper automation
 * 
 * Note: Không có block ON riêng, ON và OFF đều dùng brass_sifter
 */

import { world, system } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { MachineStateManager } from '../shared/processing/MachineState';
import { PlayerInteractionHandler } from '../shared/processing/PlayerInteractionHandler';
import { ProcessingHandler } from '../shared/processing/ProcessingHandler';
import { HopperHandler, ProcessingRecipe } from '../shared/processing/HopperHandler';
import { GENERATED_BRASS_SIFTER_RECIPES, BrassSifterRecipe } from '../../data/GeneratedProcessingRecipes';

export class BrassSifterSystem {
  private static readonly SIFTER_BLOCK = 'apeirix:brass_sifter';
  private static readonly INPUT_AMOUNT = 2;
  private static readonly PROCESSING_TIME = 40; // 2 giây
  
  private static recipeMap: Map<string, BrassSifterRecipe> = new Map();

  static initialize(): void {
    console.warn('[BrassSifterSystem] Initializing...');
    
    this.loadRecipes();
    
    // Đăng ký machine state
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.SIFTER_BLOCK) {
        MachineStateManager.add(event.block.dimension.id, event.block.location);
      }
    });
    
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      if (event.brokenBlockPermutation.type.id === this.SIFTER_BLOCK) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
    
    // Player interaction (custom handler vì cần 2 inputs)
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.SIFTER_BLOCK) {
        this.handlePlayerInteraction(event);
      }
    });
    
    // Processing loop
    system.runInterval(() => {
      PlayerInteractionHandler.incrementTick();
      ProcessingHandler.processAll(this.SIFTER_BLOCK, this.SIFTER_BLOCK); // ON = OFF
    }, 1);
    
    // Hopper input check
    system.runInterval(() => {
      this.checkHopperInputs();
    }, 20);
    
    console.warn('[BrassSifterSystem] Initialized');
  }

  private static loadRecipes(): void {
    for (const recipe of GENERATED_BRASS_SIFTER_RECIPES) {
      this.recipeMap.set(recipe.inputId, recipe);
    }
    console.warn(`[BrassSifterSystem] Loaded ${this.recipeMap.size} sifter recipes`);
  }

  private static getRecipe(itemId: string): BrassSifterRecipe | undefined {
    return this.recipeMap.get(itemId);
  }

  /**
   * Convert BrassSifterRecipe to ProcessingRecipe adapter
   */
  private static toProcessingRecipe(recipe: BrassSifterRecipe): ProcessingRecipe {
    return {
      inputId: recipe.inputId,
      outputId: `${recipe.pureDust}:1,${recipe.stoneDust}:2`, // Encode outputs
      processingTime: this.PROCESSING_TIME
    };
  }

  /**
   * Recipe getter cho HopperHandler
   */
  private static recipeGetter = (itemId: string): ProcessingRecipe | undefined => {
    const recipe = BrassSifterSystem.getRecipe(itemId);
    return recipe ? BrassSifterSystem.toProcessingRecipe(recipe) : undefined;
  };

  /**
   * Xử lý player click (custom vì cần 2 inputs)
   */
  private static handlePlayerInteraction(event: any): void {
    const { block, player, itemStack } = event;
    
    if (!itemStack) return;
    
    const recipe = this.getRecipe(itemStack.typeId);
    if (!recipe) return;
    
    const state = MachineStateManager.get(block.dimension.id, block.location);
    if (!state) return;
    
    if (state.isProcessing) {
      player.onScreenDisplay.setActionBar("§cMáy rây đang hoạt động!");
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
  private static startProcessingFromPlayer(player: any, block: any, recipe: BrassSifterRecipe, state: any): void {
    try {
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) return;
      
      const selectedSlot = player.selectedSlotIndex;
      const heldItem = inventory.container.getItem(selectedSlot);
      
      if (!heldItem || heldItem.typeId !== recipe.inputId) return;
      
      // Cần ít nhất 2 bụi
      if (heldItem.amount < this.INPUT_AMOUNT) {
        player.onScreenDisplay.setActionBar("§cBạn cần ít nhất 2 Bụi khoáng sản để rây lọc!");
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
      
      // Bật máy
      state.isProcessing = true;
      state.inputItem = recipe.inputId;
      state.outputItem = `${recipe.pureDust}:1,${recipe.stoneDust}:2`;
      state.ticksRemaining = this.PROCESSING_TIME;
      
      EventBus.emit("brasssifter:used", player);
      
    } catch (error) {
      console.warn('[BrassSifterSystem] Failed to start processing:', error);
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
        
        if (!block || block.typeId !== this.SIFTER_BLOCK) continue;
        
        // Thử lấy từ hopper trên (cần 2 items)
        if (HopperHandler.checkHopperAbove(block, state, this.recipeGetter, this.INPUT_AMOUNT)) {
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên (cần 2 items)
        if (HopperHandler.checkHoppersSides(block, state, this.recipeGetter, this.INPUT_AMOUNT)) {
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }
}
