import { FileManager } from './FileManager.js';
import { parse as parseYaml } from 'yaml';

export interface ContentConfig {
  items?: ItemConfig[];
  blocks?: BlockConfig[];
  ores?: OreConfig[];
  tools?: ToolConfig[];
  armor?: ArmorSetConfig[];
  recipes?: RecipeConfig[];
}

export interface ItemConfig {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: number;
  
  // Food properties
  nutrition?: number;
  saturation?: number;
  canAlwaysEat?: boolean;
  usingConvertsTo?: string;
  effects?: Array<{
    name: string;
    duration: number;
    amplifier?: number;
    chance?: number;
  }>;
  removeEffects?: boolean;
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
}

export interface ToolConfig {
  id: string;
  name: string;
  texture: string;
  type: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword';
  materialId: string;
  durability?: number;
  damage?: number;
  efficiency?: number;
  enchantability?: number;
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
}

/**
 * Config Loader - Load config từ YAML/JSON file
 */
export class ConfigLoader {
  static load(filePath: string): ContentConfig {
    const ext = filePath.toLowerCase();
    
    if (ext.endsWith('.yaml') || ext.endsWith('.yml')) {
      return this.loadYaml(filePath);
    } else if (ext.endsWith('.json')) {
      return this.loadJson(filePath);
    } else {
      throw new Error(`Unsupported config format: ${filePath}`);
    }
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
