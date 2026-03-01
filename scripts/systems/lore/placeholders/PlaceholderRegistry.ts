/**
 * Placeholder Registry
 * 
 * Central registry for all placeholder processors
 * Handlers self-register during initialization to avoid circular dependencies
 */

import { PlaceholderProcessor } from './PlaceholderProcessor';
import { AttributeLabelPlaceholder } from './AttributeLabelPlaceholder';
import { getItemAttributes } from '../../../data/GeneratedAttributes';

// Type for handlers with lore processing
type AttributeHandler = {
  ATTRIBUTE_ID: string;
  processLorePlaceholders?: (itemId: string, line: string, itemStack?: any) => string;
};

export class PlaceholderRegistry {
  private static processors: PlaceholderProcessor[] = [];
  private static attributeHandlers: Map<string, AttributeHandler> = new Map();
  private static initialized = false;
  
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
  

}
