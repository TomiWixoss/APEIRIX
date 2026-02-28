/**
 * Display Handler - Hiển thị thông tin blocks cho player
 * 
 * Hỗ trợ:
 * - Hiển thị thông tin cho TẤT CẢ blocks của addon (machines, ores, storage, etc.)
 * - Machines đang chạy: Progress bar + thời gian còn lại
 * - Machines idle: Tên máy + trạng thái "Sẵn sàng"
 * - Blocks khác: Tên block
 * 
 * Tối ưu hiệu năng:
 * - Chỉ hiển thị khi player nhìn vào block (raycast)
 * - Update mỗi 5 ticks (0.25s) - realtime
 * - Tự động clear khi không nhìn vào block
 */

import { Player, world, system, Block } from '@minecraft/server';
import { MachineStateManager, MachineState } from './MachineState';
import { BlockInfoProvider, BlockInfo } from './BlockInfoProvider';

export class DisplayHandler {
  private static readonly CHECK_INTERVAL = 5; // Check mỗi 5 ticks (0.25s) - realtime
  private static readonly DISPLAY_RANGE = 5; // Hiển thị trong bán kính 5 blocks

  /**
   * Khởi tạo display system
   */
  static initialize(): void {
    console.warn('[DisplayHandler] Initializing block display system...');
    
    // Check và hiển thị thông tin mỗi 5 ticks (0.25 giây)
    system.runInterval(() => {
      this.updateDisplayForAllPlayers();
    }, this.CHECK_INTERVAL);
    
    console.warn('[DisplayHandler] Initialized - Displays info for all addon blocks');
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
        const blockInfo = BlockInfoProvider.getBlockInfo(block);

        // Chỉ hiển thị cho blocks của addon
        if (!blockInfo.isAddonBlock) {
          player.onScreenDisplay.setActionBar('');
          continue;
        }

        // Tạo text hiển thị dựa trên loại block
        const displayText = this.createDisplayText(block, blockInfo);
        player.onScreenDisplay.setActionBar(displayText);
        
      } catch (error) {
        // Player có thể đã disconnect
      }
    }
  }

  /**
   * Tạo text hiển thị dựa trên loại block
   */
  private static createDisplayText(block: Block, blockInfo: BlockInfo): string {
    if (blockInfo.blockType === 'machine') {
      return this.createMachineDisplay(block, blockInfo);
    }

    // Blocks khác: Chỉ hiển thị tên
    return this.createSimpleDisplay(blockInfo);
  }

  /**
   * Tạo display cho machines (processing hoặc idle)
   */
  private static createMachineDisplay(block: Block, blockInfo: BlockInfo): string {
    const state = MachineStateManager.get(block.dimension.id, block.location);

    // Machine đang chạy
    if (state && state.isProcessing) {
      return this.createProcessingDisplay(blockInfo.displayName, state);
    }

    // Machine idle
    return this.createIdleDisplay(blockInfo.displayName);
  }

  /**
   * Tạo display cho machine đang xử lý
   */
  private static createProcessingDisplay(machineName: string, state: MachineState): string {
    // Tính progress (0-100%)
    const totalTime = state.totalProcessingTime || 60; // Fallback
    let progress = totalTime > 0 ? ((totalTime - state.ticksRemaining) / totalTime) * 100 : 0;
    
    // Đảm bảo hiển thị 100% khi hoàn thành
    if (state.ticksRemaining <= 0) {
      progress = 100;
    }
    
    // Clamp progress trong khoảng 0-100
    progress = Math.max(0, Math.min(100, progress));
    
    // Tạo progress bar (20 ký tự)
    const progressBar = this.createProgressBar(progress, 20);
    
    // Thời gian còn lại (giây)
    const secondsRemaining = Math.max(0, state.ticksRemaining / 20).toFixed(1);
    
    // Format: [Tên Máy] ▰▰▰▰▰▱▱▱▱▱ 50% (2.5s)
    return `§6${machineName} §f${progressBar} §e${progress.toFixed(0)}% §7(${secondsRemaining}s)`;
  }

  /**
   * Tạo display cho machine idle
   */
  private static createIdleDisplay(machineName: string): string {
    // Format: [Tên Máy] - Sẵn sàng
    return `§6${machineName} §7- §aSẵn sàng`;
  }

  /**
   * Tạo display đơn giản cho blocks khác
   */
  private static createSimpleDisplay(blockInfo: BlockInfo): string {
    // Format: [Tên Block]
    const color = this.getColorForBlockType(blockInfo.blockType);
    return `${color}${blockInfo.displayName}`;
  }

  /**
   * Lấy màu cho loại block
   */
  private static getColorForBlockType(blockType: string): string {
    switch (blockType) {
      case 'ore':
        return '§b'; // Aqua cho ores
      case 'storage':
        return '§e'; // Yellow cho storage blocks
      case 'machine':
        return '§6'; // Gold cho machines
      default:
        return '§f'; // White cho blocks khác
    }
  }

  /**
   * Tạo progress bar với ký tự đặc biệt
   */
  private static createProgressBar(progress: number, length: number): string {
    const filledLength = Math.floor((progress / 100) * length);
    const emptyLength = length - filledLength;
    
    const filled = '§a▰'.repeat(filledLength);
    const empty = '§8▱'.repeat(emptyLength);
    
    return filled + empty;
  }
}
