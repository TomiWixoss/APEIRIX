# Entity Attribute Probability System

## Overview

Hệ thống cho phép entity attributes được áp dụng dựa trên tỉ lệ % khi entity spawn. Mỗi attribute có thể có probability riêng, cho phép tạo ra sự đa dạng trong gameplay.

## Configuration

### YAML Format

```yaml
id: minecraft:zombie
attributes:
  # 30% chance to inflict hunger on hit
  - id: hunger_infliction
    probability: 30
    config:
      duration: 100 # 5 seconds
      amplifier: 0 # Level 1
  
  # 20% chance to have increased damage
  - id: combat_damage_modifier
    probability: 20
    config:
      context: combat
      damage: 2 # +2 damage
```

### Fields

- `id` (required): Attribute ID
- `probability` (optional): 0-100, default 100 (always apply)
- `config` (optional): Attribute-specific configuration

## How It Works

### 1. Compile Time

EntityLoader parses YAML configs và extract probability:

```typescript
{
  entityId: "minecraft:zombie",
  attributes: [
    { id: "hunger_infliction", config: {...}, probability: 30 },
    { id: "combat_damage_modifier", config: {...}, probability: 20 }
  ]
}
```

### 2. Generation

GameDataGenerator generates `GENERATED_ENTITIES` trong `GeneratedGameData.ts`:

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

### 3. Runtime

EntitySystem applies attributes khi entity spawn:

```typescript
for (const attr of config.attributes) {
  const probability = attr.probability ?? 100; // Default 100%
  const roll = Math.random() * 100; // 0-100
  
  if (roll < probability) {
    EntityAttributeStorage.setAttribute(entity, attr.id, attr.config);
    appliedCount++;
  }
}
```

## Probability Mechanics

### Independent Rolls

Mỗi attribute được roll độc lập:

- Zombie có 30% hunger + 20% damage
- Probability cả 2: ~6% (0.3 × 0.2)
- Probability ít nhất 1: ~44% (1 - 0.7 × 0.8)

### Examples

```yaml
# Always apply (default)
- id: hunger_infliction
  config: {...}
  # probability: 100 (implicit)

# 50% chance
- id: speed_boost
  probability: 50
  config: {...}

# Rare (5%)
- id: elite_modifier
  probability: 5
  config: {...}
```

## Use Cases

### 1. Variant Mobs

```yaml
id: minecraft:zombie
attributes:
  - id: hunger_infliction
    probability: 30
  - id: speed_boost
    probability: 20
  - id: extra_health
    probability: 10
```

Result: 
- 70% normal zombies
- 30% hunger zombies
- 20% fast zombies
- 10% tanky zombies
- ~6% hunger + fast
- ~3% hunger + tanky
- etc.

### 2. Elite Mobs

```yaml
id: minecraft:skeleton
attributes:
  - id: elite_marker
    probability: 5 # 5% elite
    config:
      damageMultiplier: 2
      healthMultiplier: 3
```

### 3. Conditional Attributes

```yaml
id: minecraft:spider
attributes:
  - id: poison_attack
    probability: 40 # 40% poisonous spiders
  - id: web_shooter
    probability: 20 # 20% web-shooting spiders
```

## Testing

### In-Game Test

```
/kill @e[type=zombie]
/summon zombie ~~~ 
/testfor @e[type=zombie,c=1]
```

Spawn nhiều zombies và check attributes:
- Some có hunger_infliction
- Some có combat_damage_modifier
- Some có cả 2
- Some không có gì

### Debug Commands

```typescript
// Check entity attributes
const zombie = dimension.getEntities({ type: 'minecraft:zombie' })[0];
const attrs = EntityAttributeStorage.load(zombie);
console.warn('Zombie attributes:', JSON.stringify(attrs));
```

## Implementation Files

### Compile-Time
- `addon-generator/src/core/types/ConfigTypes.ts` - EntityConfig interface
- `addon-generator/src/core/loaders/EntityLoader.ts` - Parse probability
- `addon-generator/src/generators/GameDataGenerator.ts` - Generate GENERATED_ENTITIES

### Runtime
- `scripts/systems/entities/EntitySystem.ts` - Apply attributes with probability
- `scripts/systems/attributes/EntityAttributeStorage.ts` - Store/load attributes
- `scripts/data/GeneratedGameData.ts` - Generated entity data

## Notes

- Probability rolls happen ONCE per entity spawn
- Attributes persist on entity (stored in dynamicProperties)
- Re-spawning same entity type = new rolls
- Default probability = 100% (backward compatible)
- Probability is per-attribute, not per-entity
