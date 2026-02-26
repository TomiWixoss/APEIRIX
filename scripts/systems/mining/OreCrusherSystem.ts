import { world, system, Block, ItemStack, Vector3 } from '@minecraft/server';
import { HammerRegistry } from '../../data/mining/HammerRegistry';
import { EventBus } from '../../core/EventBus';

/**
 * OreCrusherSystem - Tự động nghiền quặng chạm vào ore_crusher
 * 
 * Cơ chế thông minh:
 * - Track vị trí crusher khi đặt/phá
 * - Chỉ check các crusher đã track (cực kỳ tối ưu)
 * - Nghiền mỗi 2 giây (40 ticks)
 * - Drop x2 dust so với hammer
 */
export class OreCrusherSystem {
  private static readonly CRUSHER_BLOCK_ID = 'apeirix:ore_crusher';
  private static readonly CHECK_INTERVAL = 40; // 40 ticks = 2 giây
  private static crusherLocations: Map<string, { dimension: string; location: Vector3 }> = new Map();

  static initialize(): void {
    console.warn('[OreCrusherSystem] Initializing...');
    
    // Track khi player đặt crusher
    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (event.block.typeId === this.CRUSHER_BLOCK_ID) {
        this.addCrusher(event.block);
      }
    });
    
    // Track khi player phá crusher
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      if (event.brokenBlockPermutation.type.id === this.CRUSHER_BLOCK_ID) {
        this.removeCrusher(event.block.dimension.id, event.block.location);
      }
    });
    
    // Nghiền định kỳ - chỉ check các crusher đã track
    system.runInterval(() => {
      this.processAllCrushers();
    }, this.CHECK_INTERVAL);
    
    console.warn('[OreCrusherSystem] Initialized - Smart tracking system');
  }

  /**
   * Thêm crusher vào tracking list
   */
  private static addCrusher(block: Block): void {
    const key = this.getLocationKey(block.dimension.id, block.location);
    this.crusherLocations.set(key, {
      dimension: block.dimension.id,
      location: block.location
    });
    console.warn(`[OreCrusherSystem] Added crusher at ${key}`);
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
        if (!block || block.typeId !== this.CRUSHER_BLOCK_ID) {
          this.crusherLocations.delete(key);
          continue;
        }
        
        this.processCrusher(block);
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
  private static processCrusher(crusherBlock: Block): void {
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
          this.crushBlock(targetBlock, crusherBlock);
        }
      } catch (error) {
        // Block không thể truy cập
      }
    }
  }

  /**
   * Nghiền một block nếu có thể
   */
  private static crushBlock(targetBlock: Block, crusherBlock: Block): void {
    const blockId = targetBlock.typeId;
    
    // Kiểm tra xem block có thể nghiền bằng hammer không
    const dustDrop = HammerRegistry.getDrops(blockId);
    if (!dustDrop) {
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
      
      // Spawn dust drops x2 (double so với hammer)
      const dropLocation = {
        x: targetBlock.location.x + 0.5,
        y: targetBlock.location.y + 0.5,
        z: targetBlock.location.z + 0.5
      };
      
      // Spawn stone dust x2
      targetBlock.dimension.spawnItem(
        new ItemStack(dustDrop.stoneDust, dustDrop.stoneDustCount * 2),
        dropLocation
      );
      
      // Spawn ore dust x2 if exists
      if (dustDrop.oreDust && dustDrop.oreDustCount) {
        targetBlock.dimension.spawnItem(
          new ItemStack(dustDrop.oreDust, dustDrop.oreDustCount * 2),
          dropLocation
        );
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
