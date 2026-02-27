import { world, system, Block, ItemStack, Vector3 } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { GENERATED_ORE_CRUSHER_RECIPES, OreCrusherRecipe, GENERATED_FUEL_CONFIGS } from '../../data/GeneratedProcessingRecipes';
import { FuelHandler, FuelData } from '../shared/processing/FuelHandler';

/**
 * OreCrusherSystem - Tự động nghiền quặng chạm vào ore_crusher
 * 
 * Cơ chế thông minh:
 * - Track vị trí crusher khi đặt/phá
 * - Chỉ check các crusher đã track (cực kỳ tối ưu)
 * - 3 cấp độ với tốc độ và multiplier khác nhau:
 *   + MK1: 80 ticks (4s), x1 dust
 *   + MK2: 40 ticks (2s), x1.5 dust
 *   + MK3: 20 ticks (1s), x2 dust
 * 
 * FUEL SYSTEM (YAML-DRIVEN):
 * - Cấu hình nhiên liệu từ YAML (fuel.blockId, fuel.usesPerBlock, fuel.detectFaces)
 * - Phát hiện nhiên liệu ở tất cả 6 mặt (hoặc chỉ đáy tùy config)
 * - Mỗi lần nghiền tiêu hao fuel
 * 
 * YAML-DRIVEN:
 * - Recipes được định nghĩa trong YAML configs
 * - Auto-generated từ processingRecipes trong ore_crusher_mk1/2/3.yaml
 */
export class OreCrusherSystem {
  private static readonly CRUSHER_BLOCK_IDS = [
    'apeirix:ore_crusher_mk1',
    'apeirix:ore_crusher_mk2',
    'apeirix:ore_crusher_mk3'
  ];
  
  // Cấu hình cho từng cấp độ
  private static readonly CRUSHER_CONFIGS = {
    'apeirix:ore_crusher_mk1': { interval: 80, multiplier: 1.0 },   // 4s, x1
    'apeirix:ore_crusher_mk2': { interval: 40, multiplier: 1.5 },   // 2s, x1.5
    'apeirix:ore_crusher_mk3': { interval: 20, multiplier: 2.0 }    // 1s, x2
  };
  
  private static crusherLocations: Map<string, { 
    dimension: string; 
    location: Vector3; 
    blockId: string; 
    tickCounter: number;
    fuelData: FuelData;
  }> = new Map();
  
  // Recipe maps for each crusher type
  private static recipesByMachine: Map<string, Map<string, OreCrusherRecipe>> = new Map();

  static initialize(): void {
    console.warn('[OreCrusherSystem] Initializing...');
    
    // Load recipes from generated data
    this.loadRecipes();
    
    // Track khi player đặt crusher
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (this.CRUSHER_BLOCK_IDS.includes(event.block.typeId)) {
        this.addCrusher(event.block);
      }
    });
    
    // Track khi player phá crusher
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      if (this.CRUSHER_BLOCK_IDS.includes(event.brokenBlockPermutation.type.id)) {
        this.removeCrusher(event.block.dimension.id, event.block.location);
      }
    });
    
    // Nghiền định kỳ - check mỗi tick (20 ticks/s)
    system.runInterval(() => {
      this.processAllCrushers();
    }, 1);
    
    console.warn('[OreCrusherSystem] Initialized - 3-tier system (MK1/MK2/MK3) - YAML-driven');
  }

  /**
   * Load recipes từ generated data
   */
  private static loadRecipes(): void {
    for (const [machineType, recipes] of Object.entries(GENERATED_ORE_CRUSHER_RECIPES)) {
      const recipeMap = new Map<string, OreCrusherRecipe>();
      for (const recipe of recipes) {
        recipeMap.set(recipe.inputId, recipe);
      }
      this.recipesByMachine.set(`apeirix:${machineType}`, recipeMap);
    }
    console.warn(`[OreCrusherSystem] Loaded ${this.recipesByMachine.size} crusher types with recipes`);
  }

  /**
   * Lấy recipe cho crusher type và block ID
   */
  private static getRecipe(crusherType: string, blockId: string): OreCrusherRecipe | undefined {
    return this.recipesByMachine.get(crusherType)?.get(blockId);
  }

  /**
   * Thêm crusher vào tracking list
   */
  private static addCrusher(block: Block): void {
    const key = this.getLocationKey(block.dimension.id, block.location);
    this.crusherLocations.set(key, {
      dimension: block.dimension.id,
      location: block.location,
      blockId: block.typeId,
      tickCounter: 0,
      fuelData: { fuelRemaining: 0 } // Sẽ check fuel khi bắt đầu nghiền
    });
    console.warn(`[OreCrusherSystem] Added ${block.typeId} at ${key}`);
  }

  /**
   * Xóa crusher khỏi tracking list
   */
  private static removeCrusher(dimensionId: string, location: Vector3): void {
    const key = this.getLocationKey(dimensionId, location);
    this.crusherLocations.delete(key);
    console.warn(`[OreCrusherSystem] Removed crusher at ${key}`);
  }

  /**
   * Tạo key duy nhất cho location
   */
  private static getLocationKey(dimensionId: string, location: Vector3): string {
    return `${dimensionId}:${Math.floor(location.x)},${Math.floor(location.y)},${Math.floor(location.z)}`;
  }

  /**
   * Xử lý tất cả crusher đã track
   */
  private static processAllCrushers(): void {
    for (const [key, data] of this.crusherLocations.entries()) {
      try {
        const dimension = world.getDimension(data.dimension);
        
        // CRITICAL: Check if chunk is loaded before accessing block
        // Accessing unloaded chunks can cause lag or errors
        const block = dimension.getBlock(data.location);
        
        // Verify block vẫn là crusher (có thể bị phá bằng explosion, etc)
        if (!block || !this.CRUSHER_BLOCK_IDS.includes(block.typeId)) {
          this.crusherLocations.delete(key);
          continue;
        }
        
        // Tăng tick counter
        data.tickCounter++;
        
        // Lấy config cho crusher này
        const config = this.CRUSHER_CONFIGS[block.typeId as keyof typeof this.CRUSHER_CONFIGS];
        if (!config) continue;
        
        // Chỉ xử lý khi đủ interval
        if (data.tickCounter >= config.interval) {
          data.tickCounter = 0;
          
          // Lấy fuel config từ YAML
          const fuelConfig = GENERATED_FUEL_CONFIGS[block.typeId];
          if (!fuelConfig) {
            console.warn(`[OreCrusherSystem] No fuel config for ${block.typeId}`);
            continue;
          }
          
          // Check fuel trước khi nghiền (sử dụng FuelHandler)
          if (!FuelHandler.checkAndConsumeFuel(block, data.fuelData, fuelConfig)) {
            continue; // Không đủ fuel, bỏ qua
          }
          
          this.processCrusher(block, config.multiplier);
        }
      } catch (error) {
        // Block không load (chunk unloaded) hoặc dimension không tồn tại
        // Giữ lại trong list, sẽ check lại lần sau khi chunk load
        // KHÔNG log error để tránh spam console
      }
    }
  }

  /**
   * Xử lý một ore crusher - nghiền quặng chạm vào cả 6 mặt
   */
  private static processCrusher(crusherBlock: Block, multiplier: number): void {
    const crusherLoc = crusherBlock.location;
    
    // Quét cả 6 mặt chạm vào crusher
    const adjacentOffsets = [
      { x: 1, y: 0, z: 0 },   // East
      { x: -1, y: 0, z: 0 },  // West
      { x: 0, y: 0, z: 1 },   // South
      { x: 0, y: 0, z: -1 },  // North
      { x: 0, y: -1, z: 0 },  // Down
      { x: 0, y: 1, z: 0 },   // Up
    ];
    
    for (const offset of adjacentOffsets) {
      const targetLoc = {
        x: crusherLoc.x + offset.x,
        y: crusherLoc.y + offset.y,
        z: crusherLoc.z + offset.z
      };
      
      try {
        const targetBlock = crusherBlock.dimension.getBlock(targetLoc);
        if (targetBlock) {
          this.crushBlock(targetBlock, crusherBlock, multiplier);
        }
      } catch (error) {
        // Block không thể truy cập
      }
    }
  }

  /**
   * Nghiền một block nếu có thể
   */
  private static crushBlock(targetBlock: Block, crusherBlock: Block, multiplier: number): void {
    const blockId = targetBlock.typeId;
    
    // Kiểm tra xem block có thể nghiền không (dùng recipe từ YAML)
    const recipe = this.getRecipe(crusherBlock.typeId, blockId);
    if (!recipe) {
      return;
    }
    
    // Phá block
    try {
      targetBlock.setType('minecraft:air');
      
      // Emit event for achievement tracking
      // Find nearest player within 10 blocks
      const players = world.getAllPlayers();
      for (const player of players) {
        const distance = Math.sqrt(
          Math.pow(player.location.x - crusherBlock.location.x, 2) +
          Math.pow(player.location.y - crusherBlock.location.y, 2) +
          Math.pow(player.location.z - crusherBlock.location.z, 2)
        );
        if (distance <= 10) {
          EventBus.emit("orecrusher:used", player);
          break;
        }
      }
      
      // Spawn dust drops với multiplier (MK1: x1, MK2: x1.5, MK3: x2)
      const dropLocation = {
        x: targetBlock.location.x + 0.5,
        y: targetBlock.location.y + 0.5,
        z: targetBlock.location.z + 0.5
      };
      
      // Spawn stone dust
      const stoneDustCount = Math.floor(recipe.stoneDustCount * multiplier);
      if (stoneDustCount > 0) {
        targetBlock.dimension.spawnItem(
          new ItemStack(recipe.stoneDust, stoneDustCount),
          dropLocation
        );
      }
      
      // Spawn ore dust if exists
      if (recipe.oreDust && recipe.oreDustCount) {
        const oreDustCount = Math.floor(recipe.oreDustCount * multiplier);
        if (oreDustCount > 0) {
          targetBlock.dimension.spawnItem(
            new ItemStack(recipe.oreDust, oreDustCount),
            dropLocation
          );
        }
      }
      
      // Particle effect tại crusher
      try {
        crusherBlock.dimension.spawnParticle(
          'minecraft:crop_growth_emitter',
          {
            x: crusherBlock.location.x + 0.5,
            y: crusherBlock.location.y + 0.5,
            z: crusherBlock.location.z + 0.5
          }
        );
      } catch (e) {
        // Particle không spawn được, không sao
      }
      
    } catch (error) {
      console.warn('[OreCrusherSystem] Failed to crush block:', error);
    }
  }
}
