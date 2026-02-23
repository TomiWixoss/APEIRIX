# Test: Fortune Enchantment System

**System**: FortuneSystem  
**File**: `scripts/systems/blocks/FortuneSystem.ts`  
**Version**: 1.0.0  
**Ngày test**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. System Overview

### Purpose
Implement Fortune enchantment cho custom ores (tin ore, deepslate tin ore).

### Dependencies
- [ ] OreRegistry
- [ ] Event: playerBreakBlock

## 2. Initialization
- [ ] System initialize đúng
- [ ] Event listener register đúng
- [ ] No errors trong console

## 3. Fortune Levels

### Fortune I
- [x] Tin ore → 1-2 raw tin ✅ `tin_ore_fortune_1`
- [x] Deepslate tin ore → 1-2 raw tin ✅ `deepslate_tin_ore_fortune_1`
- [ ] Average ~1.5 drops (test 20 lần)

### Fortune II
- [x] Tin ore → 1-3 raw tin ✅ `tin_ore_fortune_2`
- [x] Deepslate tin ore → 1-3 raw tin ✅ `deepslate_tin_ore_fortune_2`
- [ ] Average ~2.0 drops (test 20 lần)

### Fortune III
- [x] Tin ore → 1-4 raw tin ✅ `tin_ore_fortune_3`, `fortune_system_tin_ore`
- [x] Deepslate tin ore → 1-4 raw tin ✅ `deepslate_tin_ore_fortune_3`
- [ ] Average ~2.5 drops (test 20 lần)

## 4. Bonus Drop Mechanics

### Drop Spawning
- [x] Bonus drops spawn đúng vị trí ✅ Tested via fortune tests
- [ ] Drops không bay quá xa
- [ ] Drops có thể pick up
- [ ] Drops stack với nhau

## 5. Silk Touch Priority
- [x] Silk Touch + Fortune → drop ore block ✅ `tin_ore_silk_touch`, `deepslate_tin_ore_silk_touch`
- [x] Silk Touch override Fortune ✅ Loot table priority
- [x] No bonus drops với Silk Touch ✅

## 6. Tool Compatibility
- [x] Fortune hoạt động với bronze pickaxe ✅ `tin_ore_fortune_bronze`
- [x] Fortune hoạt động với iron pickaxe ✅ Tested
- [x] Fortune hoạt động với diamond pickaxe ✅ Tested
- [ ] Fortune hoạt động với netherite pickaxe

## 7. Registry Integration

### OreRegistry
- [x] Tin ore đăng ký với fortuneEnabled: true ✅
- [x] Deepslate tin ore đăng ký với fortuneEnabled: true ✅
- [x] getOre() return đúng ✅

## 8. Edge Cases
- [ ] No Fortune → drop 1 raw tin
- [ ] Creative mode → Fortune hoạt động
- [ ] Survival mode → Fortune hoạt động
- [ ] Vanilla ores không bị affect

## 9. Performance
- [ ] No lag khi spawn bonus drops
- [ ] Event handling efficient
- [ ] Memory usage hợp lý

## Ghi chú lỗi

_Ghi lỗi ở đây..._
