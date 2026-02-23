# Test: Bronze Ingot

**Item**: Thỏi Đồng Thanh  
**ID**: `apeirix:bronze_ingot`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. Basic Properties

### Display
- [x] Texture hiển thị đúng (màu vàng cam sậm) ✅
- [x] Tên: "Thỏi Đồng Thanh" ✅
- [x] Icon trong inventory đúng ✅
- [x] Màu sắc đậm hơn copper, ngả nâu hơn gold ✅

### Stack Properties
- [x] Max stack size: 64 ✅ `bronze_ingot_stack_size`
- [x] Stackable đúng ✅
- [x] Có thể drop ✅
- [x] Có thể pick up ✅

## 2. Obtaining

### Crafting
- [x] Recipe: 3 copper ingot + 1 tin ingot = 4 bronze ingot ✅ `bronze_ingot_from_copper_tin`
- [x] Recipe type: shapeless ✅
- [x] Unlock khi có copper hoặc tin ingot ✅
- [x] Output: 4 bronze ingots ✅

### Conversion
- [x] 1 bronze block = 9 bronze ingots ✅ `bronze_ingot_from_block`
- [x] 9 bronze nuggets = 1 bronze ingot ✅ `bronze_ingot_from_nuggets`

### Creative Inventory
- [x] Có trong creative inventory ✅
- [x] Category: Items > Materials ✅

## 3. Usage

### Crafting Ingredient
- [x] Craft bronze pickaxe (3 ingots) ✅
- [x] Craft bronze axe (3 ingots) ✅
- [x] Craft bronze shovel (1 ingot) ✅
- [x] Craft bronze hoe (2 ingots) ✅
- [x] Craft bronze sword (2 ingots) ✅
- [x] Craft bronze block (9 ingots) ✅ `bronze_ingot_to_block`
- [x] Craft bronze nugget (1 ingot = 9 nuggets) ✅ `bronze_ingot_to_nuggets`

### Tool Repair
- [x] Repair bronze tools trong anvil ✅
- [x] Repair amount = 25% max durability ✅

## 4. Interactions

### Player Interactions
- [x] Có thể hold trong tay ✅
- [x] Có thể throw (Q key) ✅
- [x] Có thể place vào chest/container ✅

## 5. Compatibility

### Vanilla Mechanics
- [x] Hoạt động với vanilla crafting table ✅
- [x] Hoạt động với vanilla anvil ✅
- [x] Không conflict với vanilla ingots ✅

### Recipe Book
- [x] Hiển thị trong recipe book ✅
- [x] Unlock recipes khi có bronze ingot ✅
- [x] Recipe hints đúng ✅

## Automated Tests: 6/6 PASS ✅

## Ghi chú lỗi

Không có lỗi.

---

## Checklist hoàn thành

- [x] Tất cả tests pass ✅
- [x] Không có lỗi critical ✅
- [x] Performance tốt ✅
- [x] Ready for release ✅
