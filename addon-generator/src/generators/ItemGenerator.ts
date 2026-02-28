import { FileManager } from '../core/FileManager.js';
import { Validator } from '../core/Validator.js';
import { join } from 'path';
import { Logger } from '../utils/Logger.js';

export interface ItemConfig {
  id: string;
  name: string;
  texturePath: string;
  category?: string;
  stackSize?: number;
}

/**
 * Generator cho Item - CHỈ tạo item thường, KHÔNG phải food
 */
export class ItemGenerator {
  constructor(private projectRoot: string) {}

  generate(config: ItemConfig): void {
    // Skip if no name (test-only entity or improperly merged entity)
    if (!config.name) {
      return;
    }
    
    if (!Validator.validateItemId(config.id)) {
      throw new Error(`Item ID không hợp lệ: "${config.id}"`);
    }

    if (!Validator.validateDisplayName(config.name)) {
      throw new Error('Display name không được rỗng');
    }

    // Note: Texture validation is done by AssetCopier, not here
    // because texturePath is relative to config file, not to projectRoot

    const itemData: any = {
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

    const outputPath = join(this.projectRoot, `items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    Logger.log(`✅ Đã tạo: BP/items/${config.id}.json`);
  }
}
