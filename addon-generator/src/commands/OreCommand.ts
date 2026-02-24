import { OreGenerator } from '../generators/OreGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface OreCommandOptions {
  id: string;
  name: string;
  texture: string;
  deepslateTexture?: string;
  rawItem: string;
  minY?: string;
  maxY?: string;
  veinSize?: string;
  veinsPerChunk?: string;
  toolTier?: string;
  project: string;
  dryRun?: boolean;
  skipHistory?: boolean;
}

export class OreCommand {
  execute(options: OreCommandOptions): void {
    const oreId = Validator.sanitizeItemId(options.id);
    
    if (!Validator.validateItemId(oreId)) {
      throw new Error(`Ore ID không hợp lệ: "${options.id}"`);
    }

    if (!Validator.validateDisplayName(options.name)) {
      throw new Error('Display name không được rỗng');
    }

    if (!Validator.validateTexturePath(options.texture)) {
      throw new Error(`Texture không tồn tại: "${options.texture}"`);
    }

    if (options.deepslateTexture && !Validator.validateTexturePath(options.deepslateTexture)) {
      throw new Error(`Deepslate texture không tồn tại: "${options.deepslateTexture}"`);
    }

    if (options.dryRun) {
      DryRunManager.enable();
    }

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`ore -i ${oreId} -n "${options.name}"`);
    }

    console.log(`\n🚀 Đang tạo ore: ${oreId}...\n`);

    const oreGen = new OreGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);

    // Track files
    if (history) {
      history.trackCreate(`packs/BP/blocks/${oreId}.json`);
      history.trackCreate(`packs/BP/loot_tables/blocks/${oreId}.json`);
      history.trackCreate(`packs/BP/features/${oreId}_scatter.json`);
      history.trackCreate(`packs/BP/feature_rules/${oreId}_feature.json`);
      history.trackCreate(`packs/RP/textures/blocks/${oreId}.png`);
      
      if (options.deepslateTexture) {
        history.trackCreate(`packs/BP/blocks/deepslate_${oreId}.json`);
        history.trackCreate(`packs/BP/loot_tables/blocks/deepslate_${oreId}.json`);
        history.trackCreate(`packs/RP/textures/blocks/deepslate_${oreId}.png`);
      }
      
      history.trackModify('packs/RP/textures/terrain_texture.json');
      history.trackModify('packs/BP/texts/en_US.lang');
      history.trackModify('packs/RP/texts/en_US.lang');
      history.trackModify('scripts/data/blocks/OreRegistry.ts');
    }

    if (!DryRunManager.isEnabled()) {
      oreGen.generate({
        id: oreId,
        name: options.name,
        texturePath: options.texture,
        deepslateTexturePath: options.deepslateTexture,
        rawItemId: options.rawItem,
        minY: options.minY ? parseInt(options.minY) : undefined,
        maxY: options.maxY ? parseInt(options.maxY) : undefined,
        veinSize: options.veinSize ? parseInt(options.veinSize) : undefined,
        veinsPerChunk: options.veinsPerChunk ? parseInt(options.veinsPerChunk) : undefined,
        toolTier: options.toolTier as any
      });

      textureGen.copyTexture(oreId, options.texture, 'blocks');
      if (options.deepslateTexture) {
        textureGen.copyTexture(`deepslate_${oreId}`, options.deepslateTexture, 'blocks');
      }
      
      oreGen.updateTerrainTextureRegistry(oreId, !!options.deepslateTexture);

      langGen.updateLangFile(oreId, options.name, 'BP', 'tile');
      langGen.updateLangFile(oreId, options.name, 'RP', 'tile');
      
      if (options.deepslateTexture) {
        langGen.updateLangFile(`deepslate_${oreId}`, `Deepslate ${options.name}`, 'BP', 'tile');
        langGen.updateLangFile(`deepslate_${oreId}`, `Deepslate ${options.name}`, 'RP', 'tile');
      }

      // Tạo test files
      const testGen = new TestGenerator(options.project);
      testGen.generateOreTest(oreId, options.name, !!options.deepslateTexture);

      if (history) {
        history.commitOperation();
      }
      console.log(`\n✨ Hoàn thành! Ore "${options.name}" đã được tạo với world generation.\n`);
    } else {
      DryRunManager.log(`Tạo ore block: packs/BP/blocks/${oreId}.json`);
      DryRunManager.log(`Tạo loot table: packs/BP/loot_tables/blocks/${oreId}.json`);
      DryRunManager.log(`Tạo feature: packs/BP/features/${oreId}_scatter.json`);
      DryRunManager.log(`Tạo feature rule: packs/BP/feature_rules/${oreId}_feature.json`);
      DryRunManager.log(`Copy texture: packs/RP/textures/blocks/${oreId}.png`);
      
      if (options.deepslateTexture) {
        DryRunManager.log(`Tạo deepslate ore: packs/BP/blocks/deepslate_${oreId}.json`);
        DryRunManager.log(`Tạo deepslate loot table: packs/BP/loot_tables/blocks/deepslate_${oreId}.json`);
        DryRunManager.log(`Copy deepslate texture: packs/RP/textures/blocks/deepslate_${oreId}.png`);
      }
      
      DryRunManager.log(`Update terrain_texture.json`);
      DryRunManager.log(`Update lang files`);
      DryRunManager.log(`Đăng ký vào OreRegistry.ts`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      if (history) {
        history.cancelOperation();
      }
    }
  }
}
