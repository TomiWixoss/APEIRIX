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
      'recipes',
      'loot_tables/blocks',
      'features',
      'feature_rules',
      'functions/tests/items',
      'functions/tests/tools',
      'functions/tests/foods',
      'functions/tests/recipes',
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
