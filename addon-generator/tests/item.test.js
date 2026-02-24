import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Item Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create item with all files', () => {
    // Tạo dummy texture
    const texturePath = join(TEST_PROJECT_ROOT, 'test_item.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    // Run command
    execSync(
      `bun run src/index.ts item -i test_item -n "Test Item" -t ${texturePath} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify BP item
    const itemPath = join(TEST_PROJECT_ROOT, 'packs/BP/items/test_item.json');
    assert.ok(existsSync(itemPath), 'BP item should exist');
    
    const itemData = JSON.parse(readFileSync(itemPath, 'utf-8'));
    assert.strictEqual(itemData['minecraft:item'].description.identifier, 'apeirix:test_item');

    // Verify RP texture
    const rpTexturePath = join(TEST_PROJECT_ROOT, 'packs/RP/textures/items/test_item.png');
    assert.ok(existsSync(rpTexturePath), 'RP texture should exist');

    // Verify item_texture.json
    const itemTextureJson = JSON.parse(
      readFileSync(join(TEST_PROJECT_ROOT, 'packs/RP/textures/item_texture.json'), 'utf-8')
    );
    assert.ok(itemTextureJson.texture_data.test_item, 'item_texture.json should be updated');

    // Verify lang files
    const bpLang = readFileSync(join(TEST_PROJECT_ROOT, 'packs/BP/texts/en_US.lang'), 'utf-8');
    assert.ok(bpLang.includes('item.apeirix.test_item.name=Test Item'), 'BP lang should be updated');

    // Verify test files
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/items/materials/test_item.md')), 'Test MD should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/items/materials/test_item.test.ts')), 'Test TS should exist');
  });
});
