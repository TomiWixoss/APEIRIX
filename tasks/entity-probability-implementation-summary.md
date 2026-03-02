# Entity Attribute Probability System - Implementation Summary

## Completed: 2026-03-02

## Overview

Implemented probability-based entity attribute application system. Mỗi entity attribute có thể có tỉ lệ % riêng để được áp dụng khi entity spawn, tạo ra sự đa dạng trong gameplay.

## Changes Made

### 1. Type Definitions

**addon-generator/src/core/types/ConfigTypes.ts**
- Added `probability?: number` field to `EntityConfig.attributes`
- Range: 0-100, default 100 (always apply)

### 2. Entity Loader

**addon-generator/src/core/loaders/EntityLoader.ts**
- Updated `EntityAttributeData` interface to include `probability: number`
- Parse probability from YAML with default value 100%
- Validates and normalizes probability values

### 3. Game Data Generator

**addon-generator/src/generators/GameDataGenerator.ts**
- Updated `EntityAttributeData` interface to include `probability: number`
- Updated `generateEntityData()` to include probability in output
- Generates `GENERATED_ENTITIES` with probability field
- Fixed TypeScript error: Property 'probability' does not exist

### 4. Entity System (Runtime)

**scripts/systems/entities/EntitySystem.ts**
- Updated `applyAttributesToEntity()` to use probability-based rolls
- Each attribute rolled independently using `Math.random()`
- Logs applied count vs total count for debugging

### 5. Example Configuration

**addon-generator/configs/entities/vanilla_overrides/zombie.yaml**
```yaml
id: minecraft:zombie
attributes:
  - id: hunger_infliction
    probability: 30  # 30% chance
    config:
      duration: 100
      amplifier: 0
  
  - id: combat_damage_modifier
    probability: 20  # 20% chance
    config:
      context: combat
      damage: 2
```

### 6. Generated Data

**scripts/data/GeneratedGameData.ts**
- Auto-generated with probability field
- Example output:
```typescript
export const GENERATED_ENTITIES = [
  {
    entityId: "minecraft:zombie",
    attributes: [
      { id: "hunger_infliction", config: {...}, probability: 30 },
      { id: "combat_damage_modifier", config: {...}, probability: 20 }
    ]
  }
];
```

### 7. Documentation

**docs/entity-attribute-probability-system.md**
- Complete system documentation
- Configuration examples
- Probability mechanics explanation
- Use cases and testing guide

### 8. Testing

**scripts/tests/TestEntityProbability.ts**
- Test command: `/scriptevent apeirix:test_entity_probability`
- Spawns 20 zombies and analyzes attribute distribution
- Compares actual vs expected probabilities
- Auto-cleanup after test

**scripts/core/GameManager.ts**
- Registered test file (auto-imports)

## Probability Mechanics

### Independent Rolls
Each attribute is rolled independently:
- Zombie: 30% hunger + 20% damage
- Both: ~6% (0.3 × 0.2)
- At least one: ~44% (1 - 0.7 × 0.8)
- None: ~56% (0.7 × 0.8)

### Default Behavior
- No `probability` field = 100% (backward compatible)
- Existing configs without probability continue to work

## Testing Instructions

### In-Game Test
1. Load world with updated addon
2. Run: `/scriptevent apeirix:test_entity_probability`
3. Check results in chat
4. Expected distribution:
   - Hunger only: ~24%
   - Damage only: ~16%
   - Both: ~6%
   - None: ~56%

### Manual Verification
```
/kill @e[type=zombie]
/summon zombie ~~~ 
```
Spawn multiple zombies and observe:
- Some attack with hunger effect
- Some deal extra damage
- Some have both
- Some are normal

## Use Cases

### 1. Variant Mobs
Create mob variants with different abilities:
```yaml
id: minecraft:skeleton
attributes:
  - id: fire_arrow
    probability: 30
  - id: poison_arrow
    probability: 20
  - id: explosive_arrow
    probability: 5
```

### 2. Elite Mobs
Rare powerful versions:
```yaml
id: minecraft:creeper
attributes:
  - id: elite_marker
    probability: 5  # 5% elite
    config:
      explosionRadius: 8
      fuseDuration: 15
```

### 3. Conditional Spawns
Different attributes for different situations:
```yaml
id: minecraft:zombie
attributes:
  - id: speed_boost
    probability: 40  # 40% fast zombies
  - id: armor_boost
    probability: 30  # 30% armored zombies
```

## Files Modified

### Compile-Time (addon-generator)
- `src/core/types/ConfigTypes.ts`
- `src/core/loaders/EntityLoader.ts`
- `src/generators/GameDataGenerator.ts`
- `configs/entities/vanilla_overrides/zombie.yaml`

### Runtime (scripts)
- `systems/entities/EntitySystem.ts`
- `core/GameManager.ts`
- `data/GeneratedGameData.ts` (auto-generated)

### Documentation & Tests
- `docs/entity-attribute-probability-system.md`
- `scripts/tests/TestEntityProbability.ts`
- `tasks/entity-probability-implementation-summary.md`

## Build Status

✅ Compiled successfully
✅ TypeScript build passed
✅ No errors or warnings
✅ Deployed to development packs

## Next Steps

1. Test in-game with `/scriptevent apeirix:test_entity_probability`
2. Verify probability distribution matches expectations
3. Add more entity variants with different probabilities
4. Consider adding probability to other systems (items, blocks)

## Notes

- Probability rolls happen ONCE per entity spawn
- Attributes persist on entity (stored in dynamicProperties)
- Re-spawning same entity type = new probability rolls
- System is backward compatible (no probability = 100%)
- Each attribute rolled independently (not mutually exclusive)
