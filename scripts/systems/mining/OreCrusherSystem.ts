import { world, system, Block, ItemStack, Vector3 } from '@minecraft/server';
import { EventBus } from '../../core/EventBus';
import { GENERATED_ORE_CRUSHER_RECIPES, OreCrusherRecipe, GENERATED_FUEL_CONFIGS } from '../../data/GeneratedProcessingRecipes';
import { HopperHandler, FuelItem } from '../shared/processing/HopperHandler';

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
 * FUEL SYSTEM (HOPPER-BASED):
 * - Nhiên liệu được input qua hopper (trên + bên có facing vào máy)
 * - Hỗ trợ nhiều loại fuel items (coal, coal_block, etc.)
 * - Mỗi fuel item có số lần sử dụng riêng
 * - Tiêu hao fuel mỗi lần nghiền
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
    fuelRemaining: number; // Số lần sử dụng còn lại từ fuel hiện tại
  }> = new Map();
  
  // Recipe maps for each crusher type
  private static recipesByMachine: Map<string, Map<string, OreCrusherRecipe>> = new Map();

  // Fuel configs for each crusher type (converted from YAML)
  private static fuelConfigsByMachine: Map<string, FuelItem[]> = new Map();

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
    console.warn('[OreCrusherSystem] Initializing...');
    
    // Load recipes from generated data
    this.loadRecipes();
    
    // Load fuel configs from YAML
    this.loadFuelConfigs();
    
    // Track khi player đặt crusher
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (this.CRUSHER_BLOCK_IDS.includes(event.block.typeId)) {
        this.addCrusher(event.block, event.player);
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
    
    console.warn('[OreCrusherSystem] Initialized - 3-tier system (MK1/MK2/MK3) - Hopper-based fuel');
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
   * Load fuel configs từ YAML và convert sang FuelItem[]
   */
  private static loadFuelConfigs(): void {
    for (const [blockId, config] of Object.entries(GENERATED_FUEL_CONFIGS)) {
      // Convert blockId thành itemId (minecraft:coal_block → minecraft:coal_block)
      // usesPerBlock → usesPerItem
      const fuelItems: FuelItem[] = [{
        itemId: config.blockId,
        usesPerItem: config.usesPerBlock
      }];
      
      this.fuelConfigsByMachine.set(blockId, fuelItems);
    }
    console.warn(`[OreCrusherSystem] Loaded ${this.fuelConfigsByMachine.size} fuel configs`);
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
  private static addCrusher(block: Block, player: any): void {
    // Set direction dựa trên hướng player
    const direction = this.getDirectionFromPlayer(player);
    try {
      const permutation = (block.permutation as any).withState('apeirix:direction', direction);
      block.setPermutation(permutation);
    } catch (e) {
      // Block không có direction state, bỏ qua
    }
    
    const key = this.getLocationKey(block.dimension.id, block.location);
    this.crusherLocations.set(key, {
      dimension: block.dimension.id,
      location: block.location,
      blockId: block.typeId,
      tickCounter: 0,
      fuelRemaining: 0 // Sẽ check fuel từ hopper khi cần
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
          
          // Check fuel trước khi nghiền
          if (!this.checkAndConsumeFuel(block, data)) {
            continue; // Không đủ fuel, bỏ qua
          }
          
          this.processCrusher(block, config.multiplier);
        }
      } catch (error) {
        // Block không load (chunk unloaded) hoặc dimension không tồn tại
      }
    }
  }

  /**
   * Kiểm tra và tiêu hao fuel (từ hopper hoặc fuel còn lại)
   */
  private static checkAndConsumeFuel(block: Block, data: { fuelRemaining: number; blockId: string }): boolean {
    // Nếu còn fuel từ lần trước, tiêu hao
    if (data.fuelRemaining > 0) {
      data.fuelRemaining--;
      return true;
    }

    // Hết fuel, lấy fuel mới từ hopper
    const fuelItems = this.fuelConfigsByMachine.get(data.blockId);
    if (!fuelItems || fuelItems.length === 0) {
      console.warn(`[OreCrusherSystem] No fuel config for ${data.blockId}`);
      return false;
    }

    const fuelItem = HopperHandler.checkAndTakeFuel(block, fuelItems);
    if (!fuelItem) {
      return false; // Không tìm thấy fuel trong hopper
    }

    // Nạp fuel mới
    data.fuelRemaining = fuelItem.usesPerItem - 1; // -1 vì lần này đã dùng

    // Particle effect khi nạp fuel
    try {
      block.dimension.spawnParticle(
        'minecraft:lava_particle',
        {
          x: block.location.x + 0.5,
          y: block.location.y + 0.5,
          z: block.location.z + 0.5
        }
      );
    } catch (e) {
      // Particle không spawn được
    }

    return true;
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
