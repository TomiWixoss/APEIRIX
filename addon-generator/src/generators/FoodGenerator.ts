import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

export interface FoodConfig {
  id: string;
  name: string;
  texturePath: string;
  nutrition?: number;
  saturation?: number;
  useDuration?: number;
  canAlwaysEat?: boolean;
  category?: 'nature' | 'equipment' | 'items' | 'construction';
}

/**
 * Food Generator - Tạo food items
 */
export class FoodGenerator {
  constructor(private projectRoot: string) {}

  generate(config: FoodConfig): void {
    const {
      id,
      name,
      nutrition = 4,
      saturation = 1,
      useDuration = 1.6,
      canAlwaysEat = false,
      category = 'nature'
    } = config;

    // Generate BP item
    const itemData = {
      format_version: '1.21.0',
      'minecraft:item': {
        description: {
          identifier: `apeirix:${id}`,
          menu_category: {
            category: category
          }
        },
        components: {
          'minecraft:icon': id,
          'minecraft:use_modifiers': {
            use_duration: useDuration
          },
          'minecraft:food': {
            nutrition: nutrition,
            saturation_modifier: saturation,
            ...(canAlwaysEat && { can_always_eat: true })
          },
          'minecraft:use_animation': 'eat'
        }
      }
    };

    const itemPath = join(this.projectRoot, `packs/BP/items/${id}.json`);
    FileManager.writeJSON(itemPath, itemData);

    console.log(`✅ Đã tạo food item: ${id}`);
  }
}
