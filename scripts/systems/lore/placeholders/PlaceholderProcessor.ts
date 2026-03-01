/**
 * Base interface for lore placeholder processors
 * 
 * Each processor handles specific placeholders in lore text
 */

export interface PlaceholderProcessor {
  /**
   * Process a line of lore text, replacing placeholders with actual values
   * @param itemId Full item ID (e.g., "apeirix:tin_ingot" or "minecraft:wooden_pickaxe")
   * @param line Line of lore text with placeholders
   * @returns Processed line with placeholders replaced
   */
  process(itemId: string, line: string): string;
  
  /**
   * Get list of placeholders this processor handles
   * Used for documentation and debugging
   */
  getPlaceholders(): string[];
}
