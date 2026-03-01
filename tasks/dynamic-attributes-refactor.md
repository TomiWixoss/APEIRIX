# Dynamic Attributes System Refactor

## Goal
Chuyển toàn bộ attribute system sang dạng động, cho phép:
- Add/remove attributes runtime
- Modify attribute config runtime
- Transfer attributes giữa items
- Auto-update lore khi attributes thay đổi

## Architecture

### Core Components

1. **AttributeResolver** - Resolve static + dynamic attributes
2. **DynamicAttributeStorage** - Store/load attributes từ ItemStack
3. **AttributeAPI** - Public API cho add/remove/modify/transfer
4. **LoreRefreshSystem** - Auto-refresh lore khi attributes thay đổi

### Data Flow

```
ItemStack
  ↓ getDynamicProperty('apeirix:attributes')
DynamicAttributeStorage.load()
  ↓
AttributeResolver.resolve() → merge static + dynamic
  ↓
Handlers check resolved attributes
  ↓ on change
AttributeAPI.modify() → DynamicAttributeStorage.save()
  ↓
LoreRefreshSystem.refresh() → update lore
```

## Implementation Plan

### Phase 1: Core Infrastructure
- [x] Create AttributeResolver
- [x] Create DynamicAttributeStorage
- [x] Create AttributeAPI
- [x] Add tests

### Phase 2: Handler Migration
- [x] Modify BreakableHandler
- [x] Modify DurabilityModifierHandler
- [x] Modify CombatDamageModifierHandler
- [x] Modify HammerMiningHandler
- [x] Modify UndeadSlayerHandler
- [x] Modify RustMiteEdibleHandler (no changes needed - no lore)
- [x] Modify RequiresToolHandler
- [x] Modify EmptyHandCombatHandler (no changes needed - player entity)

### Phase 3: Lore Integration
- [x] Create LoreRefreshSystem
- [x] Integrate with PlaceholderRegistry
- [x] Auto-refresh on attribute change

### Phase 4: Testing
- [ ] Test add/remove attributes
- [ ] Test modify attributes
- [ ] Test transfer attributes
- [ ] Test lore refresh
- [ ] Test backward compatibility

## Files to Create/Modify

### New Files
- `scripts/systems/attributes/AttributeResolver.ts`
- `scripts/systems/attributes/DynamicAttributeStorage.ts`
- `scripts/systems/attributes/AttributeAPI.ts`
- `scripts/systems/lore/LoreRefreshSystem.ts`

### Modified Files
- All 8 handlers in `scripts/systems/attributes/handlers/`
- `scripts/systems/attributes/AttributeSystem.ts`
- `scripts/systems/lore/LoreSystem.ts`
- `scripts/systems/lore/placeholders/PlaceholderRegistry.ts`

## Backward Compatibility

- GeneratedAttributes.ts vẫn được generate và dùng làm "default"
- Items mới sẽ có attributes từ YAML
- Dynamic attributes override static attributes
- Không break existing items

## Performance Considerations

- Cache resolved attributes per tick
- Lazy load dynamic properties
- Batch lore updates
- Use WeakMap for ItemStack → attributes mapping
