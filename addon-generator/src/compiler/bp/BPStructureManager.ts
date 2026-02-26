import path from 'path';
import { mkdirSync, existsSync } from 'fs';

/**
 * Manage BP directory structure
 */
export class BPStructureManager {
  static create(bpPath: string): void {
    const directories = [
      'items',
      'blocks',
      'entities',
      'recipes',
      'loot_tables/blocks',
      'loot_tables/entities',
      'features',
      'feature_rules',
      'functions/tests/items',
      'functions/tests/tools',
      'functions/tests/foods',
      'functions/tests/entities',
      'functions/tests/recipes',
      'scripts/data',
      'texts'
    ];

    for (const dir of directories) {
      const fullPath = path.join(bpPath, dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    }
  }
}
