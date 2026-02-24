import { mkdirSync, rmSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const TEST_PROJECT_ROOT = join(process.cwd(), 'tests', 'test-project');

export async function setupTestProject() {
  // Xóa test project cũ nếu có
  if (existsSync(TEST_PROJECT_ROOT)) {
    rmSync(TEST_PROJECT_ROOT, { recursive: true, force: true });
  }

  // Tạo cấu trúc thư mục
  const dirs = [
    'packs/BP/items',
    'packs/BP/blocks',
    'packs/BP/recipes',
    'packs/BP/loot_tables/blocks',
    'packs/BP/features',
    'packs/BP/feature_rules',
    'packs/BP/texts',
    'packs/RP/textures/items',
    'packs/RP/textures/blocks',
    'packs/RP/textures/models/armor',
    'packs/RP/attachables',
    'packs/RP/texts',
    'scripts/data/tools',
    'scripts/data/blocks',
    'tests/blocks',
    'tests/items/tools',
    'tests/items/armor',
    'tests/items/materials',
    'tests/items/food'
  ];

  dirs.forEach(dir => {
    mkdirSync(join(TEST_PROJECT_ROOT, dir), { recursive: true });
  });

  // Tạo các file cần thiết
  
  // item_texture.json
  writeFileSync(
    join(TEST_PROJECT_ROOT, 'packs/RP/textures/item_texture.json'),
    JSON.stringify({
      resource_pack_name: 'test',
      texture_name: 'atlas.items',
      texture_data: {}
    }, null, 2)
  );

  // terrain_texture.json
  writeFileSync(
    join(TEST_PROJECT_ROOT, 'packs/RP/textures/terrain_texture.json'),
    JSON.stringify({
      resource_pack_name: 'test',
      texture_name: 'atlas.terrain',
      padding: 8,
      num_mip_levels: 4,
      texture_data: {}
    }, null, 2)
  );

  // en_US.lang files
  const langContent = `## Items\n\n## Blocks\n\n`;
  writeFileSync(join(TEST_PROJECT_ROOT, 'packs/BP/texts/en_US.lang'), langContent);
  writeFileSync(join(TEST_PROJECT_ROOT, 'packs/RP/texts/en_US.lang'), langContent);

  // ToolRegistry.ts
  writeFileSync(
    join(TEST_PROJECT_ROOT, 'scripts/data/tools/ToolRegistry.ts'),
    `export class ToolRegistry {
  static registerTools(): void {
    // Auto-generated registrations
  }
}`
  );

  // OreRegistry.ts
  writeFileSync(
    join(TEST_PROJECT_ROOT, 'scripts/data/blocks/OreRegistry.ts'),
    `export class OreRegistry {
  static registerOres(): void {
    // Auto-generated registrations
  }
}`
  );

  console.log(`✅ Test project created at: ${TEST_PROJECT_ROOT}`);
  return TEST_PROJECT_ROOT;
}

export function cleanupTestProject() {
  if (existsSync(TEST_PROJECT_ROOT)) {
    rmSync(TEST_PROJECT_ROOT, { recursive: true, force: true });
    console.log(`✅ Test project cleaned up`);
  }
}

export { TEST_PROJECT_ROOT };
