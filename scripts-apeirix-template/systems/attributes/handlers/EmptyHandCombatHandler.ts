/**
 * EmptyHandCombatHandler - Prevent damage when attacking with empty hand
 * 
 * SINGLE SOURCE OF TRUTH for 'empty_hand_combat' attribute:
 * - Runtime behavior for player entity
 * 
 * Player đánh bằng tay không (empty hand) sẽ gây 0 damage cho bất kỳ entity nào.
 * 
 * Config (player.yaml):
 * - context: 'combat'
 * - damage: 0
 */

import { world, EntityHurtBeforeEvent, Player } from '@minecraft/server';
import { getAttributeConfig } from '../../../data/GeneratedAttributes';

interface EmptyHandCombatConfig {
  context?: string;
  damage?: number;
}

export class EmptyHandCombatHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'empty_hand_combat';
  static readonly ENTITY_ID = 'minecraft:player';
  
  private static config: EmptyHandCombatConfig | null = null;

  static initialize(): void {
    console.warn('[EmptyHandCombatHandler] Initializing...');
    
    // Load config from GENERATED_ATTRIBUTES
    this.loadConfig();
    
    if (!this.config) {
      console.warn('[EmptyHandCombatHandler] No config found for minecraft:player, handler disabled');
      return;
    }
    
    console.warn(`[EmptyHandCombatHandler] Loaded config: damage=${this.config.damage}`);
    
    // Listen to entity hurt BEFORE events - allows modifying damage before it's applied
    world.beforeEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurtBefore(event);
    });
    
    console.warn('[EmptyHandCombatHandler] Initialized');
  }

  private static loadConfig(): void {
    const config = getAttributeConfig(this.ENTITY_ID, this.ATTRIBUTE_ID);
    if (config) {
      this.config = config as EmptyHandCombatConfig;
    }
  }

  private static handleEntityHurtBefore(event: EntityHurtBeforeEvent): void {
    try {
      if (!this.config) return;
      
      const { damageSource } = event;
      
      // Check if damage source is a player
      const attacker = damageSource.damagingEntity;
      if (!attacker || attacker.typeId !== 'minecraft:player') {
        return;
      }
      
      const player = attacker as Player;
      
      // Get player's inventory
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Get held item in selected slot
      const heldItem = container.getItem(player.selectedSlotIndex);
      
      // If player has empty hand (no item), apply damage override
      if (!heldItem && this.config.damage !== undefined) {
        event.damage = this.config.damage;
      }
      
    } catch (error) {
      console.warn('[EmptyHandCombatHandler] Error in entity hurt before handler:', error);
    }
  }
}
