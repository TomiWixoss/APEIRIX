import { OreGenerator } from '../../generators/OreGenerator.js';

/**
 * Generate BP ores (blocks + world gen)
 */
export class OreBPGenerator {
  static async generate(ores: any[], outputDir: string): Promise<number> {
    const generator = new OreGenerator(outputDir);
    let count = 0;

    for (const ore of ores) {
      try {
        const oreConfig = {
          id: ore.id,
          name: ore.name,
          texturePath: ore.texturePath || ore.texture,
          deepslateTexturePath: ore.deepslateTexturePath || ore.deepslateTexture,
          rawItemId: ore.rawItemId,
          destroyTime: ore.destroyTime,
          deepslateDestroyTime: ore.deepslateDestroyTime,
          explosionResistance: ore.explosionResistance,
          toolTier: ore.toolTier,
          minY: ore.minY,
          maxY: ore.maxY,
          veinSize: ore.veinSize,
          veinsPerChunk: ore.veinsPerChunk,
          fortuneMultiplier: ore.fortuneMultiplier
        };
        
        generator.generate(oreConfig);
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate ore ${ore.id}: ${error}`);
      }
    }

    return count;
  }
}
