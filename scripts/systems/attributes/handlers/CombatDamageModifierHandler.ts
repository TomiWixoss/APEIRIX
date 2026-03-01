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

import { world, system, EntityHurtBeforeEvent } from '@minecraft/server';
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
      
      // Check if damage source is a player
      const attacker = damageSource.damagingEntity;
      if (!attacker || attacker.typeId !== 'minecraft:player') {
        return;
      }
      
      // Cast to Player to access selectedSlotIndex
      const player = attacker as any; // Player type
      
      // Get attacker's held item
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      const heldItem = container.getItem(player.selectedSlotIndex);
      if (!heldItem) return;
      
      const itemId = heldItem.typeId;
      
      // Check if item has combat damage modifier
      const config = this.damageModifierItems.get(itemId);
      if (!config) {
        return;
      }
      
      // Get entity families for condition evaluation
      const entityFamilies = this.getEntityFamilies(hurtEntity.typeId);
      
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
   * Get entity families for condition evaluation
   */
  private static getEntityFamilies(entityTypeId: string): string[] {
    const families: string[] = [];
    
    // Undead family
    if (entityTypeId.includes('zombie') || entityTypeId.includes('skeleton') || 
        entityTypeId.includes('wither') || entityTypeId.includes('phantom')) {
      families.push('undead');
    }
    
    // Monster family
    if (entityTypeId.includes('creeper') || entityTypeId.includes('spider') || 
        entityTypeId.includes('enderman') || entityTypeId.includes('zombie') ||
        entityTypeId.includes('skeleton')) {
      families.push('monster');
    }
    
    // Animal family
    if (entityTypeId.includes('cow') || entityTypeId.includes('pig') || 
        entityTypeId.includes('sheep') || entityTypeId.includes('chicken')) {
      families.push('animal');
    }
    
    return families;
  }
}
