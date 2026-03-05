/**
 * Display Handler - Orchestrator cho display system
 * Better SB - QoL Feature: Hiển thị thông tin khi nhìn vào blocks/entities
 * 
 * Architecture:
 * - Slim orchestrator: Chỉ quản lý raycast và dispatch
 * - Providers: Xử lý logic hiển thị cho từng loại target
 * - Extensible: Dễ thêm providers mới (chest, furnace, etc.)
 * 
 * Tối ưu hiệu năng:
 * - Update mỗi 10 ticks (0.5s)
 * - Priority-based display (entity > block)
 */

import { world, system } from '@minecraft/server';
import { IDisplayProvider } from './providers/IDisplayProvider';
import { BlockDisplayProvider } from './providers/BlockDisplayProvider';
import { EntityDisplayProvider } from './providers/EntityDisplayProvider';

export class DisplayHandler {
  private static readonly CHECK_INTERVAL = 10; // Check mỗi 10 ticks (0.5s)
  private static readonly DISPLAY_RANGE = 5; // Hiển thị trong bán kính 5 blocks
  
  private static providers: IDisplayProvider[] = [];

  /**
   * Khởi tạo display system
   */
  static initialize(): void {
    console.warn('[DisplayHandler] Initializing display system...');
    
    // Register providers (order = priority)
    this.providers = [
      new EntityDisplayProvider(),  // Priority 20
      new BlockDisplayProvider()    // Priority 10
    ];
    
    // Check và hiển thị thông tin mỗi 10 ticks
    system.runInterval(() => {
      this.updateDisplayForAllPlayers();
    }, this.CHECK_INTERVAL);
    
    console.warn('[DisplayHandler] Initialized with', this.providers.length, 'providers');
  }

  /**
   * Cập nhật hiển thị cho tất cả players
   */
  private static updateDisplayForAllPlayers(): void {
    const allPlayers = world.getAllPlayers();
    
    for (const player of allPlayers) {
      try {
        // Lấy targets mà player đang nhìn vào
        const entityHit = player.getEntitiesFromViewDirection({ maxDistance: this.DISPLAY_RANGE });
        const blockHit = player.getBlockFromViewDirection({ maxDistance: this.DISPLAY_RANGE });
        
        // Collect all possible targets
        const targets: any[] = [];
        
        if (entityHit && entityHit.length > 0) {
          targets.push(entityHit[0].entity);
        }
        
        if (blockHit) {
          targets.push(blockHit.block);
        }
        
        // Find best display info (highest priority)
        let bestDisplay: any = null;
        let highestPriority = -1;
        
        for (const target of targets) {
          for (const provider of this.providers) {
            if (provider.canHandle(target)) {
              const displayInfo = provider.getDisplayInfo(player, target);
              
              if (displayInfo && displayInfo.priority > highestPriority) {
                bestDisplay = displayInfo;
                highestPriority = displayInfo.priority;
              }
              
              break; // First matching provider wins
            }
          }
        }
        
        // Display or clear
        if (bestDisplay) {
          player.onScreenDisplay.setActionBar(bestDisplay.message);
        } else {
          player.onScreenDisplay.setActionBar('');
        }
        
      } catch (error) {
        // Player có thể đã disconnect
      }
    }
  }
}
