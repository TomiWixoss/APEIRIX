# Phase 11: Utility Resources - Sulfur, Salt, Cinnabar

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐ (THẤP)

---

## 📋 Tổng Quan

Utility resources không phải metals nhưng hữu ích:
- Sulfur (Nether) - Gunpowder, chemicals
- Salt (Desert) - Food preservation, chemicals
- Cinnabar (Underground) - Mercury source

---

## 🎯 Resources

### 1. Sulfur Deposit
**Location:** Nether (Y: 0-128), Common
**Tool:** Any Pickaxe
**Drops:** Sulfur (không cần smelt)

**Uses:**
- Craft Gunpowder (alternative recipe)
- Craft Sulfuric Acid
- Craft Matches
- Craft Rubber (vulcanization)

### 2. Salt Deposit
**Location:** Desert biomes (Y: 50-70), Common
**Tool:** Any Pickaxe
**Drops:** Salt (không cần smelt)

**Uses:**
- Food preservation (extend food duration)
- Craft Salt Block (decorative)
- Craft chemicals (electrolysis)
- Trading với villagers

### 3. Cinnabar Ore
**Location:** Underground (Y: -32 to 16), Uncommon
**Tool:** Iron Pickaxe
**Drops:** Cinnabar
**Smelting:** Cinnabar → Mercury (liquid item)

**Uses:**
- Craft Thermometer
- Craft Red Dye (vibrant)
- Craft Amalgam (gold extraction)
- Craft Batteries

---

## 📁 File Structure

```
configs/materials/
├── sulfur/
│   ├── sulfur_deposit.yaml
│   ├── sulfur.yaml
│   ├── sulfuric_acid.yaml
│   └── index.yaml
├── salt/
│   ├── salt_deposit.yaml
│   ├── salt.yaml
│   ├── salt_block.yaml
│   └── index.yaml
└── cinnabar/
    ├── cinnabar_ore.yaml
    ├── cinnabar.yaml
    ├── mercury.yaml
    ├── thermometer.yaml
    └── index.yaml
```

---

## 🎮 Gameplay Uses

### Sulfur
- Alternative gunpowder recipe (cheaper)
- Chemical crafting
- Industrial recipes

### Salt
- Preserve foods (longer duration)
- Decorative salt blocks
- Trading currency

### Mercury/Cinnabar
- Thermometer (check temperature)
- Red dye (vibrant color)
- Advanced crafting

---

## 🎨 Textures: ~15 textures
- Sulfur: Yellow deposits
- Salt: White/crystalline
- Cinnabar: Red ore
- Mercury: Liquid silver

---

**Next:** [Phase 12: Decorative & Building](phase-12-decorative.md)
