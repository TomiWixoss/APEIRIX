/**
 * AttributeConditionEvaluator - Evaluate attribute conditions
 * 
 * Determines if an attribute should be active based on:
 * - Context (mining, combat, always)
 * - Conditions (block tags, entity families, etc.)
 */

import { AttributeContext, AttributeConfig, AttributeCondition, EvaluationContext } from './types/AttributeTypes';

export class AttributeConditionEvaluator {
  /**
   * Check if attribute is active in given context
   */
  static isActive(attributeConfig: AttributeConfig | undefined, evalContext: EvaluationContext): boolean {
    // No config = always active (backward compatibility)
    if (!attributeConfig) {
      return true;
    }
    
    // Check context match
    const attrContext = attributeConfig.context || AttributeContext.ALWAYS;
    
    // ALWAYS context = always active
    if (attrContext === AttributeContext.ALWAYS) {
      return true;
    }
    
    // Context must match
    if (attrContext !== evalContext.context) {
      return false;
    }
    
    // No conditions = active in matching context
    if (!attributeConfig.conditions) {
      return true;
    }
    
    // Evaluate conditions based on context
    return this.evaluateConditions(attributeConfig.conditions, evalContext);
  }
  
  /**
   * Evaluate conditions against context
   */
  private static evaluateConditions(conditions: AttributeCondition, evalContext: EvaluationContext): boolean {
    // Mining context conditions
    if (evalContext.context === AttributeContext.MINING) {
      // Check block tags
      if (conditions.blockTags && conditions.blockTags.length > 0) {
        if (!evalContext.blockTags || evalContext.blockTags.length === 0) {
          return false;
        }
        
        // Block must have at least one matching tag
        const hasMatchingTag = conditions.blockTags.some(tag => 
          evalContext.blockTags!.includes(tag)
        );
        
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Check block IDs
      if (conditions.blockIds && conditions.blockIds.length > 0) {
        if (!evalContext.blockId) {
          return false;
        }
        
        // Block must match one of the IDs
        if (!conditions.blockIds.includes(evalContext.blockId)) {
          return false;
        }
      }
    }
    
    // Combat context conditions
    if (evalContext.context === AttributeContext.COMBAT) {
      // Check entity families
      if (conditions.entityFamilies && conditions.entityFamilies.length > 0) {
        if (!evalContext.entityFamilies || evalContext.entityFamilies.length === 0) {
          return false;
        }
        
        // Entity must have at least one matching family
        const hasMatchingFamily = conditions.entityFamilies.some(family => 
          evalContext.entityFamilies!.includes(family)
        );
        
        if (!hasMatchingFamily) {
          return false;
        }
      }
      
      // Check entity types
      if (conditions.entityTypes && conditions.entityTypes.length > 0) {
        if (!evalContext.entityTypeId) {
          return false;
        }
        
        // Entity must match one of the types
        if (!conditions.entityTypes.includes(evalContext.entityTypeId)) {
          return false;
        }
      }
    }
    
    // All conditions passed
    return true;
  }
  
  /**
   * Get attribute value if active, otherwise 0
   */
  static getValue(attributeConfig: AttributeConfig | undefined, evalContext: EvaluationContext): number {
    if (!this.isActive(attributeConfig, evalContext)) {
      return 0;
    }
    
    return attributeConfig?.value ?? 0;
  }
  
  /**
   * Stack multiple attribute values (for items with same attribute)
   * Returns sum of all active attribute values
   */
  static stackValues(attributeConfigs: AttributeConfig[], evalContext: EvaluationContext): number {
    return attributeConfigs.reduce((sum, config) => {
      return sum + this.getValue(config, evalContext);
    }, 0);
  }
}
