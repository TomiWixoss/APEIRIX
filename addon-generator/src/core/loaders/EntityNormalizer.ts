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
      // Detect entity type dựa vào fields
      if (config.nutrition !== undefined) {
        // Food entity
        normalized.foods = [config];
      } else if (config.type && ['pickaxe', 'axe', 'shovel', 'hoe', 'sword', 'spear'].includes(config.type)) {
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
      
      // Fix texture paths: ../../../../assets/ → ../assets/
      // (vì AssetCopier resolve từ main config location)
      this.fixTexturePaths(config);
      
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

  /**
   * Fix texture paths for entity
   */
  private static fixTexturePaths(entity: any): void {
    if (entity.texture) {
      entity.texture = entity.texture.replace(/^(\.\.\/)+assets\//, '../assets/');
    }
    if (entity.texturePath) {
      entity.texturePath = entity.texturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
    }
    if (entity.deepslateTexturePath) {
      entity.deepslateTexturePath = entity.deepslateTexturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
    }
    if (entity.armorLayerTexturePath) {
      entity.armorLayerTexturePath = entity.armorLayerTexturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
    }
  }
}
