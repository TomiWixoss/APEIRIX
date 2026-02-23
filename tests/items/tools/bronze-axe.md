# Test: Bronze Axe

**Tool**: Rìu Đồng Thanh  
**ID**: `apeirix:bronze_axe`  
**Type**: Axe  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture đúng ✅
- [x] Tên: "Rìu Đồng Thanh" ✅
- [x] Durability bar hiển thị ✅

### Stats
- [x] Durability: 375 ✅
- [x] Mining speed: 6.0 ✅
- [x] Attack damage: 5 ✅

## 2. Crafting
- [x] Recipe: 3 bronze ingot + 2 stick ✅ `bronze_axe_craft`
- [x] Unlock khi có bronze ingot ✅

## 3. Mining
- [x] Chặt wood nhanh hơn ✅ `bronze_axe_chop_planks`
- [x] Chặt log nhanh hơn ✅ `bronze_axe_chop_log`
- [x] Phá pumpkin nhanh hơn ✅ `bronze_axe_break_pumpkin`
- [x] Phá plant stem nhanh hơn ✅

## 4. Durability
- [x] Mất 1 durability khi chặt wood ✅ `durability_bronze_axe`
- [x] Tool break khi durability = 0 ✅
- [x] Unbreaking hoạt động ✅

## 5. Enchanting
- [x] Efficiency, Fortune, Silk Touch, Unbreaking, Mending ✅

## 6. Repair
- [x] Repair bằng bronze ingot trong anvil ✅

## Automated Tests: 4/4 PASS ✅

## Ghi chú lỗi

Không có lỗi.
