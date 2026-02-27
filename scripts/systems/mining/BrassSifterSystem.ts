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
  private static readonly MACHINE_TYPE = 'brass_sifter';
  private static readonly SIFTER_BLOCK = 'apeirix:brass_sifter';
  private static readonly INPUT_AMOUNT = 2;
  private static readonly PROCESSING_TIME = 40; // 2 giây
  
  private static recipeMap: Map<string, BrassSifterRecipe> = new Map();

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

  static initialize(): void {
    console.warn('[BrassSifterSystem] Initializing...');
    
    this.loadRecipes();
    
    // Đăng ký machine state + set direction khi đặt block
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.SIFTER_BLOCK) {
        MachineStateManager.add(event.block.dimension.id, event.block.location, this.MACHINE_TYPE);
        
        // Set direction dựa vào hướng player nhìn - NGAY LẬP TỨC
        const direction = this.getDirectionFromPlayer(event.player);
        const permutation = (event.block.permutation as any).withState('apeirix:direction', direction);
        event.block.setPermutation(permutation);
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
      ProcessingHandler.processAll(this.SIFTER_BLOCK, this.SIFTER_BLOCK, this.MACHINE_TYPE); // ON = OFF
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
      outputId: `${recipe.pureDust},1;${recipe.stoneDust},2`, // Format: item,count;item,count
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
      player.sendMessage("§cMáy rây đang hoạt động!");
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
        player.sendMessage("§cBạn cần ít nhất 2 Bụi khoáng sản để rây lọc!");
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
      
      // Lưu direction trước khi bật máy (brass sifter không đổi block type nên không cần preserve)
      // Bật máy
      state.isProcessing = true;
      state.inputItem = recipe.inputId;
      state.outputItem = `${recipe.pureDust},1;${recipe.stoneDust},2`; // Format: item,count;item,count
      state.ticksRemaining = this.PROCESSING_TIME;
      
      EventBus.emit("brasssifter:used", player);
      
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
