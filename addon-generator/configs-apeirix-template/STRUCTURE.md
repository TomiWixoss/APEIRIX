# Cấu Trúc Config Files

## Tổng Quan

Cấu trúc mới sử dụng hệ thống **category-based organization** với assets được tích hợp trực tiếp vào configs.

## Nguyên Tắc

1. **Assets trong configs**: Mỗi category có thư mục `assets/` riêng
2. **Texture paths tương đối**: Paths từ YAML file đến assets trong cùng category
3. **Index-based imports**: Mỗi thư mục có `index.yaml` để import entities
4. **No test files**: Đã loại bỏ tất cả `.test.yaml` files

## Cấu Trúc Thư Mục

```
configs/
├── addon.yaml                    # Main entry point
│
├── materials/                    # Materials category
│   ├── index.yaml               # Import all material subcategories
│   ├── assets/                  # Material assets
│   │   ├── blocks/              # Block textures
│   │   ├── ores/                # Ore textures
│   │   ├── ingots/              # Ingot textures
│   │   ├── nuggets/             # Nugget textures
│   │   ├── dusts/               # Dust textures
│   │   ├── raw/                 # Raw material textures
│   │   └── special/             # Special item textures
│   ├── ores/
│   │   ├── index.yaml
│   │   └── ... (12 ore files)
│   ├── ingots/
│   │   ├── index.yaml
│   │   └── ... (11 ingot files)
│   ├── nuggets/
│   │   ├── index.yaml
│   │   └── ... (12 nugget files)
│   ├── dusts/
│   │   ├── index.yaml
│   │   └── ... (46 dust files)
│   ├── blocks/
│   │   ├── index.yaml
│   │   └── ... (12 block files)
│   ├── raw/
│   │   ├── index.yaml
│   │   └── ... (16 raw material files)
│   └── special/
│       ├── index.yaml
│       └── ... (7 special files)
│
├── tools/                        # Tools category
│   ├── index.yaml
│   ├── assets/                  # Tool textures (flat structure)
│   ├── pickaxes/
│   │   ├── index.yaml
│   │   └── ... (11 pickaxe files)
│   ├── axes/, shovels/, hoes/, swords/, spears/, hammers/
│   └── ... (79 tool files total)
│
├── armor/                        # Armor category
│   ├── index.yaml
│   ├── assets/
│   │   ├── items/               # Armor item textures
│   │   └── layers/              # Armor layer textures
│   ├── helmets/, chestplates/, leggings/, boots/
│   └── ... (47 armor files total)
│
├── foods/                        # Foods category
│   ├── index.yaml
│   ├── assets/                  # Food textures (flat structure)
│   └── canned/
│       ├── index.yaml
│       └── ... (16 food files)
│
├── machines/                     # Machines category
│   ├── index.yaml
│   ├── assets/                  # Machine block textures (flat structure)
│   └── ... (10 machine files)
│
├── special/                      # Special items category
│   ├── index.yaml
│   ├── assets/                  # Special item textures
│   └── ... (2 special files)
│
├── entities/                     # Entities category
│   ├── index.yaml
│   ├── assets/                  # Entity textures
│   └── ... (2 entity files)
│
├── ui/                          # UI category
│   ├── index.yaml
│   └── assets/                  # UI textures
│
├── structure/                    # Structure category
│   └── index.yaml
│
├── biomes/                       # Biomes category
│   └── index.yaml
│
└── lang/                         # Language files
    ├── vi_VN/
    │   ├── materials.yaml
    │   ├── tools.yaml
    │   ├── armor.yaml
    │   ├── foods.yaml
    │   └── special.yaml
    └── en_US/
        └── ... (same structure)
```

## Texture Path Rules

### Materials (2 levels deep from subcategory)
```yaml
# From configs/materials/ores/ardite_ore.yaml
texture: ../assets/ores/ardite_ore.png  # Up to materials/, then into assets/ores/

# From configs/materials/special/alloy_mixing_table.yaml  
texture: ../../machines/assets/alloy_mixing_table_top.png  # Special: machine block
```

### Tools (2 levels deep)
```yaml
# From configs/tools/pickaxes/ardite_pickaxe.yaml
texture: ../assets/ardite_pickaxe.png  # Up to tools/, then into assets/
```

### Armor (2 levels deep)
```yaml
# From configs/armor/helmets/ardite_helmet.yaml
texture: ../assets/items/ardite_helmet.png
layer: ../assets/layers/ardite_1.png
```

### Foods (2 levels deep)
```yaml
# From configs/foods/canned/cannedbeets.yaml
texture: ../assets/cannedbeets.png
```

### Machines (1 level deep)
```yaml
# From configs/machines/crusher.yaml
texture: ./assets/crusher_top.png  # Same level as machines/
```

### Special (1 level deep)
```yaml
# From configs/special/achievement_book.yaml
texture: ./assets/achievement_book.png
```

## Import Chain

```
addon.yaml
├── materials/index.yaml
│   ├── ores/index.yaml (12 files)
│   ├── ingots/index.yaml (11 files)
│   ├── nuggets/index.yaml (12 files)
│   ├── dusts/index.yaml (46 files)
│   ├── blocks/index.yaml (12 files)
│   ├── raw/index.yaml (16 files)
│   └── special/index.yaml (7 files)
├── tools/index.yaml
│   ├── pickaxes/index.yaml (11 files)
│   ├── axes/index.yaml (12 files)
│   ├── shovels/index.yaml (12 files)
│   ├── hoes/index.yaml (12 files)
│   ├── swords/index.yaml (12 files)
│   ├── spears/index.yaml (1 file)
│   └── hammers/index.yaml (19 files)
├── armor/index.yaml
│   ├── helmets/index.yaml (11 files)
│   ├── chestplates/index.yaml (12 files)
│   ├── leggings/index.yaml (12 files)
│   └── boots/index.yaml (12 files)
├── foods/index.yaml
│   └── canned/index.yaml (16 files)
├── machines/index.yaml (10 files)
├── special/index.yaml (2 files)
├── entities/index.yaml (2 files)
└── structure/index.yaml
```

## Compile Command

```bash
# Compile tất cả
bun run dev compile configs/addon.yaml --clean

# Output:
# - 404 files generated
# - 259 wiki items
# - All textures, recipes, lang files
```

## Statistics

- **Total Entities**: 259
  - Materials: 117
  - Tools: 80
  - Armor: 48
  - Foods: 14
  - Machines: 10 (NEW!)
  - Special: 2
  - Entities: 2
- **Total Assets**: 337 PNG files
- **Total Config Files**: ~280 YAML files
- **Generated Files**: 404 files

## Thêm Entity Mới

### Ví dụ: Thêm Copper Pickaxe

1. Tạo texture: `configs/tools/assets/copper_pickaxe.png`
2. Tạo file: `configs/tools/pickaxes/copper_pickaxe.yaml`
3. Update index: `configs/tools/pickaxes/index.yaml`
   ```yaml
   import:
     - ardite_pickaxe.yaml
     - copper_pickaxe.yaml  # Add this
     - ... other pickaxes
   ```
4. Compile: `bun run dev compile configs/addon.yaml --clean`

### Ví dụ: Thêm Material Mới (Aluminum)

1. Tạo assets trong `configs/materials/assets/`:
   - `ores/aluminum_ore.png`
   - `ingots/aluminum_ingot.png`
   - `nuggets/aluminum_nugget.png`
   - `blocks/aluminum_block.png`

2. Tạo YAML files:
   - `configs/materials/ores/aluminum_ore.yaml`
   - `configs/materials/ingots/aluminum_ingot.yaml`
   - `configs/materials/nuggets/aluminum_nugget.yaml`
   - `configs/materials/blocks/aluminum_block.yaml`

3. Update indexes trong mỗi subcategory

4. Compile: `bun run dev compile configs/addon.yaml --clean`

## Lợi Ích

1. **Self-contained**: Mỗi category có assets riêng, dễ quản lý
2. **Modular**: Dễ thêm/xóa/sửa từng entity
3. **Clean**: Không còn test files làm rối
4. **Organized**: Assets được phân loại rõ ràng theo category
5. **Scalable**: Dễ mở rộng với materials/tools mới
6. **Portable**: Di chuyển cả category (configs + assets) một lúc

## Migration Notes (2026-02-28)

- ✅ Đã xóa tất cả `.test.yaml` files (45 dòng imports)
- ✅ Đã di chuyển 264 assets vào trong configs
- ✅ Đã cập nhật texture paths trong YAML files
- ✅ Đã xóa 205 material folder duplicates
- ✅ Đã xóa 12 armor layer duplicates
- ✅ Đã xóa 61 misc duplicates
- ✅ Đã fix pack icon paths
- ✅ Đã thêm machines vào addon.yaml import
- ✅ Compilation thành công: 404 files generated
