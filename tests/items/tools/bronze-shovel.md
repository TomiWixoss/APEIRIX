# Test: Bronze Shovel

**Tool**: Xẻng Đồng Thanh  
**ID**: `apeirix:bronze_shovel`  
**Type**: Shovel  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture đúng ✅
- [x] Tên: "Xẻng Đồng Thanh" ✅
- [x] Durability bar hiển thị ✅

### Stats
- [x] Durability: 375 ✅
- [x] Mining speed: 6.0 ✅
- [x] Attack damage: 3 ✅

## 2. Crafting
- [x] Recipe: 1 bronze ingot + 2 stick ✅ `bronze_shovel_craft`
- [x] Unlock khi có bronze ingot ✅

## 3. Mining
- [x] Đào dirt nhanh hơn ✅ `bronze_shovel_dig_dirt`
- [x] Đào sand nhanh hơn ✅ `bronze_shovel_dig_sand`
- [x] Đào gravel nhanh hơn ✅ `bronze_shovel_dig_gravel`
- [x] Đào snow nhanh hơn ✅
- [x] Đào clay nhanh hơn ✅
- [x] Đào soul sand/soil nhanh hơn ✅
- [x] Đào powder snow nhanh hơn ✅

## 4. Durability
- [x] Mất 1 durability khi đào ✅ `durability_bronze_shovel`
- [x] Tool break khi durability = 0 ✅
- [x] Unbreaking hoạt động ✅

## 5. Enchanting
- [x] Efficiency, Fortune, Silk Touch, Unbreaking, Mending ✅

## 6. Repair
- [x] Repair bằng bronze ingot trong anvil ✅

## Automated Tests: 4/4 PASS ✅

## Ghi chú lỗi

Không có lỗi.
