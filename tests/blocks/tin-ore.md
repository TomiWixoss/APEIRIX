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
- [ ] Không thể đào bằng tay (không drop)
- [ ] Không thể đào bằng wooden pickaxe (không drop)
- [ ] Đào được bằng stone pickaxe → drop raw tin
- [ ] Đào được bằng iron pickaxe → drop raw tin
- [ ] Đào được bằng diamond pickaxe → drop raw tin
- [ ] Đào được bằng bronze pickaxe → drop raw tin

### Mining Speed
- [ ] Hardness: 3.0
- [ ] Mining speed hợp lý (giống iron ore)
- [ ] Efficiency enchantment KHÔNG hoạt động (Bedrock limitation)

### Drops
- [ ] Drop 1 raw tin (no enchantment)
- [ ] Drop đúng vị trí (không bay xa)
- [ ] XP drop (nếu có)

## 3. Enchantments

### Silk Touch
- [ ] Silk Touch → drop tin ore block
- [ ] Có thể place lại tin ore block
- [ ] Texture đúng khi place lại

### Fortune
- [ ] Fortune I → drop 1-2 raw tin
- [ ] Fortune II → drop 1-3 raw tin
- [ ] Fortune III → drop 1-4 raw tin
- [ ] Fortune hoạt động với bronze pickaxe
- [ ] Silk Touch override Fortune

## 4. Loot Table

### Configuration
- [ ] Loot table: `loot_tables/blocks/tin_ore.json`
- [ ] Format đúng
- [ ] Conditions: requires stone pickaxe+
- [ ] Drop: raw tin

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
- [ ] FortuneSystem hoạt động
- [ ] OreRegistry đăng ký đúng
- [ ] World generation hoạt động

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

---

## Checklist hoàn thành

- [ ] Tất cả tests pass
- [ ] Không có lỗi critical
- [ ] Performance tốt
- [ ] Ready for release
