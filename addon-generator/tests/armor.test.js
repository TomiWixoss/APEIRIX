import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Armor Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create full armor set', () => {
    // Tạo icon folder và textures
    const iconsDir = join(TEST_PROJECT_ROOT, 'armor_icons');
    mkdirSync(iconsDir, { recursive: true });

    const pieces = ['helmet', 'chestplate', 'leggings', 'boots'];
    pieces.forEach(piece => {
      writeFileSync(join(iconsDir, `test_${piece}.png`), Buffer.from('fake png'));
    });

    const layer1Path = join(TEST_PROJECT_ROOT, 'test_layer_1.png');
    const layer2Path = join(TEST_PROJECT_ROOT, 'test_layer_2.png');
    writeFileSync(layer1Path, Buffer.from('fake png'));
    writeFileSync(layer2Path, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts armor --base-name test --display-name "Test Armor" --material test_ingot --icons ${iconsDir} --layer1 ${layer1Path} --layer2 ${layer2Path} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify all 4 pieces
    pieces.forEach(piece => {
      // BP item
      const itemPath = join(TEST_PROJECT_ROOT, `packs/BP/items/test_${piece}.json`);
      assert.ok(existsSync(itemPath), `${piece} item should exist`);

      // RP attachable
      const attachablePath = join(TEST_PROJECT_ROOT, `packs/RP/attachables/test_${piece}.json`);
      assert.ok(existsSync(attachablePath), `${piece} attachable should exist`);

      // Test files
      assert.ok(existsSync(join(TEST_PROJECT_ROOT, `tests/items/armor/test_${piece}.md`)), `${piece} test MD should exist`);
      assert.ok(existsSync(join(TEST_PROJECT_ROOT, `tests/items/armor/test_${piece}.test.ts`)), `${piece} test TS should exist`);
    });

    // Verify armor layers
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/RP/textures/models/armor/test_layer_1.png')), 'Layer 1 should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/RP/textures/models/armor/test_layer_2.png')), 'Layer 2 should exist');
  });
});
