import { BlockGenerator } from '../../generators/BlockGenerator.js';
import { Logger } from '../../utils/Logger.js';

/**
 * Generate BP blocks
 */
export class BlockBPGenerator {
  static async generate(blocks: any[], outputDir: string): Promise<number> {
    const generator = new BlockGenerator(outputDir);
    let count = 0;

    for (const block of blocks) {
      try {
        generator.generate({
          id: block.id,
          name: block.name,
          texturePath: block.texture || block.texturePath,
          textures: block.textures, // Pass textures object for multi-face blocks
          category: block.category,
          destroyTime: block.destroyTime,
          explosionResistance: block.explosionResistance,
          mapColor: block.mapColor,
          requiresTool: block.requiresTool,
          toolTier: block.toolTier,
          craftingTable: block.craftingTable
        });
        count++;
      } catch (error) {
        Logger.error(`  ✗ Failed to generate block ${block.id}: ${error}`);
      }
    }

    return count;
  }
}
