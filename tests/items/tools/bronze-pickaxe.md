# Test: Bronze Pickaxe

**Tool**: Cúp Đồng Thanh  
**ID**: `apeirix:bronze_pickaxe`  
**Type**: Pickaxe  
**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture hiển thị đúng (màu vàng cam sậm)
- [ ] Tên: "Cúp Đồng Thanh"
- [ ] Icon trong inventory đúng
- [ ] Durability bar hiển thị

### Stats
- [ ] Durability: 375
- [ ] Mining speed: 6.0 (bằng iron)
- [ ] Attack damage: 4
- [ ] Enchantability: 18

## 2. Crafting

### Recipe
- [ ] Recipe: 3 bronze ingot + 2 stick
- [ ] Recipe format đúng (shaped)
- [ ] Unlock khi có bronze ingot
- [ ] Output: 1 bronze pickaxe

## 3. Mining

### Effective Blocks
- [ ] Phá stone nhanh hơn tay
- [ ] Phá ores nhanh hơn tay
- [ ] Phá metal blocks nhanh hơn tay
- [ ] Phá rock blocks nhanh hơn tay
- [ ] Mining speed = 6.0

### Tool Tier (Stone level)
- [ ] Đào được iron ore → drop raw iron
- [ ] Đào được gold ore → drop raw gold
- [ ] Đào được lapis ore → drop lapis
- [ ] Đào được redstone ore → drop redstone
- [ ] Đào được tin ore → drop raw tin
- [ ] Đào được deepslate tin ore → drop raw tin
- [ ] KHÔNG đào được diamond ore (cần iron+)
- [ ] KHÔNG đào được emerald ore (cần iron+)

## 4. Durability System

### Basic Durability
- [ ] Mất 1 durability mỗi lần đào block
- [ ] Durability bar update real-time
- [ ] Tool break khi durability = 0
- [ ] Break sound "random.break"
- [ ] Tool biến mất khỏi inventory

### Unbreaking Enchantment
- [ ] Unbreaking I: ~50% không mất durability
- [ ] Unbreaking II: ~67% không mất durability
- [ ] Unbreaking III: ~75% không mất durability

## 5. Enchanting

### Available Enchantments
- [ ] Efficiency (I-V)
- [ ] Fortune (I-III)
- [ ] Silk Touch (I)
- [ ] Unbreaking (I-III)
- [ ] Mending (I)

### Enchantability
- [ ] Enchantability: 18
- [ ] Enchanting table levels hợp lý
- [ ] Có thể lấy Fortune III ở level 30

## 6. Repair

### Anvil Repair
- [ ] Repair bằng bronze ingot
- [ ] Repair amount = 25% max durability (94 durability)
- [ ] Combine 2 bronze pickaxes
- [ ] Durability cộng dồn + 5% bonus
- [ ] Enchantments merge đúng

### Grindstone
- [ ] Remove enchantments
- [ ] Repair một phần durability

## 7. Special Features

### Fortune Enchantment
- [ ] Fortune hoạt động với tin ore
- [ ] Fortune hoạt động với deepslate tin ore
- [ ] Fortune I: 1-2 drops
- [ ] Fortune II: 1-3 drops
- [ ] Fortune III: 1-4 drops

### Silk Touch
- [ ] Silk Touch → drop ore block (không drop raw)
- [ ] Silk Touch override Fortune

## 8. Compatibility

### Vanilla Mechanics
- [ ] Hoạt động với vanilla enchantments
- [ ] Hoạt động với vanilla blocks
- [ ] Không conflict với vanilla pickaxes
- [ ] Efficiency enchantment hoạt động

### Custom Systems
- [ ] CustomToolSystem track durability
- [ ] FortuneSystem hoạt động
- [ ] ToolRegistry đăng ký đúng

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

---

## Checklist hoàn thành

- [ ] Tất cả tests pass
- [ ] Không có lỗi critical
- [ ] Performance tốt
- [ ] Ready for release
