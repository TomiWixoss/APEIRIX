/**
 * Placeholder Registry
 * 
 * Central registry for all placeholder processors
 * Handlers self-register during initialization to avoid circular dependencies
 */

import { PlaceholderProcessor } from './PlaceholderProcessor';
import { AttributeLabelPlaceholder } from './AttributeLabelPlaceholder';
import { getItemAttributes } from '../../../data/GeneratedAttributes';
import { AttributeResolver } from '../../attributes/AttributeResolver';
import { LangManager } from '../../../lang/LangManager';

// Import all attribute handlers (static)
import { RequiresToolHandler } from '../../attributes/handlers/RequiresToolHandler';
import { BreakableHandler } from '../../attributes/handlers/BreakableHandler';
import { DurabilityModifierHandler } from '../../attributes/handlers/DurabilityModifierHandler';
import { CombatDamageModifierHandler } from '../../attributes/handlers/CombatDamageModifierHandler';
import { HammerMiningHandler } from '../../attributes/handlers/HammerMiningHandler';
import { UndeadSlayerHandler } from '../../attributes/handlers/UndeadSlayerHandler';
import { RustMiteEdibleHandler } from '../../attributes/handlers/RustMiteEdibleHandler';
import { EmptyHandCombatHandler } from '../../attributes/handlers/EmptyHandCombatHandler';

// Type for handlers with lore processing
type AttributeHandler = {
  ATTRIBUTE_ID: string;
  processLorePlaceholders?: (itemId: string, line: string, itemStack?: any) => string;
  getDynamicPlaceholders?: () => string[]; // NEW: Export dynamic placeholders
};

export class PlaceholderRegistry {
  private static processors: PlaceholderProcessor[] = [];
  private static attributeHandlers: Map<string, AttributeHandler> = new Map();
  private static initialized = false;
  
  // Static handler map (all handlers imported at compile time)
  private static readonly HANDLER_MAP = new Map<string, any>([
    ['requires_tool', RequiresToolHandler],
    ['breakable', BreakableHandler],
    ['durability_modifier', DurabilityModifierHandler],
    ['combat_damage_modifier', CombatDamageModifierHandler],
    ['hammer_mining', HammerMiningHandler],
    ['undead_slayer', UndeadSlayerHandler],
    ['rust_mite_edible', RustMiteEdibleHandler],
    ['empty_hand_combat', EmptyHandCombatHandler],
  ]);
  
  /**
   * Initialize registry with core processors
   */
  static initialize(): void {
    if (this.initialized) return;
    
    // Register attribute label processor (must run FIRST)
    this.register(new AttributeLabelPlaceholder());
    
    this.initialized = true;
    
    console.warn(`[PlaceholderRegistry] Initialized with ${this.processors.length} processors`);
  }
  
  /**
   * Register a placeholder processor
   */
  static register(processor: PlaceholderProcessor): void {
    this.processors.push(processor);
  }
  
  /**
   * Register an attribute handler for lore processing
   * Called by handlers during their initialization
   */
  static registerAttributeHandler(handler: AttributeHandler): void {
    if (!this.initialized) {
      this.initialize();
    }
    
    if (handler.ATTRIBUTE_ID && typeof handler.processLorePlaceholders === 'function') {
      this.attributeHandlers.set(handler.ATTRIBUTE_ID, handler);
      console.warn(`[PlaceholderRegistry] Registered handler: ${handler.ATTRIBUTE_ID}`);
    }
  }
  
  /**
   * Get all dynamic placeholders from registered handlers
   * Dynamic placeholders = change at runtime (require ItemStack to resolve)
   * 
   * @returns Array of dynamic placeholder strings (e.g., ['{current_durability}', '{damageMultiplier}'])
   */
  static getAllDynamicPlaceholders(): string[] {
    const placeholders: string[] = [];
    
    for (const handler of this.attributeHandlers.values()) {
      if (typeof handler.getDynamicPlaceholders === 'function') {
        const handlerPlaceholders = handler.getDynamicPlaceholders();
        placeholders.push(...handlerPlaceholders);
      }
    }
    
    return placeholders;
  }
  
  /**
   * Process lore template with all registered processors + attribute handlers
   * @param itemId Full item ID
   * @param loreTemplate Array of lore lines with placeholders
   * @param itemStack Optional ItemStack for dynamic placeholder values (durability, damage, etc.)
   * @returns Processed lore with placeholders replaced
   */
  static process(itemId: string, loreTemplate: string[], itemStack?: any): string[] {
    if (!this.initialized) {
      this.initialize();
    }
    
    const processed: string[] = [];
    
    for (const line of loreTemplate) {
      let processedLine = line;
      
      // Run through placeholder processors first (for {attr:*})
      for (const processor of this.processors) {
        processedLine = processor.process(itemId, processedLine);
      }
      
      // Run through attribute handlers for value placeholders
      // Get item attributes to find which handlers to use
      const attributes = getItemAttributes(itemId);
      if (attributes && attributes.length > 0) {
        for (const attrId of attributes) {
          const handler = this.attributeHandlers.get(attrId);
          if (handler && handler.processLorePlaceholders) {
            // Pass itemStack to handler for dynamic values
            processedLine = handler.processLorePlaceholders(itemId, processedLine, itemStack);
          }
        }
      }
      
      processed.push(processedLine);
    }
    
    return processed;
  }
  
  /**
   * Generate lore from attributes only (for items without lore template)
   * Auto-generates lore lines from all attributes on the item
   * 
   * SIMPLE APPROACH: Plain text only (no encoding)
   * 
   * @param itemStack ItemStack to generate lore for
   * @returns Array of lore lines (plain text)
   */
  static generateAttributeLore(itemStack: any): string[] {
    if (!this.initialized) {
      this.initialize();
    }
    
    const lore: string[] = [];
    const itemId = itemStack.typeId;
    
    console.warn(`[PlaceholderRegistry] generateAttributeLore for ${itemId}`);
    
    // Get all attributes for this item (via AttributeResolver)
    // AttributeResolver already checks correct registries based on item type
    const resolved = AttributeResolver.resolve(itemStack);
    const attributes = resolved.map((a: any) => ({ id: a.id, config: a.config }));
    
    console.warn(`[PlaceholderRegistry] Resolved attributes:`, attributes.map((a: any) => a.id));
    
    if (!attributes || attributes.length === 0) {
      console.warn(`[PlaceholderRegistry] No attributes found`);
      return lore; // No attributes
    }
    
    // For each attribute, generate lore line (PLAIN TEXT, no encoding)
    for (const attr of attributes) {
      const HandlerClass = this.HANDLER_MAP.get(attr.id);
      if (!HandlerClass) {
        console.warn(`[PlaceholderRegistry] No handler found for ${attr.id}`);
        continue;
      }
      
      // Get lore template key from handler
      const templateKey = HandlerClass.getLoreTemplateKey?.();
      if (!templateKey) {
        console.warn(`[PlaceholderRegistry] No template key for ${attr.id}`);
        continue;
      }
      
      console.warn(`[PlaceholderRegistry] Template key for ${attr.id}: ${templateKey}`);
      
      // Get template from lang system
      const template = LangManager.get(`attributes.${templateKey}`);
      if (!template) {
        console.warn(`[PlaceholderRegistry] No template found for attributes.${templateKey}`);
        continue;
      }
      
      console.warn(`[PlaceholderRegistry] Template: ${template}`);
      
      // Process template with handler's placeholder processor
      let visibleText: string;
      if (HandlerClass.processLorePlaceholders) {
        // Pass config directly via a mock object with the config
        const mockItemWithConfig = {
          ...itemStack,
          _attributeConfig: attr.config  // Inject config for handler
        };
        visibleText = HandlerClass.processLorePlaceholders(itemId, template, mockItemWithConfig);
        console.warn(`[PlaceholderRegistry] Processed line: ${visibleText}`);
      } else {
        console.warn(`[PlaceholderRegistry] No placeholder processor, using raw template`);
        visibleText = template;
      }
      
      // Add PLAIN TEXT (no encoding)
      lore.push(visibleText);
    }
    
    console.warn(`[PlaceholderRegistry] Final lore (${lore.length} lines):`, lore);
    
    return lore;
  }

}
