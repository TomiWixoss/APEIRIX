/**
 * Display Handler - Hiển thị thông tin blocks cho player
 * Better SB - QoL Feature: Hiển thị tên MỌI blocks khi nhìn vào
 * 
 * Tối ưu hiệu năng:
 * - Chỉ hiển thị khi player nhìn vào block (raycast)
 * - Update mỗi 10 ticks (0.5s)
 * - Tự động clear khi không nhìn vào block
 */

import { world, system } from '@minecraft/server';
import { BlockInfoProvider } from './BlockInfoProvider';

export class DisplayHandler {
  private static readonly CHECK_INTERVAL = 10; // Check mỗi 10 ticks (0.5s)
  private static readonly DISPLAY_RANGE = 5; // Hiển thị trong bán kính 5 blocks

  /**
   * Khởi tạo display system
   */
  static initialize(): void {
    console.warn('[DisplayHandler] Initializing block display system...');
    
    // Check và hiển thị thông tin mỗi 10 ticks
    system.runInterval(() => {
      this.updateDisplayForAllPlayers();
    }, this.CHECK_INTERVAL);
    
    console.warn('[DisplayHandler] Initialized - Displays block names on look');
  }

  /**
   * Cập nhật hiển thị cho tất cả players
   */
  private static updateDisplayForAllPlayers(): void {
    const allPlayers = world.getAllPlayers();
    
    for (const player of allPlayers) {
      try {
        // Lấy block mà player đang nhìn vào (raycast)
        const blockHit = player.getBlockFromViewDirection({ maxDistance: this.DISPLAY_RANGE });
        
        if (!blockHit) {
          // Không nhìn vào block nào, clear display
          player.onScreenDisplay.setActionBar('');
          continue;
        }

        const block = blockHit.block;
        
        // Skip air blocks
        if (block.typeId === 'minecraft:air') {
          player.onScreenDisplay.setActionBar('');
          continue;
        }

        const blockInfo = BlockInfoProvider.getBlockInfo(block);
        
        // Hiển thị tên block với màu sắc
        const displayText = `§b${blockInfo.displayName}`;
        player.onScreenDisplay.setActionBar(displayText);
        
      } catch (error) {
        // Player có thể đã disconnect
      }
    }
  }
}
