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
 * - Void Protection: Prevent death for 5s after teleport (Totem of Undying style)
 */

import { world, system, Player, Vector3 } from '@minecraft/server';
import { LangManager } from '../../lang/LangManager';

export class VoidTeleportSystem {
  // Settings
  private static readonly VOID_THRESHOLD = 0;        // Teleport khi y < 0
  private static readonly TELEPORT_HEIGHT = 200;     // Teleport lên y = 200
  private static readonly COOLDOWN_TICKS = 40;       // 2 seconds cooldown
  private static readonly CHECK_INTERVAL = 1;        // Check mỗi tick
  private static readonly PROTECTION_DURATION = 100; // 5 seconds protection (100 ticks)
  
  private static playerCooldowns = new Map<string, number>(); // playerId -> tick khi có thể teleport lại
  private static voidProtection = new Map<string, number>();  // playerId -> tick khi hết protection

  /**
   * Khởi tạo void teleport system
   */
  static initialize(): void {
    console.warn('[VoidTeleportSystem] Initializing void teleport system...');
    console.warn(`[VoidTeleportSystem] Settings: threshold=${this.VOID_THRESHOLD}, height=${this.TELEPORT_HEIGHT}, cooldown=${this.COOLDOWN_TICKS}t, protection=${this.PROTECTION_DURATION}t`);
    
    // Check player positions mỗi tick
    system.runInterval(() => {
      this.checkAllPlayers();
    }, this.CHECK_INTERVAL);
    
    // Setup damage protection
    this.setupDamageProtection();
    
    console.warn('[VoidTeleportSystem] Initialized - Players will teleport when falling into void');
  }

  /**
   * Setup damage protection system
   */
  private static setupDamageProtection(): void {
    world.beforeEvents.entityHurt.subscribe((event) => {
      // Chỉ xử lý player
      if (event.hurtEntity.typeId !== 'minecraft:player') {
        return;
      }

      const player = event.hurtEntity as Player;
      const playerId = player.id;
      
      // Check nếu player có void protection
      const protectionUntil = this.voidProtection.get(playerId);
      if (!protectionUntil || system.currentTick >= protectionUntil) {
        return; // Không có protection hoặc đã hết
      }

      // Check nếu damage này sẽ giết player
      const healthComponent = player.getComponent('health');
      if (!healthComponent) return;

      const currentHealth = healthComponent.currentValue;
      const damage = event.damage;

      // Nếu damage sẽ giết player (HP - damage <= 0)
      if (currentHealth - damage <= 0) {
        // Cancel damage hoàn toàn
        event.cancel = true;
        
        // Clear protection (chỉ cứu 1 lần)
        this.voidProtection.delete(playerId);
        
        console.warn(`[VoidTeleportSystem] Void protection saved ${player.name} from death! Would take ${damage.toFixed(1)} damage at ${currentHealth.toFixed(1)} HP`);
        
        // Set HP = 1 và apply effects sau (phải dùng system.run vì không thể modify trong beforeEvents)
        system.run(() => {
          try {
            const health = player.getComponent('health');
            if (health) {
              // Set HP = 1 (nửa tim)
              health.setCurrentValue(1);
              console.warn(`[VoidTeleportSystem] Set ${player.name} HP to 1 (half heart)`);
            }
            this.applyStunEffects(player);
          } catch (error) {
            console.error('[VoidTeleportSystem] Failed to set HP:', error);
          }
        });
      }
    });
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

      // Set void protection (5 giây)
      this.voidProtection.set(player.id, currentTick + this.PROTECTION_DURATION);

      // Hiển thị message
      this.showTeleportMessage(player);

      // Play sound effect
      this.playSoundEffect(player);

      console.warn(`[VoidTeleportSystem] Teleported ${player.name} from y=${currentLocation.y.toFixed(1)} to y=${this.TELEPORT_HEIGHT} (Protection: 5s)`);
      
    } catch (error) {
      console.error(`[VoidTeleportSystem] Failed to teleport ${player.name}:`, error);
    }
  }

  /**
   * Gây hiệu ứng choáng (slowness + nausea)
   */
  private static applyStunEffects(player: Player): void {
    try {
      // Slowness IV (5 giây)
      player.addEffect('slowness', 100, {
        amplifier: 3,
        showParticles: true
      });

      // Nausea (5 giây)
      player.addEffect('nausea', 100, {
        amplifier: 0,
        showParticles: true
      });

      // Hiển thị message
      const protectionMsg = LangManager.get('ui.void.protection');
      player.sendMessage(protectionMsg);
      
    } catch (error) {
      console.error(`[VoidTeleportSystem] Failed to apply stun effects:`, error);
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
    this.voidProtection.delete(playerId);
  }

  /**
   * Get cooldown remaining cho player (debug)
   */
  static getCooldownRemaining(playerId: string): number {
    const cooldownUntil = this.playerCooldowns.get(playerId) || 0;
    const remaining = cooldownUntil - system.currentTick;
    return Math.max(0, remaining);
  }

  /**
   * Check if player has void protection (debug)
   */
  static hasVoidProtection(playerId: string): boolean {
    const protectionUntil = this.voidProtection.get(playerId);
    return protectionUntil !== undefined && system.currentTick < protectionUntil;
  }
}
