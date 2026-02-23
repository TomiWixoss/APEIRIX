# Bronze Helmet Test Checklist

**Item**: Mũ Đồng Thau
**ID**: `apeirix:bronze_helmet`
**Version**: 1.0.0
**Ngày test**: 2024
**Tester**: Automated GameTest
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

## Test Cases

### 1. Item Properties
- [ ] Max stack size = 1
- [ ] Có icon texture
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Thuộc category Equipment > Helmet

### 2. Durability
- [ ] Max durability = 220
- [ ] Damage chance 60-100%
- [ ] Durability giảm khi nhận damage

### 3. Protection
- [ ] Protection value = 2
- [ ] Giảm damage khi bị tấn công

### 4. Enchantability
- [ ] Enchantability = 18
- [ ] Có thể enchant với Protection, Unbreaking, Mending, etc.
- [ ] Slot: armor_head

### 5. Repair
- [ ] Repair bằng bronze ingot (25% durability)
- [ ] Combine 2 helmets trong anvil (12% bonus)

### 6. Crafting
- [ ] Recipe: 5 bronze ingots (helmet shape)
- [ ] Unlock khi có bronze ingot

### 7. Visual
- [ ] Hiển thị đúng trên đầu player
- [ ] Texture bronze_layer_1 render đúng
- [ ] Enchantment glint hoạt động

## Notes
- Armor piece đầu tiên của Bronze set
- Enchantability cao (18) giống gold
