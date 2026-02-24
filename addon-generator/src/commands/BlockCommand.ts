import { BlockGenerator } from '../generators/BlockGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { TestFunctionGenerator } from '../generators/TestFunctionGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';

export interface BlockCommandOptions {
  id: string;
  name: string;
  texture: string;
  category?: string;
  destroyTime?: string;
  explosionResistance?: string;
  requiresTool?: boolean;
  toolTier?: string;
  testCommands?: string[];
  project: string;
  dryRun?: boolean;
  skipHistory?: boolean;
  skipTests?: boolean;
}

/**
 * Command handler cho block generation
 */
export class BlockCommand {
  execute(options: BlockCommandOptions): void {
    const blockId = Validator.sanitizeItemId(options.id);
    
    if (!Validator.validateItemId(blockId)) {
      throw new Error(`Block ID không hợp lệ: "${options.id}"`);
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
      history.startOperation(`block -i ${blockId} -n "${options.name}"`);
    }

    console.log(`\n🚀 Đang tạo block: ${blockId}...\n`);

    const blockGen = new BlockGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);

    // Track files
    if (history) {
      history.trackCreate(`packs/BP/blocks/${blockId}.json`);
      history.trackCreate(`packs/BP/loot_tables/blocks/${blockId}.json`);
      history.trackCreate(`packs/RP/textures/blocks/${blockId}.png`);
      history.trackModify('packs/RP/textures/terrain_texture.json');
      history.trackModify('packs/BP/texts/en_US.lang');
      history.trackModify('packs/RP/texts/en_US.lang');
      history.trackCreate(`packs/BP/functions/tests/blocks/${blockId}.mcfunction`);
      
      if (!options.skipTests) {
        history.trackCreate(`tests/blocks/${blockId}.md`);
        history.trackCreate(`tests/blocks/${blockId}.test.ts`);
      }
    }

    if (!DryRunManager.isEnabled()) {
      blockGen.generate({
        id: blockId,
        name: options.name,
        texturePath: options.texture,
        category: options.category as any,
        destroyTime: options.destroyTime ? parseFloat(options.destroyTime) : undefined,
        explosionResistance: options.explosionResistance ? parseFloat(options.explosionResistance) : undefined,
        requiresTool: options.requiresTool,
        toolTier: options.toolTier as any
      });

      textureGen.copyTexture(blockId, options.texture, 'blocks');
      blockGen.updateTerrainTextureRegistry(blockId);

      langGen.updateLangFile(blockId, options.name, 'BP', 'tile');
      langGen.updateLangFile(blockId, options.name, 'RP', 'tile');

      // Tạo test files
      if (!options.skipTests) {
        const testGen = new TestGenerator(options.project);
        testGen.generateBlockTest(blockId, options.name);
      }

      // Always generate test function (mcfunction)
      const testFuncGen = new TestFunctionGenerator(options.project);
      testFuncGen.generate({
        id: blockId,
        displayName: options.name,
        commands: options.testCommands
      }, 'blocks');

      if (history) {
        history.commitOperation();
      }
      console.log(`\n✨ Hoàn thành! Block "${options.name}" đã được tạo.\n`);
    } else {
      DryRunManager.log(`Tạo BP block: packs/BP/blocks/${blockId}.json`);
      DryRunManager.log(`Tạo loot table: packs/BP/loot_tables/blocks/${blockId}.json`);
      DryRunManager.log(`Copy texture: packs/RP/textures/blocks/${blockId}.png`);
      DryRunManager.log(`Update terrain_texture.json`);
      DryRunManager.log(`Update BP/texts/en_US.lang`);
      DryRunManager.log(`Update RP/texts/en_US.lang`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      if (history) {
        history.cancelOperation();
      }
    }
  }
}
