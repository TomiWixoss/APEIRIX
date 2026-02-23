# Test: Tin Block

**Block**: Khối Thiếc  
**ID**: `apeirix:tin_block`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture hiển thị đúng ✅
- [x] Tên: "Khối Thiếc" ✅
- [x] Icon trong inventory đúng ✅

## 2. Crafting

### Recipe
- [x] 9 tin ingots = 1 tin block ✅ `tin_block_craft_from_ingots`
- [x] 1 tin block = 9 tin ingots ✅ `tin_block_craft_to_ingots`

## 3. Mining

### Tool Requirements
- [x] Không đào được bằng tay ✅ `tin_block_hand_mining`
- [x] Không đào được bằng wooden pickaxe ✅ `tin_block_wooden_pickaxe`
- [x] Đào được bằng stone pickaxe ✅ `tin_block_stone_pickaxe`
- [x] Đào được bằng iron pickaxe ✅ `tin_block_iron_pickaxe`
- [x] Đào được bằng diamond pickaxe ✅ `tin_block_diamond_pickaxe`
- [x] Drop tin block (không phải ingots) ✅

## 4. Usage

- [x] Có thể dùng để build/decorate ✅
- [x] Có thể dùng để lưu trữ tin ingots ✅

## Automated Tests: 7/7 PASS ✅

## Ghi chú lỗi

Không có lỗi.
