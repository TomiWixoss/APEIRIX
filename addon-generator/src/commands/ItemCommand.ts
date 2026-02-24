import { ItemGenerator } from '../generators/ItemGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { RecipeGenerator } from '../generators/RecipeGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { TestFunctionGenerator } from '../generators/TestFunctionGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface ItemCommandOptions {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: string;
  project: string;
  dryRun?: boolean;
  skipHistory?: boolean; // Để BatchCommand tự quản lý history
  
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
  
  // Test function commands
  testCommands?: string[];
  
  // Recipe options
  recipeShaped?: string;
  recipeShapeless?: string;
  recipeSmelting?: string;
}

/**
 * Command handler cho item generation (có thể kèm recipes)
 */
export class ItemCommand {
  execute(options: ItemCommandOptions): void {
    const itemId = Validator.sanitizeItemId(options.id);
    
    if (!Validator.validateItemId(itemId)) {
      throw new Error(`Item ID không hợp lệ: "${options.id}"`);
    }

    if (!Validator.validateDisplayName(options.name)) {
      throw new Error('Display name không được rỗng');
    }

    if (!Validator.validateTexturePath(options.texture)) {
      throw new Error(`Texture không tồn tại: "${options.texture}"`);
    }

    if (options.dryRun) {
      DryRunManager.enable();
    }

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`item -i ${itemId} -n "${options.name}"`);
    }

    console.log(`\n🚀 Đang tạo item: ${itemId}...\n`);

    const itemGen = new ItemGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);
    const recipeGen = new RecipeGenerator(options.project);
    const testGen = new TestGenerator(options.project);
    const testFuncGen = new TestFunctionGenerator(options.project);

    // Track files
    if (history) {
      history.trackCreate(`packs/BP/items/${itemId}.json`);
      history.trackCreate(`packs/RP/textures/items/${itemId}.png`);
      history.trackModify('packs/RP/textures/item_texture.json');
      history.trackModify('packs/BP/texts/en_US.lang');
      history.trackModify('packs/RP/texts/en_US.lang');
    }

    if (!DryRunManager.isEnabled()) {
      // 1. Generate item
      itemGen.generate({
        id: itemId,
        name: options.name,
        texturePath: options.texture,
        category: options.category,
        stackSize: options.stackSize ? parseInt(options.stackSize) : undefined,
        nutrition: options.nutrition,
        saturation: options.saturation,
        canAlwaysEat: options.canAlwaysEat,
        usingConvertsTo: options.usingConvertsTo,
        effects: options.effects,
        removeEffects: options.removeEffects
      });

      textureGen.copyTexture(itemId, options.texture);
      textureGen.updateItemTextureRegistry(itemId);

      langGen.updateLangFile(itemId, options.name, 'BP');
      langGen.updateLangFile(itemId, options.name, 'RP');

      // 2. Generate test files
      testGen.generateItemTest(itemId, options.name);

      // 3. Generate test function
      const category = options.nutrition ? 'food' : 'items';
      testFuncGen.generate({
        id: itemId,
        displayName: options.name,
        commands: options.testCommands
      }, category);

      // 4. Generate recipes if provided
      let recipeCount = 0;

      if (options.recipeShaped) {
        const config = JSON.parse(options.recipeShaped);
        recipeGen.createShaped(config);
        recipeCount++;
      }

      if (options.recipeShapeless) {
        const config = JSON.parse(options.recipeShapeless);
        recipeGen.createShapeless(config);
        recipeCount++;
      }

      if (options.recipeSmelting) {
        const config = JSON.parse(options.recipeSmelting);
        recipeGen.createSmelting(config);
        recipeCount++;
      }

      if (history) {
        history.commitOperation();
      }
      console.log(`\n✨ Hoàn thành! Item "${options.name}" đã được tạo${recipeCount > 0 ? ` với ${recipeCount} recipe(s)` : ''}.\n`);
    } else {
      DryRunManager.log(`Tạo BP item: packs/BP/items/${itemId}.json`);
      DryRunManager.log(`Copy texture: packs/RP/textures/items/${itemId}.png`);
      DryRunManager.log(`Update item_texture.json`);
      DryRunManager.log(`Update BP/texts/en_US.lang`);
      DryRunManager.log(`Update RP/texts/en_US.lang`);
      DryRunManager.log(`Tạo test files`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      if (history) {
        history.cancelOperation();
      }
    }
  }
}
