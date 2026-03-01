# Conditional Attributes Refactor

## Goal
Tái cấu trúc hệ thống attributes và lore để hỗ trợ:
- Attributes có điều kiện (mining, combat contexts)
- Attributes có thể stack
- Override vanilla items (wooden pickaxe, etc.)
- Lore hiển thị attributes động với điều kiện

## Requirements
- [x] Mining context: attributes chỉ active khi đào block
- [x] Combat context: attributes chỉ active khi combat
- [x] Attributes stack: nhiều attributes cùng loại cộng dồn
- [x] Vanilla override: ghi đè minecraft:wooden_pickaxe với 0 attack, 4 durability, 100% breakable khi đào quặng

## Implementation Steps

### 1. YAML Schema Extension
- [ ] Add `attributes` field với context + conditions
- [ ] Support format: `{attributeId: {context: 'mining', value: 100, conditions: {...}}}`

### 2. Type Definitions
- [ ] Create `AttributeContext` enum (mining, combat)
- [ ] Create `AttributeCondition` interface
- [ ] Update `AttributeItemData` interface

### 3. Generator Updates
- [ ] Update `AttributeGenerator` to parse new format
- [ ] Update `GameDataBPGenerator` to collect contexts
- [ ] Generate `GeneratedAttributes.ts` with contexts

### 4. Runtime System
- [ ] Create `AttributeConditionEvaluator` class
- [ ] Refactor `AttributeSystem` for context-aware queries
- [ ] Update handlers to use conditional evaluation

### 5. Lore Integration
- [ ] Update `LoreSystem` to display conditional attributes
- [ ] Format: `§cGẫy: §f100% §7(khi đào quặng)`

### 6. Vanilla Override
- [ ] Create `configs/special/vanilla_overrides/` folder
- [ ] Add `wooden_pickaxe.yaml` config
- [ ] Update compiler to process vanilla overrides

### 7. Testing
- [ ] Test wooden pickaxe override
- [ ] Verify lore displays correctly
- [ ] Test attribute stacking
- [ ] Verify mining/combat contexts work

## Example Config

```yaml
# configs/special/vanilla_overrides/wooden_pickaxe.yaml
id: minecraft:wooden_pickaxe
name: lang:tools.wooden_pickaxe
lore: lang:lore.tools.wooden_pickaxe
damage: 0  # Override attack to 0
durability: 4  # Override durability to 4
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
```

## Generated Output

```typescript
export const GENERATED_ATTRIBUTES = {
  'breakable': [
    {
      itemId: 'minecraft:wooden_pickaxe',
      config: {
        context: 'mining',
        value: 100,
        conditions: { blockTags: ['ore'] }
      }
    }
  ]
}
```

## Status
🚧 In Progress
