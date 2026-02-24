import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Tool Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  const toolTypes = ['pickaxe', 'axe', 'shovel', 'hoe', 'sword'];

  for (const type of toolTypes) {
    test(`should create ${type}`, () => {
      const texturePath = join(TEST_PROJECT_ROOT, `test_${type}.png`);
      writeFileSync(texturePath, Buffer.from('fake png'));

      execSync(
        `bun run src/index.ts tool:${type} -i test_${type} -n "Test ${type}" -t ${texturePath} --material test_ingot -p ${TEST_PROJECT_ROOT}`,
        { cwd: process.cwd() }
      );

      // Verify BP item
      const itemPath = join(TEST_PROJECT_ROOT, `packs/BP/items/test_${type}.json`);
      assert.ok(existsSync(itemPath), `${type} item should exist`);

      const itemData = JSON.parse(readFileSync(itemPath, 'utf-8'));
      assert.ok(itemData['minecraft:item'].components['minecraft:durability'], `${type} should have durability`);
      assert.ok(itemData['minecraft:item'].components['minecraft:damage'], `${type} should have damage`);

      // Verify ToolRegistry update
      const toolRegistry = readFileSync(join(TEST_PROJECT_ROOT, 'scripts/data/tools/ToolRegistry.ts'), 'utf-8');
      assert.ok(toolRegistry.includes(`test_${type}`), 'ToolRegistry should be updated');

      // Verify test files
      assert.ok(existsSync(join(TEST_PROJECT_ROOT, `tests/items/tools/test_${type}.md`)), 'Test MD should exist');
      assert.ok(existsSync(join(TEST_PROJECT_ROOT, `tests/items/tools/test_${type}.test.ts`)), 'Test TS should exist');
    });
  }
});
