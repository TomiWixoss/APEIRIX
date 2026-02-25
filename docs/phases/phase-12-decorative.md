# Phase 12: Decorative & Building Blocks

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐ (THẤP)

---

## 📋 Tổng Quan

Decorative blocks và building materials cho tất cả metals:
- Metal blocks variants (stairs, slabs, walls)
- Metal bars, doors, trapdoors
- Metal chains, lanterns
- Furniture & decorative items

---

## 🎯 Block Types

### 1. Metal Blocks (20 alloys)
**For each alloy:**
- Storage Block (9 ingots → 1 block)
- Cut Block (4 blocks → 4 cut blocks, decorative)
- Stairs (6 blocks → 4 stairs)
- Slabs (3 blocks → 6 slabs)
- Walls (6 blocks → 6 walls)

**Total:** 20 alloys × 5 variants = 100 block types

### 2. Metal Bars (20 alloys)
**Recipe:** 6 ingots → 16 bars
**Like:** Iron bars nhưng các metals khác
**Uses:** Windows, barriers, decorative

### 3. Metal Doors (20 alloys)
**Recipe:** 6 ingots → 3 doors
**Types:**
- Normal doors (button/lever to open)
- Heavy doors (redstone only)

### 4. Metal Trapdoors (20 alloys)
**Recipe:** 4 ingots → 2 trapdoors
**Uses:** Floors, ceilings, hatches

### 5. Metal Chains (20 alloys)
**Recipe:** 2 ingots + 1 iron nugget → 3 chains
**Uses:**
- Hanging lanterns
- Decorative
- Functional (like vanilla chains)

### 6. Metal Lanterns (20 alloys)
**Recipe:** 8 nuggets + 1 torch → 1 lantern
**Types:**
- Hanging lantern
- Standing lantern
- Wall lantern
**Colors:** Different tints per metal

---

## 📁 File Structure

```
configs/decorative/
├── blocks/
│   ├── bronze_cut_block.yaml
│   ├── bronze_stairs.yaml
│   ├── bronze_slab.yaml
│   ├── bronze_wall.yaml
│   └── ... (repeat for all 20 alloys)
├── bars/
│   ├── bronze_bars.yaml
│   └── ... (20 alloys)
├── doors/
│   ├── bronze_door.yaml
│   └── ... (20 alloys)
├── trapdoors/
│   ├── bronze_trapdoor.yaml
│   └── ... (20 alloys)
├── chains/
│   ├── bronze_chain.yaml
│   └── ... (20 alloys)
└── lanterns/
    ├── bronze_lantern.yaml
    └── ... (20 alloys)
```

---

## 🎨 Textures Cần Tạo

### Per Alloy (20 alloys)
- Cut block: 1 texture
- Stairs: 1 texture (reuse block)
- Slab: 1 texture (reuse block)
- Wall: 1 texture (reuse block)
- Bars: 1 texture
- Door: 2 textures (top + bottom)
- Trapdoor: 1 texture
- Chain: 1 texture
- Lantern: 1 texture

**Per alloy:** ~10 textures
**Total:** 20 alloys × 10 = ~200 textures

---

## 🎮 Building Styles

### Industrial Style
- Steel, Stainless Steel
- Cobalt Steel, Tungsten Steel
- Gray/metallic colors

### Steampunk Style
- Bronze, Brass, Copper
- Gears, pipes, chains
- Warm metallic colors

### Fantasy Style
- Mithril, Adamantite
- Glowing effects
- Magical aesthetics

### Prestige Style
- Gold alloys (Rose, White, Electrum)
- Platinum, Silver
- Shiny, luxurious

---

## 💡 Design Tips

### Color Schemes
- Bronze: Warm orange-brown
- Steel: Cool gray
- Brass: Golden yellow
- Silver: Bright silver
- Mithril: Silver-blue glow

### Patterns
- Cut blocks: Polished/smooth
- Bars: Vertical lines
- Chains: Linked pattern
- Lanterns: Light source

---

## 📊 Crafting Summary

| Block Type | Recipe | Output | Per Alloy |
|------------|--------|--------|-----------|
| Storage Block | 9 ingots | 1 block | 1 recipe |
| Cut Block | 4 blocks | 4 cut | 1 recipe |
| Stairs | 6 blocks | 4 stairs | 1 recipe |
| Slabs | 3 blocks | 6 slabs | 1 recipe |
| Walls | 6 blocks | 6 walls | 1 recipe |
| Bars | 6 ingots | 16 bars | 1 recipe |
| Door | 6 ingots | 3 doors | 1 recipe |
| Trapdoor | 4 ingots | 2 trapdoors | 1 recipe |
| Chain | 2 ingots + 1 nugget | 3 chains | 1 recipe |
| Lantern | 8 nuggets + 1 torch | 1 lantern | 1 recipe |

**Total per alloy:** 10 recipes
**Total all alloys:** 20 × 10 = 200 recipes

---

**Next:** [Phase 13: Gameplay Features](phase-13-gameplay.md)
