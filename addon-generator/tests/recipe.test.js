import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Recipe Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create shaped recipe', () => {
    execSync(
      `bun run src/index.ts recipe:shaped --id test_shaped --pattern "[\\"###\\",\\"###\\",\\"###\\"]" --key "{\\"#\\":\\"test_item\\"}" --result test_block -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    const recipePath = join(TEST_PROJECT_ROOT, 'packs/BP/recipes/test_shaped.json');
    assert.ok(existsSync(recipePath), 'Shaped recipe should exist');

    const recipe = JSON.parse(readFileSync(recipePath, 'utf-8'));
    assert.ok(recipe['minecraft:recipe_shaped'], 'Should be shaped recipe');
    assert.deepStrictEqual(recipe['minecraft:recipe_shaped'].pattern, ['###', '###', '###']);
  });

  test('should create shapeless recipe', () => {
    execSync(
      `bun run src/index.ts recipe:shapeless --id test_shapeless --ingredients test_block --result test_item --result-count 9 -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    const recipePath = join(TEST_PROJECT_ROOT, 'packs/BP/recipes/test_shapeless.json');
    assert.ok(existsSync(recipePath), 'Shapeless recipe should exist');

    const recipe = JSON.parse(readFileSync(recipePath, 'utf-8'));
    assert.ok(recipe['minecraft:recipe_shapeless'], 'Should be shapeless recipe');
    assert.strictEqual(recipe['minecraft:recipe_shapeless'].result.count, 9);
  });

  test('should create smelting recipe', () => {
    execSync(
      `bun run src/index.ts recipe:smelting --id test_smelting --input raw_test --output test_ingot -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    const recipePath = join(TEST_PROJECT_ROOT, 'packs/BP/recipes/test_smelting.json');
    assert.ok(existsSync(recipePath), 'Smelting recipe should exist');

    const recipe = JSON.parse(readFileSync(recipePath, 'utf-8'));
    assert.ok(recipe['minecraft:recipe_furnace'], 'Should be furnace recipe');
  });
});
