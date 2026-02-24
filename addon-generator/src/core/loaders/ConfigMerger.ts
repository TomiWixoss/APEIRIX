import { ContentConfig } from '../types/ConfigTypes.js';
import { EntityNormalizer } from './EntityNormalizer.js';

/**
 * Merge multiple configs together
 */
export class ConfigMerger {
  /**
   * Merge two configs together
   * Auto-detect single entity files và convert thành array
   */
  static merge(base: ContentConfig, imported: ContentConfig): ContentConfig {
    // Auto-detect single entity files (không có array, chỉ có properties trực tiếp)
    const importedNormalized = EntityNormalizer.normalize(imported);
    
    return {
      ...base,
      addon: base.addon || importedNormalized.addon,
      icons: base.icons || importedNormalized.icons,
      items: [...(base.items || []), ...(importedNormalized.items || [])],
      foods: [...(base.foods || []), ...(importedNormalized.foods || [])],
      blocks: [...(base.blocks || []), ...(importedNormalized.blocks || [])],
      ores: [...(base.ores || []), ...(importedNormalized.ores || [])],
      tools: [...(base.tools || []), ...(importedNormalized.tools || [])],
      armor: [...(base.armor || []), ...(importedNormalized.armor || [])],
      recipes: [...(base.recipes || []), ...(importedNormalized.recipes || [])]
    };
  }

  /**
   * Merge test commands into items and foods
   */
  static mergeTestCommands(config: ContentConfig, testsConfig: ContentConfig): void {
    // Merge testCommands cho items
    if (testsConfig.items && config.items) {
      testsConfig.items.forEach(testItem => {
        const item = config.items!.find(i => i.id === testItem.id);
        if (item && testItem.testCommands) {
          item.testCommands = testItem.testCommands;
        }
      });
    }
    
    // Merge testCommands cho foods
    if (testsConfig.foods && config.foods) {
      testsConfig.foods.forEach(testFood => {
        const food = config.foods!.find(f => f.id === testFood.id);
        if (food && testFood.testCommands) {
          food.testCommands = testFood.testCommands;
        }
      });
    }
  }
}
