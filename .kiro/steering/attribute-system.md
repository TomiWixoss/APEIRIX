# Attribute System

## 4 Scopes (Storage Layers)

### 1. Item-Instance (Per-Item)
- **Storage**: `ItemStack.dynamicProperties` via `DynamicAttributeStorage`
- **Use**: Non-stackable items (tools, armor) - per-instance attributes
- **Priority**: Highest (checked first)
- **Key**: `'apeirix:attributes'`

### 2. Item-Type (Global)
- **Storage**: `world.dynamicProperty` via `GlobalItemAttributeRegistry`
- **Use**: Stackable items (materials, blocks) - affects ALL items of that type
- **Priority**: Medium (checked after item-instance)
- **Key**: `'apeirix:item_attributes'`
- **Migration**: Auto-migrates from YAML on first world load

### 3. Block-Type (Global)
- **Storage**: `world.dynamicProperty` via `GlobalBlockAttributeRegistry`
- **Use**: Mining checks ONLY (NOT shown in item lore)
- **Priority**: Separate (checked by RequiresToolHandler only)
- **Key**: `'apeirix:block_attributes'`
- **Critical**: Block attributes ≠ Item attributes (different registries)

### 4. Entity-Instance (Per-Entity)
- **Storage**: `Entity.dynamicProperties` via `EntityAttributeStorage`
- **Use**: Entity behaviors (hunger, effects) - per-instance only
- **Priority**: Only source (no global entity registry)
- **Key**: `'apeirix:entity_attributes'`

## YAML Config

### Item Attributes
```yaml
# configs/tools/hammers/wooden_hammer.yaml
lore: lang:lore.auto  # Auto-generate from attributes
attributes:
  hammer_mining: {}  # No config needed
  breakable:
    context: mining  # mining | combat | always
    value: 100       # 100% chance
    conditions:
      blockTags: ['ore']  # Only when mining ore
  durability_modifier:
    durability: 4    # Max 4 uses
  combat_damage_modifier:
    context: combat
    damage: 0        # 0 damage in combat
```

### Entity Attributes (Different Format)
```yaml
# configs/entities/vanilla_overrides/zombie.yaml
id: minecraft:zombie
attributes:
  - id: hunger_infliction  # Array format for entities
    probability: 30        # 0-100, default 100 (optional)
    config:
      duration: 100  # 5 seconds (ticks)
      amplifier: 0   # Level 1
  - id: combat_damage_modifier
    probability: 20  # 20% chance to apply
    config:
      context: combat
      damage: 2
```

**Probability System**:
- Each attribute has independent probability (0-100%)
- Default: 100% (always apply) if not specified
- Rolled once per entity spawn using `Math.random()`
- Multiple attributes can apply simultaneously (independent rolls)
- Example: 30% hunger + 20% damage = ~6% both, ~44% at least one, ~56% none

## 9 Handlers (Single Source of Truth)

| Handler | ID | Context | Scope | Lore | Runtime | Event |
|---------|-----|---------|-------|------|---------|-------|
| BreakableHandler | `breakable` | mining | item | ✅ | Item breaks on use | `beforeEvents.playerBreakBlock` |
| DurabilityModifierHandler | `durability_modifier` | always | item | ✅ | Modify max uses | `afterEvents.playerBreakBlock` |
| CombatDamageModifierHandler | `combat_damage_modifier` | combat | item | ✅ | Modify attack damage | `beforeEvents.entityHurt` |
| UndeadSlayerHandler | `undead_slayer` | combat | item | ✅ | Bonus vs undead | `afterEvents.entityHurt` |
| HammerMiningHandler | `hammer_mining` | mining | item | ❌ | Ore → dust | `afterEvents.playerBreakBlock` |
| RustMiteEdibleHandler | `rust_mite_edible` | always | item | ❌ | Rust Mite attraction | `system.runInterval` |
| RequiresToolHandler | `requires_tool` | mining | block | ✅ | Prevent mining | `beforeEvents.playerBreakBlock` |
| EmptyHandCombatHandler | `empty_hand_combat` | combat | entity | ✅ | Unarmed damage | `beforeEvents.entityHurt` |
| HungerInflictionHandler | `hunger_infliction` | combat | entity | ✅ | Apply hunger | `afterEvents.entityHurt` |

## Handler Structure (Convention)

```typescript
export class MyAttributeHandler {
  // METADATA
  static readonly ATTRIBUTE_ID = 'my_attr';
  static readonly TEMPLATE_KEY = 'my_attr_template';
  
  // LORE (compile-time + runtime)
  static getLoreTemplateKey(): string { return this.TEMPLATE_KEY; }
  static processLorePlaceholders(itemId, line, itemStack?): string {
    // Uses AttributeResolver to get resolved config (static + dynamic)
    const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID);
    return line.replace(/{my_value}/g, resolved?.config?.value || '');
  }
  
  // RUNTIME (event-driven)
  static initialize(): void {
    PlaceholderRegistry.registerAttributeHandler(this);
    world.beforeEvents.playerBreakBlock.subscribe(this.handleEvent);
  }
  
  private static handleEvent(event): void {
    // Use AttributeResolver for dynamic resolution
    const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID);
    if (!resolved) return;
    
    // Use AttributeConditionEvaluator for context/condition checks
    if (!AttributeConditionEvaluator.isActive(resolved.config, evalContext)) return;
    
    // Execute behavior
  }
}
```

## Contexts & Conditions

### Contexts (When Active)
- **`always`**: Active all the time (default)
- **`mining`**: Active when breaking blocks
- **`combat`**: Active when attacking entities

### Mining Conditions
```yaml
conditions:
  blockTags: ['ore', 'stone']      # Block must have one of these tags
  blockIds: ['minecraft:stone']    # OR specific block IDs
```

### Combat Conditions
```yaml
conditions:
  entityFamilies: ['undead']       # Entity must have family tag
  entityTypes: ['minecraft:zombie'] # OR specific entity types
```

## Resolution Flow (Critical)

```
YAML Config
  ↓ Compile
GeneratedAttributes.ts (static data)
  ↓ World Load
GlobalItemAttributeRegistry.initialize() → Auto-migrate static → dynamic
GlobalBlockAttributeRegistry.initialize() → Migrate block-relevant attrs
  ↓ Runtime
AttributeResolver.resolve(itemStack):
  1. Check ItemStack.dynamicProperties (highest priority)
  2. Check GlobalItemAttributeRegistry (medium priority)
  3. Return merged results
  
NOTE: GlobalBlockAttributeRegistry NOT checked by AttributeResolver
      → Only checked by RequiresToolHandler during mining
```

## Templates & Placeholders

```yaml
# configs/script-lang/vi_VN/attributes.yaml

# Templates (for lore generation)
breakable_template: "§cGẫy: §f{breakable_value}% §7{breakable_condition}"
durability_modifier_template: "§6Độ bền: §f{max_durability}"
combat_damage_modifier_template: "§6Sát thương: §f{combat_damage}"
undead_slayer_template: "{attr:undead_slayer}: §f{damageMultiplier}x"

# Labels (for {attr:*} placeholder)
breakable: "Gẫy"
durability_modifier: "Độ bền"
undead_slayer: "§6Diệt Undead"
```

**Placeholder Types**:
- **Static**: `{breakable_value}` - same for all items (from config)
- **Dynamic**: `{current_durability}` - changes per-item (requires ItemStack)
- **Label**: `{attr:breakable}` - attribute name from lang

## Core Files

### Storage (4 classes)
- `DynamicAttributeStorage.ts` - ItemStack.dynamicProperties (non-stackable)
- `EntityAttributeStorage.ts` - Entity.dynamicProperties (per-entity)
- `GlobalItemAttributeRegistry.ts` - world.dynamicProperty (stackable items)
- `GlobalBlockAttributeRegistry.ts` - world.dynamicProperty (block mining)

### Resolution (3 classes)
- `AttributeResolver.ts` - Resolve item attributes (checks 2 sources)
- `EntityAttributeResolver.ts` - Resolve entity attributes (1 source)
- `AttributeConditionEvaluator.ts` - Check context/conditions

### System (2 classes)
- `AttributeSystem.ts` - Initialize all handlers + registries
- `AttributeAPI.ts` - Public API for runtime manipulation

### Handlers (9 classes)
- `handlers/BreakableHandler.ts`
- `handlers/DurabilityModifierHandler.ts`
- `handlers/CombatDamageModifierHandler.ts`
- `handlers/UndeadSlayerHandler.ts`
- `handlers/HammerMiningHandler.ts`
- `handlers/RustMiteEdibleHandler.ts`
- `handlers/RequiresToolHandler.ts`
- `handlers/EmptyHandCombatHandler.ts`
- `handlers/HungerInflictionHandler.ts`

## Add New Attribute (5 Steps)

1. **Create Handler**: `scripts/systems/attributes/handlers/MyHandler.ts`
```typescript
export class MyHandler {
  static readonly ATTRIBUTE_ID = 'my_attr';
  static readonly TEMPLATE_KEY = 'my_attr_template';
  
  static getLoreTemplateKey(): string { return this.TEMPLATE_KEY; }
  
  static processLorePlaceholders(itemId, line, itemStack?): string {
    const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID);
    return line.replace(/{my_value}/g, resolved?.config?.value || '');
  }
  
  static initialize(): void {
    PlaceholderRegistry.registerAttributeHandler(this);
    world.afterEvents.playerBreakBlock.subscribe(this.handleEvent);
  }
  
  private static handleEvent(event): void { /* ... */ }
}
```

2. **Register in PlaceholderRegistry**: `scripts/systems/lore/placeholders/PlaceholderRegistry.ts`
```typescript
const HANDLER_MAP = new Map([
  // ...
  ['my_attr', MyHandler],
]);
```

3. **Register in AttributeSystem**: `scripts/systems/attributes/AttributeSystem.ts`
```typescript
static initialize(): void {
  // ...
  MyHandler.initialize();
}
```

4. **Add Templates**: `configs/script-lang/{lang}/attributes.yaml`
```yaml
my_attr_template: "§6My: §f{my_value}"
my_attr: "My Attribute"
```

5. **Compile**: `bun run dev compile configs/addon.yaml --clean`

## Runtime API (AttributeAPI)

```typescript
// Add attribute (auto-detects stackable vs non-stackable)
AttributeAPI.addAttribute(itemStack, 'combat_damage_modifier', { damage: 5 });

// Remove attribute
AttributeAPI.removeAttribute(itemStack, 'combat_damage_modifier');

// Transfer between items (auto-updates block registry if needed)
AttributeAPI.transferAttribute(fromStack, toStack, 'combat_damage_modifier');

// Transfer to block type (updates BOTH item + block registries)
AttributeAPI.transferAttributeToBlockType(itemStack, 'requires_tool', 'minecraft:dirt');

// Transfer between block types
AttributeAPI.transferAttributeBetweenBlockTypes('minecraft:oak_log', 'minecraft:birch_log', 'requires_tool');

// Transfer to entity
AttributeAPI.transferAttributeToEntity(itemStack, entity, 'hunger_infliction');

// Get all attributes (resolved)
const attrs = AttributeAPI.getAttributes(itemStack);
// Returns: [{ id: 'breakable', config: {...}, source: 'item_instance' }]
```

## Common Patterns

### Conditional Breakable (Mining)
```yaml
breakable:
  context: mining
  value: 100
  conditions:
    blockTags: ['ore']
```

### Undead Slayer (Combat)
```yaml
undead_slayer:
  context: combat
  damageMultiplier: 1.5
  conditions:
    entityFamilies: ['undead']
```

### Requires Tool (Block)
```yaml
# configs/special/vanilla_overrides/oak_log.yaml
attributes:
  requires_tool:
    toolType: axe  # axe | pickaxe
```

### Entity Hunger (Entity with Probability)
```yaml
# configs/entities/vanilla_overrides/zombie.yaml
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

## Key Differences

### Item vs Entity Attributes
- **Item**: Object format `{ breakable: { value: 100 } }`
- **Entity**: Array format `[{ id: 'hunger_infliction', probability: 30, config: {...} }]`
- **Probability**: Entity attributes support probability field (0-100%), items do not

### Item vs Block Attributes
- **Item attributes**: For lore display (checked by AttributeResolver)
- **Block attributes**: For mining checks (checked by RequiresToolHandler)
- **Separation**: Same item can have BOTH (e.g., oak_log has item lore + block mining check)

### Static vs Dynamic
- **Static**: From YAML, auto-migrated to GlobalItemAttributeRegistry on first load
- **Dynamic**: Added at runtime via AttributeAPI, persisted to world.dynamicProperty
- **Priority**: Dynamic overrides static (instance > type)


## Entity Attribute Probability System

### Overview
Entity attributes can be applied probabilistically when entities spawn. Each attribute has an independent probability roll (0-100%), allowing for variant mobs with different abilities.

### Configuration

```yaml
# configs/entities/vanilla_overrides/zombie.yaml
id: minecraft:zombie
attributes:
  - id: hunger_infliction
    probability: 30  # 30% chance to apply
    config:
      duration: 100
      amplifier: 0
  
  - id: combat_damage_modifier
    probability: 20  # 20% chance to apply
    config:
      context: combat
      damage: 2
```

### Probability Mechanics

**Independent Rolls**: Each attribute is rolled separately
- Zombie with 30% hunger + 20% damage:
  - Both attributes: ~6% (0.3 × 0.2)
  - At least one: ~44% (1 - 0.7 × 0.8)
  - Neither: ~56% (0.7 × 0.8)

**Default Behavior**: 
- No `probability` field = 100% (always apply)
- Backward compatible with existing configs

**Roll Timing**:
- Rolled ONCE per entity spawn
- Attributes persist on entity (stored in dynamicProperties)
- Re-spawning same entity type = new probability rolls

### Implementation Flow

1. **Compile Time**: EntityLoader parses probability from YAML
2. **Generation**: GameDataGenerator outputs to GENERATED_ENTITIES
3. **Runtime**: EntitySystem applies attributes based on probability rolls

```typescript
// EntitySystem.ts
for (const attr of config.attributes) {
  const probability = attr.probability ?? 100; // Default 100%
  const roll = Math.random() * 100; // 0-100
  
  if (roll < probability) {
    EntityAttributeStorage.setAttribute(entity, attr.id, attr.config);
  }
}
```

### Use Cases

**Variant Mobs**:
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

**Elite Mobs**:
```yaml
id: minecraft:creeper
attributes:
  - id: elite_marker
    probability: 5  # 5% elite
    config:
      explosionRadius: 8
```

**Conditional Spawns**:
```yaml
id: minecraft:spider
attributes:
  - id: poison_attack
    probability: 40  # 40% poisonous
  - id: web_shooter
    probability: 20  # 20% web-shooting
```

### Testing

**In-Game Test**: `/scriptevent apeirix:test_entity_probability`
- Spawns 20 zombies
- Analyzes attribute distribution
- Compares actual vs expected probabilities

**Files**:
- Test: `scripts/tests/TestEntityProbability.ts`
- Docs: `docs/entity-attribute-probability-system.md`
- Summary: `tasks/entity-probability-implementation-summary.md`
