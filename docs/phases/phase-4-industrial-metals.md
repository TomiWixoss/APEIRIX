# Phase 4: Industrial Metals - Nickel Alloys

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐⭐⭐ (CAO)

---

## 📋 Tổng Quan

Phase này tập trung vào kim loại công nghiệp với special effects:
- Nickel Ore (quặng niken)
- Invar (Iron + Nickel) - Fire Resistance
- Cupronickel (Copper + Nickel) - Water Breathing
- Constantan (Copper + Nickel) - Utility only

---

## 🎯 Alloys & Materials

### 1. Nickel Ore & Materials
**Ore Spawn:** Y: -32 to 16, Uncommon, Iron Pickaxe

**Materials:**
- Nickel Ore, Deepslate Nickel Ore
- Raw Nickel
- Nickel Ingot, Nickel Nugget, Nickel Block
- Nickel Dust

### 2. Invar (Hợp Kim Sắt-Niken)
**Recipe:** 2 Iron + 1 Nickel → 3 Invar

**Stats:**
- Durability: 800 (cao nhất trong tier!)
- Speed: 6.0
- Damage: 4
- Enchantability: 12
- **Đặc biệt:** Fire Resistance khi mang full armor set

### 3. Cupronickel (Đồng-Niken Biển)
**Recipe:** 3 Copper + 1 Nickel → 4 Cupronickel

**Stats:**
- Durability: 450
- Speed: 6.0
- Damage: 4
- Enchantability: 15
- **Đặc biệt:** Water Breathing khi mang helmet, +20% damage to aquatic mobs

### 4. Constantan (Utility)
**Recipe:** 1 Copper + 1 Nickel → 2 Constantan

**Không làm tools/armor!**
**Dùng cho:**
- Wire (dây điện)
- Thermometer (nhiệt kế)
- Redstone components

---

## 📁 File Structure

```
configs/materials/
├── nickel/
│   └── ... (ore, raw, ingot, nugget, block, dust)
├── invar/
│   └── ... (mixture, ingot, nugget, block)
├── cupronickel/
│   └── ... (mixture, ingot, nugget, block)
└── constantan/
    └── ... (mixture, ingot, nugget, block)
    └── wire.yaml, thermometer.yaml

configs/tools/
├── invar/
└── cupronickel/

configs/armor/
├── invar/
└── cupronickel/
```

---

## 🎨 Textures Cần Tạo

### Nickel (7 textures)
- Ore, Deepslate Ore, Raw, Ingot, Nugget, Block, Dust

### Invar (16 textures)
- Materials + 7 tools + 6 armor

### Cupronickel (16 textures)
- Materials + 7 tools + 6 armor

### Constantan (6 textures)
- Materials + Wire + Thermometer

**TỔNG: ~45 textures**

---

## 🎮 Gameplay & Effects

### Invar - Fire Protection
1. Craft full Invar armor set
2. Wear all 4 pieces
3. Get Fire Resistance effect
4. Walk in lava safely!

### Cupronickel - Ocean Explorer
1. Craft Cupronickel helmet
2. Wear helmet
3. Get Water Breathing
4. Explore ocean depths!
5. Bonus damage to Drowned, Guardians, etc.

### Constantan - Utility
1. Craft Constantan Wire
2. Use for redstone circuits
3. Craft Thermometer
4. Check biome temperature

---

## 💻 Script Implementation

### Armor Effects System
```typescript
// scripts/systems/armor/ArmorEffectsSystem.ts
class ArmorEffectsSystem {
  checkInvarSet(player) {
    if (hasFullSet(player, 'invar')) {
      player.addEffect('fire_resistance', 999999, 0, false);
    }
  }
  
  checkCupronickelHelmet(player) {
    if (hasHelmet(player, 'cupronickel')) {
      player.addEffect('water_breathing', 999999, 0, false);
    }
  }
}
```

---

## 📊 Stats Comparison

| Alloy | Durability | Protection | Special Effect |
|-------|------------|------------|----------------|
| Invar | 800 | 15 | Fire Resistance (full set) |
| Cupronickel | 450 | 15 | Water Breathing (helmet) |
| Constantan | - | - | Utility items only |

---

**Next:** [Phase 5: Light Metals](phase-5-light-metals.md)
