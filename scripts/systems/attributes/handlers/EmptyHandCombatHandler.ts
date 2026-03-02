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
import { EntityAttributeStorage } from '../EntityAttributeStorage';

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
  static readonly TEMPLATE_KEY = 'empty_hand_combat_template';
  
  private static config: EmptyHandCombatConfig | null = null;
  
  // ============================================
  // LORE GENERATION (for when transferred to items)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {damage}
   */
  static processLorePlaceholders(entityId: string, line: string, entity?: any): string {
    // Get config from entity or use default
    const damage = this.config?.damage ?? 0;
    
    return line
      .replace('{damage}', String(damage));
  }

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
    // Load from GENERATED_ENTITIES (entity attributes)
    const { GENERATED_ENTITIES } = require('../../../data/GeneratedGameData');
    const playerEntity = GENERATED_ENTITIES.find((e: any) => e.entityId === this.ENTITY_ID);
    
    if (playerEntity) {
      const attr = playerEntity.attributes.find((a: any) => a.id === this.ATTRIBUTE_ID);
      if (attr) {
        this.config = attr.config as EmptyHandCombatConfig;
      }
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
      
      // CRITICAL: Check if player HAS the empty_hand_combat attribute
      // If attribute was transferred to item, player no longer has it → normal damage
      const playerAttributeData = EntityAttributeStorage.load(player);
      const hasAttribute = this.ATTRIBUTE_ID in playerAttributeData;
      
      if (!hasAttribute) {
        // Player doesn't have attribute → normal damage
        return;
      }
      
      // Get player's inventory
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Get held item in selected slot
      const heldItem = container.getItem(player.selectedSlotIndex);
      
      // If player has empty hand (no item) AND has attribute, apply damage override
      if (!heldItem && this.config.damage !== undefined) {
        event.damage = this.config.damage;
      }
      
    } catch (error) {
      console.warn('[EmptyHandCombatHandler] Error in entity hurt before handler:', error);
    }
  }
}
