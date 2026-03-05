/**
 * Void Teleport System - Sky Factory 4 style
 * Better SB - Teleport players back to sky when falling into void
 * 
 * Features:
 * - Monitor player Y position every tick
 * - Teleport when y < 0
 * - Cooldown to prevent spam
 * - Localized messages
 * - Sound effects
 */

import { world, system, Player, Vector3 } from '@minecraft/server';
import { LangManager } from '../../lang/LangManager';

export class VoidTeleportSystem {
  // Settings
  private static readonly VOID_THRESHOLD = 0;        // Teleport khi y < 0
  private static readonly TELEPORT_HEIGHT = 200;     // Teleport lên y = 200
  private static readonly COOLDOWN_TICKS = 40;       // 2 seconds cooldown
  private static readonly CHECK_INTERVAL = 1;        // Check mỗi tick
  
  private static playerCooldowns = new Map<string, number>(); // playerId -> tick khi có thể teleport lại

  /**
   * Khởi tạo void teleport system
   */
  static initialize(): void {
    console.warn('[VoidTeleportSystem] Initializing void teleport system...');
    console.warn(`[VoidTeleportSystem] Settings: threshold=${this.VOID_THRESHOLD}, height=${this.TELEPORT_HEIGHT}, cooldown=${this.COOLDOWN_TICKS}t`);
    
    // Check player positions mỗi tick
    system.runInterval(() => {
      this.checkAllPlayers();
    }, this.CHECK_INTERVAL);
    
    console.warn('[VoidTeleportSystem] Initialized - Players will teleport when falling into void');
  }

  /**
   * Check tất cả players
   */
  private static checkAllPlayers(): void {
    const allPlayers = world.getAllPlayers();
    const currentTick = system.currentTick;
    
    for (const player of allPlayers) {
      try {
        this.checkPlayer(player, currentTick);
      } catch (error) {
        // Player có thể đã disconnect
      }
    }
  }

  /**
   * Check một player có cần teleport không
   */
  private static checkPlayer(player: Player, currentTick: number): void {
    const location = player.location;
    
    // Check nếu player rơi xuống dưới void threshold
    if (location.y >= this.VOID_THRESHOLD) {
      return; // Player vẫn an toàn
    }

    // Check cooldown
    const playerId = player.id;
    const cooldownUntil = this.playerCooldowns.get(playerId) || 0;
    
    if (currentTick < cooldownUntil) {
      return; // Vẫn trong cooldown
    }

    // Teleport player
    this.teleportPlayer(player, currentTick);
  }

  /**
   * Teleport player về spawn height
   */
  private static teleportPlayer(player: Player, currentTick: number): void {
    try {
      // Lấy vị trí hiện tại (giữ X, Z)
      const currentLocation = player.location;
      
      // Tạo vị trí mới (teleport lên trời)
      const newLocation: Vector3 = {
        x: currentLocation.x,
        y: this.TELEPORT_HEIGHT,
        z: currentLocation.z
      };

      // Teleport
      player.teleport(newLocation, {
        dimension: player.dimension,
        rotation: player.getRotation(),
        facingLocation: undefined,
        checkForBlocks: false, // Không check blocks (có thể teleport vào không khí)
        keepVelocity: false     // Reset velocity (không rơi tiếp)
      });

      // Set cooldown
      this.playerCooldowns.set(player.id, currentTick + this.COOLDOWN_TICKS);

      // Hiển thị message
      this.showTeleportMessage(player);

      // Play sound effect
      this.playSoundEffect(player);

      console.warn(`[VoidTeleportSystem] Teleported ${player.name} from y=${currentLocation.y.toFixed(1)} to y=${this.TELEPORT_HEIGHT}`);
      
    } catch (error) {
      console.error(`[VoidTeleportSystem] Failed to teleport ${player.name}:`, error);
    }
  }

  /**
   * Hiển thị message cho player
   */
  private static showTeleportMessage(player: Player): void {
    const actionBarMsg = LangManager.get('ui.void.teleport');
    const chatMsg = LangManager.get('ui.void.message');
    
    player.onScreenDisplay.setActionBar(actionBarMsg);
    player.sendMessage(chatMsg);
  }

  /**
   * Play sound effect
   */
  private static playSoundEffect(player: Player): void {
    try {
      // Play enderman teleport sound
      player.playSound('mob.endermen.portal', {
        volume: 1.0,
        pitch: 1.2
      });
    } catch (error) {
      // Sound có thể không available
    }
  }

  /**
   * Clear cooldown cho player (dùng khi player leave)
   */
  static clearPlayerCooldown(playerId: string): void {
    this.playerCooldowns.delete(playerId);
  }

  /**
   * Get cooldown remaining cho player (debug)
   */
  static getCooldownRemaining(playerId: string): number {
    const cooldownUntil = this.playerCooldowns.get(playerId) || 0;
    const remaining = cooldownUntil - system.currentTick;
    return Math.max(0, remaining);
  }
}
