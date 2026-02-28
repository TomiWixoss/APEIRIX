import path from 'path';
import { BPStructureManager } from './bp/BPStructureManager.js';
import { ItemBPGenerator } from './bp/ItemBPGenerator.js';
import { ToolBPGenerator } from './bp/ToolBPGenerator.js';
import { ArmorBPGenerator } from './bp/ArmorBPGenerator.js';
import { FoodBPGenerator } from './bp/FoodBPGenerator.js';
import { BlockBPGenerator } from './bp/BlockBPGenerator.js';
import { OreBPGenerator } from './bp/OreBPGenerator.js';
import { RecipeBPGenerator } from './bp/RecipeBPGenerator.js';
import { TestFunctionBPGenerator } from './bp/TestFunctionBPGenerator.js';
import { LangBPGenerator } from './bp/LangBPGenerator.js';
import { GameDataBPGenerator } from './bp/GameDataBPGenerator.js';
import { LanguageConfigBPGenerator } from './bp/LanguageConfigBPGenerator.js';
import { ScriptLangBPGenerator } from './bp/ScriptLangBPGenerator.js';
import { EntityBPGenerator } from './bp/EntityBPGenerator.js';
import { StructureBPGenerator } from './bp/StructureBPGenerator.js';
import { Logger } from '../utils/Logger.js';

export interface BPConfig {
  addon?: {
    language?: string;
  };
  items?: any[];
  blocks?: any[];
  ores?: any[];
  recipes?: any[];
  armor?: any[];
  tools?: any[];
  foods?: any[];
  entities?: any[];
  structures?: any[];
  generateBulkRecipeTest?: boolean | string;
}

/**
 * Behavior Pack Compiler
 * Orchestrates generation of all BP content
 */
export class BPCompiler {
  /**
   * Compile complete Behavior Pack
   */
  static async compile(config: BPConfig, outputDir: string, configDir: string = ''): Promise<void> {
    Logger.log('\n🔨 Compiling Behavior Pack...');
    
    const bpPath = path.join(outputDir, 'BP');
    const rpPath = path.join(outputDir, 'RP');
    
    // Create BP structure
    BPStructureManager.create(bpPath);
    
    const stats = {
      items: 0,
      blocks: 0,
      recipes: 0,
      functions: 0,
      langEntries: 0
    };

    // Generate items
    if (config.items?.length) {
      stats.items += await ItemBPGenerator.generate(config.items, bpPath);
    }

    // Generate tools
    if (config.tools?.length) {
      stats.items += await ToolBPGenerator.generate(config.tools, bpPath);
    }

    // Generate armor (needs both BP and RP paths)
    if (config.armor?.length) {
      stats.items += await ArmorBPGenerator.generate(config.armor, bpPath, rpPath);
    }

    // Generate foods
    if (config.foods?.length) {
      stats.items += await FoodBPGenerator.generate(config.foods, bpPath);
    }

    // Generate blocks
    if (config.blocks?.length) {
      stats.blocks += await BlockBPGenerator.generate(config.blocks, bpPath);
    }

    // Generate ores
    if (config.ores?.length) {
      stats.blocks += await OreBPGenerator.generate(config.ores, bpPath);
    }

    // Generate entities
    if (config.entities?.length) {
      const entityCount = await EntityBPGenerator.generate(config.entities, bpPath);
      Logger.log(`  ✓ Generated ${entityCount} entities`);
    }

    // Generate structures
    if (config.structures?.length) {
      const structureCount = await StructureBPGenerator.generate(config.structures, bpPath, configDir);
      Logger.log(`  ✓ Generated ${structureCount} structures`);
    }

    // Generate recipes
    if (config.recipes?.length) {
      stats.recipes = await RecipeBPGenerator.generate(config.recipes, bpPath);
    }

    // Generate test functions
    stats.functions = await TestFunctionBPGenerator.generate(config, bpPath);

    // Generate lang file (pass configDir for lang resolution)
    stats.langEntries = await LangBPGenerator.generate(config, bpPath, configDir);

    // Generate GameData file (output to root scripts folder)
    await GameDataBPGenerator.generate(config, outputDir, configDir);

    // Generate Language Config for scripts
    const language = config.addon?.language || 'vi_VN';
    await LanguageConfigBPGenerator.generate(language, outputDir);

    // Generate Script Lang files from YAML (both vi_VN and en_US)
    await ScriptLangBPGenerator.generate(configDir, outputDir, config);

    Logger.log(`✓ BP compiled: ${stats.items} items, ${stats.blocks} blocks, ${stats.recipes} recipes`);
  }
}
