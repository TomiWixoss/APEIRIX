# Test: Bronze Sword

**Tool**: Kiếm Đồng Thanh  
**ID**: `apeirix:bronze_sword`  
**Type**: Sword  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture đúng ✅
- [x] Tên: "Kiếm Đồng Thanh" ✅
- [x] Durability bar hiển thị ✅

### Stats
- [x] Durability: 375 ✅
- [x] Attack damage: 6 (bằng iron sword) ✅

## 2. Crafting
- [x] Recipe: 2 bronze ingot + 1 stick ✅ `bronze_sword_craft`
- [x] Unlock khi có bronze ingot ✅

## 3. Combat
- [x] Đánh mob damage đúng (6 damage) ✅
- [x] Mất durability khi đánh mob ✅
- [x] Attack animation đúng ✅

## 4. Mining (Bonus)
- [x] Phá cobweb cực nhanh (speed 15) ✅ `bronze_sword_break_cobweb`
- [x] Phá bamboo nhanh (speed 6) ✅ `bronze_sword_break_bamboo`

## 5. Durability
- [x] Mất 1 durability khi combat ✅
- [x] Mất 1 durability khi phá blocks ✅ `durability_bronze_sword`
- [x] Tool break khi durability = 0 ✅
- [x] Unbreaking hoạt động ✅

## 6. Enchanting
- [x] Sharpness, Looting, Fire Aspect, Knockback ✅
- [x] Unbreaking, Mending ✅

## 7. Repair
- [x] Repair bằng bronze ingot trong anvil ✅

## Automated Tests: 3/3 PASS ✅

## Ghi chú lỗi

Không có lỗi.
