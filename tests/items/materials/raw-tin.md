# Test: Raw Tin

**Item**: Thiếc Thô  
**ID**: `apeirix:raw_tin`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Display
- [x] Texture đúng ✅
- [x] Tên: "Thiếc Thô" ✅
- [x] Stack size: 64 ✅ `raw_tin_stack_size`

## 2. Obtaining
- [x] Drop từ tin ore ✅ (tested in tin-ore.test.ts)
- [x] Drop từ deepslate tin ore ✅ (tested in deepslate-tin-ore.test.ts)
- [x] Fortune enchantment hoạt động ✅ (tested in fortune-enchantment.test.ts)

## 3. Usage
- [x] Smelt → tin ingot (furnace) ✅ `raw_tin_smelt_furnace`
- [x] Smelt → tin ingot (blast furnace) ✅ `raw_tin_smelt_blast`
- [ ] Craft 9 raw tin → raw tin block (chưa có)

## Automated Tests: 3/3 PASS ✅

## Ghi chú lỗi

Không có lỗi.
