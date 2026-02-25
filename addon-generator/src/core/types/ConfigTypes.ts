/**
 * Type definitions for config files
 */

export interface ContentConfig {
  // Addon metadata (for compiler)
  addon?: {
    name: string;
    description: string;
    version?: [number, number, number];
    minEngineVersion?: [number, number, number];
    author?: string;
    license?: string;
    language?: string; // NEW: Default language (e.g., "vi_VN", "en_US")
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
  maxStackSize?: number;
  recipe?: RecipeConfig;
  recipes?: RecipeConfig[];
  testCommands?: string[];
}

export interface FoodConfig {
  id: string;
  name: string;
  texture: string;
  nutrition: number;
  saturation: number;
  canAlwaysEat?: boolean;
  category?: string;
  stackSize?: number;
  cooldown?: number;
  cooldownType?: string;
  effects?: Array<{
    name: string;
    duration: number;
    amplifier: number;
    chance?: number;
  }>;
  recipe?: RecipeConfig;
  recipes?: RecipeConfig[];
  testCommands?: string[];
}

export interface BlockConfig {
  id: string;
  name: string;
  texture: string;
  textureTop?: string;
  textureSide?: string;
  textureFront?: string;
  category?: string;
  destroyTime?: number;
  explosionResistance?: number;
  friction?: number;
  lightEmission?: number;
  mapColor?: string;
  requiresTool?: boolean;
  toolTier?: string;
  miningSpeed?: number;
  drops?: string;
  // Crafting table component (optional)
  craftingTable?: {
    gridSize?: 3 | 2;
    craftingTags?: string[];
    customDescription?: string;
    tableName?: string;
  };
  recipe?: RecipeConfig;
  recipes?: RecipeConfig[];
  testCommands?: string[];
}

export interface OreConfig {
  id: string;
  name: string;
  texturePath: string;
  deepslateTexturePath: string;
  rawItemId: string;
  rawItemName: string;
  rawItemTexture: string;
  drops: string;
  minY?: number;
  maxY?: number;
  veinSize?: number;
  veinsPerChunk?: number;
  toolTier?: string;
  testCommands?: string[];
  recipes?: RecipeConfig[];
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
  recipe?: RecipeConfig;
  recipes?: RecipeConfig[];
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
  type?: 'helmet' | 'chestplate' | 'leggings' | 'boots';
  id?: string;
  name?: string;
  texture?: string;
  armorLayerTexturePath?: string;
  recipe?: RecipeConfig;
  recipes?: RecipeConfig[];
}

export interface RecipeConfig {
  type: 'shaped' | 'shapeless' | 'smelting' | 'blasting';
  id: string;
  pattern?: string[];
  key?: Record<string, string>;
  ingredients?: string[] | Record<string, string>;
  result: string;
  resultCount?: number;
  count?: number;
  resultExtra?: string[]; // Trả về thêm items (như bucket)
  unlock?: string[];
  input?: string;
  output?: string;
  tags?: string[];
  generateTest?: boolean; // Tự động tạo test function
}
