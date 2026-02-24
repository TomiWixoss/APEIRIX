import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Food Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create food with default values', () => {
    const texturePath = join(TEST_PROJECT_ROOT, 'test_food.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts food -i test_food -n "Test Food" -t ${texturePath} -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify BP item
    const itemPath = join(TEST_PROJECT_ROOT, 'packs/BP/items/test_food.json');
    assert.ok(existsSync(itemPath), 'Food item should exist');

    const itemData = JSON.parse(readFileSync(itemPath, 'utf-8'));
    assert.strictEqual(itemData['minecraft:item'].description.identifier, 'apeirix:test_food');
    assert.ok(itemData['minecraft:item'].components['minecraft:food'], 'Should have food component');
    assert.strictEqual(itemData['minecraft:item'].components['minecraft:food'].nutrition, 4, 'Default nutrition should be 4');
    assert.strictEqual(itemData['minecraft:item'].components['minecraft:use_animation'], 'eat');

    // Verify RP texture
    const rpTexturePath = join(TEST_PROJECT_ROOT, 'packs/RP/textures/items/test_food.png');
    assert.ok(existsSync(rpTexturePath), 'RP texture should exist');

    // Verify test files
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/items/food/test_food.md')), 'Test MD should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/items/food/test_food.test.ts')), 'Test TS should exist');
  });

  test('should create food with custom values', () => {
    const texturePath = join(TEST_PROJECT_ROOT, 'custom_food.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts food -i custom_food -n "Custom Food" -t ${texturePath} --nutrition 8 --saturation 1.5 --use-duration 2.0 --can-always-eat -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    const itemPath = join(TEST_PROJECT_ROOT, 'packs/BP/items/custom_food.json');
    const itemData = JSON.parse(readFileSync(itemPath, 'utf-8'));

    assert.strictEqual(itemData['minecraft:item'].components['minecraft:food'].nutrition, 8);
    assert.strictEqual(itemData['minecraft:item'].components['minecraft:food'].saturation_modifier, 1.5);
    assert.strictEqual(itemData['minecraft:item'].components['minecraft:use_modifiers'].use_duration, 2.0);
    assert.strictEqual(itemData['minecraft:item'].components['minecraft:food'].can_always_eat, true);
  });
});
