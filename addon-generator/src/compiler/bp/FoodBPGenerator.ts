import { FoodGenerator } from '../../generators/FoodGenerator.js';
import { Logger } from '../../utils/Logger.js';

/**
 * Generate BP foods
 */
export class FoodBPGenerator {
  static async generate(foods: any[], outputDir: string): Promise<number> {
    const generator = new FoodGenerator(outputDir);
    let count = 0;

    for (const food of foods) {
      try {
        generator.generate(food);
        count++;
      } catch (error) {
        Logger.error(`  ✗ Failed to generate food ${food.id}: ${error}`);
      }
    }

    return count;
  }
}
