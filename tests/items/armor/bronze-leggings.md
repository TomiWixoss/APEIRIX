# Bronze Leggings Test Checklist

**Item**: Quần Giáp Đồng Thau
**ID**: `apeirix:bronze_leggings`
**Version**: 1.0.0
**Ngày test**: 2024
**Tester**: Automated GameTest
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

## Test Cases

### 1. Item Properties
- [ ] Max stack size = 1
- [ ] Có icon texture
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Thuộc category Equipment > Leggings

### 2. Durability
- [ ] Max durability = 300
- [ ] Damage chance 60-100%
- [ ] Durability giảm khi nhận damage

### 3. Protection
- [ ] Protection value = 4
- [ ] Giảm damage khi bị tấn công

### 4. Enchantability
- [ ] Enchantability = 18
- [ ] Có thể enchant với Protection, Unbreaking, Mending, etc.
- [ ] Slot: armor_legs

### 5. Repair
- [ ] Repair bằng bronze ingot (25% durability)
- [ ] Combine 2 leggings trong anvil (12% bonus)

### 6. Crafting
- [ ] Recipe: 7 bronze ingots (leggings shape)
- [ ] Unlock khi có bronze ingot

### 7. Visual
- [ ] Hiển thị đúng trên chân player
- [ ] Texture bronze_layer_2 render đúng
- [ ] Enchantment glint hoạt động

## Notes
- Dùng bronze_layer_2 (khác với các piece khác)
- Protection 4 (cao thứ 2)
