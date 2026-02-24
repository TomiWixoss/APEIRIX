import { PickaxeGenerator } from '../generators/tools/PickaxeGenerator.js';
import { AxeGenerator } from '../generators/tools/AxeGenerator.js';
import { ShovelGenerator } from '../generators/tools/ShovelGenerator.js';
import { HoeGenerator } from '../generators/tools/HoeGenerator.js';
import { SwordGenerator } from '../generators/tools/SwordGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface ToolCommandOptions {
  id: string;
  name: string;
  texture: string;
  type: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword';
  material: string;
  durability?: string;
  damage?: string;
  efficiency?: string;
  enchantability?: string;
  project: string;
  dryRun?: boolean;
}

export class ToolCommand {
  execute(options: ToolCommandOptions): void {
    const toolId = Validator.sanitizeItemId(options.id);
    
    if (!Validator.validateItemId(toolId)) {
      throw new Error(`Tool ID không hợp lệ: "${options.id}"`);
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
    history.startOperation(`tool:${options.type} -i ${toolId} -n "${options.name}"`);

    console.log(`\n🚀 Đang tạo ${options.type}: ${toolId}...\n`);

    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);

    // Track files
    history.trackCreate(`packs/BP/items/${toolId}.json`);
    history.trackCreate(`packs/RP/textures/items/${toolId}.png`);
    history.trackModify('packs/RP/textures/item_texture.json');
    history.trackModify('packs/BP/texts/en_US.lang');
    history.trackModify('packs/RP/texts/en_US.lang');
    history.trackModify('scripts/data/tools/ToolRegistry.ts');

    if (!DryRunManager.isEnabled()) {
      const config = {
        id: toolId,
        name: options.name,
        texturePath: options.texture,
        materialId: options.material,
        durability: options.durability ? parseInt(options.durability) : undefined,
        damage: options.damage ? parseInt(options.damage) : undefined,
        efficiency: options.efficiency ? parseInt(options.efficiency) : undefined,
        enchantability: options.enchantability ? parseInt(options.enchantability) : undefined
      };

      // Generate based on type
      switch (options.type) {
        case 'pickaxe':
          new PickaxeGenerator(options.project).generate(config);
          break;
        case 'axe':
          new AxeGenerator(options.project).generate(config);
          break;
        case 'shovel':
          new ShovelGenerator(options.project).generate(config);
          break;
        case 'hoe':
          new HoeGenerator(options.project).generate(config);
          break;
        case 'sword':
          new SwordGenerator(options.project).generate(config);
          break;
      }

      textureGen.copyTexture(toolId, options.texture, 'items');
      textureGen.updateItemTextureRegistry(toolId);

      langGen.updateLangFile(toolId, options.name, 'BP', 'item');
      langGen.updateLangFile(toolId, options.name, 'RP', 'item');

      history.commitOperation();
      console.log(`\n✨ Hoàn thành! ${options.type} "${options.name}" đã được tạo.\n`);
      console.log(`💡 Tạo recipe riêng bằng: bun run dev recipe:shaped/shapeless\n`);
    } else {
      DryRunManager.log(`Tạo ${options.type} item: packs/BP/items/${toolId}.json`);
      DryRunManager.log(`Copy texture: packs/RP/textures/items/${toolId}.png`);
      DryRunManager.log(`Update item_texture.json`);
      DryRunManager.log(`Update lang files`);
      DryRunManager.log(`Đăng ký vào ToolRegistry.ts`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      history.cancelOperation();
    }
  }
}
