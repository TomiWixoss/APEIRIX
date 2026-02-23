# Bronze Chestplate Test Checklist

**Item**: Áo Giáp Đồng Thau
**ID**: `apeirix:bronze_chestplate`
**Version**: 1.0.0
**Ngày test**: 2024
**Tester**: Automated GameTest
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

## Test Cases

### 1. Item Properties
- [ ] Max stack size = 1
- [ ] Có icon texture
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Thuộc category Equipment > Chestplate

### 2. Durability
- [ ] Max durability = 320
- [ ] Damage chance 60-100%
- [ ] Durability giảm khi nhận damage

### 3. Protection
- [ ] Protection value = 5
- [ ] Giảm damage khi bị tấn công

### 4. Enchantability
- [ ] Enchantability = 18
- [ ] Có thể enchant với Protection, Unbreaking, Mending, etc.
- [ ] Slot: armor_torso

### 5. Repair
- [ ] Repair bằng bronze ingot (25% durability)
- [ ] Combine 2 chestplates trong anvil (12% bonus)

### 6. Crafting
- [ ] Recipe: 8 bronze ingots (chestplate shape)
- [ ] Unlock khi có bronze ingot

### 7. Visual
- [ ] Hiển thị đúng trên ngực player
- [ ] Texture bronze_layer_1 render đúng
- [ ] Enchantment glint hoạt động

## Notes
- Armor piece với protection cao nhất (5)
- Durability cao nhất (320)
