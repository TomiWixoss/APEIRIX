# Attributes Quick Reference

Tham khảo nhanh về Attribute System.

## Thêm Attribute vào Item

```yaml
# configs/tools/bronze/pickaxe.yaml
id: bronze_pickaxe
lore: lang:lore.auto  # Auto-generate lore
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
```

## Override Vanilla Item

```yaml
# configs/special/vanilla_overrides/wooden_pickaxe.yaml
id: minecraft:wooden_pickaxe  # Không thêm apeirix: prefix
lore: lang:lore.auto
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
```

## Attribute Config Structure

```yaml
attributes:
  {attribute_id}:
    context: mining | combat | always  # Optional, default: always
    value: number                      # Required
    conditions:                        # Optional
      blockTags: ['ore', 'stone']     # For mining context
      blockIds: ['minecraft:stone']   # For mining context
      entityFamilies: ['undead']      # For combat context
```

## Available Attributes

| Attribute ID | Context | Description | Lore |
|-------------|---------|-------------|------|
| `breakable` | `mining` | Item có chance bị phá khi đào | ✅ |
| `durability_modifier` | `always` | Modify max durability | ✅ |
| `combat_damage_modifier` | `combat` | Modify combat damage | ✅ |
| `undead_slayer` | `combat` | Bonus damage vs undead | ✅ |
| `hammer_mining` | `mining` | Đập block ra dust | ❌ |
| `rust_mite_edible` | `always` | Rust Mite thu hút | ❌ |

## Lore Templates

```yaml
# configs/script-lang/vi_VN/attributes.yaml
breakable_template: "§cGẫy: §f{breakable_value}% §7{breakable_condition}"
durability_modifier_template: "§6Độ bền: §f{max_durability}"
combat_damage_modifier_template: "§6Sát thương: §f{combat_damage}"
undead_slayer_template: "{attr:undead_slayer}: §f{damageMultiplier}x §7(vs undead)"

# Attribute labels (for {attr:*} placeholder)
breakable: "Gẫy"
durability_modifier: "Độ bền"
combat_damage_modifier: "Sát thương"
undead_slayer: "§6Diệt Undead"
```

## Placeholders

| Attribute | Placeholders | Example |
|-----------|-------------|---------|
| `breakable` | `{breakable_value}`, `{breakable_condition}` | `100%`, `(khi đào ore)` |
| `durability_modifier` | `{max_durability}` | `4` |
| `combat_damage_modifier` | `{combat_damage}` | `5` |
| `undead_slayer` | `{damageMultiplier}` | `2.5x` |
| **All** | `{attr:attribute_id}` | `§6Diệt Undead` |

## Workflow

1. **Add attribute to YAML**: Set `lore: lang:lore.auto`
2. **Add lang template**: `{attribute_id}_template` in `attributes.yaml`
3. **Compile**: `bun run dev compile configs/addon.yaml --clean`
4. **Build**: `.\build-and-deploy.ps1`
5. **Test in-game**: Check lore và behavior

## Create New Attribute Handler

### 1. Create Handler File

```typescript
// scripts/systems/attributes/handlers/MyAttributeHandler.ts
export class MyAttributeHandler {
  static readonly ATTRIBUTE_ID = 'my_attribute';
  static readonly TEMPLATE_KEY = 'my_attribute_template';
  
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  static processLorePlaceholders(itemId: string, line: string): string {
    const config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    return line.replace(/{my_value}/g, config?.value?.toString() || '');
  }
  
  static initialize(): void {
    // Runtime logic
  }
}
```

### 2. Register Handler

```typescript
// scripts/systems/lore/placeholders/PlaceholderRegistry.ts
import { MyAttributeHandler } from '../../attributes/handlers/MyAttributeHandler';

const ATTRIBUTE_HANDLERS = [
  // ...
  MyAttributeHandler,  // Add here
] as const;
```

```typescript
// scripts/systems/attributes/AttributeSystem.ts
import { MyAttributeHandler } from './handlers/MyAttributeHandler';

export class AttributeSystem {
  static initialize(): void {
    // ...
    MyAttributeHandler.initialize();  // Add here
  }
}
```

### 3. Add Lang Template

```yaml
# configs/script-lang/vi_VN/attributes.yaml
my_attribute_template: "§6My Attribute: §f{my_value}"
my_attribute: "Thuộc tính của tôi"
```

## Contexts

- **`always`**: Attribute luôn active (default)
- **`mining`**: Chỉ active khi đào block
- **`combat`**: Chỉ active khi combat với entity

## Conditions

### Mining Context

```yaml
conditions:
  blockTags: ['ore', 'stone']      # Match block tags
  blockIds: ['minecraft:stone']    # Match specific blocks
```

### Combat Context

```yaml
conditions:
  entityFamilies: ['undead', 'monster']  # Match entity families
```

## Format Codes

- **Colors**: `§0-9,a-f` (0=black, 7=gray, a=green, c=red, e=yellow, f=white)
- **Format**: `§l`=bold, `§o`=italic, `§r`=reset

## Common Issues

### Lore không hiển thị
- Check template key: `{attribute_id}_template`
- Check handler có `processLorePlaceholders()`
- Check handler registered trong `PlaceholderRegistry.ts`

### Placeholder không replace
- Check placeholder name (case-sensitive)
- Check config có value

### Attribute không active
- Check context đúng
- Check conditions match
- Check handler initialized trong `AttributeSystem.ts`

## Examples

### Simple Attribute
```yaml
attributes:
  combat_damage_modifier:
    value: 8
```
→ `§6Sát thương: §f8`

### Conditional Attribute
```yaml
attributes:
  breakable:
    context: mining
    value: 100
    conditions:
      blockTags: ['ore']
```
→ `§cGẫy: §f100% §7(khi đào ore)`

### Multiple Attributes
```yaml
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
→ 
```
§cGẫy: §f100% §7(khi đào ore)
§6Độ bền: §f4
§6Sát thương: §f0
```

---

**Full Documentation**: See [how-to-add-attributes.md](./how-to-add-attributes.md)
