# CLI Tool Tests

Automated tests cho APEIRIX Addon Generator CLI tool.

## Chạy Tests

```bash
# Chạy tất cả tests
bun test

# Chạy test cụ thể
bun test tests/item.test.js
bun test tests/block.test.js
bun test tests/pickaxe-scanner.test.js
```

## Test Structure

```
tests/
├── setup.js                    # Test project setup/cleanup
├── item.test.js                # Item generator tests
├── block.test.js               # Block generator tests
├── ore.test.js                 # Ore generator tests (TODO)
├── tool.test.js                # Tool generator tests (TODO)
├── armor.test.js               # Armor generator tests (TODO)
├── pickaxe-scanner.test.js     # PickaxeScanner tests
└── README.md
```

## Test Coverage

- ✅ Item generation với texture và lang files
- ✅ Block generation với loot tables
- ✅ Ore generation với world gen và pickaxe scanner
- ✅ Tool generation (pickaxe, axe, shovel, hoe, sword)
- ✅ Armor generation (full set với attachables)
- ✅ Recipe generation (shaped, shapeless, smelting)
- ✅ Batch config loading (YAML)
- ✅ History & Undo/rollback
- ✅ PickaxeScanner functionality

**Test Results**: 18/18 tests passing ✅

## Test Project

Tests tạo một test project tạm thời trong `tests/test-project/` với cấu trúc đầy đủ:
- packs/BP/ và packs/RP/
- scripts/data/
- tests/

Test project được tự động xóa sau khi tests hoàn thành.

## Validation

Mỗi test validate:
1. Files được tạo đúng vị trí
2. JSON structure đúng format
3. Registries được update
4. Lang files được update
5. Test files được tạo
