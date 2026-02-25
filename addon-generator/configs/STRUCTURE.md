# Cấu Trúc Config Files

## Tổng Quan

Cấu trúc mới sử dụng hệ thống **index-based imports** với test files riêng biệt.

## Nguyên Tắc

1. **Mỗi entity = 2 files**: `entity.yaml` + `entity.test.yaml`
2. **Mỗi thư mục = 2 index files**: `index.yaml` + `index.test.yaml`
3. **index.yaml import entity.yaml + index.test.yaml**
4. **index.test.yaml import entity.test.yaml**
5. **addon.yaml chỉ import top-level index.yaml**

## Cấu Trúc Thư Mục

```
configs/
├── addon.yaml                    # Main entry point
├── materials/
│   ├── index.yaml               # Import tin/index.yaml + bronze/index.yaml
│   ├── index.test.yaml          # Import tin/index.test.yaml + bronze/index.test.yaml
│   ├── tin/
│   │   ├── index.yaml           # Import all tin entities + index.test.yaml
│   │   ├── index.test.yaml      # Import all tin test files
│   │   ├── raw_tin.yaml
│   │   ├── raw_tin.test.yaml
│   │   ├── tin_ingot.yaml
│   │   ├── tin_ingot.test.yaml
│   │   ├── tin_nugget.yaml
│   │   ├── tin_nugget.test.yaml
│   │   ├── tin_block.yaml
│   │   ├── tin_block.test.yaml
│   │   ├── tin_ore.yaml
│   │   └── tin_ore.test.yaml
│   └── bronze/
│       ├── index.yaml
│       ├── index.test.yaml
│       ├── bronze_ingot.yaml
│       ├── bronze_ingot.test.yaml
│       ├── bronze_nugget.yaml
│       ├── bronze_nugget.test.yaml
│       ├── bronze_block.yaml
│       └── bronze_block.test.yaml
├── tools/
│   ├── index.yaml
│   ├── index.test.yaml
│   └── bronze/
│       ├── index.yaml
│       ├── index.test.yaml
│       ├── pickaxe.yaml
│       ├── pickaxe.test.yaml
│       ├── axe.yaml
│       ├── axe.test.yaml
│       ├── shovel.yaml
│       ├── shovel.test.yaml
│       ├── hoe.yaml
│       ├── hoe.test.yaml
│       ├── sword.yaml
│       ├── sword.test.yaml
│       ├── spear.yaml
│       └── spear.test.yaml
├── armor/
│   ├── index.yaml
│   ├── index.test.yaml
│   └── bronze/
│       ├── index.yaml
│       ├── index.test.yaml
│       ├── helmet.yaml
│       ├── helmet.test.yaml
│       ├── chestplate.yaml
│       ├── chestplate.test.yaml
│       ├── leggings.yaml
│       ├── leggings.test.yaml
│       ├── boots.yaml
│       └── boots.test.yaml
├── foods/
│   ├── index.yaml
│   ├── index.test.yaml
│   └── canned-food/
│       ├── index.yaml
│       ├── index.test.yaml
│       ├── canempty.yaml
│       ├── canempty.test.yaml
│       ├── candirty.yaml
│       ├── candirty.test.yaml
│       ├── canned_food.yaml
│       ├── canned_food.test.yaml
│       └── ... (12 canned food items total)
└── special/
    ├── index.yaml
    ├── index.test.yaml
    ├── achievement_book.yaml
    └── achievement_book.test.yaml
```

## Import Chain

```
addon.yaml
├── materials/index.yaml
│   ├── tin/index.yaml
│   │   ├── raw_tin.yaml
│   │   ├── tin_ingot.yaml
│   │   ├── tin_nugget.yaml
│   │   ├── tin_block.yaml
│   │   ├── tin_ore.yaml
│   │   └── tin/index.test.yaml
│   │       ├── raw_tin.test.yaml
│   │       ├── tin_ingot.test.yaml
│   │       ├── tin_nugget.test.yaml
│   │       ├── tin_block.test.yaml
│   │       └── tin_ore.test.yaml
│   └── bronze/index.yaml
│       ├── bronze_ingot.yaml
│       ├── bronze_nugget.yaml
│       ├── bronze_block.yaml
│       └── bronze/index.test.yaml
│           ├── bronze_ingot.test.yaml
│           ├── bronze_nugget.test.yaml
│           └── bronze_block.test.yaml
├── tools/index.yaml
│   └── bronze/index.yaml
│       ├── pickaxe.yaml
│       ├── axe.yaml
│       ├── shovel.yaml
│       ├── hoe.yaml
│       ├── sword.yaml
│       ├── spear.yaml
│       └── bronze/index.test.yaml
│           ├── pickaxe.test.yaml
│           ├── axe.test.yaml
│           ├── shovel.test.yaml
│           ├── hoe.test.yaml
│           ├── sword.test.yaml
│           └── spear.test.yaml
├── armor/index.yaml
│   └── bronze/index.yaml
│       ├── helmet.yaml
│       ├── chestplate.yaml
│       ├── leggings.yaml
│       ├── boots.yaml
│       └── bronze/index.test.yaml
│           ├── helmet.test.yaml
│           ├── chestplate.test.yaml
│           ├── leggings.test.yaml
│           └── boots.test.yaml
├── foods/index.yaml
│   └── canned-food/index.yaml
│       ├── canempty.yaml
│       ├── candirty.yaml
│       ├── ... (12 items)
│       └── canned-food/index.test.yaml
│           ├── canempty.test.yaml
│           ├── candirty.test.yaml
│           └── ... (12 test files)
└── special/index.yaml
    ├── achievement_book.yaml
    └── special/index.test.yaml
        └── achievement_book.test.yaml
```

## Compile Command

```bash
# Compile tất cả (entities + tests)
bun run dev compile configs/addon.yaml

# Output:
# - 31 entities (items, blocks, tools, armor, foods)
# - 31 test functions (trong build/BP/functions/tests/)
# - All textures, recipes, lang files
```

## Test Commands Trong Game

```
# Test individual entity
/function tests/materials/tin/tin_ingot
/function tests/tools/bronze/pickaxe
/function tests/foods/canned-food/canned_food

# Test category
/function tests/materials/tin/all
/function tests/tools/bronze/all
/function tests/armor/bronze/all
```

## Lợi Ích

1. **Modular**: Dễ thêm/xóa/sửa từng entity
2. **Organized**: Test files tách biệt, không làm rối entity files
3. **Scalable**: Thêm material/tool mới chỉ cần:
   - Tạo thư mục mới
   - Tạo entity.yaml + entity.test.yaml
   - Tạo index.yaml + index.test.yaml
   - Import vào parent index.yaml
4. **Clean**: addon.yaml chỉ 5 dòng import thay vì 31 dòng
5. **Testable**: Mỗi entity có test riêng, dễ debug

## Thêm Entity Mới

### Ví dụ: Thêm Copper Material

1. Tạo thư mục: `configs/materials/copper/`
2. Tạo entity files:
   - `copper_ingot.yaml`
   - `copper_ingot.test.yaml`
   - `copper_nugget.yaml`
   - `copper_nugget.test.yaml`
3. Tạo index files:
   - `index.yaml` (import entities + index.test.yaml)
   - `index.test.yaml` (import test files)
4. Update parent: `configs/materials/index.yaml`
   ```yaml
   import:
     - tin/index.yaml
     - bronze/index.yaml
     - copper/index.yaml  # Add this
   ```
5. Compile: `bun run dev compile configs/addon.yaml`

## Test File Format

Mỗi `.test.yaml` chứa:
```yaml
testCommands:
  - "# Test: [Entity Name]"
  - clear @s
  - give @s apeirix:[entity_id]
  - 'tellraw @s {"text":"=== Test: [Name] ===","color":"gold"}'
  - 'tellraw @s {"text":"[Stats]","color":"aqua"}'
  - tellraw @s {"text":"[Description]","color":"white"}
  - playsound random.levelup @s
```

## Statistics

- **Total Entities**: 31
- **Total Test Files**: 31
- **Total Index Files**: 20 (10 index.yaml + 10 index.test.yaml)
- **Total Config Files**: 82 (31 entities + 31 tests + 20 indexes)
