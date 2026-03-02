/**
 * ArmorDamageMultiplierHandler - Modify incoming damage when wearing armor
 * 
 * SINGLE SOURCE OF TRUTH for 'armor_damage_multiplier' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * Armor với attribute 'armor_damage_multiplier' sẽ:
 * - Tăng/giảm sát thương nhận vào khi mặc giáp
 * - Multipliers từ nhiều món giáp sẽ nhân với nhau
 * 
 * Config:
 * - damageMultiplier: 1.5 (nhận 150% damage, tức +50% đau hơn)
 * 
 * Example: Wooden armor với damageMultiplier: 1.5
 * - Mặc 1 món: 1.5x damage
 * - Mặc 2 món: 1.5 * 1.5 = 2.25x damage
 * - Mặc full bộ: 1.5^4 = 5.06x damage
 */

import { world, EntityHurtBeforeEvent, ItemStack, system, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';
import { AttributeResolver } from '../AttributeResolver';

interface ArmorDamageConfig {
  damageMultiplier?: number;
}

export class ArmorDamageMultiplierHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'armor_damage_multiplier';
  static readonly TEMPLATE_KEY = 'armor_damage_multiplier_template';
  
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
   * Replaces: {damage_multiplier}
   * 
   * DYNAMIC: Uses AttributeResolver to get resolved config (static + dynamic)
   */
  static processLorePlaceholders(itemId: string, line: string, itemStack?: ItemStack): string {
    let config: any;
    
    // If itemStack provided, resolve dynamic attributes
    if (itemStack) {
      const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID, system.currentTick);
      config = resolved?.config;
    } else {
      // Fallback to static config (for compile-time generation)
      config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    }
    
    if (config?.damageMultiplier !== undefined) {
      return line.replace(/{damage_multiplier}/g, config.damageMultiplier.toString());
    }
    
    return line;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static armorDamageItems = new Map<string, ArmorDamageConfig>();

  static initialize(): void {
    console.warn('[ArmorDamageMultiplierHandler] Initializing...');
    
    // Register with PlaceholderRegistry for lore processing
    PlaceholderRegistry.registerAttributeHandler(this);
    
    // Load armor damage multiplier items from attributes
    this.loadArmorDamageItems();
    
    console.warn(`[ArmorDamageMultiplierHandler] Loaded ${this.armorDamageItems.size} armor damage multiplier items`);
    
    // Listen to entity hurt BEFORE events - allows modifying damage before it's applied
    world.beforeEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurtBefore(event);
    });
    
    console.warn('[ArmorDamageMultiplierHandler] Initialized');
  }

  private static loadArmorDamageItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.armorDamageItems.set(item.itemId, item.config || {});
      
      const mult = item.config?.damageMultiplier ?? 1;
      console.warn(`[ArmorDamageMultiplierHandler] ${item.itemId}: multiplier=${mult}x`);
    }
  }

  private static handleEntityHurtBefore(event: EntityHurtBeforeEvent): void {
    try {
      const { hurtEntity, damage } = event;
      
      // Get entity's equipment component
      const equipment = hurtEntity.getComponent('minecraft:equippable') as EntityEquippableComponent;
      if (!equipment) return;
      
      // Check all armor slots for damage multiplier attribute
      let totalMultiplier = 1.0;
      const armorSlots: EquipmentSlot[] = [
        EquipmentSlot.Head,
        EquipmentSlot.Chest,
        EquipmentSlot.Legs,
        EquipmentSlot.Feet
      ];
      
      for (const slot of armorSlots) {
        const armorItem = equipment.getEquipment(slot);
        if (!armorItem) continue;
        
        // DYNAMIC: Resolve attributes from ItemStack
        const resolved = AttributeResolver.getAttribute(armorItem, this.ATTRIBUTE_ID, system.currentTick);
        if (!resolved) continue;
        
        const config = resolved.config;
        
        // Apply multiplier (stack multiplicatively)
        if (config.damageMultiplier !== undefined) {
          totalMultiplier *= config.damageMultiplier;
          console.warn(`[ArmorDamageMultiplierHandler] ${armorItem.typeId} (${slot}): ${config.damageMultiplier}x`);
        }
      }
      
      // Apply total multiplier if different from 1.0
      if (totalMultiplier !== 1.0) {
        const modifiedDamage = damage * totalMultiplier;
        event.damage = modifiedDamage;
        console.warn(`[ArmorDamageMultiplierHandler] Total multiplier: ${totalMultiplier}x, damage: ${damage} -> ${modifiedDamage}`);
      }
      
    } catch (error) {
      console.warn('[ArmorDamageMultiplierHandler] Error in entity hurt before handler:', error);
    }
  }
}
