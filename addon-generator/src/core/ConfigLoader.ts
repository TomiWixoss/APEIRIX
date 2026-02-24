import { join } from 'path';
import { ContentConfig } from './types/ConfigTypes.js';
import { YamlLoader } from './loaders/YamlLoader.js';
import { JsonLoader } from './loaders/JsonLoader.js';
import { ConfigMerger } from './loaders/ConfigMerger.js';

// Re-export types for backward compatibility
export * from './types/ConfigTypes.js';

/**
 * Main config loader - orchestrates loading and merging of config files
 */
export class ConfigLoader {
  /**
   * Load config file (YAML or JSON)
   */
  static load(filePath: string): ContentConfig {
    const ext = filePath.toLowerCase();
    
    let config: ContentConfig;
    if (ext.endsWith('.yaml') || ext.endsWith('.yml')) {
      config = YamlLoader.load(filePath);
    } else if (ext.endsWith('.json')) {
      config = JsonLoader.load(filePath);
    } else {
      throw new Error(`Unsupported config format: ${filePath}`);
    }
    
    // Load imported files nếu có
    config = this.loadImports(config, filePath);
    
    return config;
  }

  /**
   * Load imported YAML files và merge vào config
   */
  private static loadImports(config: ContentConfig, basePath: string): ContentConfig {
    // Normalize path separators to forward slashes
    const normalizedPath = basePath.replace(/\\/g, '/');
    const baseDir = normalizedPath.substring(0, normalizedPath.lastIndexOf('/'));
    
    // Preserve addon metadata and icons from root config
    const rootAddon = config.addon;
    const rootIcons = config.icons;
    
    // NEW: Support import array (import multiple files)
    if (config.import && Array.isArray(config.import)) {
      for (const importPath of config.import) {
        const fullPath = join(baseDir, importPath);
        const importedConfig = this.load(fullPath);
        
        // Merge all content from imported config
        config = ConfigMerger.merge(config, importedConfig);
      }
    }
    
    // Restore root addon and icons (don't let imports override)
    if (rootAddon) config.addon = rootAddon;
    if (rootIcons) config.icons = rootIcons;
    
    // NEW: Support importConfig (single file import)
    if (config.importConfig) {
      const fullPath = join(baseDir, config.importConfig);
      const importedConfig = this.load(fullPath);
      
      // Merge all content from imported config
      config = ConfigMerger.merge(config, importedConfig);
    }
    
    // Import items
    if (config.importItems) {
      const itemsPath = join(baseDir, config.importItems);
      const itemsConfig = this.load(itemsPath);
      if (itemsConfig.items) {
        config.items = [...(config.items || []), ...itemsConfig.items];
      }
      // Also merge foods from items file if present
      if (itemsConfig.foods) {
        config.foods = [...(config.foods || []), ...itemsConfig.foods];
      }
    }
    
    // Import foods
    if (config.importFoods) {
      const foodsPath = join(baseDir, config.importFoods);
      const foodsConfig = this.load(foodsPath);
      if (foodsConfig.foods) {
        config.foods = [...(config.foods || []), ...foodsConfig.foods];
      }
    }
    
    // Import recipes
    if (config.importRecipes) {
      const recipesPath = join(baseDir, config.importRecipes);
      const recipesConfig = this.load(recipesPath);
      if (recipesConfig.recipes) {
        config.recipes = [...(config.recipes || []), ...recipesConfig.recipes];
      }
    }
    
    // Import tests - merge testCommands vào items và foods
    if (config.importTests) {
      const testsPath = join(baseDir, config.importTests);
      const testsConfig = this.load(testsPath);
      ConfigMerger.mergeTestCommands(config, testsConfig);
    }
    
    return config;
  }
}
