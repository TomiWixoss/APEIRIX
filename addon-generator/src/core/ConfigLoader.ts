import { FileManager } from './FileManager.js';
import { parse as parseYaml } from 'yaml';
import { join } from 'path';

export interface ContentConfig {
  // Addon metadata (for compiler)
  addon?: {
    name: string;
    description: string;
    version?: [number, number, number];
    minEngineVersion?: [number, number, number];
    author?: string;
    license?: string;
    uuids?: {
      bp?: string;
      rp?: string;
    };
    icons?: {
      bp?: string;
      rp?: string;
    };
  };
  
  // Icons at root level (for backward compatibility)
  icons?: {
    bp?: string;
    rp?: string;
  };

  items?: ItemConfig[];
  foods?: FoodConfig[];
  blocks?: BlockConfig[];
  ores?: OreConfig[];
  tools?: ToolConfig[];
  armor?: ArmorSetConfig[];
  recipes?: RecipeConfig[];
  
  // YAML linking - import từ files khác
  import?: string[];           // Array of config files to import (NEW)
  importConfig?: string;       // Single config file to import (NEW)
  importItems?: string;        // Path to items YAML
  importFoods?: string;        // Path to foods YAML (merged into foods array)
  importRecipes?: string;      // Path to recipes YAML
  importTests?: string;        // Path to test functions YAML
  
  // Recipe bulk test
  generateBulkRecipeTest?: boolean | string; // true = "all_recipes", string = custom name
  
  // Test generation options
  skipTestGeneration?: boolean; // Skip tạo test files (.md & .test.ts) trong tests/
}

export interface ItemConfig {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: number;
  
  // Test function commands (optional)
  testCommands?: string[];
}

export interface FoodConfig {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: number;
  
  // Food properties (required)
  nutrition: number;
  saturation: number;
  canAlwaysEat?: boolean;
  usingConvertsTo?: string;
  effects?: Array<{
    name: string;
    duration: number;
    amplifier?: number;
    chance?: number;
  }>;
  removeEffects?: boolean;
  
  // Test function commands (optional)
  testCommands?: string[];
}

export interface BlockConfig {
  id: string;
  name: string;
  texture: string;
  category?: string;
  destroyTime?: number;
  explosionResistance?: number;
  requiresTool?: boolean;
  toolTier?: string;
  testCommands?: string[];
}

export interface OreConfig {
  id: string;
  name: string;
  texture: string;
  deepslateTexture?: string;
  rawItemId: string;
  minY?: number;
  maxY?: number;
  veinSize?: number;
  veinsPerChunk?: number;
  toolTier?: string;
  testCommands?: string[];
}

export interface ToolConfig {
  id: string;
  name: string;
  texture: string;
  type: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'spear';
  materialId: string;
  durability?: number;
  damage?: number;
  efficiency?: number;
  enchantability?: number;
  tier?: string;
  testCommands?: string[];
}

export interface ArmorSetConfig {
  baseName: string;
  displayNamePrefix: string;
  materialId: string;
  iconTexturesPath: string;
  armorLayer1: string;
  armorLayer2: string;
  durabilityMultiplier?: number;
  protectionMultiplier?: number;
  enchantability?: number;
  testCommands?: string[];
}

export interface RecipeConfig {
  type: 'shaped' | 'shapeless' | 'smelting';
  id: string;
  pattern?: string[];
  key?: Record<string, string>;
  ingredients?: string[];
  result: string;
  resultCount?: number;
  resultExtra?: string[]; // Trả về thêm items (như bucket)
  unlock?: string[];
  input?: string;
  output?: string;
  tags?: string[];
  generateTest?: boolean; // Tự động tạo test function
}

/**
 * Config Loader - Load config từ YAML/JSON file
 */
export class ConfigLoader {
  static load(filePath: string): ContentConfig {
    const ext = filePath.toLowerCase();
    
    let config: ContentConfig;
    if (ext.endsWith('.yaml') || ext.endsWith('.yml')) {
      config = this.loadYaml(filePath);
    } else if (ext.endsWith('.json')) {
      config = this.loadJson(filePath);
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
        config = this.mergeConfigs(config, importedConfig);
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
      config = this.mergeConfigs(config, importedConfig);
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
    
    return config;
  }

  /**
   * Merge two configs together
   * Auto-detect single entity files và convert thành array
   */
  private static mergeConfigs(base: ContentConfig, imported: ContentConfig): ContentConfig {
    // Auto-detect single entity files (không có array, chỉ có properties trực tiếp)
    const importedNormalized = this.normalizeSingleEntity(imported);
    
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
   * Normalize single entity file thành array format
   * Detect nếu file chỉ chứa 1 entity (có id field) thay vì array
   */
  private static normalizeSingleEntity(config: any): ContentConfig {
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
      if (config.texture) {
        config.texture = config.texture.replace(/^(\.\.\/)+assets\//, '../assets/');
      }
      if (config.texturePath) {
        config.texturePath = config.texturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
      }
      if (config.deepslateTexturePath) {
        config.deepslateTexturePath = config.deepslateTexturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
      }
      if (config.armorLayerTexturePath) {
        config.armorLayerTexturePath = config.armorLayerTexturePath.replace(/^(\.\.\/)+assets\//, '../assets/');
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

  private static loadYaml(filePath: string): ContentConfig {
    const content = FileManager.readText(filePath);
    if (!content) {
      throw new Error(`Cannot read file: ${filePath}`);
    }

    try {
      return parseYaml(content) as ContentConfig;
    } catch (error) {
      throw new Error(`Invalid YAML: ${error}`);
    }
  }

  private static loadJson(filePath: string): ContentConfig {
    const data = FileManager.readJSON<ContentConfig>(filePath);
    if (!data) {
      throw new Error(`Cannot read file: ${filePath}`);
    }
    return data;
  }
}
