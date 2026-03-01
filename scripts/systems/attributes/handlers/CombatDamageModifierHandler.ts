/**
 * CombatDamageModifierHandler - Modify combat damage
 * 
 * SINGLE SOURCE OF TRUTH for 'combat_damage_modifier' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * Items với attribute 'combat_damage_modifier' có thể:
 * - Override attack damage
 * - Set damage multiplier
 * 
 * Config:
 * - context: 'combat' (chỉ active khi combat)
 * - damage: 0 (override damage to 0)
 * - damageMultiplier: 0.5 (50% damage)
 * 
 * Example: Wooden pickaxe với damage: 0 (no combat damage)
 */

import { world, EntityHurtBeforeEvent } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';

interface CombatDamageConfig {
  context?: AttributeContext | string;
  damage?: number;
  damageMultiplier?: number;
  conditions?: any;
}

export class CombatDamageModifierHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'combat_damage_modifier';
  static readonly TEMPLATE_KEY = 'combat_damage_template';
  
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
   * Replaces: {combat_damage}
   */
  static processLorePlaceholders(itemId: string, line: string): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    
    if (config?.damage !== undefined) {
      return line.replace(/{combat_damage}/g, config.damage.toString());
    }
    
    return line;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static damageModifierItems = new Map<string, CombatDamageConfig>();

  static initialize(): void {
    console.warn('[CombatDamageModifierHandler] Initializing...');
    
    // Load combat damage modifier items from attributes
    this.loadDamageModifierItems();
    
    console.warn(`[CombatDamageModifierHandler] Loaded ${this.damageModifierItems.size} combat damage modifier items`);
    
    // Listen to entity hurt BEFORE events (experimental) - allows modifying damage before it's applied
    world.beforeEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurtBefore(event);
    });
    
    console.warn('[CombatDamageModifierHandler] Initialized');
  }

  private static loadDamageModifierItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.damageModifierItems.set(item.itemId, item.config || {});
      
      const dmg = item.config?.damage ?? 'default';
      const mult = item.config?.damageMultiplier ?? 1;
      console.warn(`[CombatDamageModifierHandler] ${item.itemId}: damage=${dmg}, multiplier=${mult}x`);
    }
  }

  private static handleEntityHurtBefore(event: EntityHurtBeforeEvent): void {
    try {
      const { hurtEntity, damageSource, damage } = event;
      
      // Check if damage source is an entity
      const attacker = damageSource.damagingEntity;
      if (!attacker) {
        return;
      }
      
      // Get attacker's inventory (works for any entity with inventory component)
      const inventory = attacker.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Get held item (for players, use selectedSlotIndex; for mobs, use slot 0)
      let heldItem;
      if (attacker.typeId === 'minecraft:player') {
        const player = attacker as any;
        heldItem = container.getItem(player.selectedSlotIndex);
      } else {
        // For non-player entities, check first slot (main hand)
        heldItem = container.getItem(0);
      }
      
      if (!heldItem) return;
      
      const itemId = heldItem.typeId;
      
      // Check if item has combat damage modifier
      const config = this.damageModifierItems.get(itemId);
      if (!config) {
        return;
      }
      
      // Get entity tags for condition evaluation (from actual entity component)
      const entityFamilies = this.getEntityFamilies(hurtEntity);
      
      // Create evaluation context
      const evalContext: EvaluationContext = {
        context: AttributeContext.COMBAT,
        entityTypeId: hurtEntity.typeId,
        entityFamilies: entityFamilies
      };
      
      // Check if attribute is active
      if (!AttributeConditionEvaluator.isActive(config as any, evalContext)) {
        return;
      }
      
      // Calculate modified damage
      let modifiedDamage = damage;
      
      // Override damage if specified
      if (config.damage !== undefined) {
        modifiedDamage = config.damage;
      }
      
      // Apply multiplier if specified
      if (config.damageMultiplier !== undefined) {
        modifiedDamage *= config.damageMultiplier;
      }
      
      // Modify damage BEFORE it's applied (this is the key difference from afterEvents)
      if (modifiedDamage !== damage) {
        event.damage = modifiedDamage;
        console.warn(`[CombatDamageModifierHandler] ${itemId} damage: ${damage} -> ${modifiedDamage}`);
      }
      
    } catch (error) {
      console.warn('[CombatDamageModifierHandler] Error in entity hurt before handler:', error);
    }
  }

  /**
   * Get entity families/tags for condition evaluation
   * Reads from entity's actual tags via Script API
   */
  private static getEntityFamilies(entity: any): string[] {
    try {
      // Use Script API to get actual entity tags
      return entity.getTags();
    } catch (error) {
      console.warn('[CombatDamageModifierHandler] Error getting entity tags:', error);
      return [];
    }
  }
}
