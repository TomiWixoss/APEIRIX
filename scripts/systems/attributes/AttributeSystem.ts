/**
 * AttributeSystem - Core system for managing entity/item attributes
 * 
 * YAML-DRIVEN: Attributes được định nghĩa trong field `attributes` của YAML configs
 * Generated data: GENERATED_ATTRIBUTES trong GeneratedAttributes.ts
 * 
 * Architecture:
 * - AttributeSystem: Core system, load attributes và initialize handlers
 * - Handlers: Mỗi attribute type có 1 handler riêng (RustMiteEdibleHandler, HammerMiningHandler, etc.)
 */

import { GENERATED_ATTRIBUTES, hasAttribute, getItemsWithAttribute } from '../../data/GeneratedAttributes';
import { RustMiteEdibleHandler } from './handlers/RustMiteEdibleHandler';
import { HammerMiningHandler } from './handlers/HammerMiningHandler';
import { UndeadSlayerHandler } from './handlers/UndeadSlayerHandler';
import { BreakableHandler } from './handlers/BreakableHandler';
import { DurabilityModifierHandler } from './handlers/DurabilityModifierHandler';
import { CombatDamageModifierHandler } from './handlers/CombatDamageModifierHandler';
import { RequiresToolHandler } from './handlers/RequiresToolHandler';
import { EmptyHandCombatHandler } from './handlers/EmptyHandCombatHandler';
import { LoreRefreshSystem } from '../lore/LoreRefreshSystem';

export class AttributeSystem {
  private static initialized = false;

  /**
   * Initialize attribute system và tất cả handlers
   */
  static initialize(): void {
    if (this.initialized) {
      console.warn('[AttributeSystem] Already initialized, skipping...');
      return;
    }

    console.warn('[AttributeSystem] Initializing...');
    
    // Log loaded attributes
    const attributeCount = Object.keys(GENERATED_ATTRIBUTES).length;
    const totalItems = Object.values(GENERATED_ATTRIBUTES).reduce((sum, items) => sum + items.length, 0);
    console.warn(`[AttributeSystem] Loaded ${attributeCount} attributes for ${totalItems} items`);
    
    // Initialize lore refresh system FIRST
    LoreRefreshSystem.initialize();
    
    // Initialize handlers
    RustMiteEdibleHandler.initialize();
    HammerMiningHandler.initialize();
    UndeadSlayerHandler.initialize();
    BreakableHandler.initialize();
    DurabilityModifierHandler.initialize();
    CombatDamageModifierHandler.initialize();
    RequiresToolHandler.initialize();
    EmptyHandCombatHandler.initialize();
    
    this.initialized = true;
    console.warn('[AttributeSystem] Initialized');
  }

  /**
   * Check if item has specific attribute
   */
  static hasAttribute(itemId: string, attributeId: string): boolean {
    return hasAttribute(itemId, attributeId);
  }

  /**
   * Get all items with specific attribute
   */
  static getItemsWithAttribute(attributeId: string): string[] {
    return getItemsWithAttribute(attributeId);
  }
}
