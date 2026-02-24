import { FileManager } from '../core/FileManager.js';
import { Validator } from '../core/Validator.js';
import { join } from 'path';

export interface ItemConfig {
  id: string;
  name: string;
  texturePath: string;
  category?: string;
  stackSize?: number;
  
  // Food properties (optional)
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

    // Add food components if nutrition is provided
    if (config.nutrition !== undefined) {
      itemData['minecraft:item'].components['minecraft:food'] = {
        nutrition: config.nutrition,
        saturation_modifier: config.saturation ? config.saturation / config.nutrition : 0.6,
        can_always_eat: config.canAlwaysEat || false
      };
      
      itemData['minecraft:item'].components['minecraft:use_animation'] = 'eat';
      itemData['minecraft:item'].components['minecraft:use_modifiers'] = {
        use_duration: 1.6,
        movement_modifier: 0.33
      };

      // Add using_converts_to
      if (config.usingConvertsTo) {
        const convertsTo = config.usingConvertsTo.startsWith('minecraft:') || config.usingConvertsTo.startsWith('apeirix:')
          ? config.usingConvertsTo
          : `apeirix:${config.usingConvertsTo}`;
        itemData['minecraft:item'].components['minecraft:food'].using_converts_to = convertsTo;
      }

      // Add effects
      if (config.effects && config.effects.length > 0) {
        itemData['minecraft:item'].components['minecraft:food'].effects = config.effects.map(effect => ({
          name: effect.name,
          duration: effect.duration,
          amplifier: effect.amplifier || 0,
          chance: effect.chance || 1.0
        }));
      }

      // Add remove_effects
      if (config.removeEffects) {
        itemData['minecraft:item'].components['minecraft:food'].remove_effects = true;
      }
    }

    const outputPath = join(this.projectRoot, `packs/BP/items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: packs/BP/items/${config.id}.json`);
  }
}
