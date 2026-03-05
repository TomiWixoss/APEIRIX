/**
 * Fuel Handler - Xử lý nhiên liệu cho máy móc (shared)
 * 
 * Hỗ trợ:
 * - Phát hiện nhiên liệu ở tất cả 6 mặt (hoặc chỉ đáy)
 * - Tiêu hao nhiên liệu theo số lần sử dụng
 * - Particle effect khi tiêu hao
 */

import { Block, Vector3 } from '@minecraft/server';

export interface FuelConfig {
  blockId: string;        // ID của block nhiên liệu (vd: minecraft:coal_block)
  usesPerBlock: number;   // Số lần sử dụng mỗi block nhiên liệu
  detectFaces: 'all' | 'bottom';  // Phát hiện ở tất cả mặt hay chỉ đáy
}

export interface FuelData {
  fuelRemaining: number;  // Số lần sử dụng còn lại
}

export class FuelHandler {
  /**
   * Kiểm tra và tiêu hao nhiên liệu
   * @returns true nếu có đủ fuel, false nếu không
   */
  static checkAndConsumeFuel(
    block: Block,
    fuelData: FuelData,
    config: FuelConfig
  ): boolean {
    // Nếu còn fuel từ lần trước, tiêu hao
    if (fuelData.fuelRemaining > 0) {
      fuelData.fuelRemaining--;
      return true;
    }

    // Hết fuel, tìm fuel block ở các mặt
    const fuelLocation = this.findFuelBlock(block, config);
    
    if (!fuelLocation) {
      return false; // Không tìm thấy fuel
    }

    // Tiêu hao fuel block
    try {
      const fuelBlock = block.dimension.getBlock(fuelLocation);
      
      if (fuelBlock && fuelBlock.typeId === config.blockId) {
        // Có fuel block, tiêu hao nó và nạp fuel
        fuelBlock.setType('minecraft:air');
        fuelData.fuelRemaining = config.usesPerBlock - 1; // -1 vì lần này đã dùng

        // Particle effect khi tiêu hao fuel
        this.spawnFuelParticle(block, fuelLocation);

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Tìm fuel block ở các mặt
   * @returns Vị trí của fuel block hoặc null nếu không tìm thấy
   */
  private static findFuelBlock(
    block: Block,
    config: FuelConfig
  ): Vector3 | null {
    const offsets = this.getFaceOffsets(config.detectFaces);

    for (const offset of offsets) {
      const checkLoc: Vector3 = {
        x: block.location.x + offset.x,
        y: block.location.y + offset.y,
        z: block.location.z + offset.z
      };

      try {
        const checkBlock = block.dimension.getBlock(checkLoc);
        
        if (checkBlock && checkBlock.typeId === config.blockId) {
          return checkLoc;
        }
      } catch (error) {
        // Không thể truy cập block
        continue;
      }
    }

    return null;
  }

  /**
   * Lấy danh sách offset cho các mặt cần kiểm tra
   */
  private static getFaceOffsets(detectFaces: 'all' | 'bottom'): Vector3[] {
    if (detectFaces === 'bottom') {
      // Chỉ kiểm tra mặt dưới
      return [{ x: 0, y: -1, z: 0 }];
    }

    // Kiểm tra tất cả 6 mặt
    return [
      { x: 0, y: -1, z: 0 },  // Dưới
      { x: 0, y: 1, z: 0 },   // Trên
      { x: 1, y: 0, z: 0 },   // Đông
      { x: -1, y: 0, z: 0 },  // Tây
      { x: 0, y: 0, z: 1 },   // Nam
      { x: 0, y: 0, z: -1 }   // Bắc
    ];
  }

  /**
   * Spawn particle effect khi tiêu hao fuel
   */
  private static spawnFuelParticle(block: Block, fuelLocation: Vector3): void {
    try {
      block.dimension.spawnParticle(
        'minecraft:lava_particle',
        {
          x: fuelLocation.x + 0.5,
          y: fuelLocation.y + 0.5,
          z: fuelLocation.z + 0.5
        }
      );
    } catch (e) {
      // Particle không spawn được, bỏ qua
    }
  }
}
