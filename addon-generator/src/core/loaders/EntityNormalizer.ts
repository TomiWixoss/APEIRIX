import { ContentConfig } from '../types/ConfigTypes.js';

/**
 * Normalize single entity files to array format
 * Detects if a file contains a single entity (has 'id' field) and converts to array
 */
export class EntityNormalizer {
  /**
   * Normalize single entity file thành array format
   * Detect nếu file chỉ chứa 1 entity (có id field) thay vì array
   */
  static normalize(config: any): ContentConfig {
    const normalized: ContentConfig = {};
    
    // Nếu có 'id' field ở root level → đây là single entity file
    if (config.id) {
      // Check if this is a test-only file (only has id + testCommands)
      const keys = Object.keys(config);
      const isTestOnly = keys.length <= 3 && // id, testCommands, và có thể _sourcePath
        keys.includes('id') && 
        keys.includes('testCommands') &&
        !config.name && 
        !config.texture;
      
      if (isTestOnly) {
        // Test-only file - don't classify into any category
        // Just return it as-is for mergeTestCommands to handle
        normalized.items = [config]; // Temporary classification for mergeTestCommands
        return normalized;
      }
      
      // Detect entity type dựa vào fields
      if (config.nutrition !== undefined) {
        // Food entity
        normalized.foods = [config];
      } else if (config.type && ['pickaxe', 'axe', 'shovel', 'hoe', 'sword', 'spear', 'hammer'].includes(config.type)) {
        // Tool entity
        normalized.tools = [config];
      } else if (config.type && ['helmet', 'chestplate', 'leggings', 'boots'].includes(config.type)) {
        // Armor entity
        normalized.armor = [config];
      } else if (config.texturePath || config.deepslateTexturePath) {
        // Ore entity (có texturePath thay vì texture)
        normalized.ores = [config];
      } else if (config.destroyTime !== undefined || config.explosionResistance !== undefined) {
        // Block entity
        normalized.blocks = [config];
      } else {
        // Default: Item entity
        normalized.items = [config];
      }
      
      // Extract recipe nếu có (single recipe in entity file)
      if (config.recipe) {
        normalized.recipes = [config.recipe];
      }
      
      // Extract recipes nếu có (multiple recipes in entity file)
      if (config.recipes && Array.isArray(config.recipes)) {
        normalized.recipes = [...(normalized.recipes || []), ...config.recipes];
      }
    } else {
      // Normal array format, return as-is
      return config as ContentConfig;
    }
    
    return normalized;
  }
}
