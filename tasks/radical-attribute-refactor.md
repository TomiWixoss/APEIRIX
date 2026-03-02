# Radical Attribute Refactor - Pure Dynamic System

## Status: READY FOR TESTING

## Problem (Original)
Current system had fundamental conflicts:
1. Static attributes (YAML) vs Dynamic attributes (runtime)
2. Stackable items can't use dynamicProperties
3. Lore and attributes not properly synced
4. Transfer doesn't work correctly (static attributes persist)

Example:
- Log has `requires_tool:axe` in YAML (static)
- Transfer to dirt → Dirt gets attribute (dynamic)
- But log STILL has attribute (static) → Lore still shows

## Solution: Pure Dynamic with Auto-Migration

### Core Principle
**NO static attributes at runtime**
- YAML = "initial state" only (for migration)
- First game load: Auto-migrate YAML → Dynamic registries
- After migration: Pure dynamic system
- Lore = Function(Attributes) - always in sync

### Architecture

**Storage Strategy:**

1. **Non-Stackable Items** (tools, armor)
   - Store in `ItemStack.dynamicProperties`
   - Per-instance attributes

2. **Stackable Items** (blocks, materials, foods)
   - Store in `GlobalItemAttributeRegistry` (world-level, per-type)
   - All items of same type share attributes

3. **Blocks**
   - Store in `GlobalBlockAttributeRegistry` (world-level, per-type)
   - All blocks of same type share attributes

**Priority Order:**
```
ItemStack.dynamicProperties (highest)
  ↓
GlobalItemAttributeRegistry
  ↓
GlobalBlockAttributeRegistry (lowest)
```

### Migration Flow

```
Game Start
  ↓
AttributeSystem.initialize()
  ↓
GlobalItemAttributeRegistry.initialize()
  ↓
Check flag: apeirix:item_attrs_migrated
  ↓
If not migrated:
  - Load GENERATED_ATTRIBUTES (from YAML)
  - For each attribute → item mapping:
    - Add to GlobalItemAttributeRegistry
  - Save registry to world storage
  - Set migration flag
  ↓
GlobalBlockAttributeRegistry.initialize()
  ↓
Check flag: apeirix:block_attrs_migrated
  ↓
Set flag (no-op for blocks - no static attributes)
  ↓
Runtime: Pure dynamic system
```

### Transfer Flow (Log → Dirt)

```
User holds log item (stackable)
  ↓
/scriptevent test:transfer_to_dirt
  ↓
AttributeAPI.transferAttributeToBlockType()
  ↓
1. Get attribute from log
   - AttributeResolver checks GlobalItemAttributeRegistry
   - Finds requires_tool (source: item_type)
  ↓
2. Add to dirt block type
   - GlobalBlockAttributeRegistry.addBlockAttribute()
  ↓
3. Remove from log item type
   - AttributeAPI.removeAttribute()
   - Detects source: item_type
   - GlobalItemAttributeRegistry.removeItemAttribute()
  ↓
Result:
- Log item type: No attributes → No lore
- Dirt block type: Has requires_tool → Lore applies when pickup
```

## Implementation Status

### ✅ COMPLETED

1. **GlobalItemAttributeRegistry.ts**
   - Per-type attribute storage for stackable items
   - Auto-migration from GENERATED_ATTRIBUTES
   - Migration flag: `apeirix:item_attrs_migrated`
   - Persists to `apeirix:item_attributes`

2. **GlobalBlockAttributeRegistry.ts**
   - Per-type attribute storage for blocks
   - Migration check (no-op, just sets flag)
   - Migration flag: `apeirix:block_attrs_migrated`
   - Persists to `apeirix:block_attributes`

3. **AttributeResolver.ts**
   - Removed static attribute loading
   - Priority: ItemStack.dynamicProperties > GlobalItemAttributeRegistry > GlobalBlockAttributeRegistry
   - Caching per tick for performance

4. **AttributeAPI.ts**
   - `addAttribute()`: Auto-detect stackable (maxAmount > 1) → Add to GlobalItemAttributeRegistry
   - `removeAttribute()`: Check attribute source → Remove from correct registry
   - Transfer methods work with registries
   - Smart routing based on item type

5. **AttributeSystem.ts**
   - Initialize GlobalItemAttributeRegistry FIRST
   - Initialize GlobalBlockAttributeRegistry
   - Proper initialization order

6. **LoreSystem.ts**
   - UNIFIED DYNAMIC LORE
   - Lore = Function(Attributes)
   - No more static lore templates
   - Always synced with attributes

7. **PlaceholderRegistry.ts**
   - Removed `.filter((a: any) => a.enabled)` (no more enabled flag)
   - Simplified attribute filtering

### 🔄 NEXT STEPS

1. **Test in-game**:
   - Verify migration runs on first load
   - Check attributes loaded into registries
   - Test transfer log → dirt
   - Verify lore syncs properly
   - Test pickup/drop to trigger lore refresh

2. **Add test commands** (optional):
   - `/scriptevent test:clear_migration` - Clear migration flags for re-testing
   - `/scriptevent test:check_item_registry` - Check GlobalItemAttributeRegistry state

3. **System-wide lore refresh** (future enhancement):
   - When GlobalItemAttributeRegistry changes, ALL items of that type need lore refresh
   - Current: Only refreshes item in hand
   - Solution: Event system or pickup/drop trigger (already works via LoreRefreshSystem)

## Benefits

1. **No Conflicts**: Only one source of truth (dynamic registries)
2. **Lore Sync**: Lore always reflects current attributes
3. **Transfer Works**: No static attributes left behind
4. **Clean Architecture**: YAML = design time, Runtime = pure dynamic
5. **Backward Compatible**: Existing YAML configs still work (via migration)
6. **Stackable Support**: Works for ALL item types

## Known Limitations

1. **Lore refresh scope**: Only refreshes item in hand during transfer
   - Workaround: Pickup/drop item to trigger refresh (LoreRefreshSystem handles this)
2. **Migration is one-time**: Need to clear flag to re-migrate (for testing)
3. **No rollback**: Once migrated, can't go back to static system

## Testing Commands

- `/scriptevent test:transfer_to_dirt` - Transfer requires_tool from log to dirt
- `/scriptevent test:transfer_back` - Transfer back from dirt to log
- `/scriptevent test:check_registry` - Check GlobalBlockAttributeRegistry state
- `/scriptevent test:clear_registry` - Clear GlobalBlockAttributeRegistry

## Files Modified

- `scripts/systems/attributes/GlobalItemAttributeRegistry.ts` - Auto-migration added
- `scripts/systems/attributes/GlobalBlockAttributeRegistry.ts` - Migration check added
- `scripts/systems/attributes/AttributeResolver.ts` - Removed static loading
- `scripts/systems/attributes/AttributeAPI.ts` - Smart add/remove for registries
- `scripts/systems/attributes/AttributeSystem.ts` - Initialize registries
- `scripts/systems/lore/LoreSystem.ts` - Unified dynamic lore
- `scripts/systems/lore/placeholders/PlaceholderRegistry.ts` - Removed enabled filter

## Expected In-Game Behavior

### First Load (Migration)
```
[AttributeSystem] Initializing...
[AttributeSystem] Loaded 8 attributes for 132 items
[GlobalItemAttributeRegistry] Initializing...
[GlobalItemAttributeRegistry] Performing one-time migration from YAML...
[GlobalItemAttributeRegistry] Migration completed: 132 attributes migrated
[GlobalItemAttributeRegistry] Loaded 132 attributes for 21 item types
[GlobalBlockAttributeRegistry] Initializing...
[GlobalBlockAttributeRegistry] Migration completed (no-op for blocks)
[GlobalBlockAttributeRegistry] Loaded 0 attributes for 0 block types
```

### After Transfer (Log → Dirt)
```
[AttributeAPI] Transferred attribute 'requires_tool' from minecraft:mangrove_log to block type minecraft:dirt
[GlobalItemAttributeRegistry] Removed attribute 'requires_tool' from item type 'minecraft:mangrove_log'
[GlobalBlockAttributeRegistry] Added attribute 'requires_tool' to block type 'minecraft:dirt'
```

### Pickup Dirt Item
```
[LoreRefreshSystem] Refreshing lore for minecraft:dirt
[PlaceholderRegistry] generateAttributeLore for minecraft:dirt
[PlaceholderRegistry] Resolved attributes: requires_tool
[PlaceholderRegistry] Generated lore with 1 attributes
```

## Dead Code to Remove (Future)

After confirming system works:
- `hasStaticAttribute()` function in AttributeAPI (no longer used)
- `disabled` and `modified` lists in DynamicAttributeStorage (no longer needed)
- Static attribute loading code (already removed)

Should I remove these now or wait for testing confirmation?
