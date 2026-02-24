import { FoodGenerator } from '../generators/FoodGenerator.js';
import { FoodRegistryHelper } from '../generators/FoodRegistryHelper.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { TestFunctionGenerator } from '../generators/TestFunctionGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface FoodCommandOptions {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: string;
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
  testCommands?: string[];
  project: string;
  dryRun?: boolean;
  skipHistory?: boolean;
  skipTests?: boolean; // Skip tạo test files
}

/**
 * Command handler cho food generation
 */
export class FoodCommand {
  execute(options: FoodCommandOptions): void {
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
      history.startOperation(`food -i ${itemId} -n "${options.name}"`);
    }

    console.log(`\n🍖 Đang tạo food item: ${itemId}...\n`);

    const foodGen = new FoodGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);
    const testGen = new TestGenerator(options.project);
    const testFuncGen = new TestFunctionGenerator(options.project);

    // Track files
    if (history) {
      history.trackCreate(`packs/BP/items/${itemId}.json`);
      history.trackCreate(`packs/RP/textures/items/${itemId}.png`);
      history.trackModify('packs/RP/textures/item_texture.json');
      history.trackModify('packs/BP/texts/en_US.lang');
      history.trackModify('packs/RP/texts/en_US.lang');
      history.trackModify('scripts/data/GameData.ts'); // Track GameData.ts
      history.trackCreate(`packs/BP/functions/tests/food/${itemId}.mcfunction`);
      
      if (!options.skipTests) {
        history.trackCreate(`tests/items/food/${itemId}.md`);
        history.trackCreate(`tests/items/food/${itemId}.test.ts`);
      }
    }

    if (!DryRunManager.isEnabled()) {
      // Generate food item
      const foodConfig = {
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
      };
      
      foodGen.generate(foodConfig);

      // Add to GameData.ts (if has effects or removeEffects)
      if ((options.effects && options.effects.length > 0) || options.removeEffects) {
        FoodRegistryHelper.addToGameData(options.project, foodConfig);
      }

      textureGen.copyTexture(itemId, options.texture);
      textureGen.updateItemTextureRegistry(itemId);

      langGen.updateLangFile(itemId, options.name, 'BP');
      langGen.updateLangFile(itemId, options.name, 'RP');

      // Generate test files (if not skipped)
      if (!options.skipTests) {
        testGen.generateFoodTest(itemId, options.name);
      }

      // Always generate test function (mcfunction)
      testFuncGen.generate({
        id: itemId,
        displayName: options.name,
        commands: options.testCommands
      }, 'food');

      if (history) {
        history.commitOperation();
      }
      console.log(`\n✨ Hoàn thành! Food item "${options.name}" đã được tạo.\n`);
    } else {
      DryRunManager.log(`Tạo BP food item: packs/BP/items/${itemId}.json`);
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
