# 🔨 APEIRIX - Tài Liệu Hợp Kim & Quặng

> **Hệ thống luyện kim hoàn chỉnh cho Minecraft Bedrock Edition**

## 📚 Cấu Trúc Tài Liệu

### 📖 Tổng Quan
- [README.md](README.md) - File này
- [OVERVIEW.md](OVERVIEW.md) - Tổng quan toàn bộ hệ thống
- [COMPARISON.md](COMPARISON.md) - Bảng so sánh tất cả hợp kim

### 🎯 Phases (Lộ Trình Phát Triển)

#### Phase 1: Bronze Age ✅
- [phase-1-bronze-age.md](phases/phase-1-bronze-age.md)
- Status: **HOÀN THÀNH**
- Nội dung: Bronze, Tin, Hammer Mining, Anvil Crushing

#### Phase 2: Iron Age - Steel & Basic Alloys
- [phase-2-steel-age.md](phases/phase-2-steel-age.md)
- Hợp kim: Steel, Damascus Steel, Stainless Steel
- Quặng: Chromium

#### Phase 3: Precious Metals
- [phase-3-precious-metals.md](phases/phase-3-precious-metals.md)
- Hợp kim: Electrum, Rose Gold, White Gold
- Quặng: Silver

#### Phase 4: Industrial Metals
- [phase-4-industrial-metals.md](phases/phase-4-industrial-metals.md)
- Hợp kim: Invar, Cupronickel, Constantan
- Quặng: Nickel

#### Phase 5: Light Metals
- [phase-5-light-metals.md](phases/phase-5-light-metals.md)
- Hợp kim: Brass, Duralumin
- Quặng: Zinc, Bauxite (Aluminum)

#### Phase 6: Heavy Metals
- [phase-6-heavy-metals.md](phases/phase-6-heavy-metals.md)
- Hợp kim: Pewter
- Quặng: Lead

#### Phase 7: Advanced Metals
- [phase-7-advanced-metals.md](phases/phase-7-advanced-metals.md)
- Hợp kim: Cobalt Steel, Tungsten Steel
- Quặng: Cobalt, Tungsten

#### Phase 8: Rare Metals
- [phase-8-rare-metals.md](phases/phase-8-rare-metals.md)
- Hợp kim: Titanium Steel, Platinum
- Quặng: Titanium, Platinum

#### Phase 9: Fantasy Metals
- [phase-9-fantasy-metals.md](phases/phase-9-fantasy-metals.md)
- Hợp kim: Mithril
- Quặng: Mithril

#### Phase 10: End Game
- [phase-10-end-game.md](phases/phase-10-end-game.md)
- Hợp kim: Adamantite, Meteoric Iron
- Quặng: Nether Star (craft)

#### Phase 11: Utility Resources
- [phase-11-utility-resources.md](phases/phase-11-utility-resources.md)
- Quặng: Sulfur, Salt, Cinnabar

#### Phase 12: Decorative & Building
- [phase-12-decorative.md](phases/phase-12-decorative.md)
- Blocks, Furniture, Lighting

#### Phase 13: Gameplay Features
- [phase-13-gameplay.md](phases/phase-13-gameplay.md)
- Armor Effects, Tool Abilities, Scripts

### 📊 Reference Tables
- [ores-reference.md](reference/ores-reference.md) - Tất cả quặng
- [alloys-reference.md](reference/alloys-reference.md) - Tất cả hợp kim
- [tools-reference.md](reference/tools-reference.md) - Tất cả tools
- [armor-reference.md](reference/armor-reference.md) - Tất cả armor
- [blocks-reference.md](reference/blocks-reference.md) - Tất cả blocks

### 🎮 Implementation Guides
- [implementation-guide.md](guides/implementation-guide.md) - Hướng dẫn implement
- [yaml-structure.md](guides/yaml-structure.md) - Cấu trúc YAML
- [texture-guide.md](guides/texture-guide.md) - Hướng dẫn texture
- [testing-guide.md](guides/testing-guide.md) - Hướng dẫn test

---

## 📈 Thống Kê

### Tổng Quan
- **Tổng số hợp kim:** 20
- **Tổng số quặng mới:** 15
- **Tổng số tools:** 140+ (20 alloys × 7 tools)
- **Tổng số armor:** 80+ (20 alloys × 4 pieces)
- **Tổng số blocks:** 100+ (decorative variants)

### Phân Loại Theo Tier

#### Low Tier (Stone - Iron)
- Brass
- Rose Gold
- White Gold

#### Mid Tier (Iron - Iron+)
- Bronze ✅
- Steel
- Damascus Steel
- Stainless Steel
- Invar
- Cupronickel
- Duralumin

#### High Tier (Diamond)
- Titanium Steel
- Cobalt Steel
- Tungsten Steel
- Platinum
- Meteoric Iron

#### Ultra Tier (Diamond+ - Netherite)
- Mithril
- Adamantite

#### Special Tier (Utility)
- Electrum (Enchanting)
- Constantan (Utility)
- Pewter (Decorative)

---

## 🚀 Quick Start

### Đọc Theo Thứ Tự
1. [OVERVIEW.md](OVERVIEW.md) - Hiểu tổng quan
2. [phase-1-bronze-age.md](phases/phase-1-bronze-age.md) - Xem đã có gì
3. [phase-2-steel-age.md](phases/phase-2-steel-age.md) - Bắt đầu implement
4. [implementation-guide.md](guides/implementation-guide.md) - Hướng dẫn chi tiết

### Implement Phase Mới
1. Đọc file phase tương ứng
2. Tạo YAML configs theo pattern
3. Tạo textures (hoặc placeholder)
4. Compile và test
5. Update wiki data

---

## 🎯 Priority Implementation Order

### Đợt 1: Core Alloys (Quan Trọng Nhất)
1. **Steel** - Nền tảng cho nhiều alloys khác
2. **Electrum** - Enchanting focus
3. **Brass** - Decorative focus

### Đợt 2: Durability & Utility
4. **Invar** - Fire resistance
5. **Cupronickel** - Water breathing
6. **Stainless Steel** - Corrosion-proof

### Đợt 3: Advanced Tiers
7. **Cobalt Steel** - Ultra fast mining
8. **Tungsten Steel** - Armor piercing
9. **Titanium Steel** - Near Diamond tier

### Đợt 4: Fantasy & End Game
10. **Mithril** - Fantasy tier
11. **Adamantite** - Netherite tier
12. **Meteoric Iron** - Cosmic power

---

## 📝 Notes

- Tất cả phases đều có thể implement trong Bedrock
- Không có energy system, temperature, hay pollution
- Tập trung vào items, blocks, và script-based features
- Textures cần tạo cho tất cả items/blocks mới

---

**APEIRIX - Realistic Metallurgy Addon**
**Version: 1.0.0**
**Last Updated: 2026-02-26**
