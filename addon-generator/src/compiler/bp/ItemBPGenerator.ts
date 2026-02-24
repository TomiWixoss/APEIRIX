import path from 'path';
import { ItemGenerator } from '../../generators/ItemGenerator.js';

/**
 * Generate BP items
 */
export class ItemBPGenerator {
  static async generate(items: any[], bpPath: string): Promise<number> {
    const projectRoot = path.dirname(bpPath);
    const generator = new ItemGenerator(projectRoot);
    let count = 0;
    
    for (const item of items) {
      try {
        generator.generate({
          id: item.id,
          name: item.name,
          texturePath: item.texture || `./textures/${item.id}.png`,
          category: item.category || 'items',
          stackSize: item.maxStackSize || 64
        });
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate item ${item.id}: ${error}`);
      }
    }
    
    return count;
  }
}
