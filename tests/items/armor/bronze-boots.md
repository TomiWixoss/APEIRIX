# Bronze Boots Test Checklist

**Item**: Giày Đồng Thau
**ID**: `apeirix:bronze_boots`
**Version**: 1.0.0
**Ngày test**: 2024
**Tester**: Automated GameTest
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

## Test Cases

### 1. Item Properties
- [ ] Max stack size = 1
- [ ] Có icon texture
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Thuộc category Equipment > Boots

### 2. Durability
- [ ] Max durability = 260
- [ ] Damage chance 60-100%
- [ ] Durability giảm khi nhận damage

### 3. Protection
- [ ] Protection value = 1
- [ ] Giảm damage khi bị tấn công

### 4. Enchantability
- [ ] Enchantability = 18
- [ ] Có thể enchant với Protection, Unbreaking, Mending, Feather Falling, etc.
- [ ] Slot: armor_feet

### 5. Repair
- [ ] Repair bằng bronze ingot (25% durability)
- [ ] Combine 2 boots trong anvil (12% bonus)

### 6. Crafting
- [ ] Recipe: 4 bronze ingots (boots shape)
- [ ] Unlock khi có bronze ingot

### 7. Visual
- [ ] Hiển thị đúng trên chân player
- [ ] Texture bronze_layer_1 render đúng
- [ ] Enchantment glint hoạt động

## Notes
- Armor piece với durability thấp nhất
- Protection thấp nhất (1)
- Có thể enchant Feather Falling (boots only)
