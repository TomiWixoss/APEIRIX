/**
 * AttributeTypes - Type definitions for conditional attribute system
 * 
 * Supports:
 * - Context-aware attributes (mining, combat)
 * - Conditional activation (block tags, entity families)
 * - Attribute stacking
 */

/**
 * Attribute context - when the attribute is active
 */
export enum AttributeContext {
  MINING = 'mining',    // Active when breaking blocks
  COMBAT = 'combat',    // Active when attacking entities
  ALWAYS = 'always'     // Always active (default)
}

/**
 * Condition for attribute activation
 */
export interface AttributeCondition {
  // Mining context conditions
  blockTags?: string[];      // Block must have one of these tags (e.g., ['ore', 'stone'])
  blockIds?: string[];       // Block must be one of these IDs
  
  // Combat context conditions
  entityFamilies?: string[]; // Entity must have one of these families (e.g., ['undead', 'zombie'])
  entityTypes?: string[];    // Entity must be one of these types
}

/**
 * Attribute configuration with context and conditions
 */
export interface AttributeConfig {
  context?: AttributeContext;  // When attribute is active (default: ALWAYS)
  value?: number;              // Attribute value (percentage, multiplier, etc.)
  conditions?: AttributeCondition; // Activation conditions
  
  // Legacy support for existing attributes
  [key: string]: any;          // Allow arbitrary config fields
}

/**
 * Item with attribute data
 */
export interface AttributeItemData {
  itemId: string;
  config?: AttributeConfig;
}

/**
 * Attribute mapping: attributeId -> items with that attribute
 */
export interface AttributeMapping {
  [attributeId: string]: AttributeItemData[];
}

/**
 * Evaluation context for checking attribute conditions
 */
export interface EvaluationContext {
  context: AttributeContext;
  
  // Mining context data
  blockId?: string;
  blockTags?: string[];
  
  // Combat context data
  entityTypeId?: string;
  entityFamilies?: string[];
}
