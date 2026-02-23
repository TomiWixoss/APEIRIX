# Test: Tin Ore

**Block**: Quặng Thiếc  
**ID**: `apeirix:tin_ore`  
**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture hiển thị đúng
- [ ] Tên: "Quặng Thiếc"
- [ ] Icon trong inventory đúng
- [ ] Blend tốt với stone texture

### Placement
- [ ] Có thể place block (creative/silk touch)
- [ ] Block placement sound đúng
- [ ] Collision box đúng
- [ ] Selection box đúng

## 2. Mining

### Tool Requirements
- [x] Không thể đào bằng tay (không drop) ✅ `tin_ore_hand_mining`
- [x] Không thể đào bằng wooden pickaxe (không drop) ✅ `tin_ore_wooden_pickaxe`
- [x] Đào được bằng stone pickaxe → drop raw tin ✅ `tin_ore_stone_pickaxe`
- [x] Đào được bằng iron pickaxe → drop raw tin ✅ `tin_ore_iron_pickaxe`
- [x] Đào được bằng diamond pickaxe → drop raw tin ✅ `tin_ore_diamond_pickaxe`
- [x] Đào được bằng bronze pickaxe → drop raw tin ✅ `tin_ore_bronze_pickaxe`

### Mining Speed
- [ ] Hardness: 3.0
- [ ] Mining speed hợp lý (giống iron ore)
- [ ] Efficiency enchantment KHÔNG hoạt động (Bedrock limitation)

### Drops
- [x] Drop 1 raw tin (no enchantment) ✅ Tested via mining tests
- [ ] Drop đúng vị trí (không bay xa)
- [ ] XP drop (nếu có)

## 3. Enchantments

### Silk Touch
- [x] Silk Touch → drop tin ore block ✅ `tin_ore_silk_touch`
- [ ] Có thể place lại tin ore block
- [ ] Texture đúng khi place lại

### Fortune
- [x] Fortune I → drop 1-2 raw tin ✅ `tin_ore_fortune_1`
- [x] Fortune II → drop 1-3 raw tin ✅ `tin_ore_fortune_2`
- [x] Fortune III → drop 1-4 raw tin ✅ `tin_ore_fortune_3`
- [x] Fortune hoạt động với bronze pickaxe ✅ `tin_ore_fortune_bronze`
- [ ] Silk Touch override Fortune

## 4. Loot Table

### Configuration
- [x] Loot table: `loot_tables/blocks/tin_ore.json` ✅
- [x] Format đúng ✅
- [x] Conditions: requires stone pickaxe+ ✅
- [x] Drop: raw tin ✅
- [x] Silk Touch pool added ✅

## 5. World Generation

### Spawn
- [ ] Spawn trong overworld
- [ ] Y-level: 0-72
- [ ] Frequency hợp lý (~20 iterations/chunk)
- [ ] Tìm thấy trong 5-10 phút mining

### Vein Size
- [ ] Vein size: 4-8 blocks
- [ ] Không quá lớn (>15 blocks)
- [ ] Không quá nhỏ (single ore)

### Biome Distribution
- [ ] Spawn trong tất cả overworld biomes
- [ ] Không spawn trong Nether
- [ ] Không spawn trong End

## 6. Interactions

### Player Interactions
- [ ] Break animation đúng
- [ ] Break particles đúng
- [ ] Break sound đúng

## 7. Compatibility

### Vanilla Mechanics
- [ ] Hoạt động với vanilla pickaxes
- [ ] Hoạt động với vanilla enchantments
- [ ] Không conflict với vanilla ores

### Custom Systems
- [x] FortuneSystem hoạt động ✅ `fortune_system_tin_ore`
- [x] OreRegistry đăng ký đúng ✅
- [ ] World generation hoạt động

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

---

## Checklist hoàn thành

- [ ] Tất cả tests pass
- [ ] Không có lỗi critical
- [ ] Performance tốt
- [ ] Ready for release
