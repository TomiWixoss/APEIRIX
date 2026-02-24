import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

export interface ArmorPieceConfig {
  id: string;
  name: string;
  texturePath: string;
  materialId: string;
  armorLayerTexturePath: string; // Path to armor layer texture (e.g., bronze_layer_1.png)
  
  // Piece type
  piece: 'helmet' | 'chestplate' | 'leggings' | 'boots';
  
  // Stats
  durability?: number;
  protection?: number;
  enchantability?: number;
}

/**
 * Generator cho Armor - CHỈ tạo item + attachable, KHÔNG tạo recipe
 */
export class ArmorGenerator {
  constructor(private projectRoot: string) {}

  generate(config: ArmorPieceConfig): void {
    // 1. Tạo BP item
    this.generateItem(config);
    
    // 2. Tạo RP attachable
    this.generateAttachable(config);
  }

  private generateItem(config: ArmorPieceConfig): void {
    const stats = this.getArmorStats(config.piece);
    const durability = config.durability || stats.durability;
    const protection = config.protection || stats.protection;
    const enchantability = config.enchantability || 18;

    const itemData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: {
          identifier: `apeirix:${config.id}`,
          menu_category: {
            category: "equipment",
            group: `minecraft:itemGroup.name.${config.piece}`
          }
        },
        components: {
          "minecraft:icon": config.id,
          "minecraft:display_name": {
            value: `item.apeirix.${config.id}.name`
          },
          "minecraft:max_stack_size": 1,
          "minecraft:durability": {
            max_durability: durability,
            damage_chance: {
              min: 60,
              max: 100
            }
          },
          "minecraft:enchantable": {
            slot: stats.enchantSlot,
            value: enchantability
          },
          "minecraft:repairable": {
            repair_items: [
              {
                items: [`apeirix:${config.id}`],
                repair_amount: "context.other->query.remaining_durability + 0.12 * context.other->query.max_durability"
              },
              {
                items: [`apeirix:${config.materialId}`],
                repair_amount: "context.other->query.remaining_durability * 0.25"
              }
            ]
          },
          "minecraft:wearable": {
            slot: stats.wearableSlot,
            protection: protection
          },
          "minecraft:tags": {
            tags: ["minecraft:trimmable_armors"]
          }
        }
      }
    };

    const outputPath = join(this.projectRoot, `packs/BP/items/${config.id}.json`);
    FileManager.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: packs/BP/items/${config.id}.json`);
  }

  private generateAttachable(config: ArmorPieceConfig): void {
    const stats = this.getArmorStats(config.piece);
    
    // Xác định layer texture (layer_1 cho helmet/chestplate/boots, layer_2 cho leggings)
    const layerNum = config.piece === 'leggings' ? 2 : 1;
    const layerTextureName = config.armorLayerTexturePath.replace(/\.(png|jpg)$/i, '').replace(/.*[\/\\]/, '');

    const attachableData = {
      format_version: "1.20.80",
      "minecraft:attachable": {
        description: {
          identifier: `apeirix:${config.id}`,
          materials: {
            default: "armor",
            enchanted: "armor_enchanted"
          },
          textures: {
            default: `textures/models/armor/${layerTextureName}`,
            enchanted: "textures/misc/enchanted_item_glint"
          },
          geometry: {
            default: stats.geometry
          },
          scripts: {
            parent_setup: stats.parentSetup
          },
          render_controllers: ["controller.render.item_default"]
        }
      }
    };

    const outputPath = join(this.projectRoot, `packs/RP/attachables/${config.id}.json`);
    FileManager.writeJSON(outputPath, attachableData);
    console.log(`✅ Đã tạo: packs/RP/attachables/${config.id}.json`);
  }

  private getArmorStats(piece: string) {
    const stats: Record<string, any> = {
      helmet: {
        durability: 220,
        protection: 2,
        enchantSlot: 'armor_head',
        wearableSlot: 'slot.armor.head',
        geometry: 'geometry.humanoid.armor.helmet',
        parentSetup: 'variable.helmet_layer_visible = 0.0;'
      },
      chestplate: {
        durability: 320,
        protection: 5,
        enchantSlot: 'armor_torso',
        wearableSlot: 'slot.armor.chest',
        geometry: 'geometry.humanoid.armor.chestplate',
        parentSetup: 'variable.chest_layer_visible = 0.0;'
      },
      leggings: {
        durability: 300,
        protection: 4,
        enchantSlot: 'armor_legs',
        wearableSlot: 'slot.armor.legs',
        geometry: 'geometry.humanoid.armor.leggings',
        parentSetup: 'variable.leg_layer_visible = 0.0;'
      },
      boots: {
        durability: 260,
        protection: 1,
        enchantSlot: 'armor_feet',
        wearableSlot: 'slot.armor.feet',
        geometry: 'geometry.humanoid.armor.boots',
        parentSetup: 'variable.boot_layer_visible = 0.0;'
      }
    };

    return stats[piece];
  }

  /**
   * Tạo full armor set (4 pieces)
   */
  generateFullSet(config: {
    baseName: string;
    displayNamePrefix: string;
    materialId: string;
    iconTexturesPath: string; // Folder chứa 4 icon textures
    armorLayer1Path: string;  // bronze_layer_1.png
    armorLayer2Path: string;  // bronze_layer_2.png
    durabilityMultiplier?: number;
    protectionMultiplier?: number;
    enchantability?: number;
  }): void {
    const pieces: Array<'helmet' | 'chestplate' | 'leggings' | 'boots'> = 
      ['helmet', 'chestplate', 'leggings', 'boots'];

    const multiplier = config.durabilityMultiplier || 1;
    const protMultiplier = config.protectionMultiplier || 1;

    pieces.forEach(piece => {
      const stats = this.getArmorStats(piece);
      const layerPath = piece === 'leggings' ? config.armorLayer2Path : config.armorLayer1Path;

      this.generate({
        id: `${config.baseName}_${piece}`,
        name: `${config.displayNamePrefix} ${this.capitalize(piece)}`,
        texturePath: join(config.iconTexturesPath, `${config.baseName}_${piece}.png`),
        materialId: config.materialId,
        armorLayerTexturePath: layerPath,
        piece: piece,
        durability: Math.round(stats.durability * multiplier),
        protection: Math.round(stats.protection * protMultiplier),
        enchantability: config.enchantability
      });
    });

    console.log(`\n✨ Đã tạo full armor set: ${config.baseName}\n`);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
