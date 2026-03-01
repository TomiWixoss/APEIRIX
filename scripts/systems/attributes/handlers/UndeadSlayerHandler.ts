/**
 * UndeadSlayerHandler - Handle 'undead_slayer' attribute
 * 
 * SINGLE SOURCE OF TRUTH for 'undead_slayer' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * NEW LOGIC: Weapons với attribute 'undead_slayer' deal bonus damage to undead mobs
 * 
 * Config:
 * - damageMultiplier: 1.5 (50% bonus damage)
 * - targetFamilies: ['undead', 'zombie', 'skeleton']
 * 
 * IMPROVED: Track actual damage dealt + safety checks
 * - Calculate bonus based on ACTUAL damage (after armor/resistance)
 * - Delay 11 ticks để tránh i-frame conflicts (no API to bypass)
 * - Comprehensive safety checks to prevent crashes
 * - Auto-cleanup damage history to prevent memory leaks
 */

import { world, system, EntityHurtAfterEvent } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';

interface DamageRecord {
  actualDamage: number;
  timestamp: number;
  bonusDamage: number;
}

interface UndeadSlayerData {
  itemId: string;
  damageMultiplier: number;
}

export class UndeadSlayerHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'undead_slayer';
  static readonly TEMPLATE_KEY = 'damage_multiplier_template';
  
  // ============================================
  // LORE GENERATION (Compile-time)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {damageMultiplier}
   */
  static processLorePlaceholders(itemId: string, line: string, itemStack?: any): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    
    if (config?.damageMultiplier) {
      const percentage = ((config.damageMultiplier - 1) * 100).toFixed(0);
      return line.replace(/{damageMultiplier}/g, percentage);
    }
    
    return line;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static readonly DEFAULT_DAMAGE_MULTIPLIER = 1.5; // 50% bonus damage (default)
  private static readonly TARGET_FAMILIES = ['undead', 'zombie', 'skeleton'];
  private static readonly I_FRAME_DELAY = 11; // Delay sau i-frame window (10 ticks)
  private static readonly HISTORY_CLEANUP_INTERVAL = 6000; // Cleanup every 5 minutes (6000 ticks)
  private static readonly HISTORY_MAX_AGE = 200; // Remove records older than 10 seconds (200 ticks)
  
  private static undeadSlayerWeapons = new Map<string, number>(); // itemId -> damageMultiplier
  private static damageHistory = new Map<string, DamageRecord>();

  static initialize(): void {
    console.warn('[UndeadSlayerHandler] Initializing...');
    
    // Register with PlaceholderRegistry for lore processing
    PlaceholderRegistry.registerAttributeHandler(this);
    
    // Load undead slayer weapons from attributes
    this.loadUndeadSlayerWeapons();
    
    console.warn(`[UndeadSlayerHandler] Loaded ${this.undeadSlayerWeapons.size} undead slayer weapons`);
    
    // Listen to entity hurt events
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    // Periodic cleanup of damage history to prevent memory leaks
    system.runInterval(() => {
      this.cleanupDamageHistory();
    }, this.HISTORY_CLEANUP_INTERVAL);
    
    console.warn('[UndeadSlayerHandler] Initialized');
  }

  private static loadUndeadSlayerWeapons(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      const multiplier = item.config?.damageMultiplier || this.DEFAULT_DAMAGE_MULTIPLIER;
      this.undeadSlayerWeapons.set(item.itemId, multiplier);
      
      console.warn(`[UndeadSlayerHandler] ${item.itemId}: ${multiplier}x damage vs undead`);
    }
  }

  private static handleEntityHurt(event: EntityHurtAfterEvent): void {
    try {
      const { hurtEntity, damageSource, damage } = event;
      
      // Check if damage source is a player
      const attacker = damageSource.damagingEntity;
      if (!attacker || attacker.typeId !== 'minecraft:player') {
        return;
      }
      
      // Check if victim is undead
      if (!this.isUndead(hurtEntity)) {
        return;
      }
      
      // Get weapon used
      const equipment = attacker.getComponent('minecraft:equippable');
      if (!equipment) return;
      
      const weapon = equipment.getEquipment('Mainhand' as any);
      if (!weapon) return;
      
      // Check if weapon has undead_slayer attribute
      const damageMultiplier = this.undeadSlayerWeapons.get(weapon.typeId);
      if (!damageMultiplier) {
        return;
      }
      
      // Calculate bonus damage based on ACTUAL damage dealt (after armor/resistance)
      const bonusDamage = damage * (damageMultiplier - 1);
      
      // Store damage record for tracking
      const currentTick = system.currentTick;
      this.damageHistory.set(hurtEntity.id, {
        actualDamage: damage,
        timestamp: currentTick,
        bonusDamage: bonusDamage
      });
      
      // Delay bonus damage để tránh i-frame conflicts
      // Entity có 10 ticks invulnerability sau khi bị hurt
      // No API to bypass i-frames, so we must delay
      system.runTimeout(() => {
        try {
          // Verify entity vẫn còn valid
          if (!hurtEntity.isValid) {
            return;
          }
          
          // Get health component
          const healthComp = hurtEntity.getComponent('health');
          if (!healthComp) {
            return;
          }
          
          // Safety check: Entity must be alive
          if (healthComp.currentValue <= 0) {
            console.warn(`[UndeadSlayerHandler] Entity ${hurtEntity.typeId} already dead, skipping bonus damage`);
            return;
          }
          
          // Safety check: Don't overkill
          // If bonus damage would kill entity, reduce it to leave 0.5 HP
          const finalBonusDamage = Math.min(bonusDamage, healthComp.currentValue - 0.5);
          
          if (finalBonusDamage <= 0) {
            console.warn(`[UndeadSlayerHandler] Entity ${hurtEntity.typeId} too low HP, skipping bonus damage`);
            return;
          }
          
          // Apply bonus damage sau i-frame window
          const damageApplied = hurtEntity.applyDamage(finalBonusDamage, {
            cause: damageSource.cause,
            damagingEntity: attacker
          });
          
          if (damageApplied) {
            // Visual feedback
            hurtEntity.dimension.spawnParticle(
              'minecraft:critical_hit_emitter',
              {
                x: hurtEntity.location.x,
                y: hurtEntity.location.y + 1,
                z: hurtEntity.location.z
              }
            );
            
            console.warn(`[UndeadSlayerHandler] Applied ${finalBonusDamage.toFixed(1)} bonus damage to ${hurtEntity.typeId} (HP: ${healthComp.currentValue.toFixed(1)})`);
          }
          
        } catch (error) {
          console.warn('[UndeadSlayerHandler] Error applying bonus damage:', error);
        }
      }, this.I_FRAME_DELAY);
      
    } catch (error) {
      console.warn('[UndeadSlayerHandler] Error handling entity hurt:', error);
    }
  }
  
  private static cleanupDamageHistory(): void {
    const currentTick = system.currentTick;
    const cutoffTick = currentTick - this.HISTORY_MAX_AGE;
    
    let removedCount = 0;
    for (const [entityId, record] of this.damageHistory.entries()) {
      if (record.timestamp < cutoffTick) {
        this.damageHistory.delete(entityId);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      console.warn(`[UndeadSlayerHandler] Cleaned up ${removedCount} old damage records`);
    }
  }

  private static isUndead(entity: any): boolean {
    try {
      // Check entity families
      for (const family of this.TARGET_FAMILIES) {
        if (entity.hasTag(family)) {
          return true;
        }
      }
      
      // Check entity type ID
      const typeId = entity.typeId.toLowerCase();
      if (typeId.includes('zombie') || 
          typeId.includes('skeleton') || 
          typeId.includes('wither') ||
          typeId.includes('phantom') ||
          typeId.includes('drowned')) {
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
}
