/**
 * DamageIndicatorSystem - Hiển thị damage indicator trên nameTag của entity
 * 
 * Features:
 * - Hiển thị damage số khi entity bị đánh
 * - Lưu và restore original nameTag
 * - Auto-hide sau 2 giây
 * - Support tất cả entities
 */

import { world, Entity, system } from '@minecraft/server';

interface DamageIndicatorData {
  originalNameTag: string;
  restoreScheduleId?: number;
}

export class DamageIndicatorSystem {
  private static readonly DISPLAY_DURATION_TICKS = 20; // 1 second (20 ticks/sec)
  private static readonly ORIGINAL_NAMETAG_PROPERTY = 'apeirix:original_nametag';
  
  // Track entities with active damage indicators
  private static activeIndicators = new Map<string, DamageIndicatorData>();

  static initialize(): void {
    console.warn('[DamageIndicatorSystem] Initializing...');
    
    // Listen to entity hurt events
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    console.warn('[DamageIndicatorSystem] Initialized');
  }

  private static handleEntityHurt(event: any): void {
    try {
      const { hurtEntity, damage } = event;
      
      if (!hurtEntity || !hurtEntity.isValid) {
        return;
      }
      
      // Show damage indicator
      this.showDamageIndicator(hurtEntity, damage);
      
    } catch (error) {
      console.warn('[DamageIndicatorSystem] Error in entity hurt handler:', error);
    }
  }

  private static showDamageIndicator(entity: Entity, damage: number): void {
    try {
      const entityId = entity.id;
      
      // Save original nameTag if not already saved
      if (!this.activeIndicators.has(entityId)) {
        const originalNameTag = entity.nameTag || '';
        
        // Store in dynamic property for persistence across reloads
        try {
          entity.setDynamicProperty(this.ORIGINAL_NAMETAG_PROPERTY, originalNameTag);
        } catch (e) {
          // Dynamic property might fail, fallback to memory only
        }
        
        this.activeIndicators.set(entityId, {
          originalNameTag: originalNameTag
        });
      }
      
      // Cancel previous restore schedule if exists
      const indicatorData = this.activeIndicators.get(entityId);
      if (indicatorData?.restoreScheduleId !== undefined) {
        system.clearRun(indicatorData.restoreScheduleId);
      }
      
      // Format damage display
      const damageText = this.formatDamage(damage);
      
      // Set nameTag to show damage
      entity.nameTag = damageText;
      
      // Schedule restore original nameTag
      const scheduleId = system.runTimeout(() => {
        this.restoreOriginalNameTag(entity);
      }, this.DISPLAY_DURATION_TICKS);
      
      // Update schedule ID
      if (indicatorData) {
        indicatorData.restoreScheduleId = scheduleId;
      }
      
    } catch (error) {
      console.warn('[DamageIndicatorSystem] Error showing damage indicator:', error);
    }
  }

  private static formatDamage(damage: number): string {
    // Format: §c-5⚔ or §c-5.25⚔ (red color, damage value with sword icon)
    // Round to 2 decimal places and remove trailing zeros
    const roundedDamage = Math.round(damage * 100) / 100;
    
    // Format with max 2 decimals, remove trailing zeros
    const formatted = roundedDamage.toFixed(2).replace(/\.?0+$/, '');
    
    return `§c${formatted} ⚔`;
  }

  private static restoreOriginalNameTag(entity: Entity): void {
    try {
      if (!entity.isValid) {
        return;
      }
      
      const entityId = entity.id;
      const indicatorData = this.activeIndicators.get(entityId);
      
      if (!indicatorData) {
        return;
      }
      
      // Restore original nameTag
      let originalNameTag = indicatorData.originalNameTag;
      
      // Try to get from dynamic property if available
      try {
        const storedNameTag = entity.getDynamicProperty(this.ORIGINAL_NAMETAG_PROPERTY);
        if (typeof storedNameTag === 'string') {
          originalNameTag = storedNameTag;
        }
      } catch (e) {
        // Ignore if dynamic property not available
      }
      
      entity.nameTag = originalNameTag;
      
      // Clean up
      this.activeIndicators.delete(entityId);
      
      // Clean up dynamic property
      try {
        entity.setDynamicProperty(this.ORIGINAL_NAMETAG_PROPERTY, undefined);
      } catch (e) {
        // Ignore cleanup errors
      }
      
    } catch (error) {
      console.warn('[DamageIndicatorSystem] Error restoring nameTag:', error);
    }
  }

  /**
   * Clean up all active indicators (useful for system shutdown)
   */
  static cleanup(): void {
    for (const [entityId, data] of this.activeIndicators.entries()) {
      if (data.restoreScheduleId !== undefined) {
        system.clearRun(data.restoreScheduleId);
      }
    }
    this.activeIndicators.clear();
  }
}
