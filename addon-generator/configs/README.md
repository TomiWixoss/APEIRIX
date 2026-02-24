# APEIRIX Addon Configs

Tất cả YAML config files cho APEIRIX addon, được tổ chức theo category.

## 📁 Cấu Trúc

```
configs/
├── materials/          # Material sets (tin, bronze)
│   ├── tin-material.yaml
│   └── bronze-material.yaml
├── tools/              # Tool sets
│   └── bronze-tools.yaml
├── armor/              # Armor sets
│   └── bronze-armor.yaml
├── special/            # Special items
│   └── achievement-book.yaml
├── canned-food/        # Canned food system
│   ├── main.yaml
│   ├── items.yaml
│   ├── recipes.yaml
│   └── tests.yaml
├── bronze-spear.yaml   # Bronze spear (standalone)
└── README.md           # This file
```

## 🚀 Compile Commands

### Compile tất cả (recommended)
```bash
cd addon-generator

# Materials
bun run dev batch -f configs/materials/tin-material.yaml
bun run dev batch -f configs/materials/bronze-material.yaml

# Tools & Armor
bun run dev batch -f configs/tools/bronze-tools.yaml
bun run dev batch -f configs/armor/bronze-armor.yaml

# Special Items
bun run dev batch -f configs/special/achievement-book.yaml
bun run dev batch -f configs/bronze-spear.yaml

# Canned Food System
bun run dev batch -f configs/canned-food/main.yaml
```

### Compile từng phần

#### 1. Tin Material Set
```bash
bun run dev batch -f configs/materials/tin-material.yaml
```
Tạo:
- 3 items: raw_tin, tin_ingot, tin_nugget
- 3 blocks: tin_ore, deepslate_tin_ore, tin_block
- 10 recipes: smelting, blasting, crafting
- World gen: ore scatter + feature rules
- Loot tables: Fortune support

#### 2. Bronze Material Set
```bash
bun run dev batch -f configs/materials/bronze-material.yaml
```
Tạo:
- 2 items: bronze_ingot, bronze_nugget
- 1 block: bronze_block
- 5 recipes: alloy (3 copper + 1 tin → 4 bronze), crafting

#### 3. Bronze Tools
```bash
bun run dev batch -f configs/tools/bronze-tools.yaml
```
Tạo:
- 5 tools: pickaxe, axe, shovel, hoe, sword
- 5 recipes: shaped crafting
- Durability: 375, Speed: 6, Enchantability: 18

#### 4. Bronze Armor
```bash
bun run dev batch -f configs/armor/bronze-armor.yaml
```
Tạo:
- 4 armor pieces: helmet, chestplate, leggings, boots
- 8 recipes: 4 normal + 4 from block
- 4 attachables (RP)
- Protection: 2/5/4/1, Durability: 220/320/300/260

#### 5. Achievement Book
```bash
bun run dev batch -f configs/special/achievement-book.yaml
```
Tạo:
- 1 special item: achievement_book
- NO recipes (special item)

#### 6. Bronze Spear
```bash
bun run dev batch -f configs/bronze-spear.yaml
```
Tạo:
- 1 weapon: bronze_spear
- 1 recipe: shaped crafting
- Special components: piercing_weapon, kinetic_weapon

#### 7. Canned Food System
```bash
bun run dev batch -f configs/canned-food/main.yaml
```
Tạo:
- 12 food items
- 14 recipes
- Test functions

## 📊 Coverage

### Items: 28/28 (100%)
- ✅ 3 tin materials
- ✅ 2 bronze materials
- ✅ 5 bronze tools
- ✅ 4 bronze armor
- ✅ 1 bronze spear
- ✅ 12 canned foods
- ✅ 1 achievement book

### Blocks: 4/4 (100%)
- ✅ 2 tin ores (overworld + deepslate)
- ✅ 1 tin block
- ✅ 1 bronze block

### Recipes: 42/42 (100%)
- ✅ 10 tin recipes
- ✅ 5 bronze material recipes
- ✅ 5 bronze tool recipes
- ✅ 8 bronze armor recipes
- ✅ 1 bronze spear recipe
- ✅ 14 canned food recipes

### World Gen: 2/2 (100%)
- ✅ 1 tin ore feature
- ✅ 1 tin ore feature rule

### Attachables: 4/4 (100%)
- ✅ 4 bronze armor attachables

## ✅ Verification Checklist

Sau khi compile, verify:

### 1. Files Generated
- [ ] All JSON files in `packs/BP/items/`
- [ ] All JSON files in `packs/BP/blocks/`
- [ ] All JSON files in `packs/BP/recipes/`
- [ ] All JSON files in `packs/BP/features/`
- [ ] All JSON files in `packs/BP/feature_rules/`
- [ ] All JSON files in `packs/BP/loot_tables/blocks/`
- [ ] All JSON files in `packs/RP/attachables/`

### 2. Textures
- [ ] All item textures in `packs/RP/textures/items/`
- [ ] All block textures in `packs/RP/textures/blocks/`
- [ ] Armor layer textures in `packs/RP/textures/models/armor/`

### 3. Lang Files
- [ ] All entries in `packs/BP/texts/en_US.lang`
- [ ] All entries in `packs/RP/texts/en_US.lang`

### 4. GameData.ts Registrations
- [ ] OreRegistry: tin_ore, deepslate_tin_ore
- [ ] ToolRegistry: 5 bronze tools + bronze_spear
- [ ] FoodRegistry: 12 canned foods

### 5. In-Game Testing
- [ ] Tin ore generates in world (Y: 0-64)
- [ ] Fortune works on tin ore
- [ ] Bronze alloy recipe works (3 copper + 1 tin → 4 bronze)
- [ ] All tools mine correctly
- [ ] All armor protects correctly
- [ ] Canned foods work correctly
- [ ] Achievement book opens UI

## 🔧 Troubleshooting

### Generator không tìm thấy texture
- Verify texture path trong YAML (relative to config file)
- Check texture file tồn tại trong `packs/RP/textures/`

### Recipe không unlock
- Verify `unlock` field trong recipe YAML
- Check item ID đúng với namespace `apeirix:`

### World gen không hoạt động
- Verify feature và feature_rule được tạo
- Check biome filter và distribution settings
- Run `/reload` trong game

### Armor không render
- Verify attachables được tạo trong `packs/RP/attachables/`
- Check armor layer textures tồn tại
- Verify geometry references đúng

## 📝 Notes

- Tất cả configs đã được tạo từ existing JSON files
- Textures đã có sẵn trong `packs/RP/textures/`
- Lang entries đã có sẵn trong `packs/BP/texts/en_US.lang`
- Chỉ cần compile và test in-game

## 🎯 Next Steps

1. Compile tất cả configs
2. Verify files generated
3. Test in-game
4. Update GameData.ts nếu cần
5. Run full integration test
