# 🔨 APEIRIX - Tổng Quan Hệ Thống

## 🎯 Mục Tiêu

Tạo một hệ thống luyện kim hoàn chỉnh và thực tế cho Minecraft Bedrock Edition, bao gồm:
- 20 hợp kim khác nhau (từ Bronze đến Adamantite)
- 15 quặng mới
- 140+ tools mới
- 80+ armor pieces mới
- 100+ decorative blocks

## 📊 Danh Sách Hợp Kim (20 Total)

### Tier 1: Low Tier (Stone - Iron Level)
1. **Brass** - Decorative, enchantability cao
2. **Rose Gold** - Decorative, luck bonus
3. **White Gold** - Decorative, glow effect

### Tier 2: Mid Tier (Iron - Iron+ Level)
4. **Bronze** ✅ - Balanced, đã implement
5. **Steel** - Durable, nền tảng
6. **Damascus Steel** - Sharpness bonus, decorative pattern
7. **Stainless Steel** - Corrosion-proof
8. **Invar** - Fire resistance, durability cao
9. **Cupronickel** - Water breathing, ocean focus
10. **Duralumin** - Lightweight, speed boost

### Tier 3: High Tier (Diamond Level)
11. **Titanium Steel** - Knockback resist
12. **Cobalt Steel** - Ultra fast mining
13. **Tungsten Steel** - Armor piercing
14. **Platinum** - Prestige, không ăn mòn
15. **Meteoric Iron** - Cosmic power

### Tier 4: Ultra Tier (Diamond+ - Netherite Level)
16. **Mithril** - Fantasy, glow effect, XP bonus
17. **Adamantite** - Unbreakable, highest tier

### Tier 5: Special/Utility
18. **Electrum** - Enchanting focus, XP bonus
19. **Constantan** - Utility, không làm tools/armor
20. **Pewter** - Decorative, không làm tools/armor

## ⛏️ Danh Sách Quặng (15 Total)

### Common Ores (Dễ tìm)
1. **Zinc Ore** - Y: 0-64, common
2. **Bauxite Ore** - Y: 40-96, common (Aluminum source)
3. **Salt Deposit** - Y: 50-70, Desert biomes

### Uncommon Ores (Trung bình)
4. **Silver Ore** - Y: -64 to 32
5. **Nickel Ore** - Y: -32 to 16
6. **Chromium Ore** - Y: -32 to 32
7. **Lead Ore** - Y: -64 to 0
8. **Cinnabar Ore** - Y: -32 to 16 (Mercury source)

### Rare Ores (Hiếm)
9. **Cobalt Ore** - Y: -48 to 0
10. **Tungsten Ore** - Y: -64 to -16
11. **Sulfur Deposit** - Nether, common trong Nether

### Very Rare Ores (Rất hiếm)
12. **Titanium Ore** - Y: -64 to -32, deep underground
13. **Platinum Ore** - Y: -64 to -32, như Diamond

### Extremely Rare Ores (Cực hiếm)
14. **Mithril Ore** - Y: -64 to -48, deep caves only

### Special (Craft-only)
15. **Meteoric Iron** - Craft từ Iron + Nether Star

## 🛠️ Tools & Armor

### Tools (7 types × 20 alloys = 140 tools)
- Pickaxe
- Axe
- Shovel
- Hoe
- Sword
- Spear
- Hammer

### Armor (4 pieces × 20 alloys = 80 pieces)
- Helmet
- Chestplate
- Leggings
- Boots

### Special Properties
- **Fire Resistance:** Invar armor
- **Water Breathing:** Cupronickel helmet
- **Speed Boost:** Duralumin armor
- **XP Bonus:** Electrum, Mithril armor
- **Glow Effect:** Mithril, White Gold
- **Knockback Resist:** Titanium Steel, Adamantite

## 🏗️ Blocks & Decorative

### Metal Blocks (20 alloys)
- Storage Block (9 ingots)
- Cut Block (decorative)
- Stairs
- Slabs
- Walls

### Functional Blocks
- Metal Bars
- Metal Doors
- Metal Trapdoors
- Metal Chains
- Metal Lanterns

### Furniture & Decorative
- Tables
- Chairs
- Shelves
- Lighting fixtures

## 🎮 Gameplay Features

### Existing Systems ✅
- Alloy Mixing Table
- Hammer Mining (drop dust)
- Anvil Crushing (drop more dust)
- Dust → Ingot recipes

### New Systems (To Implement)
- Armor set effects (script)
- Tool special abilities (script)
- Block interactions (script)
- Trading với coins
- Achievement expansion

## 📈 Progression Path

```
Early Game → Mid Game → Late Game → End Game
   ↓            ↓           ↓          ↓
Bronze      Steel      Titanium   Adamantite
Brass       Invar      Cobalt     Mithril
            Electrum   Tungsten   Meteoric
```

### Detailed Progression
1. **Bronze Age** ✅ - Tin + Copper → Bronze
2. **Steel Age** - Iron + Coal → Steel (nền tảng)
3. **Precious Metals** - Silver → Electrum, Rose/White Gold
4. **Industrial** - Nickel → Invar, Cupronickel
5. **Light Metals** - Zinc, Aluminum → Brass, Duralumin
6. **Advanced** - Cobalt, Tungsten → High-tier alloys
7. **Rare** - Titanium, Platinum → Near-Diamond tier
8. **Fantasy** - Mithril → Fantasy tier
9. **End Game** - Adamantite, Meteoric → Ultimate tier

## 🎯 Implementation Priority

### Phase 1: Core (Quan Trọng Nhất)
- Steel (nền tảng cho nhiều alloys)
- Electrum (enchanting focus)
- Brass (decorative focus)

### Phase 2: Utility
- Invar (fire resistance)
- Cupronickel (water breathing)
- Stainless Steel (corrosion-proof)

### Phase 3: High Tier
- Cobalt Steel (ultra fast)
- Tungsten Steel (armor piercing)
- Titanium Steel (near Diamond)

### Phase 4: End Game
- Mithril (fantasy)
- Adamantite (ultimate)
- Meteoric Iron (cosmic)

## 📝 Technical Notes

### ✅ Có Thể Làm (Bedrock Supports)
- Custom items (tools, armor, materials)
- Custom blocks (ores, decorative)
- Custom recipes (crafting, smelting, mixing)
- Script-based mechanics (effects, abilities)
- UI forms (mixing table)
- Loot tables
- Particle effects
- Sound effects

### ❌ Không Thể Làm (Bedrock Limitations)
- Custom furnace blocks với inventory
- Energy system (RF, FE)
- Fluid system (pipes, tanks)
- Temperature mechanics
- Pollution system
- Complex automation
- Multi-block structures
- Custom GUIs với slots

### 🔄 Workarounds
- Furnace → Alloy Mixing Table (UI form)
- Crusher → Anvil Crushing (script)
- Pipes → Hoppers (vanilla)
- Energy → Fuel items
- Machines → Script systems

## 📚 Documentation Structure

```
docs/
├── README.md (index)
├── OVERVIEW.md (this file)
├── COMPARISON.md (tables)
├── phases/
│   ├── phase-1-bronze-age.md
│   ├── phase-2-steel-age.md
│   ├── ... (13 phases total)
├── reference/
│   ├── ores-reference.md
│   ├── alloys-reference.md
│   ├── tools-reference.md
│   ├── armor-reference.md
│   └── blocks-reference.md
└── guides/
    ├── implementation-guide.md
    ├── yaml-structure.md
    ├── texture-guide.md
    └── testing-guide.md
```

---

**Next Steps:**
1. Đọc [COMPARISON.md](COMPARISON.md) để xem bảng so sánh
2. Đọc [phase-2-steel-age.md](phases/phase-2-steel-age.md) để bắt đầu implement
3. Đọc [implementation-guide.md](guides/implementation-guide.md) để hiểu workflow

---

**APEIRIX - Realistic Metallurgy Addon**
**Version: 1.0.0**
