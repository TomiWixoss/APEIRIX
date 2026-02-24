import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';
import { PickaxeScanner } from '../src/core/PickaxeScanner.js';

describe('PickaxeScanner', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should scan custom pickaxes', () => {
    // Tạo custom pickaxe
    const pickaxeData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: {
          identifier: "apeirix:test_pickaxe"
        },
        components: {
          "minecraft:digger": {
            use_efficiency: true,
            destroy_speeds: [
              {
                block: {
                  tags: "q.any_tag('stone', 'metal')"
                },
                speed: 6
              }
            ]
          }
        }
      }
    };

    writeFileSync(
      join(TEST_PROJECT_ROOT, 'packs/BP/items/test_pickaxe.json'),
      JSON.stringify(pickaxeData, null, 2)
    );

    const scanner = new PickaxeScanner(TEST_PROJECT_ROOT);
    const pickaxes = scanner.scanPickaxes();

    assert.ok(pickaxes.includes('apeirix:test_pickaxe'), 'Should find custom pickaxe');
    assert.strictEqual(pickaxes.length, 1, 'Should find exactly 1 pickaxe');
  });

  test('should generate pickaxe entries', () => {
    const scanner = new PickaxeScanner(TEST_PROJECT_ROOT);
    const entries = scanner.generatePickaxeEntries(5.0);

    assert.ok(Array.isArray(entries), 'Should return array');
    entries.forEach(entry => {
      assert.ok(entry.item, 'Entry should have item');
      assert.strictEqual(entry.destroy_speed, 5.0, 'Entry should have correct speed');
    });
  });
});
