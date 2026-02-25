import { ContentConfig } from '../types/ConfigTypes.js';
import { EntityNormalizer } from './EntityNormalizer.js';

/**
 * Merge multiple configs together
 */
export class ConfigMerger {
  /**
   * Merge two configs together
   * Auto-detect single entity files và convert thành array
   * Auto-merge testCommands từ .test.yaml files
   * Deduplicate entities by ID (keep last occurrence with most specific _sourcePath)
   */
  static merge(base: ContentConfig, imported: ContentConfig): ContentConfig {
    // Auto-detect single entity files (không có array, chỉ có properties trực tiếp)
    const importedNormalized = EntityNormalizer.normalize(imported);
    
    // Helper function to merge and deduplicate arrays by ID
    const mergeArrays = (baseArr: any[] | undefined, importedArr: any[] | undefined): any[] => {
      const combined = [...(baseArr || []), ...(importedArr || [])];
      
      // Deduplicate by ID - keep last occurrence (most recent/specific)
      const seen = new Map<string, any>();
      for (const entity of combined) {
        if (entity && entity.id) {
          seen.set(entity.id, entity);
        }
      }
      
      return Array.from(seen.values());
    };
    
    const merged: ContentConfig = {
      ...base,
      addon: base.addon || importedNormalized.addon,
      icons: base.icons || importedNormalized.icons,
      items: mergeArrays(base.items, importedNormalized.items),
      foods: mergeArrays(base.foods, importedNormalized.foods),
      blocks: mergeArrays(base.blocks, importedNormalized.blocks),
      ores: mergeArrays(base.ores, importedNormalized.ores),
      tools: mergeArrays(base.tools, importedNormalized.tools),
      armor: mergeArrays(base.armor, importedNormalized.armor),
      recipes: mergeArrays(base.recipes, importedNormalized.recipes)
    };
    
    // Auto-merge testCommands từ imported config
    this.mergeTestCommands(merged, importedNormalized);
    
    return merged;
  }

  /**
   * Merge test commands into items, foods, tools, armor, blocks, ores
   * Search across ALL entity types to find matching ID
   */
  static mergeTestCommands(config: ContentConfig, testsConfig: ContentConfig): void {
    // Helper function to merge testCommands for any entity type
    const mergeForType = (testEntities: any[] | undefined, targetType: keyof ContentConfig) => {
      if (!testEntities || !config[targetType]) return;
      
      testEntities.forEach(testEntity => {
        if (!testEntity.id || !testEntity.testCommands) return;
        
        const targetArray = config[targetType] as any[];
        const target = targetArray.find((e: any) => e.id === testEntity.id);
        if (target) {
          target.testCommands = testEntity.testCommands;
        }
      });
    };
    
    // Try to merge testCommands from testsConfig.items into ALL entity types
    // (because .test.yaml files are classified as items by default)
    if (testsConfig.items) {
      testsConfig.items.forEach(testItem => {
        if (!testItem.id || !testItem.testCommands) return;
        
        // Search in all entity types
        let found = false;
        
        // Search in items
        if (config.items) {
          const item = config.items.find(i => i.id === testItem.id);
          if (item) {
            item.testCommands = testItem.testCommands;
            found = true;
          }
        }
        
        // Search in foods
        if (!found && config.foods) {
          const food = config.foods.find(f => f.id === testItem.id);
          if (food) {
            food.testCommands = testItem.testCommands;
            found = true;
          }
        }
        
        // Search in tools
        if (!found && config.tools) {
          const tool = config.tools.find(t => t.id === testItem.id);
          if (tool) {
            tool.testCommands = testItem.testCommands;
            found = true;
          }
        }
        
        // Search in armor
        if (!found && config.armor) {
          const armor = config.armor.find(a => a.id === testItem.id);
          if (armor) {
            armor.testCommands = testItem.testCommands;
            found = true;
          }
        }
        
        // Search in blocks
        if (!found && config.blocks) {
          const block = config.blocks.find(b => b.id === testItem.id);
          if (block) {
            block.testCommands = testItem.testCommands;
            found = true;
          }
        }
        
        // Search in ores
        if (!found && config.ores) {
          const ore = config.ores.find(o => o.id === testItem.id);
          if (ore) {
            ore.testCommands = testItem.testCommands;
            found = true;
          }
        }
      });
    }
    
    // Also merge from properly typed test entities
    mergeForType(testsConfig.foods, 'foods');
    mergeForType(testsConfig.tools, 'tools');
    mergeForType(testsConfig.armor, 'armor');
    mergeForType(testsConfig.blocks, 'blocks');
    mergeForType(testsConfig.ores, 'ores');
  }
}
