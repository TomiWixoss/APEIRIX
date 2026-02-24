# APEIRIX Addon Generator

CLI tool 100% ĐỘNG - tất cả từ parameters, không có template cứng.

## Cài Đặt

```bash
cd addon-generator
bun install
```

## Commands

### 1. Tạo Item (có thể kèm recipes)

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
└── package.json
```

## Đặc Điểm

- ✅ 100% ĐỘNG - không có template cứng
- ✅ Truyền pattern, key, ingredients, result, unlock từ CLI
- ✅ Hỗ trợ shaped, shapeless, smelting recipes
- ✅ Modular - dễ thêm command mới
- ✅ Type-safe với TypeScript
