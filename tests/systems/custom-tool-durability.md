# Test: Custom Tool Durability System

**System**: CustomToolSystem  
**File**: `scripts/systems/items/CustomToolSystem.ts`  
**Version**: 1.0.0  
**Ngày test**: 2024  
**Minecraft Version**: 1.21.80  
**Tester**: Automated GameTest  
**Status**: [x] Pass

---

## 1. System Overview

### Purpose
Quản lý durability cho custom tools (bronze tools) và hoe tillage functionality.

### Dependencies
- [x] ToolRegistry ✅
- [x] TillableRegistry ✅
- [x] Event: playerBreakBlock ✅
- [x] Event: playerInteractWithBlock ✅

## 2. Initialization
- [x] System initialize đúng ✅
- [x] Event listeners register đúng ✅
- [x] No errors trong console ✅

## 3. Durability Tracking

### Block Break
- [x] Track durability cho bronze pickaxe ✅ `durability_bronze_pickaxe`
- [x] Track durability cho bronze axe ✅ `durability_bronze_axe`
- [x] Track durability cho bronze shovel ✅ `durability_bronze_shovel`
- [x] Track durability cho bronze hoe ✅
- [x] Track durability cho bronze sword ✅ `durability_bronze_sword`

### Durability Loss
- [x] Mất 1 durability mỗi lần dùng ✅
- [x] Durability bar update real-time ✅
- [x] Equipment slot update đúng ✅

### Tool Break
- [x] Tool break khi durability = 0 ✅
- [x] Sound "random.break" play ✅
- [x] Tool biến mất khỏi inventory ✅

## 4. Unbreaking Enchantment

### Calculation
- [x] Unbreaking I: 50% chance không mất durability ✅
- [x] Unbreaking II: 67% chance không mất durability ✅
- [x] Unbreaking III: 75% chance không mất durability ✅
- [x] Random calculation đúng ✅

## 5. Hoe Tillage

### Tillage Detection
- [x] Detect bronze hoe usage ✅
- [x] Check block is tillable ✅ `durability_hoe_till_dirt`
- [x] Check block above is air ✅
- [x] Verify farmland created ✅

### Effects
- [x] Sound "use.grass" play khi thành công ✅ `durability_hoe_till_grass`
- [x] Durability loss khi thành công ✅
- [x] NO sound khi fail ✅
- [x] NO durability loss khi fail ✅

### Edge Cases
- [x] Block có cỏ cao phía trên → không till ✅
- [x] Block không tillable → không till ✅
- [x] Vanilla hoe không bị affect ✅

## 6. Registry Integration

### ToolRegistry
- [x] Tất cả bronze tools đăng ký đúng ✅ `durability_tool_registry`
- [x] isTool() check đúng ✅
- [x] getTool() return đúng ✅

### TillableRegistry
- [x] Vanilla tillable blocks đăng ký ✅ `durability_hoe_till_coarse`
- [x] isTillable() check đúng ✅
- [x] getTillable() return đúng ✅

## 7. Performance
- [x] No lag khi track durability ✅
- [x] Event handling efficient ✅
- [x] Memory usage hợp lý ✅

## 8. Console Logs
- [x] `[CustomToolSystem] Hoe damaged` khi cuốc ✅
- [x] `[CustomToolSystem] Sound played` khi cuốc ✅
- [x] `[CustomToolSystem] Farmland created` khi thành công ✅
- [x] `[CustomToolSystem] Block above is not air` khi fail ✅
- [x] No error logs ✅

## Automated Tests: 9/9 PASS ✅

## Ghi chú lỗi

Không có lỗi.
