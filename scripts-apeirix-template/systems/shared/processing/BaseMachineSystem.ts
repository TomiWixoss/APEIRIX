/**
 * Base Machine System - Abstract class cho tất cả processing machines
 * 
 * Provides common functionality:
 * - Event registration (place/break/explode/interact)
 * - Direction calculation from player rotation
 * - Hopper input checking
 * - Processing loop integration
 * 
 * Subclasses chỉ cần:
 * - Define constants (MACHINE_TYPE, MACHINE_OFF, MACHINE_ON)
 * - Override methods nếu cần custom behavior
 */

import { world, system, Block, BlockPermutation, Player } from '@minecraft/server';
import { MachineStateManager } from './MachineState';
import { PlayerInteractionHandler } from './PlayerInteractionHandler';
import { ProcessingHandler } from './ProcessingHandler';
import { HopperHandler } from './HopperHandler';
import { ProcessingRecipeRegistry } from '../../../data/processing/ProcessingRecipeRegistry';

export abstract class BaseMachineSystem {
  // Abstract properties - subclasses MUST define these
  protected abstract readonly MACHINE_TYPE: string;
  protected abstract readonly MACHINE_OFF: string;
  protected abstract readonly MACHINE_ON: string;
  
  // Optional overrides
  protected readonly INPUT_AMOUNT: number = 1;
  protected readonly PROCESSING_INTERVAL: number = 5; // ticks
  protected readonly HOPPER_CHECK_INTERVAL: number = 20; // ticks

  /**
   * Initialize machine system
   * Registers all event listeners and starts processing loops
   */
  public initialize(): void {
    console.warn(`[${this.constructor.name}] Initializing...`);
    
    this.registerPlaceBlockEvent();
    this.registerBreakBlockEvent();
    this.registerExplodeEvent();
    this.registerInteractEvent();
    this.startProcessingLoop();
    this.startHopperCheckLoop();
    
    console.warn(`[${this.constructor.name}] Initialized`);
  }

  /**
   * Register player place block event
   */
  protected registerPlaceBlockEvent(): void {
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.MACHINE_OFF) {
        MachineStateManager.add(
          event.block.dimension.id,
          event.block.location,
          this.MACHINE_TYPE
        );
        
        // Set direction atomically with BlockPermutation.resolve
        const direction = this.getDirectionFromPlayer(event.player);
        this.setBlockWithDirection(event.block, this.MACHINE_OFF, direction);
      }
    });
  }

  /**
   * Register player break block event
   */
  protected registerBreakBlockEvent(): void {
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      const blockId = event.brokenBlockPermutation.type.id;
      if (blockId === this.MACHINE_OFF || blockId === this.MACHINE_ON) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
  }

  /**
   * Register block explode event (Creeper, TNT, etc.)
   */
  protected registerExplodeEvent(): void {
    world.afterEvents.blockExplode.subscribe((event) => {
      const blockId = event.explodedBlockPermutation.type.id;
      if (blockId === this.MACHINE_OFF || blockId === this.MACHINE_ON) {
        MachineStateManager.remove(event.block.dimension.id, event.block.location);
      }
    });
  }

  /**
   * Register player interact event
   */
  protected registerInteractEvent(): void {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId === this.MACHINE_OFF) {
        const state = MachineStateManager.get(event.block.dimension.id, event.block.location);
        if (state) {
          const recipeGetter = (itemId: string) => 
            ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
          PlayerInteractionHandler.handleInteraction(
            event,
            state,
            recipeGetter,
            this.MACHINE_ON
          );
        }
      }
    });
  }

  /**
   * Start processing loop
   */
  protected startProcessingLoop(): void {
    system.runInterval(() => {
      PlayerInteractionHandler.incrementTick();
      ProcessingHandler.processAll(this.MACHINE_ON, this.MACHINE_OFF, this.MACHINE_TYPE);
    }, this.PROCESSING_INTERVAL);
  }

  /**
   * Start hopper check loop
   */
  protected startHopperCheckLoop(): void {
    system.runInterval(() => {
      this.checkHopperInputs();
    }, this.HOPPER_CHECK_INTERVAL);
  }

  /**
   * Check hopper inputs for all machines of this type
   */
  protected checkHopperInputs(): void {
    for (const [, state] of MachineStateManager.getAll().entries()) {
      if (state.machineType !== this.MACHINE_TYPE) continue;
      if (state.isProcessing) continue;
      
      try {
        const dimension = world.getDimension(state.dimension);
        const block = dimension.getBlock(state.location);
        
        if (!block || block.typeId !== this.MACHINE_OFF) continue;
        
        const recipeGetter = (itemId: string) => 
          ProcessingRecipeRegistry.getRecipe(this.MACHINE_TYPE, itemId);
        
        // Lưu direction trước khi bật máy
        const currentDirection = (block.permutation as any).getState('apeirix:direction') ?? 0;
        
        // Thử lấy từ hopper trên
        if (HopperHandler.checkHopperAbove(block, state, recipeGetter, this.INPUT_AMOUNT)) {
          this.setBlockWithDirection(block, this.MACHINE_ON, currentDirection);
          state.isProcessing = true;
          continue;
        }
        
        // Thử lấy từ hopper 4 bên
        if (HopperHandler.checkHoppersSides(block, state, recipeGetter, this.INPUT_AMOUNT)) {
          this.setBlockWithDirection(block, this.MACHINE_ON, currentDirection);
          state.isProcessing = true;
        }
        
      } catch (error) {
        // Chunk unloaded
      }
    }
  }

  /**
   * Set block type with direction state atomically
   * Prevents visual flicker by using BlockPermutation.resolve
   */
  protected setBlockWithDirection(block: Block, blockType: string, direction: number): void {
    try {
      const newPermutation = BlockPermutation.resolve(blockType, {
        'apeirix:direction': direction
      });
      block.setPermutation(newPermutation);
    } catch (error) {
      // Fallback: Block không có direction state hoặc API không support
      try {
        block.setType(blockType);
        const permutation = (block.permutation as any).withState('apeirix:direction', direction);
        block.setPermutation(permutation);
      } catch (e) {
        // Block không có direction state, chỉ set type
        block.setType(blockType);
      }
    }
  }

  /**
   * Calculate direction from player rotation
   * 0 = south, 1 = west, 2 = north, 3 = east
   * 
   * Block faces player (opposite of player's facing direction)
   */
  protected getDirectionFromPlayer(player: Player): number {
    const rotation = player.getRotation();
    const yaw = rotation.y;
    
    // Normalize yaw to 0-360
    let normalizedYaw = yaw % 360;
    if (normalizedYaw < 0) normalizedYaw += 360;
    
    // Convert to direction (block faces player - opposite of player's facing)
    let direction: number;
    if (normalizedYaw >= 315 || normalizedYaw < 45) {
      direction = 2;  // Nhìn nam → mặt bắc
    } else if (normalizedYaw >= 45 && normalizedYaw < 135) {
      direction = 1;  // Nhìn tây → mặt đông
    } else if (normalizedYaw >= 135 && normalizedYaw < 225) {
      direction = 0;  // Nhìn bắc → mặt nam
    } else {
      direction = 3;  // Nhìn đông → mặt tây
    }
    
    return direction;
  }
}
