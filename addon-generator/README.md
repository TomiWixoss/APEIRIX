# APEIRIX Addon Generator v2.0

CLI tool 100% ĐỘNG với hỗ trợ đầy đủ blocks, ores, tools, armor, config files, dry-run và undo/rollback.

## ✨ Tính Năng Mới v2.0

- ✅ **Block Generator** - Tạo blocks với loot tables
- ✅ **Ore Generator** - Tạo ores với world generation (features + feature_rules) + Fortune support
- ✅ **Tool Generators** - Tách riêng từng loại (pickaxe, axe, shovel, hoe, sword) - KHÔNG hardcode recipe
- ✅ **Armor Generator** - Tạo full set (4 pieces) với attachables - KHÔNG hardcode recipe
- ✅ **Food Generator** - Tạo food items với nutrition, saturation, effects
- ✅ **Config File Support** - Batch generation từ YAML/JSON
- ✅ **Dry-Run Mode** - Preview trước khi thực hiện
- ✅ **Undo/Rollback** - Hoàn tác operations
- ✅ **History Tracking** - Xem lịch sử thay đổi
- ✅ **Auto Test Generation** - Tự động tạo test files (.md + .test.ts)

## Cài Đặt

```bash
cd addon-generator
bun install
```

## Commands

### 1. Tạo Item

```bash
apeirix item -i <id> -n <name> -t <texture> [options] [--recipe-shaped <json>] [--recipe-shapeless <json>] [--recipe-smelting <json>]
```

**Ví dụ đơn giản:**
```bash
bun run dev item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png -p ..
```

**Ví dụ với recipes:**
```bash
# Tạo copper_ingot + 2 recipes (nugget <-> ingot)
bun run dev item \
  -i copper_ingot \
  -n "Thỏi Đồng" \
  -t ./copper_ingot.png \
  --recipe-shaped '{"id":"copper_ingot_from_nuggets","pattern":["###","###","###"],"key":{"#":"copper_nugget"},"result":"copper_ingot","unlock":["copper_nugget"]}' \
  --recipe-shapeless '{"id":"copper_nugget_from_ingot","ingredients":["copper_ingot"],"result":"copper_nugget","resultCount":9,"unlock":["copper_ingot"]}' \
  -p ..
```

**Ví dụ với smelting:**
```bash
bun run dev item \
  -i copper_ingot \
  -n "Thỏi Đồng" \
  -t ./copper_ingot.png \
  --recipe-smelting '{"id":"copper_ingot_from_smelting","input":"raw_copper","output":"copper_ingot"}' \
  -p ..
```

### 2. Tạo Shaped Recipe (có pattern)

```bash
apeirix recipe:shaped \
  --id <recipe_id> \
  --pattern '<json_array>' \
  --key '<json_object>' \
  --result <item_id> \
  [--result-count <number>] \
  [--unlock <items>] \
  [-p <project>]
```

**Ví dụ - 9 nuggets → 1 ingot:**
```bash
bun run dev recipe:shaped \
  --id copper_ingot_from_nuggets \
  --pattern '["###","###","###"]' \
  --key '{"#":"copper_nugget"}' \
  --result copper_ingot \
  --unlock copper_nugget \
  -p ..
```

**Ví dụ - 9 ingots → 1 block:**
```bash
bun run dev recipe:shaped \
  --id copper_block_from_ingots \
  --pattern '["###","###","###"]' \
  --key '{"#":"copper_ingot"}' \
  --result copper_block \
  --unlock copper_ingot \
  -p ..
```

**Ví dụ - Sword recipe:**
```bash
bun run dev recipe:shaped \
  --id copper_sword \
  --pattern '[" # "," # "," S "]' \
  --key '{"#":"copper_ingot","S":"minecraft:stick"}' \
  --result copper_sword \
  --unlock copper_ingot \
  -p ..
```

### 3. Tạo Shapeless Recipe

```bash
apeirix recipe:shapeless \
  --id <recipe_id> \
  --ingredients <item1,item2,...> \
  --result <item_id> \
  [--result-count <number>] \
  [--unlock <items>] \
  [-p <project>]
```

**Ví dụ - 1 ingot → 9 nuggets:**
```bash
bun run dev recipe:shapeless \
  --id copper_nugget_from_ingot \
  --ingredients copper_ingot \
  --result copper_nugget \
  --result-count 9 \
  --unlock copper_ingot \
  -p ..
```

**Ví dụ - 1 block → 9 ingots:**
```bash
bun run dev recipe:shapeless \
  --id copper_ingot_from_block \
  --ingredients copper_block \
  --result copper_ingot \
  --result-count 9 \
  --unlock copper_block \
  -p ..
```

### 4. Tạo Smelting Recipe

```bash
apeirix recipe:smelting \
  --id <recipe_id> \
  --input <item_id> \
  --output <item_id> \
  [--tags <tag1,tag2>] \
  [-p <project>]
```

**Ví dụ:**
```bash
bun run dev recipe:smelting \
  --id copper_ingot_from_ore \
  --input raw_copper \
  --output copper_ingot \
  --tags furnace,blast_furnace \
  -p ..
```

## Workflow Hoàn Chỉnh

Tạo copper ingot với đầy đủ recipes:

```bash
# 1. Tạo item
bun run dev item -i copper_ingot -n "Thỏi Đồng" -t ./copper_ingot.png -p ..

# 2. Recipe: 9 nuggets → 1 ingot
bun run dev recipe:shaped \
  --id copper_ingot_from_nuggets \
  --pattern '["###","###","###"]' \
  --key '{"#":"copper_nugget"}' \
  --result copper_ingot \
  --unlock copper_nugget \
  -p ..

# 3. Recipe: 1 ingot → 9 nuggets
bun run dev recipe:shapeless \
  --id copper_nugget_from_ingot \
  --ingredients copper_ingot \
  --result copper_nugget \
  --result-count 9 \
  --unlock copper_ingot \
  -p ..

# 4. Recipe: 9 ingots → 1 block
bun run dev recipe:shaped \
  --id copper_block_from_ingots \
  --pattern '["###","###","###"]' \
  --key '{"#":"copper_ingot"}' \
  --result copper_block \
  --unlock copper_ingot \
  -p ..

# 5. Recipe: 1 block → 9 ingots
bun run dev recipe:shapeless \
  --id copper_ingot_from_block \
  --ingredients copper_block \
  --result copper_ingot \
  --result-count 9 \
  --unlock copper_block \
  -p ..

# 6. Recipe: smelting raw ore
bun run dev recipe:smelting \
  --id copper_ingot_from_smelting \
  --input raw_copper \
  --output copper_ingot \
  -p ..
```

## Cấu Trúc

```
addon-generator/
├── src/
│   ├── index.ts                    # CLI entry
│   ├── commands/
│   │   ├── ItemCommand.ts          # Item command
│   │   └── RecipeCommand.ts        # Recipe commands
│   ├── core/
│   │   ├── FileManager.ts          # File operations
│   │   └── Validator.ts            # Validation
│   └── generators/
│       ├── ItemGenerator.ts        # Generate items
│       ├── TextureGenerator.ts     # Texture handling
│       ├── LangGenerator.ts        # Lang files
│       └── RecipeGenerator.ts      # Recipe generation (100% động)
├── templates/                      # Mẫu tham khảo, ví dụ generic
├── configs/                        # Config files sẵn sàng chạy
└── package.json
```

## 📂 Templates vs Configs

- **`templates/`** - Mẫu tham khảo, ví dụ generic để học cách dùng
- **`configs/`** - Config files thực tế, sẵn sàng chạy với dữ liệu cụ thể

**Ví dụ:**
```bash
# Dùng config có sẵn
bun run dev batch -f configs/canned-food-system.yaml -p ..

# Tạo config mới từ template
cp templates/complete-material-set-template.yaml configs/my-material.yaml
# Edit configs/my-material.yaml
bun run dev batch -f configs/my-material.yaml -p ..
```

## Đặc Điểm

- ✅ 100% ĐỘNG - không có template cứng
- ✅ Truyền pattern, key, ingredients, result, unlock từ CLI
- ✅ Hỗ trợ shaped, shapeless, smelting recipes
- ✅ Modular - dễ thêm command mới
- ✅ Type-safe với TypeScript


## 🆕 Commands Mới v2.0

### 5. Tạo Block

```bash
apeirix block -i <id> -n <name> -t <texture> [options]
```

**Ví dụ:**
```bash
bun run dev block \
  -i magic_block \
  -n "Khối Ma Thuật" \
  -t ./magic_block.png \
  --category construction \
  --destroy-time 5.0 \
  --requires-tool \
  --tool-tier stone \
  -p ..
```

**Tự động tạo:**
- BP block JSON
- Loot table
- Copy texture vào RP
- Update terrain_texture.json
- Update lang files

### 6. Tạo Ore (với World Generation)

```bash
apeirix ore -i <id> -n <name> -t <texture> --raw-item <id> [options]
```

**Ví dụ:**
```bash
bun run dev ore \
  -i copper_ore \
  -n "Quặng Đồng" \
  -t ./copper_ore.png \
  --deepslate-texture ./deepslate_copper_ore.png \
  --raw-item raw_copper \
  --min-y 0 \
  --max-y 64 \
  --vein-size 9 \
  --veins-per-chunk 20 \
  --tool-tier stone \
  -p ..
```

**Tự động tạo:**
- Normal ore + deepslate ore blocks
- Loot tables với tool tier requirements
- World generation (features + feature_rules)
- Đăng ký vào OreRegistry.ts (Fortune support)
- Copy textures
- Update terrain_texture.json
- Update lang files

### 7. Tạo Tools (KHÔNG tạo recipe)

```bash
apeirix tool:pickaxe -i <id> -n <name> -t <texture> --material <id> [options]
apeirix tool:axe -i <id> -n <name> -t <texture> --material <id> [options]
apeirix tool:shovel -i <id> -n <name> -t <texture> --material <id> [options]
apeirix tool:hoe -i <id> -n <name> -t <texture> --material <id> [options]
apeirix tool:sword -i <id> -n <name> -t <texture> --material <id> [options]
```

**Ví dụ:**
```bash
bun run dev tool:pickaxe \
  -i copper_pickaxe \
  -n "Cuốc Đồng" \
  -t ./copper_pickaxe.png \
  --material copper_ingot \
  --durability 250 \
  --damage 4 \
  --efficiency 6 \
  -p ..
```

**Tự động tạo:**
- BP tool item JSON với đúng components
- Đăng ký vào ToolRegistry.ts
- Copy texture
- Update item_texture.json
- Update lang files

**Lưu ý:** Tool KHÔNG tự động tạo recipe. Tạo recipe riêng bằng `recipe:shaped`.

### 8. Tạo Armor Set (KHÔNG tạo recipes)

```bash
apeirix armor \
  --base-name <name> \
  --display-name <name> \
  --material <id> \
  --icons <path> \
  --layer1 <path> \
  --layer2 <path> \
  [options]
```

**Ví dụ:**
```bash
bun run dev armor \
  --base-name copper \
  --display-name "Giáp Đồng" \
  --material copper_ingot \
  --icons ./textures/armor/ \
  --layer1 ./textures/armor/copper_layer_1.png \
  --layer2 ./textures/armor/copper_layer_2.png \
  --durability-multiplier 1.0 \
  --protection-multiplier 1.0 \
  -p ..
```

**Tự động tạo:**
- 4 BP armor items (helmet, chestplate, leggings, boots)
- 4 RP attachables
- Copy icon textures
- Copy armor layer textures
- Update item_texture.json
- Update lang files

**Lưu ý:** Armor KHÔNG tự động tạo recipes. Tạo recipes riêng bằng `recipe:shaped`.

### 9. Tạo Food

```bash
apeirix food -i <id> -n <name> -t <texture> [options]
```

**Options:**
- `--nutrition <number>` - Nutrition value (default: 4)
- `--saturation <number>` - Saturation modifier (default: 1)
- `--use-duration <number>` - Use duration in seconds (default: 1.6)
- `--can-always-eat` - Có thể ăn khi đã no
- `-c, --category <category>` - Menu category (nature/equipment/items/construction)

**Ví dụ đơn giản:**
```bash
bun run dev food \
  -i apple_pie \
  -n "Bánh Táo" \
  -t ./apple_pie.png \
  -p ..
```

**Ví dụ với custom values:**
```bash
bun run dev food \
  -i golden_apple_pie \
  -n "Bánh Táo Vàng" \
  -t ./golden_apple_pie.png \
  --nutrition 8 \
  --saturation 1.5 \
  --use-duration 2.0 \
  --can-always-eat \
  -p ..
```

**Tự động tạo:**
- BP food item với minecraft:food component
- Copy texture
- Update item_texture.json
- Update lang files
- Tạo test files

**Lưu ý:** Food KHÔNG tự động tạo recipe. Tạo recipe riêng bằng `recipe:shaped/shapeless`.

### 10. Batch từ Config File

```bash
apeirix batch -f <config.yaml> [-p <project>]
```

**Ví dụ:**
```bash
bun run dev batch -f content.yaml -p ..
```

**Config format (YAML):**
```yaml
items:
  - id: magic_stone
    name: "Đá Ma Thuật"
    texture: ./textures/magic_stone.png

blocks:
  - id: magic_block
    name: "Khối Ma Thuật"
    texture: ./textures/magic_block.png

ores:
  - id: copper_ore
    name: "Quặng Đồng"
    texture: ./textures/copper_ore.png
    deepslateTexture: ./textures/deepslate_copper_ore.png
    rawItemId: raw_copper
    minY: 0
    maxY: 64

tools:
  - id: copper_pickaxe
    name: "Cuốc Đồng"
    type: pickaxe
    texture: ./textures/copper_pickaxe.png
    materialId: copper_ingot

armor:
  - baseName: copper
    displayNamePrefix: "Giáp Đồng"
    materialId: copper_ingot
    iconTexturesPath: ./textures/armor/
    armorLayer1: ./textures/armor/copper_layer_1.png
    armorLayer2: ./textures/armor/copper_layer_2.png

recipes:
  - type: shaped
    id: copper_ingot_from_nuggets
    pattern: ["###", "###", "###"]
    key: {"#": "copper_nugget"}
    result: copper_ingot
```

Xem `example-config.yaml` để biết thêm chi tiết.

### 10. Dry-Run Mode

Preview thay đổi mà không tạo file thật:

```bash
apeirix <command> [options] --dry-run
```

**Ví dụ:**
```bash
bun run dev ore -i test_ore -n "Test" -t ./test.png --raw-item raw_test --dry-run
```

**Output:**
```
🔍 Dry run - Các thao tác sẽ được thực hiện:

1. Tạo ore block: packs/BP/blocks/test_ore.json
2. Tạo loot table: packs/BP/loot_tables/blocks/test_ore.json
3. Tạo feature: packs/BP/features/test_ore_scatter.json
4. Tạo feature rule: packs/BP/feature_rules/test_ore_feature.json
5. Copy texture: packs/RP/textures/blocks/test_ore.png
6. Update terrain_texture.json
7. Update lang files
8. Đăng ký vào OreRegistry.ts

Tổng cộng: 8 thao tác

💡 Chạy lại không có --dry-run để thực hiện thật
```

### 11. Undo/Rollback

Hoàn tác operation cuối cùng:

```bash
apeirix undo [-p <project>]
```

**Ví dụ:**
```bash
bun run dev undo
```

**Chức năng:**
- Xóa các file đã tạo
- Restore nội dung cũ của files đã modify
- Lưu history trong `.addon-generator-history.json`

### 12. History

Xem lịch sử operations:

```bash
apeirix history [-l <limit>] [--clear] [-p <project>]
```

**Ví dụ:**
```bash
# Xem 10 operations gần nhất
bun run dev history

# Xem 20 operations
bun run dev history -l 20

# Xóa toàn bộ lịch sử
bun run dev history --clear
```

## 🎯 Workflow Hoàn Chỉnh

### Tạo Material Set (Copper)

```bash
# 1. Raw ore item
bun run dev item -i raw_copper -n "Đồng Thô" -t ./raw_copper.png -p ..

# 2. Ore với world gen
bun run dev ore \
  -i copper_ore \
  -n "Quặng Đồng" \
  -t ./copper_ore.png \
  --deepslate-texture ./deepslate_copper_ore.png \
  --raw-item raw_copper \
  --min-y 0 \
  --max-y 64 \
  -p ..

# 3. Ingot
bun run dev item -i copper_ingot -n "Thỏi Đồng" -t ./copper_ingot.png -p ..

# 4. Nugget
bun run dev item -i copper_nugget -n "Mảnh Đồng" -t ./copper_nugget.png -p ..

# 5. Block
bun run dev block -i copper_block -n "Khối Đồng" -t ./copper_block.png -p ..

# 6. Tools
bun run dev tool:pickaxe -i copper_pickaxe -n "Cuốc Đồng" -t ./copper_pickaxe.png --material copper_ingot -p ..
bun run dev tool:axe -i copper_axe -n "Rìu Đồng" -t ./copper_axe.png --material copper_ingot -p ..
bun run dev tool:shovel -i copper_shovel -n "Xẻng Đồng" -t ./copper_shovel.png --material copper_ingot -p ..
bun run dev tool:hoe -i copper_hoe -n "Cuốc Đồng" -t ./copper_hoe.png --material copper_ingot -p ..
bun run dev tool:sword -i copper_sword -n "Kiếm Đồng" -t ./copper_sword.png --material copper_ingot -p ..

# 7. Armor
bun run dev armor \
  --base-name copper \
  --display-name "Giáp Đồng" \
  --material copper_ingot \
  --icons ./textures/armor/ \
  --layer1 ./textures/armor/copper_layer_1.png \
  --layer2 ./textures/armor/copper_layer_2.png \
  -p ..

# 8. Recipes
bun run dev recipe:shaped --id copper_ingot_from_nuggets --pattern '["###","###","###"]' --key '{"#":"copper_nugget"}' --result copper_ingot -p ..
bun run dev recipe:shapeless --id copper_nugget_from_ingot --ingredients copper_ingot --result copper_nugget --result-count 9 -p ..
bun run dev recipe:shaped --id copper_block_from_ingots --pattern '["###","###","###"]' --key '{"#":"copper_ingot"}' --result copper_block -p ..
bun run dev recipe:shapeless --id copper_ingot_from_block --ingredients copper_block --result copper_ingot --result-count 9 -p ..
bun run dev recipe:smelting --id copper_ingot_from_smelting --input raw_copper --output copper_ingot -p ..
```

### Hoặc Dùng Config File

```bash
# Tạo file content.yaml với tất cả content
bun run dev batch -f content.yaml -p ..
```

## 📁 Cấu Trúc v2.0

```
addon-generator/
├── src/
│   ├── index.ts                    # CLI entry
│   ├── commands/
│   │   ├── ItemCommand.ts
│   │   ├── BlockCommand.ts         # ✅ Mới
│   │   ├── OreCommand.ts           # ✅ Mới
│   │   ├── ToolCommand.ts          # ✅ Mới
│   │   ├── ArmorCommand.ts         # ✅ Mới
│   │   ├── RecipeCommand.ts
│   │   └── BatchCommand.ts         # ✅ Mới
│   ├── core/
│   │   ├── FileManager.ts
│   │   ├── Validator.ts
│   │   ├── HistoryManager.ts       # ✅ Mới
│   │   ├── DryRunManager.ts        # ✅ Mới
│   │   └── ConfigLoader.ts         # ✅ Mới
│   └── generators/
│       ├── ItemGenerator.ts
│       ├── BlockGenerator.ts       # ✅ Mới
│       ├── OreGenerator.ts         # ✅ Mới
│       ├── ArmorGenerator.ts       # ✅ Mới
│       ├── TextureGenerator.ts
│       ├── LangGenerator.ts
│       ├── RecipeGenerator.ts
│       └── tools/                  # ✅ Mới
│           ├── PickaxeGenerator.ts
│           ├── AxeGenerator.ts
│           ├── ShovelGenerator.ts
│           ├── HoeGenerator.ts
│           └── SwordGenerator.ts
├── package.json
├── example-config.yaml             # ✅ Mới
└── README.md
```

## 🚀 Lợi Ích v2.0

1. **Không Hardcode Recipe** - Tools/armor không tự động tạo recipe, linh hoạt hơn
2. **Tách Riêng Tool Types** - Mỗi loại tool có generator riêng, dễ customize
3. **Ore với World Gen** - Tự động tạo features, feature_rules, Fortune registry
4. **Armor với Attachables** - Tự động tạo cả BP item và RP attachable
5. **Config File** - Batch generation từ YAML/JSON
6. **Dry Run** - Preview trước khi thực hiện
7. **Undo/Rollback** - Hoàn tác nếu sai
8. **History Tracking** - Xem lại lịch sử thay đổi

## 📝 Notes

- Tool và Armor KHÔNG tự động tạo recipes vì có thể có recipe khác nhau
- Ore tự động đăng ký vào OreRegistry.ts cho Fortune enchantment support
- Tất cả commands hỗ trợ `--dry-run` để preview
- Tất cả operations được track trong history, có thể undo
- Config file hỗ trợ cả YAML và JSON
