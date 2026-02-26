import path from 'path';
import { EntityGenerator } from '../../generators/EntityGenerator.js';

/**
 * Entity BP Generator
 * Generates entity behavior files
 */
export class EntityBPGenerator {
  /**
   * Generate all entity files
   */
  static async generate(entities: any[], bpPath: string): Promise<number> {
    if (!entities || entities.length === 0) {
      return 0;
    }

    console.log(`  📦 Generating ${entities.length} entities...`);
    
    const generator = new EntityGenerator(bpPath);
    let count = 0;

    for (const entity of entities) {
      try {
        generator.generate(entity);
        generator.generateLootTable(entity);
        count++;
      } catch (error) {
        console.error(`  ❌ Error generating entity ${entity.id}:`, error);
      }
    }

    return count;
  }
}
