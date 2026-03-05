/**
 * Attribute Label Placeholder Processor
 * 
 * Handles:
 * - {attr:attribute_name} - Load attribute label from lang (e.g., {attr:breakable} → "§cGẫy")
 * 
 * Labels are defined in configs/script-lang/{lang}/attributes.yaml
 */

import { PlaceholderProcessor } from './PlaceholderProcessor';
import { LangManager } from '../../../lang/LangManager';

export class AttributeLabelPlaceholder implements PlaceholderProcessor {
  process(itemId: string, line: string): string {
    // Match all {attr:*} placeholders
    const regex = /{attr:(\w+)}/g;
    
    return line.replace(regex, (match, attrName) => {
      // Get label from lang system
      const label = LangManager.get(`attributes.${attrName}`);
      
      // If not found, return the attribute name as fallback
      if (label === `attributes.${attrName}`) {
        return attrName;
      }
      
      return label;
    });
  }
  
  getPlaceholders(): string[] {
    return ['{attr:*}'];
  }
}
