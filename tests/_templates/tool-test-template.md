# Test: [Tool Name]

**Tool**: [Tên hiển thị]  
**ID**: `apeirix:[tool_id]`  
**Type**: Pickaxe | Axe | Shovel | Hoe | Sword  
**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture hiển thị đúng
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Icon trong inventory đúng
- [ ] Durability bar hiển thị

### Stats
- [ ] Durability: [value]
- [ ] Mining speed: [value]
- [ ] Attack damage: [value]
- [ ] Enchantability: [value]

## 2. Crafting

### Recipe
- [ ] Recipe tồn tại
- [ ] Recipe đúng format
- [ ] Unlock recipe hoạt động
- [ ] Materials đúng

## 3. Mining/Usage

### Effective Blocks
- [ ] Phá [block type 1] nhanh hơn
- [ ] Phá [block type 2] nhanh hơn
- [ ] Phá [block type 3] nhanh hơn
- [ ] Mining speed đúng với stats

### Tool Tier
- [ ] Đào được [ore/block tier]
- [ ] Không đào được [higher tier]
- [ ] Drop requirements đúng

## 4. Durability System

### Basic Durability
- [ ] Mất 1 durability mỗi lần dùng
- [ ] Durability bar update đúng
- [ ] Tool break khi durability = 0
- [ ] Break sound "random.break"
- [ ] Tool biến mất khi break

### Unbreaking Enchantment
- [ ] Unbreaking I: ~50% chance không mất durability
- [ ] Unbreaking II: ~67% chance không mất durability
- [ ] Unbreaking III: ~75% chance không mất durability

## 5. Enchanting

### Available Enchantments
- [ ] Efficiency
- [ ] Fortune (pickaxe/axe/shovel)
- [ ] Silk Touch (pickaxe/axe/shovel)
- [ ] Unbreaking
- [ ] Mending
- [ ] [Other enchantments]

### Enchantability
- [ ] Enchantability value: [value]
- [ ] Enchanting table levels hợp lý
- [ ] Enchantment quality tốt

## 6. Repair

### Anvil Repair
- [ ] Repair bằng [material]
- [ ] Repair amount = 25% max durability
- [ ] Combine 2 tools hoạt động
- [ ] Enchantments merge đúng

### Grindstone
- [ ] Remove enchantments hoạt động
- [ ] Repair một phần durability

## 7. Combat (Weapons only)

### Attack
- [ ] Attack damage đúng
- [ ] Attack speed đúng
- [ ] Durability loss khi attack
- [ ] Knockback đúng

## 8. Special Features (nếu có)

### [Feature 1]
- [ ] [Test case 1]
- [ ] [Test case 2]

## 9. Compatibility

### Vanilla Mechanics
- [ ] Hoạt động với vanilla enchantments
- [ ] Hoạt động với vanilla blocks
- [ ] Không conflict với vanilla tools

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

---

## Checklist hoàn thành

- [ ] Tất cả tests pass
- [ ] Không có lỗi critical
- [ ] Performance tốt
- [ ] Ready for release
