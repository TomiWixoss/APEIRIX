# Test: Bronze Hoe

**Tool**: Cuốc Đồng Thanh  
**ID**: `apeirix:bronze_hoe`  
**Type**: Hoe  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture đúng ✅
- [x] Tên: "Cuốc Đồng Thanh" ✅
- [x] Durability bar hiển thị ✅

### Stats
- [x] Durability: 375 ✅
- [x] Mining speed: 6.0 ✅
- [x] Attack damage: 4 ✅

## 2. Crafting
- [x] Recipe: 2 bronze ingot + 2 stick ✅ `bronze_hoe_craft`
- [x] Unlock khi có bronze ingot ✅

## 3. Tillage

### Basic Tillage
- [x] Cuốc dirt → farmland (có sound "use.grass") ✅ `bronze_hoe_till_dirt`, `durability_hoe_till_dirt`
- [x] Cuốc grass block → farmland (có sound) ✅ `durability_hoe_till_grass`
- [x] Cuốc coarse dirt → farmland ✅ `durability_hoe_till_coarse`
- [x] Cuốc dirt path → farmland ✅

### Edge Cases
- [x] KHÔNG cuốc khi có block phía trên (cỏ cao) ✅
- [x] Mất 1 durability khi cuốc thành công ✅
- [x] KHÔNG mất durability khi cuốc fail ✅
- [x] Sound chỉ play khi cuốc thành công ✅

## 4. Mining (Bonus)
- [x] Phá plant blocks nhanh hơn ✅
- [x] Phá crop blocks nhanh hơn ✅
- [x] Phá leaves nhanh hơn ✅ `bronze_hoe_break_leaves`
- [x] Phá hay block nhanh hơn ✅ `bronze_hoe_break_hay`
- [x] Phá sponge nhanh hơn ✅
- [x] Phá sculk nhanh hơn ✅
- [x] Phá nether wart blocks nhanh hơn ✅
- [x] Phá shroomlight nhanh hơn ✅
- [x] Phá target nhanh hơn ✅

## 5. Durability
- [x] Mất durability khi cuốc ✅
- [x] Mất durability khi phá blocks ✅
- [x] Tool break khi durability = 0 ✅
- [x] Unbreaking hoạt động ✅

## 6. Systems Integration
- [x] CustomToolSystem track durability ✅
- [x] TillableRegistry hoạt động ✅
- [x] Block above check hoạt động ✅
- [x] Farmland verification hoạt động ✅

## Automated Tests: 4/4 PASS ✅

## Ghi chú lỗi

Không có lỗi.
