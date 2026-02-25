import { join, dirname } from 'path';
import { ContentConfig } from './types/ConfigTypes.js';
import { YamlLoader } from './loaders/YamlLoader.js';
import { JsonLoader } from './loaders/JsonLoader.js';
import { ConfigMerger } from './loaders/ConfigMerger.js';
import { langLoader } from './loaders/LangLoader.js';

// Re-export types for backward compatibility
export * from './types/ConfigTypes.js';

/**
 * Main config loader - orchestrates loading and merging of config files
 */
export class ConfigLoader {
  /**
   * Load config file (YAML or JSON)
   */
  static load(filePath: string, parentPath: string = ''): ContentConfig {
    const ext = filePath.toLowerCase();
    
    let config: ContentConfig;
    if (ext.endsWith('.yaml') || ext.endsWith('.yml')) {
      config = YamlLoader.load(filePath);
    } else if (ext.endsWith('.json')) {
      config = JsonLoader.load(filePath);
    } else {
      throw new Error(`Unsupported config format: ${filePath}`);
    }
    
    // Set language from addon config
    if (config.addon?.language) {
      langLoader.setLanguage(config.addon.language);
      console.log(`[ConfigLoader] Language set to: ${config.addon.language}`);
    }
    
    // Load imported files nếu có
    config = this.loadImports(config, filePath, parentPath);
    
    return config;
  }

  /**
   * Load imported YAML files và merge vào config
   */
  private static loadImports(config: ContentConfig, basePath: string, parentPath: string = ''): ContentConfig {
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
        
        // Calculate accumulated path for nested imports
        // Extract directory from importPath (remove filename)
        let importDir = importPath.includes('/') 
          ? importPath.substring(0, importPath.lastIndexOf('/'))
          : '';
        
        // Build accumulated path
        const accumulatedPath = parentPath 
          ? `${parentPath}/${importDir}`.replace(/\/+/g, '/') // Remove duplicate slashes
          : importDir;
        
        // Load with accumulated parent path
        const importedConfig = this.load(fullPath, accumulatedPath);
        
        // Add source path metadata to entities that don't have it yet
        // (entities from nested imports will already have _sourcePath set)
        this.addSourcePathMetadata(importedConfig, importPath, accumulatedPath);
        
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
      
      // Calculate accumulated path
      let importDir = config.importConfig.includes('/') 
        ? config.importConfig.substring(0, config.importConfig.lastIndexOf('/'))
        : '';
      const accumulatedPath = parentPath 
        ? `${parentPath}/${importDir}`.replace(/\/+/g, '/')
        : importDir;
      
      const importedConfig = this.load(fullPath, accumulatedPath);
      
      // Add source path metadata
      this.addSourcePathMetadata(importedConfig, config.importConfig, parentPath);
      
      // Merge all content from imported config
      config = ConfigMerger.merge(config, importedConfig);
    }
    
    // Import items
    if (config.importItems) {
      const itemsPath = join(baseDir, config.importItems);
      
      let importDir = config.importItems.includes('/') 
        ? config.importItems.substring(0, config.importItems.lastIndexOf('/'))
        : '';
      const accumulatedPath = parentPath 
        ? `${parentPath}/${importDir}`.replace(/\/+/g, '/')
        : importDir;
      
      const itemsConfig = this.load(itemsPath, accumulatedPath);
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
      
      let importDir = config.importFoods.includes('/') 
        ? config.importFoods.substring(0, config.importFoods.lastIndexOf('/'))
        : '';
      const accumulatedPath = parentPath 
        ? `${parentPath}/${importDir}`.replace(/\/+/g, '/')
        : importDir;
      
      const foodsConfig = this.load(foodsPath, accumulatedPath);
      if (foodsConfig.foods) {
        config.foods = [...(config.foods || []), ...foodsConfig.foods];
      }
    }
    
    // Import recipes
    if (config.importRecipes) {
      const recipesPath = join(baseDir, config.importRecipes);
      
      let importDir = config.importRecipes.includes('/') 
        ? config.importRecipes.substring(0, config.importRecipes.lastIndexOf('/'))
        : '';
      const accumulatedPath = parentPath 
        ? `${parentPath}/${importDir}`.replace(/\/+/g, '/')
        : importDir;
      
      const recipesConfig = this.load(recipesPath, accumulatedPath);
      if (recipesConfig.recipes) {
        config.recipes = [...(config.recipes || []), ...recipesConfig.recipes];
      }
    }
    
    // Import tests - merge testCommands vào items và foods
    if (config.importTests) {
      const testsPath = join(baseDir, config.importTests);
      
      let importDir = config.importTests.includes('/') 
        ? config.importTests.substring(0, config.importTests.lastIndexOf('/'))
        : '';
      const accumulatedPath = parentPath 
        ? `${parentPath}/${importDir}`.replace(/\/+/g, '/')
        : importDir;
      
      const testsConfig = this.load(testsPath, accumulatedPath);
      ConfigMerger.mergeTestCommands(config, testsConfig);
    }
    
    return config;
  }

  /**
   * Add source path metadata to entities for tracking
   */
  private static addSourcePathMetadata(config: ContentConfig, sourcePath: string, accumulatedPath: string = ''): void {
    // Use accumulated path directly if provided, otherwise extract from sourcePath
    let fullPath = accumulatedPath;
    
    if (!fullPath) {
      // Extract directory path from source (remove filename and index.yaml)
      // Example: "materials/tin/index.yaml" -> "materials/tin"
      // Example: "tools/bronze/pickaxe.yaml" -> "tools/bronze"
      let dirPath = sourcePath.includes('/') 
        ? sourcePath.substring(0, sourcePath.lastIndexOf('/'))
        : '';
      
      // Remove "index" from path if present (index.yaml or index.test.yaml)
      if (dirPath.endsWith('/index') || dirPath.endsWith('/index.test')) {
        dirPath = dirPath.substring(0, dirPath.lastIndexOf('/'));
      }
      
      fullPath = dirPath;
    }
    
    // Clean up path (remove leading/trailing slashes and duplicate slashes)
    fullPath = fullPath.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
    
    // Add _sourcePath to all entity types
    const addToArray = (arr: any[] | undefined) => {
      if (arr) {
        arr.forEach(entity => {
          if (entity && typeof entity === 'object') {
            // Only set _sourcePath if not already set (from nested imports)
            if (!entity._sourcePath) {
              entity._sourcePath = fullPath;
            }
          }
        });
      }
    };
    
    addToArray(config.items);
    addToArray(config.foods);
    addToArray(config.blocks);
    addToArray(config.ores);
    addToArray(config.tools);
    addToArray(config.armor);
  }
}
