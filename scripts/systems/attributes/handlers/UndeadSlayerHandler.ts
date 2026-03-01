/**
 * UndeadSlayerHandler - Handle 'undead_slayer' attribute
 * 
 * NEW LOGIC: Weapons với attribute 'undead_slayer' deal bonus damage to undead mobs
 * 
 * Config:
 * - damageMultiplier: 1.5 (50% bonus damage)
 * - targetFamilies: ['undead', 'zombie', 'skeleton']
 * 
 * FIXED: Delay bonus damage để tránh i-frame conflicts
 * - Entity có i-frames 10 ticks sau khi bị hurt
 * - Delay 11 ticks để đảm bảo bonus damage apply sau i-frame window
 */

import { world, system, EntityHurtAfterEvent } from '@minecraft/server';
import { getItemsWithAttribute } from '../../../data/GeneratedAttributes';

export class UndeadSlayerHandler {
  private static readonly DAMAGE_MULTIPLIER = 1.5; // 50% bonus damage
  private static readonly TARGET_FAMILIES = ['undead', 'zombie', 'skeleton'];
  private static readonly I_FRAME_DELAY = 11; // Delay sau i-frame window (10 ticks)
  
  private static undeadSlayerWeapons: Set<string>;

  static initialize(): void {
    console.warn('[UndeadSlayerHandler] Initializing...');
    
    // Load undead slayer weapons from attributes
    const weapons = getItemsWithAttribute('undead_slayer');
    this.undeadSlayerWeapons = new Set(weapons);
    
    console.warn(`[UndeadSlayerHandler] Loaded ${this.undeadSlayerWeapons.size} undead slayer weapons`);
    
    // Listen to entity hurt events
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    console.warn('[UndeadSlayerHandler] Initialized');
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
      if (!this.undeadSlayerWeapons.has(weapon.typeId)) {
        return;
      }
      
      // Calculate bonus damage
      const bonusDamage = damage * (this.DAMAGE_MULTIPLIER - 1);
      
      // Delay bonus damage để tránh i-frame conflicts
      // Entity có 10 ticks invulnerability sau khi bị hurt
      system.runTimeout(() => {
        try {
          // Verify entity vẫn còn sống và valid
          if (!hurtEntity.isValid || hurtEntity.getComponent('health')?.currentValue === 0) {
            return;
          }
          
          // Apply bonus damage sau i-frame window
          hurtEntity.applyDamage(bonusDamage, {
            cause: damageSource.cause,
            damagingEntity: attacker
          });
          
          // Visual feedback
          hurtEntity.dimension.spawnParticle(
            'minecraft:critical_hit_emitter',
            {
              x: hurtEntity.location.x,
              y: hurtEntity.location.y + 1,
              z: hurtEntity.location.z
            }
          );
          
          console.warn(`[UndeadSlayerHandler] Applied ${bonusDamage.toFixed(1)} bonus damage to ${hurtEntity.typeId} (delayed)`);
          
        } catch (error) {
          // Entity might be dead or unloaded
        }
      }, this.I_FRAME_DELAY);
      
    } catch (error) {
      console.warn('[UndeadSlayerHandler] Error handling entity hurt:', error);
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
