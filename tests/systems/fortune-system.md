# Test Checklist: Fortune System

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____

## 1. Fortune Enchantment Setup

### Enchanting
- [ ] Có thể enchant pickaxe với Fortune I
- [ ] Có thể enchant pickaxe với Fortune II
- [ ] Có thể enchant pickaxe với Fortune III
- [ ] Fortune hoạt động trên bronze pickaxe
- [ ] Fortune hoạt động trên iron pickaxe
- [ ] Fortune hoạt động trên diamond pickaxe

## 2. Tin Ore Fortune Drops

### Fortune I (1-2 drops)
- [ ] Đào tin ore → drop 1 raw tin (50% chance)
- [ ] Đào tin ore → drop 2 raw tin (50% chance)
- [ ] Test 10 lần, average ~1.5 drops

### Fortune II (1-3 drops)
- [ ] Đào tin ore → drop 1 raw tin (33% chance)
- [ ] Đào tin ore → drop 2 raw tin (33% chance)
- [ ] Đào tin ore → drop 3 raw tin (33% chance)
- [ ] Test 10 lần, average ~2.0 drops

### Fortune III (1-4 drops)
- [ ] Đào tin ore → drop 1 raw tin (25% chance)
- [ ] Đào tin ore → drop 2 raw tin (25% chance)
- [ ] Đào tin ore → drop 3 raw tin (25% chance)
- [ ] Đào tin ore → drop 4 raw tin (25% chance)
- [ ] Test 10 lần, average ~2.5 drops

## 3. Deepslate Tin Ore Fortune Drops

### Fortune I-III
- [ ] Fortune I → 1-2 raw tin
- [ ] Fortune II → 1-3 raw tin
- [ ] Fortune III → 1-4 raw tin
- [ ] Drops giống hệt tin ore

## 4. Fortune vs Silk Touch

### Silk Touch Priority
- [ ] Silk Touch + Fortune → drop ore block (không drop raw tin)
- [ ] Silk Touch luôn override Fortune

### No Enchantment
- [ ] Không có enchantment → drop 1 raw tin
- [ ] Baseline test

## 5. Fortune System Implementation

### Script API
- [ ] FortuneSystem.ts hoạt động
- [ ] OreRegistry đăng ký tin ores
- [ ] Event `playerBreakBlock` trigger đúng
- [ ] Bonus drops spawn đúng vị trí
- [ ] Console log debug (nếu có)

### Edge Cases
- [ ] Fortune hoạt động trong Creative mode
- [ ] Fortune hoạt động trong Survival mode
- [ ] Fortune hoạt động khi đào bằng tay (không có effect)
- [ ] Fortune hoạt động với Efficiency enchantment
- [ ] Fortune hoạt động với Unbreaking enchantment

## 6. Performance

### Lag Test
- [ ] Đào 100 tin ores liên tục → không lag
- [ ] Fortune không gây performance issues
- [ ] Drops spawn smooth

## 7. Compatibility

### Vanilla Ores
- [ ] Fortune KHÔNG affect vanilla ores (coal, iron, diamond, etc.)
- [ ] Chỉ affect custom ores (tin ore)

### Other Pickaxes
- [ ] Fortune hoạt động với wooden pickaxe (nếu có thể đào)
- [ ] Fortune hoạt động với stone pickaxe
- [ ] Fortune hoạt động với iron pickaxe
- [ ] Fortune hoạt động với diamond pickaxe
- [ ] Fortune hoạt động với netherite pickaxe
- [ ] Fortune hoạt động với bronze pickaxe

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

## Statistics (Optional)

### Fortune III Test (20 samples)
```
Ore #1: ___ drops
Ore #2: ___ drops
...
Average: ___ drops
Expected: ~2.5 drops
```
