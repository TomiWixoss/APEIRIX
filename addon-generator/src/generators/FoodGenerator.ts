import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

export interface FoodConfig {
  id: string;
  name: string;
  texturePath: string;
  category?: string;
  stackSize?: number;
  
  // Food properties
  nutrition: number;
  saturation: number;
  canAlwaysEat?: boolean;
  usingConvertsTo?: string;
  
  // Effects
  effects?: Array<{
    name: string;
    duration: number;
    amplifier?: number;
    chance?: number;
  }>;
  
  // Remove effects (như milk bucket)
  removeEffects?: boolean;
}

/**
 * Food Generator - Tạo food items với đầy đủ properties và effects
 */
export class FoodGenerator {
  constructor(private projectRoot: string) {}

  generate(config: FoodConfig): void {
    const itemPath = join(
      this.projectRoot,
      'packs/BP/items',
      `${config.id}.json`
    );

    const itemData: any = {
      format_version: '1.21.0',
      'minecraft:item': {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: config.category || 'items'
          }
        },
        components: {
          'minecraft:icon': config.id,
          'minecraft:display_name': {
            value: `item.apeirix.${config.id}.name`
          },
          'minecraft:max_stack_size': config.stackSize || 64,
          'minecraft:food': {
            nutrition: config.nutrition,
            saturation_modifier: config.saturation / config.nutrition,
            can_always_eat: config.canAlwaysEat || false
          },
          'minecraft:use_duration': 32,
          'minecraft:use_animation': 'eat'
        }
      }
    };

    // Add using_converts_to (trả lại item sau khi ăn)
    if (config.usingConvertsTo) {
      itemData['minecraft:item'].components['minecraft:food'].using_converts_to = config.usingConvertsTo;
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

    // Add remove_effects (như milk bucket)
    if (config.removeEffects) {
      itemData['minecraft:item'].components['minecraft:food'].remove_effects = true;
    }

    FileManager.writeJSON(itemPath, itemData);
    console.log(`✅ Đã tạo: packs/BP/items/${config.id}.json`);
  }
}
