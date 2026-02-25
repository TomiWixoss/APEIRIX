# Phase 3: Precious Metals - Silver & Gold Alloys

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐⭐⭐ (CAO)

---

## 📋 Tổng Quan

Phase này tập trung vào kim loại quý và enchanting. Bao gồm:
- Silver Ore (quặng bạc)
- Electrum (Gold + Silver) - Enchanting focus
- Rose Gold (Gold + Copper) - Decorative
- White Gold (Gold + Silver) - Prestige

---

## 🎯 Alloys & Materials

### 1. Silver Ore & Materials
**Ore Spawn:** Y: -64 to 32, Uncommon, Iron Pickaxe required

**Materials:**
- Silver Ore, Deepslate Silver Ore
- Raw Silver
- Silver Ingot, Silver Nugget, Silver Block
- Silver Dust

**Tools & Armor:** Full set
**Stats:** Durability: 250, Speed: 11.0, Damage: 3, Enchantability: 24

### 2. Electrum (Vàng Điện)
**Recipe:** 1 Gold + 1 Silver → 2 Electrum

**Stats:**
- Durability: 200 (gấp đôi Gold)
- Speed: 12.0
- Damage: 2
- Enchantability: 25 (cao nhất!)
- Đặc biệt: +50% XP khi enchant

### 3. Rose Gold (Vàng Hồng)
**Recipe:** 3 Gold + 1 Copper → 4 Rose Gold

**Stats:**
- Durability: 150
- Speed: 12.0
- Damage: 2
- Enchantability: 28
- Đặc biệt: Luck bonus, decorative

### 4. White Gold (Vàng Trắng)
**Recipe:** 3 Gold + 1 Silver → 4 White Gold

**Stats:**
- Durability: 180
- Speed: 12.0
- Damage: 2
- Enchantability: 26
- Đặc biệt: Glow effect, prestige

---

## 📁 File Structure

```
configs/materials/
├── silver/
│   ├── silver_ore.yaml
│   ├── deepslate_silver_ore.yaml
│   ├── raw_silver.yaml
│   ├── silver_ingot.yaml
│   ├── silver_nugget.yaml
│   ├── silver_block.yaml
│   └── index.yaml
├── electrum/
│   ├── electrum_mixture.yaml
│   ├── electrum_ingot.yaml
│   ├── electrum_nugget.yaml
│   ├── electrum_block.yaml
│   └── index.yaml
├── rose_gold/
│   └── ... (same structure)
└── white_gold/
    └── ... (same structure)

configs/tools/
├── silver/
├── electrum/
├── rose_gold/
└── white_gold/

configs/armor/
├── silver/
├── electrum/
├── rose_gold/
└── white_gold/
```

---

## 🎨 Textures Cần Tạo

### Silver (13 textures)
- Ore, Deepslate Ore, Raw, Ingot, Nugget, Block, Dust
- 7 tools
- 6 armor (4 items + 2 layers)

### Electrum (16 textures)
- Mixture, Ingot, Nugget, Block
- 7 tools
- 6 armor

### Rose Gold (16 textures)
- Pink/rose tint
- Decorative patterns

### White Gold (16 textures)
- White/silver tint
- Glow effect

**TỔNG: ~61 textures**

---

## 🎮 Gameplay

### Silver Mining
1. Mine Silver Ore (Iron Pickaxe, Y: -64 to 32)
2. Smelt Raw Silver → Silver Ingot
3. Craft Silver tools (enchantability 24!)

### Electrum Crafting
1. Get Gold + Silver
2. Mix 1:1 → 2 Electrum
3. Best for enchanting (enchantability 25)
4. Bonus: +50% XP when enchanting

### Rose Gold (Decorative)
1. Mix 3 Gold + 1 Copper → 4 Rose Gold
2. Beautiful pink color
3. Luck bonus effect

### White Gold (Prestige)
1. Mix 3 Gold + 1 Silver → 4 White Gold
2. Shiny white/silver
3. Glow in dark

---

## 📊 Stats Comparison

| Alloy | Durability | Speed | Enchantability | Special |
|-------|------------|-------|----------------|---------|
| Silver | 250 | 11.0 | 24 | High enchant |
| Electrum | 200 | 12.0 | 25 | +50% XP |
| Rose Gold | 150 | 12.0 | 28 | Luck |
| White Gold | 180 | 12.0 | 26 | Glow |

---

**Next:** [Phase 4: Industrial Metals](phase-4-industrial-metals.md)
