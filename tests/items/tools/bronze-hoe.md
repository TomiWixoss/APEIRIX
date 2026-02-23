# Test: Bronze Hoe

**Tool**: Cuốc Đồng Thanh  
**ID**: `apeirix:bronze_hoe`  
**Type**: Hoe  
**Version**: 1.0.0  
**Ngày test**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture đúng
- [ ] Tên: "Cuốc Đồng Thanh"
- [ ] Durability bar hiển thị

### Stats
- [ ] Durability: 375
- [ ] Mining speed: 6.0
- [ ] Attack damage: 4

## 2. Crafting
- [ ] Recipe: 2 bronze ingot + 2 stick
- [ ] Unlock khi có bronze ingot

## 3. Tillage

### Basic Tillage
- [ ] Cuốc dirt → farmland (có sound "use.grass")
- [ ] Cuốc grass block → farmland (có sound)
- [ ] Cuốc dirt path → farmland
- [ ] Cuốc coarse dirt → farmland

### Edge Cases
- [ ] KHÔNG cuốc khi có block phía trên (cỏ cao)
- [ ] Mất 1 durability khi cuốc thành công
- [ ] KHÔNG mất durability khi cuốc fail
- [ ] Sound chỉ play khi cuốc thành công

## 4. Mining (Bonus)
- [ ] Phá plant blocks nhanh hơn
- [ ] Phá crop blocks nhanh hơn
- [ ] Phá leaves nhanh hơn
- [ ] Phá hay block nhanh hơn
- [ ] Phá sponge nhanh hơn
- [ ] Phá sculk nhanh hơn
- [ ] Phá nether wart blocks nhanh hơn
- [ ] Phá shroomlight nhanh hơn
- [ ] Phá target nhanh hơn

## 5. Durability
- [ ] Mất durability khi cuốc
- [ ] Mất durability khi phá blocks
- [ ] Tool break khi durability = 0
- [ ] Unbreaking hoạt động

## 6. Systems Integration
- [ ] CustomToolSystem track durability
- [ ] TillableRegistry hoạt động
- [ ] Block above check hoạt động
- [ ] Farmland verification hoạt động

## Ghi chú lỗi

_Ghi lỗi ở đây..._
