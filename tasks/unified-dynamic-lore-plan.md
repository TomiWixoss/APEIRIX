# Unified Dynamic Lore System - Refactor Plan

## Problem
- Log vẫn có lore sau khi transfer attribute (static template)
- Dirt không có lore sau khi nhận attribute (no template)
- Attributes và lore KHÔNG sync với nhau

## Root Cause
Hệ thống hiện tại tách biệt:
- Static attributes (YAML) → Static lore (template)
- Dynamic attributes (runtime) → Không sync với lore
- LoreSystem dùng template tĩnh từ GENERATED_WIKI_ITEMS

## Solution: Unified Dynamic System

### Core Principle
**Lore = Function(Attributes)**
- Lore LUÔN được generate từ attributes (không dùng template)
- Mọi thay đổi attribute → Auto-refresh lore
- Static attributes (YAML) chỉ là "initial state"

### Architecture Changes

#### 1. AttributeResolver (UNCHANGED)
- Already returns full attribute list (static + dynamic + block-type)
- Priority: Dynamic > Static

#### 2. LoreSystem (MAJOR REFACTOR)
**OLD:**
```typescript
// Load lore templates from GENERATED_WIKI_ITEMS
loreMap.set(item.id, item.lore);

// Apply template with placeholders
const lore = PlaceholderRegistry.process(itemId, loreTemplate, itemStack);
```

**NEW:**
```typescript
// NO lore templates!
// ALWAYS generate from attributes
const lore = PlaceholderRegistry.generateAttributeLore(itemStack);
```

**Changes:**
- Remove `loreMap` (no more templates)
- Remove `needsLore()` check (always regenerate)
- `subscribeToInventoryEvents()` → Always apply lore from attributes
- `applyLore()` → Always call `generateAttributeLore()`

#### 3. PlaceholderRegistry (MINOR CHANGES)
**Current:**
- `generateAttributeLore()` - Generate from attributes ✓
- Used only for items without template

**NEW:**
- `generateAttributeLore()` - Used for ALL items
- Add support for non-attribute lore (wiki descriptions, etc.)

#### 4. AttributeAPI (ADD AUTO-REFRESH)
**Changes:**
- `addAttribute()` → Refresh lore after add
- `removeAttribute()` → Refresh lore after remove
- `modifyAttribute()` → Refresh lore after modify
- `transferAttribute*()` → Refresh lore for both source and target

#### 5. LoreRefreshSystem (REMOVE)
- No longer needed
- Lore auto-refreshes via AttributeAPI

### Implementation Steps

1. ✅ Backup current system
2. ✅ Refactor LoreSystem:
   - Removed loreMap
   - Removed needsLore(), itemHasDynamicLore(), applyLoreToSlot()
   - Always generate from attributes via PlaceholderRegistry
3. ✅ Modify AttributeAPI:
   - Changed import from LoreRefreshSystem to LoreSystem
   - triggerLoreRefresh() now calls LoreSystem.applyLore()
4. ⬜ Update PlaceholderRegistry:
   - Handle items with no attributes (empty lore)
5. ⬜ Remove LoreRefreshSystem (dead code)
6. ⬜ Update GameManager initialization
7. ⬜ Test in-game

### Expected Behavior

**Before:**
- Log: Has static lore (from template)
- Transfer log → dirt: Log keeps lore, dirt has no lore

**After:**
- Log: Has lore (generated from attributes)
- Transfer log → dirt: Log loses lore (no attributes), dirt gains lore (has attributes)
- Pickup dirt: Auto-apply lore from block-type attributes

### Files to Modify

1. `scripts/systems/lore/LoreSystem.ts` - Major refactor
2. `scripts/systems/attributes/AttributeAPI.ts` - Add lore refresh
3. `scripts/systems/lore/placeholders/PlaceholderRegistry.ts` - Minor updates
4. `scripts/core/GameManager.ts` - Remove LoreRefreshSystem init
5. `scripts/systems/lore/LoreRefreshSystem.ts` - DELETE

### Risks

1. **Performance**: Regenerating lore on every inventory change
   - Mitigation: Cache in PlaceholderRegistry
2. **Non-attribute lore**: Items with lore but no attributes (wiki descriptions)
   - Mitigation: Keep GENERATED_WIKI_ITEMS for wiki system only
3. **Breaking changes**: Existing items in player inventory
   - Mitigation: Lore auto-updates on next pickup

### Testing Checklist

- [ ] Transfer log → dirt: Log loses lore, dirt gains lore
- [ ] Pickup dirt: Auto-apply lore
- [ ] Mine dirt without axe: Blocked
- [ ] Transfer dirt → log: Dirt loses lore, log gains lore
- [ ] Items with no attributes: No lore
- [ ] Items with multiple attributes: All attributes in lore
- [ ] Dynamic attributes (durability): Lore updates correctly

