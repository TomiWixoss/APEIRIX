# Phase 2: Iron Age - Steel & Basic Alloys

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐⭐⭐⭐ (CAO NHẤT - NỀN TẢNG)

---

## 📋 Tổng Quan

Phase này tập trung vào Steel - hợp kim quan trọng nhất và là nền tảng cho nhiều alloys khác. Bao gồm:
- Steel (Iron + Coal)
- Damascus Steel (Steel + Iron + Coal)
- Stainless Steel (Steel + Chromium)
- Chromium Ore (quặng mới)

---

## 🎯 Mục Tiêu

### 1. Steel Alloy (Thép)
**Công thức:** 4 Iron + 1 Coal → 4 Steel Mixture → 4 Steel Ingot

**Materials cần tạo:**
- Steel Mixture (hỗn hợp thép)
- Steel Ingot
- Steel Nugget
- Steel Block
- Steel Dust

**Tools (7 types):**
- Steel Pickaxe
- Steel Axe
- Steel Shovel
- Steel Hoe
- Steel Sword
- Steel Spear
- Steel Hammer

**Armor (4 pieces):**
- Steel Helmet
- Steel Chestplate
- Steel Leggings
- Steel Boots

**Stats:**
- Tier: Iron+
- Durability: 600 (cao hơn Iron 50%)
- Mining Speed: 6.6
- Damage: 5 (+1 so với Iron)
- Enchantability: 14
- Protection: 18

### 2. Damascus Steel (Thép Damascus)
**Công thức:** 2 Steel + 1 Iron + 1 Coal → 3 Damascus Steel

**Materials:**
- Damascus Steel Mixture
- Damascus Steel Ingot
- Damascus Steel Nugget
- Damascus Steel Block

**Tools & Armor:** Full set

**Stats:**
- Tier: Iron+
- Durability: 700
- Mining Speed: 6.8
- Damage: 6
- Enchantability: 16
- Đặc biệt: Sharpness bonus, decorative pattern

### 3. Chromium Ore (Quặng Crom)
**Spawn:** Y: -32 to 32
**Vein Size:** 6-8 blocks
**Frequency:** Uncommon
**Tool Required:** Iron Pickaxe

**Materials:**
- Chromium Ore
- Deepslate Chromium Ore
- Raw Chromium
- Chromium Ingot
- Chromium Nugget
- Chromium Block
- Chromium Dust

### 4. Stainless Steel (Thép Không Gỉ)
**Công thức:** 3 Steel + 1 Chromium → 4 Stainless Steel

**Materials:**
- Stainless Steel Mixture
- Stainless Steel Ingot
- Stainless Steel Nugget
- Stainless Steel Block

**Tools & Armor:** Full set

**Stats:**
- Tier: Iron
- Durability: 500
- Mining Speed: 6.2
- Damage: 4
- Enchantability: 12
- Đặc biệt: Không bị ăn mòn (water/lava)

---

## 📁 File Structure Cần Tạo

### Configs - Materials
```
configs/materials/
├── steel/
│   ├── steel_mixture.yaml
│   ├── steel_ingot.yaml
│   ├── steel_ingot.test.yaml
│   ├── steel_nugget.yaml
│   ├── steel_block.yaml
│   └── index.yaml
├── damascus_steel/
│   ├── damascus_steel_mixture.yaml
│   ├── damascus_steel_ingot.yaml
│   ├── damascus_steel_ingot.test.yaml
│   ├── damascus_steel_nugget.yaml
│   ├── damascus_steel_block.yaml
│   └── index.yaml
├── chromium/
│   ├── chromium_ore.yaml
│   ├── deepslate_chromium_ore.yaml
│   ├── raw_chromium.yaml
│   ├── chromium_ingot.yaml
│   ├── chromium_ingot.test.yaml
│   ├── chromium_nugget.yaml
│   ├── chromium_block.yaml
│   └── index.yaml
├── stainless_steel/
│   ├── stainless_steel_mixture.yaml
│   ├── stainless_steel_ingot.yaml
│   ├── stainless_steel_ingot.test.yaml
│   ├── stainless_steel_nugget.yaml
│   ├── stainless_steel_block.yaml
│   └── index.yaml
└── dusts/
    ├── steel_dust.yaml
    ├── damascus_steel_dust.yaml
    ├── chromium_dust.yaml
    ├── stainless_steel_dust.yaml
    └── index.yaml (update)
```

### Configs - Tools
```
configs/tools/
├── steel/
│   ├── pickaxe.yaml
│   ├── axe.yaml
│   ├── shovel.yaml
│   ├── hoe.yaml
│   ├── sword.yaml
│   ├── spear.yaml
│   ├── hammer.yaml
│   ├── index.yaml
│   └── index.test.yaml
├── damascus_steel/
│   ├── ... (same structure)
└── stainless_steel/
    ├── ... (same structure)
```

### Configs - Armor
```
configs/armor/
├── steel/
│   ├── helmet.yaml
│   ├── chestplate.yaml
│   ├── leggings.yaml
│   ├── boots.yaml
│   ├── index.yaml
│   └── index.test.yaml
├── damascus_steel/
│   ├── ... (same structure)
└── stainless_steel/
    ├── ... (same structure)
```

### Configs - Lang
```
configs/lang/
├── en_US/
│   ├── materials.yaml (update)
│   ├── tools.yaml (update)
│   └── armor.yaml (update)
└── vi_VN/
    ├── materials.yaml (update)
    ├── tools.yaml (update)
    └── armor.yaml (update)
```

### Configs - Wiki
```
configs/script-lang/
├── en_US/wiki/
│   ├── materials/
│   │   ├── steel.yaml
│   │   ├── damascus_steel.yaml
│   │   ├── chromium.yaml
│   │   └── stainless_steel.yaml
│   ├── tools/
│   │   ├── steel.yaml
│   │   ├── damascus_steel.yaml
│   │   └── stainless_steel.yaml
│   └── armor/
│       ├── steel.yaml
│       ├── damascus_steel.yaml
│       └── stainless_steel.yaml
└── vi_VN/wiki/
    └── ... (same structure)
```

---

## 🎨 Textures Cần Tạo

### Chromium Ore (3 textures)
- `chromium_ore.png` (block)
- `deepslate_chromium_ore.png` (block)
- `raw_chromium.png` (item)

### Chromium Materials (4 textures)
- `chromium_ingot.png` (item)
- `chromium_nugget.png` (item)
- `chromium_block.png` (block)
- `chromium_dust.png` (item)

### Steel Materials (5 textures)
- `steel_mixture.png` (item)
- `steel_ingot.png` (item)
- `steel_nugget.png` (item)
- `steel_block.png` (block)
- `steel_dust.png` (item)

### Steel Tools (7 textures)
- `steel_pickaxe.png`
- `steel_axe.png`
- `steel_shovel.png`
- `steel_hoe.png`
- `steel_sword.png`
- `steel_spear.png`
- `steel_hammer.png`

### Steel Armor (6 textures)
- `steel_helmet.png` (item)
- `steel_chestplate.png` (item)
- `steel_leggings.png` (item)
- `steel_boots.png` (item)
- `steel_layer_1.png` (armor layer)
- `steel_layer_2.png` (armor layer)

### Damascus Steel (16 textures total)
- Materials: 5 textures
- Tools: 7 textures
- Armor: 6 textures (với decorative pattern!)

### Stainless Steel (16 textures total)
- Materials: 5 textures
- Tools: 7 textures
- Armor: 6 textures

**TỔNG: ~60 textures cần tạo**

---

## 📝 Implementation Steps

### Bước 1: Chromium Ore
1. Tạo `configs/materials/chromium/` folder
2. Copy structure từ `tin/` folder
3. Tạo tất cả YAML files (ore, raw, ingot, nugget, block, dust)
4. Update `configs/materials/index.yaml`
5. Tạo textures (hoặc placeholder)
6. Compile và test: `/give @s apeirix:chromium_ore`

### Bước 2: Steel Alloy
1. Tạo `configs/materials/steel/` folder
2. Tạo mixture, ingot, nugget, block, dust YAMLs
3. Add recipe trong `steel_mixture.yaml`:
   ```yaml
   alloy_recipe:
     inputs:
       - item: minecraft:iron_ingot
         count: 4
       - item: minecraft:coal
         count: 1
     output:
       item: apeirix:steel_mixture
       count: 4
   ```
4. Update Alloy Mixing Table recipes
5. Compile và test

### Bước 3: Steel Tools
1. Tạo `configs/tools/steel/` folder
2. Copy structure từ `bronze/` folder
3. Update stats (durability: 600, speed: 6.6, damage: +1)
4. Tạo 7 tool YAMLs
5. Tạo textures
6. Compile và test

### Bước 4: Steel Armor
1. Tạo `configs/armor/steel/` folder
2. Copy structure từ `bronze/` folder
3. Update stats (durability_mult: 18, protection: 18)
4. Tạo 4 armor YAMLs
5. Tạo textures (items + layers)
6. Compile và test

### Bước 5: Damascus Steel
1. Repeat steps 2-4 cho Damascus Steel
2. Recipe: 2 Steel + 1 Iron + 1 Coal → 3 Damascus Steel
3. Decorative pattern trong textures

### Bước 6: Stainless Steel
1. Repeat steps 2-4 cho Stainless Steel
2. Recipe: 3 Steel + 1 Chromium → 4 Stainless Steel
3. Add corrosion-proof effect (script)

### Bước 7: Lang & Wiki
1. Update `configs/lang/en_US/materials.yaml`
2. Update `configs/lang/vi_VN/materials.yaml`
3. Update tools.yaml và armor.yaml
4. Tạo wiki data files
5. Compile

### Bước 8: Testing
1. Test mining Chromium Ore
2. Test smelting Raw Chromium
3. Test mixing Steel
4. Test crafting tools/armor
5. Test durability và damage
6. Test special effects (corrosion-proof)

---

## 🎮 Gameplay Flow

### Steel Progression
1. Mine Iron Ore (vanilla)
2. Get Coal (vanilla)
3. Mix 4 Iron + 1 Coal → 4 Steel Mixture (Alloy Mixing Table)
4. Smelt Steel Mixture → Steel Ingot
5. Craft Steel Tools & Armor
6. Enjoy 50% more durability!

### Damascus Steel Progression
1. Craft Steel first
2. Mix 2 Steel + 1 Iron + 1 Coal → 3 Damascus Steel
3. Craft Damascus tools (sharpness bonus!)

### Stainless Steel Progression
1. Mine Chromium Ore (Iron Pickaxe)
2. Smelt Raw Chromium → Chromium Ingot
3. Mix 3 Steel + 1 Chromium → 4 Stainless Steel
4. Craft Stainless tools (never corrode!)

---

## 📊 Stats Summary

| Alloy | Durability | Speed | Damage | Protection | Enchantability | Special |
|-------|------------|-------|--------|------------|----------------|---------|
| Steel | 600 | 6.6 | 5 | 18 | 14 | Durable |
| Damascus | 700 | 6.8 | 6 | 17 | 16 | Sharpness |
| Stainless | 500 | 6.2 | 4 | 16 | 12 | Corrosion-proof |

---

## 🎯 Success Criteria

- [ ] Chromium Ore spawns correctly
- [ ] Steel mixture crafts in Alloy Mixing Table
- [ ] Steel tools have correct durability (600)
- [ ] Steel armor has correct protection (18)
- [ ] Damascus Steel has decorative pattern
- [ ] Stainless Steel doesn't take damage in water/lava
- [ ] All items have correct lang entries
- [ ] Wiki data displays correctly
- [ ] Test commands work

---

## 💡 Tips

### Texture Creation
- Steel: Gray/silver color
- Damascus: Wavy pattern (layered steel)
- Stainless: Shiny silver/chrome
- Chromium: Green-ish gray

### Balancing
- Steel should be better than Iron but not as good as Diamond
- Damascus is decorative + combat focus
- Stainless is utility focus (corrosion-proof)

### Testing
- Use `/give` commands để test nhanh
- Test durability bằng cách mine nhiều blocks
- Test damage bằng cách đánh mobs
- Test corrosion-proof trong water/lava

---

**Next Phase:** [Phase 3: Precious Metals](phase-3-precious-metals.md)

**APEIRIX - Steel Age 🔨**
