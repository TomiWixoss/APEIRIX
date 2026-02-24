import { BlockGenerator } from '../../generators/BlockGenerator.js';

/**
 * Generate BP blocks
 */
export class BlockBPGenerator {
  static async generate(blocks: any[], outputDir: string): Promise<number> {
    const generator = new BlockGenerator(outputDir);
    let count = 0;

    for (const block of blocks) {
      try {
        generator.generate(block);
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate block ${block.id}: ${error}`);
      }
    }

    return count;
  }
}
