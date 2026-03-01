/**
 * Placeholder Registry
 * 
 * Central registry for all placeholder processors
 * Auto-discovers attribute handlers via imports
 */

import { PlaceholderProcessor } from './PlaceholderProcessor';
import { AttributeLabelPlaceholder } from './AttributeLabelPlaceholder';
import { getItemAttributes } from '../../../data/GeneratedAttributes';

// Auto-import all attribute handlers
import { BreakableHandler } from '../../attributes/handlers/BreakableHandler';
import { DurabilityModifierHandler } from '../../attributes/handlers/DurabilityModifierHandler';
import { CombatDamageModifierHandler } from '../../attributes/handlers/CombatDamageModifierHandler';
import { UndeadSlayerHandler } from '../../attributes/handlers/UndeadSlayerHandler';
import { HammerMiningHandler } from '../../attributes/handlers/HammerMiningHandler';
import { RustMiteEdibleHandler } from '../../attributes/handlers/RustMiteEdibleHandler';

// Registry of all attribute handlers
// Convention: Each handler must have ATTRIBUTE_ID
// Optional: processLorePlaceholders() method for lore generation
const ATTRIBUTE_HANDLERS = [
  BreakableHandler,
  DurabilityModifierHandler,
  CombatDamageModifierHandler,
  UndeadSlayerHandler,
  HammerMiningHandler,
  RustMiteEdibleHandler,
] as const;

// Type for handlers with lore processing
type AttributeHandler = {
  ATTRIBUTE_ID: string;
  processLorePlaceholders?: (itemId: string, line: string) => string;
};

export class PlaceholderRegistry {
  private static processors: PlaceholderProcessor[] = [];
  private static initialized = false;
  
  /**
   * Initialize registry with all processors
   */
  static initialize(): void {
    if (this.initialized) return;
    
    // Register attribute label processor (must run FIRST)
    this.register(new AttributeLabelPlaceholder());
    
    this.initialized = true;
    
    console.warn(`[PlaceholderRegistry] Initialized with ${this.processors.length} processors + ${ATTRIBUTE_HANDLERS.length} attribute handlers`);
  }
  
  /**
   * Register a placeholder processor
   */
  static register(processor: PlaceholderProcessor): void {
    this.processors.push(processor);
  }
  
  /**
   * Process lore template with all registered processors + attribute handlers
   * @param itemId Full item ID
   * @param loreTemplate Array of lore lines with placeholders
   * @returns Processed lore with placeholders replaced
   */
  static process(itemId: string, loreTemplate: string[]): string[] {
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
      // Only process handlers for attributes this item actually has
      const itemAttributes = getItemAttributes(itemId);
      for (const handler of ATTRIBUTE_HANDLERS) {
        const h = handler as unknown as AttributeHandler;
        
        // Check if item has this attribute
        if (itemAttributes.includes(h.ATTRIBUTE_ID)) {
          // Check if handler has lore processing method (some handlers are runtime-only)
          if (h.processLorePlaceholders) {
            processedLine = h.processLorePlaceholders(itemId, processedLine);
          }
        }
      }
      
      processed.push(processedLine);
    }
    
    return processed;
  }
  

}
