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

import { world, system, EntityHurtAfterEvent } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';

interface CombatDamageConfig {
  context?: AttributeContext | string;
  damage?: number;
  damageMultiplier?: number;
  conditions?: any;
}

interface DamageRecord {
  actualDamage: number;
  timestamp: number;
  shouldCancel: boolean;
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
  
  private static readonly I_FRAME_DELAY = 11; // Delay sau i-frame window
  private static readonly HISTORY_CLEANUP_INTERVAL = 6000;
  private static readonly HISTORY_MAX_AGE = 200;
  
  private static damageModifierItems = new Map<string, CombatDamageConfig>();
  private static damageHistory = new Map<string, DamageRecord>();

  static initialize(): void {
    console.warn('[CombatDamageModifierHandler] Initializing...');
    
    // Load combat damage modifier items from attributes
    this.loadDamageModifierItems();
    
    console.warn(`[CombatDamageModifierHandler] Loaded ${this.damageModifierItems.size} combat damage modifier items`);
    
    // Listen to entity hurt events
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    // Periodic cleanup
    system.runInterval(() => {
      this.cleanupDamageHistory();
    }, this.HISTORY_CLEANUP_INTERVAL);
    
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

  private static handleEntityHurt(event: EntityHurtAfterEvent): void {
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
      
      // If damage is reduced, heal the entity to compensate
      const damageReduction = damage - modifiedDamage;
      if (damageReduction > 0) {
        // Record damage for delayed healing
        const recordKey = `${hurtEntity.id}_${Date.now()}`;
        this.damageHistory.set(recordKey, {
          actualDamage: damage,
          timestamp: system.currentTick,
          shouldCancel: true
        });
        
        // Heal after i-frame delay
        system.runTimeout(() => {
          this.applyDamageModification(hurtEntity, damageReduction);
        }, this.I_FRAME_DELAY);
        
        console.warn(`[CombatDamageModifierHandler] ${itemId} damage: ${damage} -> ${modifiedDamage} (reduction: ${damageReduction})`);
      }
      
    } catch (error) {
      console.warn('[CombatDamageModifierHandler] Error in entity hurt handler:', error);
    }
  }

  private static applyDamageModification(entity: any, healAmount: number): void {
    try {
      // Safety checks
      if (!entity || !entity.isValid()) {
        return;
      }
      
      const health = entity.getComponent('minecraft:health');
      if (!health) {
        return;
      }
      
      // Heal to compensate for damage reduction
      const newHealth = Math.min(health.currentValue + healAmount, health.effectiveMax);
      health.setCurrentValue(newHealth);
      
      console.warn(`[CombatDamageModifierHandler] Healed ${entity.typeId} by ${healAmount} (${health.currentValue}/${health.effectiveMax})`);
      
    } catch (error) {
      console.warn('[CombatDamageModifierHandler] Error applying damage modification:', error);
    }
  }

  private static cleanupDamageHistory(): void {
    const currentTick = system.currentTick;
    const toDelete: string[] = [];
    
    for (const [key, record] of this.damageHistory.entries()) {
      if (currentTick - record.timestamp > this.HISTORY_MAX_AGE) {
        toDelete.push(key);
      }
    }
    
    for (const key of toDelete) {
      this.damageHistory.delete(key);
    }
    
    if (toDelete.length > 0) {
      console.warn(`[CombatDamageModifierHandler] Cleaned up ${toDelete.length} old damage records`);
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
