# How to Add Custom Attributes

Hướng dẫn thêm thuộc tính (attributes) mới vào items/tools/armor và sử dụng auto-generated lore.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Attribute Handler Structure](#attribute-handler-structure)
5. [Using lore.auto](#using-loreauto)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

---

## Overview

**Attribute System** cho phép bạn:
- Thêm custom behaviors cho items (breakable, durability modifier, combat damage, etc.)
- Auto-generate lore từ attribute config
- Support conditional attributes (chỉ active trong context nhất định)
- Override vanilla items với custom attributes

**Architecture**: Single Source of Truth
- Mỗi attribute = 1 handler file chứa TẤT CẢ logic (metadata, lore generation, runtime behavior)
- Convention over configuration: Template key = `{attribute_id}_template`
- Auto-discovery: System tự động discover handlers và templates

---

## Quick Start

### Thêm Attribute vào Item Mới

```yaml
# configs/tools/bronze/pickaxe.yaml
id: bronze_pickaxe
name: lang:tools.bronze_pickaxe
lore: lang:lore.auto  # ← Auto-generate lore từ attributes
texture: ../../../assets/bronze_pickaxe.png
damage: 4
durability: 375

attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
  
  durability_modifier:
    value: 4
```

### Override Vanilla Item

```yaml
# configs/special/vanilla_overrides/wooden_pickaxe.yaml
id: minecraft:wooden_pickaxe
lore: lang:lore.auto  # ← Auto-generate lore

attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
  
  durability_modifier:
    value: 4
  
  combat_damage_modifier:
    context: combat
    value: 0
```

**Lưu ý**: Vanilla items không thể override name/stats qua BP/RP, chỉ có thể modify behavior qua scripts.

---

## Step-by-Step Guide

### 1. Tạo Attribute Handler

Tạo file mới trong `scripts/systems/attributes/handlers/`:

```typescript
// scripts/systems/attributes/handlers/MyAttributeHandler.ts

import { world, ItemStack, Player } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { AttributeConditionEvaluator } from '../AttributeConditionEvaluator';
import { AttributeContext, EvaluationContext } from '../types/AttributeTypes';

export class MyAttributeHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'my_attribute';
  static readonly TEMPLATE_KEY = 'my_attribute_template';
  
  // ============================================
  // LORE GENERATION (Compile-time)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {my_value}, {my_condition}
   */
  static processLorePlaceholders(itemId: string, line: string): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    let result = line;
    
    // Replace {my_value}
    if (config?.value !== undefined) {
      result = result.replace(/{my_value}/g, config.value.toString());
    }
    
    // Replace {my_condition}
    if (config?.conditions) {
      const conditionText = this.formatCondition(config.conditions);
      result = result.replace(/{my_condition}/g, conditionText);
    } else {
      result = result.replace(/{my_condition}/g, '');
    }
    
    return result;
  }
  
  /**
   * Format condition text from config
   */
  private static formatCondition(conditions: any): string {
    // Custom logic để format condition text
    if (conditions.blockTags && conditions.blockTags.length > 0) {
      return `khi đào ${conditions.blockTags.join(', ')}`;
    }
    return '';
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static itemsWithAttribute = new Map<string, any>();

  static initialize(): void {
    console.warn('[MyAttributeHandler] Initializing...');
    
    // Load items with this attribute
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    for (const item of items) {
      this.itemsWithAttribute.set(item.itemId, item.config);
    }
    
    console.warn(`[MyAttributeHandler] Loaded ${this.itemsWithAttribute.size} items`);
    
    // Subscribe to events
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleEvent(event);
    });
    
    console.warn('[MyAttributeHandler] Initialized');
  }

  private static handleEvent(event: any): void {
    // Your runtime logic here
  }
}
```

**Lưu ý**: Nếu attribute chỉ có runtime behavior (không có lore), bỏ qua section LORE GENERATION:

```typescript
export class RuntimeOnlyHandler {
  // ============================================
  // METADATA
  // ============================================
  static readonly ATTRIBUTE_ID = 'runtime_only';
  // No TEMPLATE_KEY - this attribute has no lore
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  static initialize(): void {
    // ...
  }
}
```

### 2. Register Handler

Thêm handler vào `PlaceholderRegistry.ts`:

```typescript
// scripts/systems/lore/placeholders/PlaceholderRegistry.ts

import { MyAttributeHandler } from '../../attributes/handlers/MyAttributeHandler';

const ATTRIBUTE_HANDLERS = [
  BreakableHandler,
  DurabilityModifierHandler,
  CombatDamageModifierHandler,
  UndeadSlayerHandler,
  HammerMiningHandler,
  RustMiteEdibleHandler,
  MyAttributeHandler,  // ← Add here
] as const;
```

Và trong `AttributeSystem.ts`:

```typescript
// scripts/systems/attributes/AttributeSystem.ts

import { MyAttributeHandler } from './handlers/MyAttributeHandler';

export class AttributeSystem {
  static initialize(): void {
    // ...
    MyAttributeHandler.initialize();  // ← Add here
  }
}
```

### 3. Thêm Lang Templates

Thêm template cho mỗi ngôn ngữ:

```yaml
# configs/script-lang/vi_VN/attributes.yaml
my_attribute_template: "§6Thuộc tính: §f{my_value} §7{my_condition}"
```

```yaml
# configs/script-lang/en_US/attributes.yaml
my_attribute_template: "§6Attribute: §f{my_value} §7{my_condition}"
```

**Convention**: Template key PHẢI là `{attribute_id}_template`

### 4. Thêm Attribute Label (Optional)

Nếu muốn hiển thị tên attribute trong lore:

```yaml
# configs/script-lang/vi_VN/attributes.yaml
my_attribute: "Thuộc tính của tôi"
```

```yaml
# configs/script-lang/en_US/attributes.yaml
my_attribute: "My Attribute"
```

Sử dụng trong template: `{attr:my_attribute}` → "Thuộc tính của tôi"

### 5. Compile & Test

```bash
# Compile configs
bun run dev compile configs/addon.yaml --clean

# Build & deploy
.\build-and-deploy.ps1
```

---

## Attribute Handler Structure

### Full Structure (với Lore)

```typescript
export class FullAttributeHandler {
  // METADATA
  static readonly ATTRIBUTE_ID = 'attribute_id';
  static readonly TEMPLATE_KEY = 'attribute_id_template';
  
  // LORE GENERATION
  static getLoreTemplateKey(): string { return this.TEMPLATE_KEY; }
  static processLorePlaceholders(itemId: string, line: string): string { /* ... */ }
  private static formatCondition(conditions: any): string { /* ... */ }
  
  // RUNTIME BEHAVIOR
  static initialize(): void { /* ... */ }
  private static handleEvent(event: any): void { /* ... */ }
}
```

### Runtime-Only Structure (không có Lore)

```typescript
export class RuntimeOnlyHandler {
  // METADATA
  static readonly ATTRIBUTE_ID = 'attribute_id';
  // No TEMPLATE_KEY
  
  // RUNTIME BEHAVIOR
  static initialize(): void { /* ... */ }
  private static handleEvent(event: any): void { /* ... */ }
}
```

---

## Using lore.auto

### Cách hoạt động

Khi bạn set `lore: lang:lore.auto` trong YAML:

1. **Compile-time**: WikiDataBPGenerator detect `lore.auto`
2. **Auto-discovery**: Tìm tất cả attributes của item
3. **Template lookup**: Với mỗi attribute, tìm template key `{attribute_id}_template`
4. **Generate lore**: Tạo lore array từ templates
5. **Runtime**: PlaceholderRegistry replace placeholders với actual values

### Example Flow

**YAML Config:**
```yaml
id: bronze_pickaxe
lore: lang:lore.auto
attributes:
  breakable:
    value: 100
    conditions:
      blockTags: ['ore']
  durability_modifier:
    value: 4
```

**Lang Templates:**
```yaml
# vi_VN/attributes.yaml
breakable_template: "§cGẫy: §f{breakable_value}% §7{breakable_condition}"
durability_modifier_template: "§6Độ bền: §f{max_durability}"
```

**Generated Lore (compile-time):**
```typescript
lore: [
  "§cGẫy: §f{breakable_value}% §7{breakable_condition}",
  "§6Độ bền: §f{max_durability}"
]
```

**Final Lore (runtime):**
```
§cGẫy: §f100% §7(khi đào ore)
§6Độ bền: §f4
```

### Placeholders

Mỗi attribute handler define placeholders riêng:

| Attribute | Placeholders | Example |
|-----------|-------------|---------|
| `breakable` | `{breakable_value}`, `{breakable_condition}` | `100%`, `(khi đào ore)` |
| `durability_modifier` | `{max_durability}` | `4` |
| `combat_damage_modifier` | `{combat_damage}` | `5` |
| `undead_slayer` | `{damageMultiplier}` | `2.5x` |

**Attribute Label Placeholder**: `{attr:attribute_id}` → Tên attribute từ lang file

---

## Examples

### Example 1: Simple Attribute (No Conditions)

```yaml
# configs/tools/steel/sword.yaml
id: steel_sword
lore: lang:lore.auto
attributes:
  combat_damage_modifier:
    context: combat
    value: 8
```

**Lang:**
```yaml
combat_damage_modifier_template: "§6Sát thương: §f{combat_damage}"
```

**Result:**
```
§6Sát thương: §f8
```

### Example 2: Conditional Attribute

```yaml
# configs/tools/silver/sword.yaml
id: silver_sword
lore: lang:lore.auto
attributes:
  undead_slayer:
    context: combat
    value: 2.5
    conditions:
      entityFamilies: ['undead']
```

**Lang:**
```yaml
undead_slayer_template: "{attr:undead_slayer}: §f{damageMultiplier}x §7(vs undead)"
undead_slayer: "§6Diệt Undead"
```

**Result:**
```
§6Diệt Undead: §f2.5x §7(vs undead)
```

### Example 3: Multiple Attributes

```yaml
# configs/tools/bronze/pickaxe.yaml
id: bronze_pickaxe
lore: lang:lore.auto
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
  
  durability_modifier:
    value: 4
  
  hammer_mining:
    context: mining
```

**Lang:**
```yaml
breakable_template: "§cGẫy: §f{breakable_value}% §7{breakable_condition}"
durability_modifier_template: "§6Độ bền: §f{max_durability}"
# hammer_mining không có template (runtime-only)
```

**Result:**
```
§cGẫy: §f100% §7(khi đào ore)
§6Độ bền: §f4
```

### Example 4: Vanilla Override

```yaml
# configs/special/vanilla_overrides/wooden_pickaxe.yaml
id: minecraft:wooden_pickaxe
lore: lang:lore.auto
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
  
  durability_modifier:
    value: 4
  
  combat_damage_modifier:
    context: combat
    value: 0
```

**Lưu ý**: 
- Không thêm `apeirix:` prefix cho vanilla items
- Không thể override name/stats, chỉ có thể add custom behaviors

---

## Troubleshooting

### Lore không hiển thị

**Kiểm tra:**
1. Template key đúng convention: `{attribute_id}_template`
2. Template tồn tại trong `configs/script-lang/{lang}/attributes.yaml`
3. Handler có method `processLorePlaceholders()`
4. Handler được register trong `PlaceholderRegistry.ts`

**Debug:**
```typescript
// Check generated lore
console.warn('[Debug] Generated lore:', GENERATED_WIKI_ITEMS.find(i => i.id === 'apeirix:bronze_pickaxe')?.lore);
```

### Placeholder không được replace

**Kiểm tra:**
1. Placeholder name đúng (case-sensitive)
2. Handler implement `processLorePlaceholders()` đúng
3. Config có value cho placeholder

**Debug:**
```typescript
// In handler
static processLorePlaceholders(itemId: string, line: string): string {
  console.warn(`[Debug] Processing: ${line}`);
  const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
  console.warn(`[Debug] Config:`, config);
  // ...
}
```

### Attribute không active

**Kiểm tra:**
1. Context đúng (`mining`, `combat`, `always`)
2. Conditions match (blockTags, blockIds, entityFamilies)
3. Handler được initialize trong `AttributeSystem.ts`

**Debug:**
```typescript
// In handler
private static handleEvent(event: any): void {
  const config = this.itemsWithAttribute.get(itemId);
  console.warn(`[Debug] Config:`, config);
  
  const isActive = AttributeConditionEvaluator.isActive(config, evalContext);
  console.warn(`[Debug] Is active:`, isActive);
}
```

### TypeScript errors

**Common errors:**
- `Property 'processLorePlaceholders' does not exist`: Handler chưa có method này (OK nếu runtime-only)
- `Cannot find module`: Import path sai
- Type mismatch: Check AttributeHandler interface

**Fix:**
```typescript
// PlaceholderRegistry.ts đã handle runtime-only handlers
if (h.processLorePlaceholders) {
  processedLine = h.processLorePlaceholders(itemId, processedLine);
}
```

---

## Best Practices

1. **Convention over Configuration**: Luôn dùng `{attribute_id}_template` cho template key
2. **Single Source of Truth**: Tất cả logic trong 1 handler file
3. **Type Safety**: Dùng TypeScript interfaces và type guards
4. **Optimization**: Check item có attribute trước khi process
5. **Documentation**: Comment rõ ràng về attribute behavior
6. **Testing**: Test cả compile-time (lore) và runtime (behavior)

---

## Related Files

- **Handlers**: `scripts/systems/attributes/handlers/`
- **Registry**: `scripts/systems/lore/placeholders/PlaceholderRegistry.ts`
- **System**: `scripts/systems/attributes/AttributeSystem.ts`
- **Templates**: `configs/script-lang/{lang}/attributes.yaml`
- **Examples**: `configs/special/vanilla_overrides/wooden_pickaxe.yaml`
- **Types**: `scripts/systems/attributes/types/AttributeTypes.ts`
- **Evaluator**: `scripts/systems/attributes/AttributeConditionEvaluator.ts`
