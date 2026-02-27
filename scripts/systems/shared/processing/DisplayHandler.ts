/**
 * Display Handler - Hiển thị thông tin xử lý của máy cho player
 * 
 * Tối ưu hiệu năng:
 * - Chỉ hiển thị khi player nhìn vào máy (raycast)
 * - Update mỗi 20 ticks (1 giây)
 * - Tự động clear khi không nhìn vào máy
 */

import { Player, world, system } from '@minecraft/server';
import { MachineStateManager, MachineState } from './MachineState';
import { LangManager } from '../../../lang/LangManager';

export class DisplayHandler {
  private static readonly CHECK_INTERVAL = 5; // Check mỗi 5 ticks (0.25s) - realtime
  private static readonly DISPLAY_RANGE = 5; // Hiển thị trong bán kính 5 blocks

  /**
   * Khởi tạo display system
   */
  static initialize(): void {
    console.warn('[DisplayHandler] Initializing machine display system (ultra-optimized)...');
    
    // Check và hiển thị thông tin mỗi 5 ticks (0.25 giây)
    // CHỈ CHẠY KHI CÓ ÍT NHẤT 1 PLAYER ĐANG NHÌN VÀO MÁY ĐANG XỬ LÝ
    system.runInterval(() => {
      // Chỉ check khi có player đang nhìn vào máy đang xử lý
      if (this.hasAnyPlayerLookingAtProcessingMachine()) {
        this.updateDisplayForTrackedPlayers();
      }
    }, this.CHECK_INTERVAL);
    
    console.warn('[DisplayHandler] Initialized - Ultra-optimized (only checks when player looks at processing machine)');
  }

  /**
   * Kiểm tra xem có player nào đang nhìn vào máy đang xử lý không
   */
  private static hasAnyPlayerLookingAtProcessingMachine(): boolean {
    const allPlayers = world.getAllPlayers();
    
    for (const player of allPlayers) {
      try {
        // Raycast để xem player có đang nhìn vào block nào không
        const blockHit = player.getBlockFromViewDirection({ maxDistance: this.DISPLAY_RANGE });
        
        if (!blockHit) continue;
        
        const block = blockHit.block;
        
        // Kiểm tra xem block này có phải là máy đang xử lý không
        const state = MachineStateManager.get(block.dimension.id, block.location);
        
        if (state && state.isProcessing) {
          return true; // Có ít nhất 1 player đang nhìn vào máy đang xử lý
        }
      } catch (error) {
        // Player có thể đã disconnect hoặc lỗi raycast
      }
    }
    
    return false; // Không có player nào đang nhìn vào máy đang xử lý
  }

  /**
   * Cập nhật hiển thị cho tracked players
   */
  private static updateDisplayForTrackedPlayers(): void {
    const allPlayers = world.getAllPlayers();
    
    for (const player of allPlayers) {
      try {
        // Lấy block mà player đang nhìn vào (raycast)
        const lookingAtMachine = this.getMachineLookingAt(player);
        
        if (lookingAtMachine) {
          const displayText = this.createDisplayText(lookingAtMachine);
          player.onScreenDisplay.setActionBar(displayText);
        } else {
          // Clear display
          player.onScreenDisplay.setActionBar('');
        }
        
      } catch (error) {
        // Player có thể đã disconnect
      }
    }
  }

  /**
   * Lấy máy mà player đang nhìn vào (raycast)
   */
  private static getMachineLookingAt(player: Player): MachineState | null {
    try {
      // Raycast từ player để tìm block đang nhìn
      const blockHit = player.getBlockFromViewDirection({ maxDistance: this.DISPLAY_RANGE });
      
      if (!blockHit) return null;
      
      const block = blockHit.block;
      
      // Kiểm tra xem block này có phải là máy đang xử lý không
      const state = MachineStateManager.get(block.dimension.id, block.location);
      
      if (state && state.isProcessing) {
        return state;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Tạo text hiển thị với progress bar
   */
  private static createDisplayText(state: MachineState): string {
    // Lấy tên máy từ LangManager
    const machineKey = `machines.${state.machineType}`;
    const machineName = `§6${LangManager.get(machineKey)}`;
    
    // Tính progress (0-100%) từ totalProcessingTime
    const totalTime = state.totalProcessingTime || 60; // Fallback nếu chưa có
    let progress = totalTime > 0 ? ((totalTime - state.ticksRemaining) / totalTime) * 100 : 0;
    
    // Đảm bảo hiển thị 100% khi hoàn thành (ticksRemaining <= 0)
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
    return `${machineName} §f${progressBar} §e${progress.toFixed(0)}% §7(${secondsRemaining}s)`;
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
