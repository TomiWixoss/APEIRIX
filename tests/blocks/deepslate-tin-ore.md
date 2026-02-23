# Test: Deepslate Tin Ore

**Block**: Quặng Thiếc Deepslate  
**ID**: `apeirix:deepslate_tin_ore`  
**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture hiển thị đúng (deepslate variant)
- [ ] Tên: "Quặng Thiếc Deepslate"
- [ ] Icon trong inventory đúng
- [ ] Blend tốt với deepslate texture

## 2. Mining

### Tool Requirements
- [x] Yêu cầu stone pickaxe trở lên ✅ `deepslate_tin_ore_hand_mining`, `deepslate_tin_ore_wooden_pickaxe`
- [x] Drop raw tin (giống tin ore) ✅ `deepslate_tin_ore_stone_pickaxe`

### Mining Speed
- [ ] Hardness: 4.5 (cao hơn tin ore)
- [ ] Đào chậm hơn tin ore

### Drops
- [x] Drop 1 raw tin (no enchantment) ✅ Tested via mining tests

## 3. Enchantments

### Fortune
- [x] Fortune I → 1-2 raw tin ✅ `deepslate_tin_ore_fortune_1`
- [x] Fortune II → 1-3 raw tin ✅ `deepslate_tin_ore_fortune_2`
- [x] Fortune III → 1-4 raw tin ✅ `deepslate_tin_ore_fortune_3`

### Silk Touch
- [x] Silk Touch → drop deepslate tin ore block ✅ `deepslate_tin_ore_silk_touch`

## 4. World Generation

### Spawn
- [ ] Chỉ spawn dưới Y=0
- [ ] Chỉ spawn trong deepslate layer
- [ ] Frequency giống tin ore

## 5. Compatibility

- [x] FortuneSystem hoạt động ✅ Tested via fortune tests
- [x] OreRegistry đăng ký đúng ✅
- [x] Loot table với Silk Touch pool ✅

## Ghi chú lỗi

_Ghi lỗi ở đây..._
