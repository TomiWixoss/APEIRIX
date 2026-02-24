import { ArmorGenerator } from '../generators/ArmorGenerator.js';
import { TextureGenerator } from '../generators/TextureGenerator.js';
import { LangGenerator } from '../generators/LangGenerator.js';
import { TestGenerator } from '../generators/TestGenerator.js';
import { TestFunctionGenerator } from '../generators/TestFunctionGenerator.js';
import { Validator } from '../core/Validator.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DryRunManager } from '../core/DryRunManager.js';
import { existsSync } from 'fs';
import { join } from 'path';

export interface ArmorCommandOptions {
  baseName: string;
  displayName: string;
  material: string;
  icons: string;
  layer1: string;
  layer2: string;
  durabilityMultiplier?: string;
  protectionMultiplier?: string;
  enchantability?: string;
  testCommands?: string[];
  project: string;
  dryRun?: boolean;
  skipHistory?: boolean;
}

export class ArmorCommand {
  execute(options: ArmorCommandOptions): void {
    const baseName = Validator.sanitizeItemId(options.baseName);
    
    if (!Validator.validateItemId(baseName)) {
      throw new Error(`Base name không hợp lệ: "${options.baseName}"`);
    }

    if (!Validator.validateDisplayName(options.displayName)) {
      throw new Error('Display name không được rỗng');
    }

    // Validate textures
    if (!Validator.validateTexturePath(options.layer1)) {
      throw new Error(`Layer 1 texture không tồn tại: "${options.layer1}"`);
    }

    if (!Validator.validateTexturePath(options.layer2)) {
      throw new Error(`Layer 2 texture không tồn tại: "${options.layer2}"`);
    }

    // Validate icon folder
    if (!existsSync(options.icons)) {
      throw new Error(`Icon folder không tồn tại: "${options.icons}"`);
    }

    if (options.dryRun) {
      DryRunManager.enable();
    }

    const history = options.skipHistory ? null : new HistoryManager(options.project);
    if (history) {
      history.startOperation(`armor --base-name ${baseName} --display-name "${options.displayName}"`);
    }

    console.log(`\n🚀 Đang tạo armor set: ${baseName}...\n`);

    const armorGen = new ArmorGenerator(options.project);
    const textureGen = new TextureGenerator(options.project);
    const langGen = new LangGenerator(options.project);

    const pieces = ['helmet', 'chestplate', 'leggings', 'boots'];

    // Track files
    if (history) {
      pieces.forEach(piece => {
        history.trackCreate(`packs/BP/items/${baseName}_${piece}.json`);
        history.trackCreate(`packs/RP/attachables/${baseName}_${piece}.json`);
        history.trackCreate(`packs/RP/textures/items/${baseName}_${piece}.png`);
        history.trackCreate(`tests/items/armor/${baseName}_${piece}.md`);
        history.trackCreate(`tests/items/armor/${baseName}_${piece}.test.ts`);
        history.trackCreate(`packs/BP/functions/tests/armor/${baseName}_${piece}.mcfunction`);
      });
      
      history.trackCreate(`packs/RP/textures/models/armor/${baseName}_layer_1.png`);
      history.trackCreate(`packs/RP/textures/models/armor/${baseName}_layer_2.png`);
      history.trackModify('packs/RP/textures/item_texture.json');
      history.trackModify('packs/BP/texts/en_US.lang');
      history.trackModify('packs/RP/texts/en_US.lang');
    }

    if (!DryRunManager.isEnabled()) {
      armorGen.generateFullSet({
        baseName: baseName,
        displayNamePrefix: options.displayName,
        materialId: options.material,
        iconTexturesPath: options.icons,
        armorLayer1Path: options.layer1,
        armorLayer2Path: options.layer2,
        durabilityMultiplier: options.durabilityMultiplier ? parseFloat(options.durabilityMultiplier) : undefined,
        protectionMultiplier: options.protectionMultiplier ? parseFloat(options.protectionMultiplier) : undefined,
        enchantability: options.enchantability ? parseInt(options.enchantability) : undefined
      });

      // Copy icon textures
      pieces.forEach(piece => {
        const iconPath = join(options.icons, `${baseName}_${piece}.png`);
        if (existsSync(iconPath)) {
          textureGen.copyTexture(`${baseName}_${piece}`, iconPath, 'items');
          textureGen.updateItemTextureRegistry(`${baseName}_${piece}`);
          
          langGen.updateLangFile(`${baseName}_${piece}`, `${options.displayName} ${this.capitalize(piece)}`, 'BP', 'item');
          langGen.updateLangFile(`${baseName}_${piece}`, `${options.displayName} ${this.capitalize(piece)}`, 'RP', 'item');
        }
      });

      // Copy armor layer textures
      const layer1Name = options.layer1.replace(/\.(png|jpg)$/i, '').replace(/.*[\/\\]/, '');
      const layer2Name = options.layer2.replace(/\.(png|jpg)$/i, '').replace(/.*[\/\\]/, '');
      
      textureGen.copyTexture(`models/armor/${layer1Name}`, options.layer1, 'textures');
      textureGen.copyTexture(`models/armor/${layer2Name}`, options.layer2, 'textures');

      // Tạo test files cho từng piece
      const testGen = new TestGenerator(options.project);
      const testFuncGen = new TestFunctionGenerator(options.project);
      
      pieces.forEach(piece => {
        testGen.generateArmorTest(`${baseName}_${piece}`, `${options.displayName} ${this.capitalize(piece)}`, piece);
        
        // Tạo test function cho từng piece
        testFuncGen.generate({
          id: `${baseName}_${piece}`,
          displayName: `${options.displayName} ${this.capitalize(piece)}`,
          commands: options.testCommands
        }, 'armor');
      });

      if (history) {
        history.commitOperation();
      }
      console.log(`\n✨ Hoàn thành! Armor set "${options.displayName}" (4 pieces) đã được tạo.\n`);
      console.log(`💡 Tạo recipes riêng bằng: bun run dev recipe:shaped\n`);
    } else {
      pieces.forEach(piece => {
        DryRunManager.log(`Tạo ${piece} item: packs/BP/items/${baseName}_${piece}.json`);
        DryRunManager.log(`Tạo ${piece} attachable: packs/RP/attachables/${baseName}_${piece}.json`);
        DryRunManager.log(`Copy ${piece} icon: packs/RP/textures/items/${baseName}_${piece}.png`);
      });
      
      DryRunManager.log(`Copy armor layer 1: packs/RP/textures/models/armor/`);
      DryRunManager.log(`Copy armor layer 2: packs/RP/textures/models/armor/`);
      DryRunManager.log(`Update item_texture.json`);
      DryRunManager.log(`Update lang files`);
      
      DryRunManager.showSummary();
      DryRunManager.disable();
      if (history) {
        history.cancelOperation();
      }
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
