import { describe, test, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { setupTestProject, cleanupTestProject, TEST_PROJECT_ROOT } from './setup.js';

describe('Ore Generator', () => {
  before(async () => {
    await setupTestProject();
  });

  after(() => {
    cleanupTestProject();
  });

  test('should create ore with world generation', () => {
    const texturePath = join(TEST_PROJECT_ROOT, 'test_ore.png');
    const deepslateTexturePath = join(TEST_PROJECT_ROOT, 'deepslate_test_ore.png');
    writeFileSync(texturePath, Buffer.from('fake png'));
    writeFileSync(deepslateTexturePath, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts ore -i test_ore -n "Test Ore" -t ${texturePath} --deepslate-texture ${deepslateTexturePath} --raw-item raw_test -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify normal ore
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/blocks/test_ore.json')), 'Normal ore should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/loot_tables/blocks/test_ore.json')), 'Normal ore loot table should exist');

    // Verify deepslate ore
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/blocks/deepslate_test_ore.json')), 'Deepslate ore should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/loot_tables/blocks/deepslate_test_ore.json')), 'Deepslate ore loot table should exist');

    // Verify world generation
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/features/test_ore_scatter.json')), 'Feature should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'packs/BP/feature_rules/test_ore_feature.json')), 'Feature rule should exist');

    // Verify feature content
    const feature = JSON.parse(readFileSync(join(TEST_PROJECT_ROOT, 'packs/BP/features/test_ore_scatter.json'), 'utf-8'));
    assert.strictEqual(feature['minecraft:ore_feature'].replace_rules.length, 2, 'Should have 2 replace rules (normal + deepslate)');

    // Verify OreRegistry update
    const oreRegistry = readFileSync(join(TEST_PROJECT_ROOT, 'scripts/data/blocks/OreRegistry.ts'), 'utf-8');
    assert.ok(oreRegistry.includes('test_ore'), 'OreRegistry should be updated');

    // Verify test files
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/blocks/test_ore.md')), 'Test MD should exist');
    assert.ok(existsSync(join(TEST_PROJECT_ROOT, 'tests/blocks/deepslate_test_ore.md')), 'Deepslate test MD should exist');
  });

  test('should scan and add custom pickaxes to ore', () => {
    // Tạo custom pickaxe trước
    const pickaxeData = {
      format_version: "1.21.0",
      "minecraft:item": {
        description: { identifier: "apeirix:custom_pickaxe" },
        components: {
          "minecraft:digger": {
            destroy_speeds: [{ block: { tags: "q.any_tag('stone')" }, speed: 8 }]
          }
        }
      }
    };
    writeFileSync(
      join(TEST_PROJECT_ROOT, 'packs/BP/items/custom_pickaxe.json'),
      JSON.stringify(pickaxeData, null, 2)
    );

    // Tạo ore
    const texturePath = join(TEST_PROJECT_ROOT, 'test_ore2.png');
    writeFileSync(texturePath, Buffer.from('fake png'));

    execSync(
      `bun run src/index.ts ore -i test_ore2 -n "Test Ore 2" -t ${texturePath} --raw-item raw_test2 -p ${TEST_PROJECT_ROOT}`,
      { cwd: process.cwd() }
    );

    // Verify ore có custom pickaxe
    const oreData = JSON.parse(readFileSync(join(TEST_PROJECT_ROOT, 'packs/BP/blocks/test_ore2.json'), 'utf-8'));
    const speeds = oreData['minecraft:block'].components['minecraft:destructible_by_mining'].item_specific_speeds;
    
    const hasCustomPickaxe = speeds.some(s => s.item === 'apeirix:custom_pickaxe');
    assert.ok(hasCustomPickaxe, 'Ore should include custom pickaxe');
  });
});
