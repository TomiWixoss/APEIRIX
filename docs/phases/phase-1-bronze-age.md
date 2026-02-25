# Phase 1: Bronze Age ✅

**Status:** HOÀN THÀNH
**Priority:** N/A (đã có)

---

## 📋 Tổng Quan

Phase đầu tiên đã được implement hoàn chỉnh, bao gồm:
- Bronze alloy system
- Tin ore
- Alloy Mixing Table
- Hammer Mining System
- Anvil Crushing System
- Dust system

---

## ✅ Đã Implement

### 1. Tin Ore & Materials
- **Tin Ore** (quặng thiếc)
  - Spawn: Y -16 to 112
  - Tool required: Stone Pickaxe
  - Drops: Raw Tin
- **Deepslate Tin Ore**
- **Raw Tin**
- **Tin Ingot**
- **Tin Nugget**
- **Tin Block**
- **Tin Dust**

### 2. Bronze Alloy
- **Bronze Mixture** (hỗn hợp đồng thiếc)
  - Recipe: 3 Copper + 1 Tin → 4 Bronze Mixture (Alloy Mixing Table)
- **Bronze Ingot**
  - Recipe: Bronze Mixture → Bronze Ingot (Furnace)
- **Bronze Nugget**
- **Bronze Block**

### 3. Bronze Tools (7 types)
- Bronze Pickaxe
- Bronze Axe
- Bronze Shovel
- Bronze Hoe
- Bronze Sword
- Bronze Spear
- Bronze Hammer

**Stats:**
- Durability: 375
- Mining Speed: 6.0
- Damage: 4
- Enchantability: 18
- Tier: Iron level

### 4. Bronze Armor (4 pieces)
- Bronze Helmet
- Bronze Chestplate
- Bronze Leggings
- Bronze Boots

**Stats:**
- Durability Multiplier: 15
- Protection: 15 (Iron level)
- Toughness: 0
- Enchantability: 18

### 5. Alloy Mixing Table
- **Block:** Alloy Mixing Table
- **Function:** Mix metals để tạo alloy mixtures
- **UI:** Custom form với input/output
- **Recipes:** Bronze (hiện tại), có thể mở rộng

### 6. Hammer Mining System
- **Function:** Mine blocks với hammer → drop dust
- **Blocks:** Ores, stones, etc.
- **Output:** 2-4 dust per block
- **Registry:** HammerRegistry.ts

### 7. Anvil Crushing System
- **Function:** Anvil rơi xuống block → vỡ thành dust
- **Output:** Nhiều dust hơn hammer (3-6 dust)
- **System:** AnvilCrushingSystem.ts
- **Registry:** CrushingRegistry.ts

### 8. Dust System (11 types)
- Coal Dust
- Cobblestone Dust
- Copper Dust
- Deepslate Dust
- Diamond Dust
- Emerald Dust
- Gold Dust
- Iron Dust
- Lapis Dust
- Netherrack Dust
- Tin Dust

**Recipe:** 9 Dust → 1 Raw/Ingot (Crafting Table)

---

## 📁 File Structure

### Configs
```
configs/materials/
├── tin/
│   ├── tin_ore.yaml
│   ├── deepslate_tin_ore.yaml
│   ├── raw_tin.yaml
│   ├── tin_ingot.yaml
│   ├── tin_nugget.yaml
│   ├── tin_block.yaml
│   └── index.yaml
├── bronze/
│   ├── bronze_mixture.yaml
│   ├── bronze_ingot.yaml
│   ├── bronze_nugget.yaml
│   ├── bronze_block.yaml
│   ├── alloy_mixing_table.yaml
│   └── index.yaml
└── dusts/
    ├── tin_ingot_dust.yaml
    ├── ... (11 dust types)
    └── index.yaml

configs/tools/bronze/
├── pickaxe.yaml
├── axe.yaml
├── shovel.yaml
├── hoe.yaml
├── sword.yaml
├── spear.yaml
├── hammer.yaml
└── index.yaml

configs/armor/bronze/
├── helmet.yaml
├── chestplate.yaml
├── leggings.yaml
├── boots.yaml
└── index.yaml
```

### Scripts
```
scripts/systems/
├── mining/
│   └── HammerMiningSystem.ts
└── crushing/
    └── AnvilCrushingSystem.ts

scripts/data/
├── mining/
│   └── HammerRegistry.ts
└── crushing/
    └── CrushingRegistry.ts
```

---

## 🎮 Gameplay

### Progression
1. Mine Tin Ore (Stone Pickaxe)
2. Smelt Raw Tin → Tin Ingot
3. Craft Alloy Mixing Table
4. Mix 3 Copper + 1 Tin → 4 Bronze Mixture
5. Smelt Bronze Mixture → Bronze Ingot
6. Craft Bronze Tools & Armor

### Alternative: Dust System
1. Craft Hammer (any tier)
2. Mine ores với hammer → drop dust
3. Collect 9 dust
4. Craft 9 dust → 1 raw/ingot
5. Hiệu quả hơn smelting!

### Alternative: Anvil Crushing
1. Place ore/stone blocks
2. Drop anvil lên trên
3. Block vỡ → drop nhiều dust
4. Collect và craft

---

## 📊 Stats Summary

| Item | Durability | Speed/Protection | Damage | Enchantability |
|------|------------|------------------|--------|----------------|
| Bronze Pickaxe | 375 | 6.0 | - | 18 |
| Bronze Axe | 375 | 6.0 | 5 | 18 |
| Bronze Shovel | 375 | 6.0 | - | 18 |
| Bronze Hoe | 375 | 6.0 | - | 18 |
| Bronze Sword | 375 | - | 4 | 18 |
| Bronze Spear | 375 | - | 5 | 18 |
| Bronze Hammer | 375 | 6.0 | 3 | 18 |
| Bronze Helmet | 165 | 2 | - | 18 |
| Bronze Chestplate | 240 | 6 | - | 18 |
| Bronze Leggings | 225 | 5 | - | 18 |
| Bronze Boots | 195 | 2 | - | 18 |

---

## 🎯 Lessons Learned

### What Works Well
- Alloy Mixing Table với UI form
- Hammer mining system
- Anvil crushing system
- Dust recipes (9 → 1)

### Bedrock Limitations
- Không thể tạo custom furnace block
- Không thể có inventory component cho custom blocks
- Phải dùng UI forms thay vì container GUIs

### Best Practices
- Dùng `lang:` prefix cho tất cả names
- Texture paths relative to config file
- Test commands trong `.test.yaml` files
- Registry pattern cho data management

---

## 📝 Notes for Future Phases

### Pattern to Follow
1. Tạo ore YAML (nếu cần)
2. Tạo material YAMLs (ingot, nugget, block, dust)
3. Tạo alloy mixture YAML
4. Tạo tools YAMLs (7 types)
5. Tạo armor YAMLs (4 pieces)
6. Tạo lang entries (vi_VN, en_US)
7. Tạo wiki data
8. Tạo test commands
9. Compile và test

### Texture Requirements
- Ore texture (block)
- Deepslate ore texture (block)
- Raw material texture (item)
- Ingot texture (item)
- Nugget texture (item)
- Block texture (block)
- Dust texture (item)
- Mixture texture (item)
- 7 tool textures (items)
- 4 armor item textures (items)
- 4 armor layer textures (2 layers)

---

**Next Phase:** [Phase 2: Steel Age](phase-2-steel-age.md)

**APEIRIX - Bronze Age Complete ✅**
