import { FoodGenerator } from '../generators/FoodGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface FoodCommandOptions {
  id: string;
  name: string;
  texture: string;
  nutrition?: string;
  saturation?: string;
  useDuration?: string;
  canAlwaysEat?: boolean;
  category?: string;
  project: string;
  dryRun?: boolean;
}

export class FoodCommand {
  execute(options: FoodCommandOptions): void {
    const foodId = Validator.sanitizeItemId(options.id);
    
    if (!Validator.validateItemId(foodId)) {
      throw new Error(`Food ID không hợp lệ: "${options.id}"`);
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

    const history = new HistoryManager(options.project);
    history.startOperation(`food -i ${foodId} -n "${options.name}"`);

    console.log(`\n🚀 Đang tạo food: ${foodId}...\n`);

    const foodGen = new FoodGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);

    // Track files
    history.trackCreate(`packs/BP/items/${foodId}.json`);
    history.trackCreate(`packs/RP/textures/items/${foodId}.png`);
    history.trackModify('packs/RP/textures/item_texture.json');
    history.trackModify('packs/BP/texts/en_US.lang');
    history.trackModify('packs/RP/texts/en_US.lang');

    if (!DryRunManager.isEnabled()) {
      foodGen.generate({
        id: foodId,
        name: options.name,
        texturePath: options.texture,
        nutrition: options.nutrition ? parseInt(options.nutrition) : undefined,
        saturation: options.saturation ? parseFloat(options.saturation) : undefined,
        useDuration: options.useDuration ? parseFloat(options.useDuration) : undefined,
        canAlwaysEat: options.canAlwaysEat,
        category: options.category as any
      });

      textureGen.copyTexture(foodId, options.texture, 'items');
      textureGen.updateItemTextureRegistry(foodId);

      langGen.updateLangFile(foodId, options.name, 'BP', 'item');
      langGen.updateLangFile(foodId, options.name, 'RP', 'item');

      // Tạo test files
      const testGen = new TestGenerator(options.project);
      testGen.generateFoodTest(foodId, options.name);

      history.commitOperation();
      console.log(`\n✨ Hoàn thành! Food "${options.name}" đã được tạo.\n`);
      console.log(`💡 Tạo recipe riêng bằng: bun run dev recipe:shaped/shapeless\n`);
    } else {
      DryRunManager.log(`Tạo food item: packs/BP/items/${foodId}.json`);
      DryRunManager.log(`Copy texture: packs/RP/textures/items/${foodId}.png`);
      DryRunManager.log(`Update item_texture.json`);
      DryRunManager.log(`Update BP/texts/en_US.lang`);
      DryRunManager.log(`Update RP/texts/en_US.lang`);
      DryRunManager.log(`Tạo test files`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      history.cancelOperation();
    }
  }
}
