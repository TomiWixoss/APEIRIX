import { FileManager } from '../core/FileManager.js';
import { Validator } from '../core/Validator.js';
import { join } from 'path';

export interface ItemConfig {
  id: string;
  name: string;
  texturePath: string;
  category?: string;
  stackSize?: number;
}

/**
 * Generator cho Item - tạo BP item JSON
 */
export class ItemGenerator {
  constructor(private projectRoot: string) {}

  generate(config: ItemConfig): void {
    if (!Validator.validateItemId(config.id)) {
      throw new Error(`Item ID không hợp lệ: "${config.id}"`);
    }

    if (!Validator.validateDisplayName(config.name)) {
      throw new Error('Display name không được rỗng');
    }

    if (!Validator.validateTexturePath(config.texturePath)) {
      throw new Error(`Texture không tồn tại: "${config.texturePath}"`);
    }

    const itemData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: config.category || "items"
          }
        },
        components: {
          "minecraft:icon": config.id,
          "minecraft:display_name": {
            value: `item.apeirix.${config.id}.name`
          },
          "minecraft:max_stack_size": config.stackSize || 64
        }
      }
    };

    const outputPath = join(this.projectRoot, `packs/BP/items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: packs/BP/items/${config.id}.json`);
  }
}
