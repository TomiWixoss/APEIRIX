# Test: Bronze Block

**Block**: Khối Đồng Thanh  
**ID**: `apeirix:bronze_block`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture hiển thị đúng (màu vàng cam sậm) ✅
- [x] Tên: "Khối Đồng Thanh" ✅
- [x] Icon trong inventory đúng ✅

## 2. Crafting

### Recipe
- [x] 9 bronze ingots = 1 bronze block ✅ `bronze_block_craft_from_ingots`
- [x] 1 bronze block = 9 bronze ingots ✅ `bronze_block_craft_to_ingots`

## 3. Mining

### Tool Requirements
- [x] Không đào được bằng tay ✅ `bronze_block_hand_mining`
- [x] Không đào được bằng wooden pickaxe ✅ `bronze_block_wooden_pickaxe`
- [x] Đào được bằng stone pickaxe ✅ `bronze_block_stone_pickaxe`
- [x] Đào được bằng iron pickaxe ✅ `bronze_block_iron_pickaxe`
- [x] Đào được bằng diamond pickaxe ✅ `bronze_block_diamond_pickaxe`
- [x] Drop bronze block ✅

## 4. Usage

- [x] Có thể dùng để build/decorate ✅
- [x] Có thể dùng để lưu trữ bronze ingots ✅

## Automated Tests: 7/7 PASS ✅

## Ghi chú lỗi

Không có lỗi.
