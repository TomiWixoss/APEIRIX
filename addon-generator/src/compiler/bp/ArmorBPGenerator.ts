import path from 'path';
import { ArmorGenerator } from '../../generators/ArmorGenerator.js';

/**
 * Generate BP armor
 */
export class ArmorBPGenerator {
  static async generate(armor: any[], bpPath: string, rpPath: string): Promise<number> {
    const projectRoot = path.dirname(bpPath);
    const generator = new ArmorGenerator(projectRoot);
    let count = 0;
    
    for (const armorPiece of armor) {
      try {
        generator.generate({
          id: armorPiece.id,
          name: armorPiece.name,
          texturePath: armorPiece.texture || `./textures/${armorPiece.id}.png`,
          materialId: armorPiece.materialId || armorPiece.repairItem,
          armorLayerTexturePath: armorPiece.armorLayerTexture || armorPiece.armorLayer || armorPiece.armorLayerTexturePath || `./textures/models/armor/${armorPiece.armorTexture}_layer_${armorPiece.type === 'leggings' ? 2 : 1}.png`,
          piece: armorPiece.type || armorPiece.piece,
          slot: armorPiece.slot,
          enchantSlot: armorPiece.enchantSlot,
          geometry: armorPiece.geometry,
          durability: armorPiece.durability,
          protection: armorPiece.protection,
          enchantability: armorPiece.enchantability || 18,
          category: armorPiece.category,
          group: armorPiece.group,
          tags: armorPiece.tags
        });
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate armor ${armorPiece.id}: ${error}`);
      }
    }
    
    return count;
  }
}
