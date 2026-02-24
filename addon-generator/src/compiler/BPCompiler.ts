import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import { ItemGenerator } from '../generators/ItemGenerator.js';
import { BlockGenerator } from '../generators/BlockGenerator.js';
import { OreGenerator } from '../generators/OreGenerator.js';
import { RecipeGenerator } from '../generators/RecipeGenerator.js';
import { ArmorGenerator } from '../generators/ArmorGenerator.js';
import { FoodGenerator } from '../generators/FoodGenerator.js';
import { TestFunctionGenerator } from '../generators/TestFunctionGenerator.js';
import { RecipeTestFunctionGenerator } from '../generators/RecipeTestFunctionGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { PickaxeGenerator } from '../generators/tools/PickaxeGenerator.js';
import { AxeGenerator } from '../generators/tools/AxeGenerator.js';
import { ShovelGenerator } from '../generators/tools/ShovelGenerator.js';
import { HoeGenerator } from '../generators/tools/HoeGenerator.js';
import { SwordGenerator } from '../generators/tools/SwordGenerator.js';
import { SpearGenerator } from '../generators/tools/SpearGenerator.js';

export interface BPConfig {
  items?: any[];
  blocks?: any[];
  ores?: any[];
  recipes?: any[];
  armor?: any[];
  tools?: any[];
  foods?: any[];
}

/**
 * Behavior Pack Compiler
 * Orchestrates generation of all BP content
 */
export class BPCompiler {
  /**
   * Compile complete Behavior Pack
   */
  static async compile(config: BPConfig, outputDir: string): Promise<void> {
    console.log('\n🔨 Compiling Behavior Pack...');
    
    const bpPath = path.join(outputDir, 'BP');
    
    // Create BP structure
    this.createStructure(bpPath);
    
    let stats = {
      items: 0,
      blocks: 0,
      ores: 0,
      recipes: 0,
      functions: 0,
      langEntries: 0
    };

    // Generate items
    if (config.items && config.items.length > 0) {
      stats.items = await this.generateItems(config.items, bpPath);
    }

    // Generate tools
    if (config.tools && config.tools.length > 0) {
      stats.items += await this.generateTools(config.tools, bpPath);
    }

    // Generate armor
    if (config.armor && config.armor.length > 0) {
      stats.items += await this.generateArmor(config.armor, bpPath);
    }

    // Generate foods (special items)
    if (config.foods && config.foods.length > 0) {
      stats.items += await this.generateFoods(config.foods, bpPath);
    }

    // Generate blocks
    if (config.blocks && config.blocks.length > 0) {
      stats.blocks = await this.generateBlocks(config.blocks, bpPath);
    }

    // Generate ores
    if (config.ores && config.ores.length > 0) {
      stats.ores = await this.generateOres(config.ores, bpPath);
    }

    // Generate recipes
    if (config.recipes && config.recipes.length > 0) {
      stats.recipes = await this.generateRecipes(config.recipes, bpPath);
    }

    // Generate test functions
    stats.functions = await this.generateTestFunctions(config, bpPath);

    // Generate lang file
    stats.langEntries = await this.generateLangFile(config, bpPath);

    // Generate languages.json
    this.generateLanguagesJson(bpPath);

    console.log(`✓ BP compiled: ${stats.items} items, ${stats.blocks} blocks, ${stats.recipes} recipes`);
  }

  /**
   * Create BP folder structure
   */
  private static createStructure(bpPath: string): void {
    const dirs = [
      'items',
      'blocks',
      'recipes',
      'loot_tables/blocks',
      'features',
      'feature_rules',
      'functions/tests',
      'texts'
    ];

    for (const dir of dirs) {
      const fullPath = path.join(bpPath, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  /**
   * Generate items using ItemGenerator
   */
  private static async generateItems(items: any[], bpPath: string): Promise<number> {
    const generator = new ItemGenerator(path.dirname(bpPath));
    let count = 0;

    for (const item of items) {
      try {
        generator.generate({
          id: item.id,
          name: item.name,
          texturePath: item.texture || `./textures/${item.id}.png`,
          category: item.category || 'items',
          stackSize: item.maxStackSize || 64
        });
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate item ${item.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate tools using tool generators
   */
  private static async generateTools(tools: any[], bpPath: string): Promise<number> {
    const projectRoot = path.dirname(bpPath);
    let count = 0;

    for (const tool of tools) {
      try {
        const toolConfig = {
          id: tool.id,
          name: tool.name,
          texturePath: tool.texture || `./textures/${tool.id}.png`,
          materialId: tool.materialId || tool.repairItem,
          durability: tool.durability || 250,
          speed: tool.speed || 4,
          damage: tool.damage || 1,
          enchantability: tool.enchantability || 14
        };

        switch (tool.type) {
          case 'pickaxe':
            new PickaxeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'axe':
            new AxeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'shovel':
            new ShovelGenerator(projectRoot).generate(toolConfig);
            break;
          case 'hoe':
            new HoeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'sword':
            new SwordGenerator(projectRoot).generate(toolConfig);
            break;
          case 'spear':
            new SpearGenerator(projectRoot).generate(toolConfig);
            break;
          default:
            console.warn(`  ⚠ Unknown tool type: ${tool.type}`);
            continue;
        }
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate tool ${tool.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate armor using ArmorGenerator
   */
  private static async generateArmor(armor: any[], bpPath: string): Promise<number> {
    const generator = new ArmorGenerator(path.dirname(bpPath));
    let count = 0;

    for (const armorPiece of armor) {
      try {
        generator.generate({
          id: armorPiece.id,
          name: armorPiece.name,
          texturePath: armorPiece.texture || `./textures/${armorPiece.id}.png`,
          materialId: armorPiece.materialId || armorPiece.repairItem,
          armorLayerTexturePath: armorPiece.armorLayerTexture || armorPiece.armorLayer || `./textures/models/armor/${armorPiece.armorTexture}_layer_${armorPiece.type === 'leggings' ? 2 : 1}.png`,
          piece: armorPiece.type || armorPiece.piece,
          slot: armorPiece.slot,
          enchantSlot: armorPiece.enchantSlot,
          geometry: armorPiece.geometry,
          durability: armorPiece.durability,
          protection: armorPiece.protection,
          enchantability: armorPiece.enchantability || 18,
          category: armorPiece.category,
          group: armorPiece.group,
          tags: armorPiece.tags
        });
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate armor ${armorPiece.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate foods using existing FoodGenerator
   */
  private static async generateFoods(foods: any[], bpPath: string): Promise<number> {
    const generator = new FoodGenerator(path.dirname(bpPath));
    let count = 0;

    for (const food of foods) {
      try {
        generator.generate(food);
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate food ${food.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate blocks using existing BlockGenerator
   */
  private static async generateBlocks(blocks: any[], bpPath: string): Promise<number> {
    const generator = new BlockGenerator(path.dirname(bpPath));
    let count = 0;

    for (const block of blocks) {
      try {
        generator.generate(block);
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate block ${block.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate ores using OreGenerator
   */
  private static async generateOres(ores: any[], bpPath: string): Promise<number> {
    const generator = new OreGenerator(path.dirname(bpPath));
    let count = 0;

    for (const ore of ores) {
      try {
        const oreConfig = {
          id: ore.id,
          name: ore.name,
          texturePath: ore.texturePath || ore.texture,
          deepslateTexturePath: ore.deepslateTexturePath || ore.deepslateTexture,
          rawItemId: ore.rawItemId,
          destroyTime: ore.destroyTime,
          deepslateDestroyTime: ore.deepslateDestroyTime,
          explosionResistance: ore.explosionResistance,
          toolTier: ore.toolTier,
          minY: ore.minY,
          maxY: ore.maxY,
          veinSize: ore.veinSize,
          veinsPerChunk: ore.veinsPerChunk,
          fortuneMultiplier: ore.fortuneMultiplier
        };
        
        generator.generate(oreConfig);
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate ore ${ore.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate recipes using RecipeGenerator
   */
  private static async generateRecipes(recipes: any[], bpPath: string): Promise<number> {
    const generator = new RecipeGenerator(path.dirname(bpPath));
    let count = 0;

    for (const recipe of recipes) {
      try {
        switch (recipe.type) {
          case 'shaped':
            generator.createShaped({
              id: recipe.id,
              pattern: recipe.pattern,
              key: recipe.key || recipe.ingredients,
              result: recipe.result,
              resultCount: recipe.resultCount || recipe.count,
              resultExtra: recipe.resultExtra,
              unlock: recipe.unlock
            });
            break;
          case 'shapeless':
            generator.createShapeless({
              id: recipe.id,
              ingredients: recipe.ingredients,
              result: recipe.result,
              resultCount: recipe.resultCount || recipe.count,
              resultExtra: recipe.resultExtra,
              unlock: recipe.unlock
            });
            break;
          case 'smelting':
          case 'blasting':
            generator.createSmelting({
              id: recipe.id,
              input: recipe.input,
              output: recipe.output || recipe.result,
              tags: recipe.tags || (recipe.type === 'blasting' ? ['blast_furnace'] : ['furnace', 'blast_furnace', 'soul_campfire', 'campfire'])
            });
            break;
          default:
            console.warn(`  ⚠ Unknown recipe type: ${recipe.type}`);
            continue;
        }
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate recipe ${recipe.id}: ${error}`);
      }
    }

    return count;
  }

  /**
   * Generate test functions
   */
  private static async generateTestFunctions(config: BPConfig, bpPath: string): Promise<number> {
    let count = 0;

    // Generate item test functions
    if (config.items) {
      for (const item of config.items) {
        if (item.testCommands) {
          const generator = new TestFunctionGenerator(path.dirname(bpPath));
          generator.generate({
            id: item.id,
            displayName: item.name || item.id,
            commands: item.testCommands
          }, 'items');
          count++;
        }
      }
    }

    // Generate tool test functions
    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.testCommands) {
          const generator = new TestFunctionGenerator(path.dirname(bpPath));
          generator.generate({
            id: tool.id,
            displayName: tool.name || tool.id,
            commands: tool.testCommands
          }, 'tools');
          count++;
        }
      }
    }

    // Generate food test functions
    if (config.foods) {
      for (const food of config.foods) {
        if (food.testCommands) {
          const generator = new TestFunctionGenerator(path.dirname(bpPath));
          generator.generate({
            id: food.id,
            displayName: food.name || food.id,
            commands: food.testCommands
          }, 'foods');
          count++;
        }
      }
    }

    // Generate recipe test functions
    if (config.recipes) {
      for (const recipe of config.recipes) {
        if (recipe.testCommands) {
          const generator = new RecipeTestFunctionGenerator(path.dirname(bpPath));
          generator.generate({
            id: recipe.id,
            type: recipe.type,
            ingredients: recipe.ingredients || [],
            result: recipe.result,
            resultCount: recipe.resultCount
          });
          count++;
        }
      }
    }

    return count;
  }

  /**
   * Generate lang file using LangGenerator
   */
  private static async generateLangFile(config: BPConfig, bpPath: string): Promise<number> {
    const generator = new LangGenerator(path.dirname(bpPath));
    const entries: Record<string, string> = {};

    // Collect all lang entries
    if (config.items) {
      for (const item of config.items) {
        if (item.name) {
          entries[`item.apeirix.${item.id}.name`] = item.name;
        }
      }
    }

    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.name) {
          entries[`item.apeirix.${tool.id}.name`] = tool.name;
        }
      }
    }

    if (config.armor) {
      for (const armor of config.armor) {
        if (armor.name) {
          entries[`item.apeirix.${armor.id}.name`] = armor.name;
        }
      }
    }

    if (config.foods) {
      for (const food of config.foods) {
        if (food.name) {
          entries[`item.apeirix.${food.id}.name`] = food.name;
        }
      }
    }

    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.name) {
          entries[`tile.apeirix:${block.id}.name`] = block.name;
        }
      }
    }

    if (config.ores) {
      for (const ore of config.ores) {
        if (ore.name) {
          entries[`tile.apeirix:${ore.id}.name`] = ore.name;
        }
      }
    }

    // Generate lang file
    generator.generate(entries, 'BP');

    return Object.keys(entries).length;
  }

  /**
   * Generate languages.json
   */
  private static generateLanguagesJson(bpPath: string): void {
    const generator = new LangGenerator(path.dirname(bpPath));
    generator.generateLanguagesJson('BP');
  }
}
