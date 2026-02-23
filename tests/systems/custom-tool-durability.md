# Test: Custom Tool Durability System

**System**: CustomToolSystem  
**File**: `scripts/systems/items/CustomToolSystem.ts`  
**Version**: 1.0.0  
**Ngày test**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. System Overview

### Purpose
Quản lý durability cho custom tools (bronze tools) và hoe tillage functionality.

### Dependencies
- [ ] ToolRegistry
- [ ] TillableRegistry
- [ ] Event: playerBreakBlock
- [ ] Event: playerInteractWithBlock

## 2. Initialization
- [ ] System initialize đúng
- [ ] Event listeners register đúng
- [ ] No errors trong console

## 3. Durability Tracking

### Block Break
- [ ] Track durability cho bronze pickaxe
- [ ] Track durability cho bronze axe
- [ ] Track durability cho bronze shovel
- [ ] Track durability cho bronze hoe
- [ ] Track durability cho bronze sword

### Durability Loss
- [ ] Mất 1 durability mỗi lần dùng
- [ ] Durability bar update real-time
- [ ] Equipment slot update đúng

### Tool Break
- [ ] Tool break khi durability = 0
- [ ] Sound "random.break" play
- [ ] Tool biến mất khỏi inventory

## 4. Unbreaking Enchantment

### Calculation
- [ ] Unbreaking I: 50% chance không mất durability
- [ ] Unbreaking II: 67% chance không mất durability
- [ ] Unbreaking III: 75% chance không mất durability
- [ ] Random calculation đúng

## 5. Hoe Tillage

### Tillage Detection
- [ ] Detect bronze hoe usage
- [ ] Check block is tillable
- [ ] Check block above is air
- [ ] Verify farmland created

### Effects
- [ ] Sound "use.grass" play khi thành công
- [ ] Durability loss khi thành công
- [ ] NO sound khi fail
- [ ] NO durability loss khi fail

### Edge Cases
- [ ] Block có cỏ cao phía trên → không till
- [ ] Block không tillable → không till
- [ ] Vanilla hoe không bị affect

## 6. Registry Integration

### ToolRegistry
- [ ] Tất cả bronze tools đăng ký đúng
- [ ] isTool() check đúng
- [ ] getTool() return đúng

### TillableRegistry
- [ ] Vanilla tillable blocks đăng ký
- [ ] isTillable() check đúng
- [ ] getTillable() return đúng

## 7. Performance
- [ ] No lag khi track durability
- [ ] Event handling efficient
- [ ] Memory usage hợp lý

## 8. Console Logs
- [ ] `[CustomToolSystem] Hoe damaged` khi cuốc
- [ ] `[CustomToolSystem] Sound played` khi cuốc
- [ ] `[CustomToolSystem] Farmland created` khi thành công
- [ ] `[CustomToolSystem] Block above is not air` khi fail
- [ ] No error logs

## Ghi chú lỗi

_Ghi lỗi ở đây..._
