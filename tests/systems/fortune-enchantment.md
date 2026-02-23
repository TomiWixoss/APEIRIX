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
- [ ] Tin ore → 1-2 raw tin
- [ ] Deepslate tin ore → 1-2 raw tin
- [ ] Average ~1.5 drops (test 20 lần)

### Fortune II
- [ ] Tin ore → 1-3 raw tin
- [ ] Deepslate tin ore → 1-3 raw tin
- [ ] Average ~2.0 drops (test 20 lần)

### Fortune III
- [ ] Tin ore → 1-4 raw tin
- [ ] Deepslate tin ore → 1-4 raw tin
- [ ] Average ~2.5 drops (test 20 lần)

## 4. Bonus Drop Mechanics

### Drop Spawning
- [ ] Bonus drops spawn đúng vị trí
- [ ] Drops không bay quá xa
- [ ] Drops có thể pick up
- [ ] Drops stack với nhau

## 5. Silk Touch Priority
- [ ] Silk Touch + Fortune → drop ore block
- [ ] Silk Touch override Fortune
- [ ] No bonus drops với Silk Touch

## 6. Tool Compatibility
- [ ] Fortune hoạt động với bronze pickaxe
- [ ] Fortune hoạt động với iron pickaxe
- [ ] Fortune hoạt động với diamond pickaxe
- [ ] Fortune hoạt động với netherite pickaxe

## 7. Registry Integration

### OreRegistry
- [ ] Tin ore đăng ký với fortuneEnabled: true
- [ ] Deepslate tin ore đăng ký với fortuneEnabled: true
- [ ] getOre() return đúng

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
