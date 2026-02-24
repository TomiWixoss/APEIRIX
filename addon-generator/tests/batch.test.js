import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Batch Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create content from YAML config', () => {
    // Tạo textures
    writeFileSync(join(TEST_PROJECT_ROOT, 'batch_item.png'), Buffer.from('fake png'));
    writeFileSync(join(TEST_PROJECT_ROOT, 'batch_block.png'), Buffer.from('fake png'));

    // Tạo config file
    const config = `
items:
  - id: batch_item
    name: "Batch Item"
    texture: ${join(TEST_PROJECT_ROOT, 'batch_item.png')}

blocks:
  - id: batch_block
    name: "Batch Block"
    texture: ${join(TEST_PROJECT_ROOT, 'batch_block.png')}

recipes:
  - type: shaped
    id: batch_recipe
    pattern: ["###", "###", "###"]
    key: {"#": "batch_item"}
    result: batch_block
`;

    const configPath = join(TEST_PROJECT_ROOT, 'batch_config.yaml');
    writeFileSync(configPath, config);

    execSync(
      `bun run src/index.ts batch -f ${configPath} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify item
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/items/batch_item.json')), 'Batch item should exist');

    // Verify block
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/blocks/batch_block.json')), 'Batch block should exist');

    // Verify recipe
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/recipes/batch_recipe.json')), 'Batch recipe should exist');
  });
});
