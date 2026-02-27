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
  entities?: EntityConfig[];
  structures?: StructureConfig[];
  
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
  
  // Flipbook animation
  flipbook?: {
    texture?: string;
    frames?: number[];
    ticksPerFrame?: number;
    blendFrames?: boolean;
  };
  
  // Fuel configuration (for machines)
  fuel?: {
    blockId: string;
    usesPerBlock: number;
    detectFaces?: 'all' | 'bottom';
  };
  
  // Processing recipes (for processing machines)
  processingRecipes?: Array<{
    input: string;
    output: string;
    processingTime: number;
  }>;
  
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
  type: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'spear' | 'hammer';
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

export interface EntityConfig {
  id: string;
  name: string;
  spawnEgg?: {
    texture: string;
    baseColor?: string;
    overlayColor?: string;
  };
  model: string; // Path to .geo.json
  texture: string; // Path to texture file
  animation?: string; // Path to .animation.json
  animationName?: string; // Animation name to use (e.g., "move", "walk", "idle")
  health?: number;
  movement?: number;
  attack?: number;
  collisionBox?: {
    width: number;
    height: number;
  };
  spawnCategory?: 'monster' | 'creature' | 'ambient' | 'water_creature';
  isSpawnable?: boolean;
  isSummonable?: boolean;
  renderScale?: number; // For invisible markers
  
  // NEW: 1.21.130+ Components
  rotationLockedToVehicle?: boolean;
  burnsInDaylight?: {
    protectionSlot?: 'slot.weapon.offhand' | 'slot.armor.head' | 'slot.armor.chest' | 'slot.armor.legs' | 'slot.armor.feet' | 'slot.armor.body';
  };
  breathable?: {
    canDehydrate?: boolean;
    breatheBlocks?: string[];
    suffocateTime?: number;
    breathesAir?: boolean;
    breathesWater?: boolean;
    breathesLava?: boolean;
    breathesSolids?: boolean;
    generatesBubbles?: boolean;
    inhaleTime?: number;
    totalSupply?: number;
  };
  rideable?: {
    seatCount?: number;
    familyTypes?: string[];
    interactText?: string;
    riders?: Array<{
      entityType: string;
      spawnEvent?: string;
    }>;
  };
  
  spawnRules?: {
    populationControl?: string; // 'monster', 'animal', 'water_animal', 'ambient'
    weight?: number;
    minGroupSize?: number;
    maxGroupSize?: number;
    conditions?: {
      surface?: boolean; // Spawn on surface
      underground?: boolean; // Spawn underground
      brightnessMin?: number; // 0-15
      brightnessMax?: number; // 0-15
      biomes?: string[]; // Biome tags
      nearBlocks?: string[]; // Must be near these blocks
      nearBlocksRadius?: number; // Search radius for nearBlocks
    };
  };
  lootTable?: {
    pools: Array<{
      rolls: number;
      entries: Array<{
        type: string;
        name: string;
        weight?: number;
        count?: number | { min: number; max: number };
      }>;
    }>;
  };
  behaviors?: {
    float?: boolean | {
      priority?: number;
      chancePerTickToFloat?: number;
      timeUnderWaterToDismountPassengers?: number;
    };
    panic?: boolean | {
      priority?: number;
      speed?: number;
    };
    randomStroll?: boolean | {
      priority?: number;
      speed?: number;
    };
    lookAtPlayer?: boolean | {
      priority?: number;
      lookDistance?: number;
      probability?: number;
    };
    randomLookAround?: boolean | {
      priority?: number;
    };
    meleeAttack?: boolean | {
      priority?: number;
      speedMultiplier?: number;
      trackTarget?: boolean;
    };
    nearestAttackableTarget?: {
      priority?: number;
      withinRadius?: number;
      reselectTargets?: boolean;
      entityTypes?: any[];
      targetAcquisitionProbability?: number;
      attackInterval?: {
        rangeMin?: number;
        rangeMax?: number;
      } | number;
    };
    hurtByTarget?: boolean | {
      priority?: number;
    };
    useKineticWeapon?: {
      priority?: number;
      approachDistance?: number;
      repositionDistance?: number;
      cooldownDistance?: number;
      weaponReachMultiplier?: number;
      hijackMountNavigation?: boolean;
    };
  };
  testCommands?: string[];
}

export interface StructureConfig {
  id: string;
  name: string;
  file: string; // Path to .mcstructure file
  category?: string;
  description?: string;
  spawnRules?: {
    scatter?: {
      iterations: number; // Số lần thử spawn per chunk
      chance: number; // Xác suất spawn (0-100)
    };
    biomes?: string[]; // Biome tags
    yRange?: {
      min: number;
      max: number;
    };
  };
  testCommands?: string[];
}
