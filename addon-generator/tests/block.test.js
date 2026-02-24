import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Block Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create block with loot table', () => {
    const texturePath = join(TEST_PROJECT_ROOT, 'test_block.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts block -i test_block -n "Test Block" -t ${texturePath} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify BP block
    const blockPath = join(TEST_PROJECT_ROOT, 'packs/BP/blocks/test_block.json');
    assert.ok(existsSync(blockPath), 'BP block should exist');

    // Verify loot table
    const lootPath = join(TEST_PROJECT_ROOT, 'packs/BP/loot_tables/blocks/test_block.json');
    assert.ok(existsSync(lootPath), 'Loot table should exist');

    // Verify terrain_texture.json
    const terrainTexture = JSON.parse(
      readFileSync(join(TEST_PROJECT_ROOT, 'packs/RP/textures/terrain_texture.json'), 'utf-8')
    );
    assert.ok(terrainTexture.texture_data.test_block, 'terrain_texture.json should be updated');

    // Verify test files
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/blocks/test_block.md')), 'Test MD should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/blocks/test_block.test.ts')), 'Test TS should exist');
  });
});
