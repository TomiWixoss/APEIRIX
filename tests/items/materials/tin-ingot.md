# Test: Tin Ingot

**Item**: Thỏi Thiếc  
**ID**: `apeirix:tin_ingot`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Display
- [x] Texture đúng ✅
- [x] Tên: "Thỏi Thiếc" ✅
- [x] Stack size: 64 ✅ `tin_ingot_stack_size`

## 2. Obtaining
- [x] Smelt raw tin ✅ `tin_ingot_from_raw_smelting`
- [x] Smelt tin ore ✅ `tin_ingot_from_ore_smelting`
- [x] Smelt deepslate tin ore ✅ `tin_ingot_from_deepslate_smelting`
- [x] Craft từ tin block (1 block = 9 ingots) ✅ `tin_ingot_from_block`
- [x] Craft từ tin nugget (9 nuggets = 1 ingot) ✅ `tin_ingot_from_nuggets`

## 3. Usage
- [x] Craft tin block (9 ingots) ✅ `tin_ingot_to_block`
- [x] Craft tin nugget (1 ingot = 9 nuggets) ✅ `tin_ingot_to_nuggets`
- [x] Craft bronze ingot (3 copper + 1 tin = 4 bronze) ✅ `tin_ingot_to_bronze`

## Automated Tests: 9/9 PASS ✅

## Ghi chú lỗi

Không có lỗi.
