import { ItemGenerator } from '../generators/ItemGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { RecipeGenerator } from '../generators/RecipeGenerator.js';
import { Validator } from '../core/Validator.js';

export interface ItemCommandOptions {
  id: string;
  name: string;
  texture: string;
  category?: string;
  stackSize?: string;
  project: string;
  dryRun?: boolean;
  
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

    console.log(`\n🚀 Đang tạo item: ${itemId}...\n`);

    const itemGen = new ItemGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);
    const recipeGen = new RecipeGenerator(options.project);

    // 1. Generate item
    itemGen.generate({
      id: itemId,
      name: options.name,
      texturePath: options.texture,
      category: options.category,
      stackSize: options.stackSize ? parseInt(options.stackSize) : undefined
    });

    textureGen.copyTexture(itemId, options.texture);
    textureGen.updateItemTextureRegistry(itemId);

    langGen.updateLangFile(itemId, options.name, 'BP');
    langGen.updateLangFile(itemId, options.name, 'RP');

    // 2. Generate recipes if provided
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

    console.log(`\n✨ Hoàn thành! Item "${options.name}" đã được tạo${recipeCount > 0 ? ` với ${recipeCount} recipe(s)` : ''}.\n`);
  }
}
