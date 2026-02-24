import { FileManager } from './FileManager.js';
import { parse as parseYaml } from 'yaml';
import { join } from 'path';

export interface ContentConfig {
  items?: ItemConfig[];
  foods?: FoodConfig[];
  blocks?: BlockConfig[];
  ores?: OreConfig[];
  tools?: ToolConfig[];
  armor?: ArmorSetConfig[];
  recipes?: RecipeConfig[];
  
  // YAML linking - import từ files khác
  importItems?: string;      // Path to items YAML
  importFoods?: string;      // Path to foods YAML (merged into foods array)
  importRecipes?: string;    // Path to recipes YAML
  importTests?: string;      // Path to test functions YAML
  
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
    const baseDir = basePath.substring(0, basePath.lastIndexOf('/'));
    
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
