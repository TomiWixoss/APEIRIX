---
description: "Config system - YAML structure & patterns"
---

# Config System

## Structure
```
configs/{category}/
├── index.yaml           # Import entities
├── assets/              # Textures
└── {subcategory}/
    ├── index.yaml
    └── {entity}.yaml    # Entity definition
```

## Entity Types

### Materials (`configs/materials/`)
- `ores/` - Ore blocks + world gen
- `ingots/`, `nuggets/`, `blocks/` - Material items
- `dusts/`, `raw/` - Processing items
- `processing/` - Machine recipes

### Tools (`configs/tools/`)
Types: pickaxes, axes, shovels, hoes, swords, hammers, spears

### Armor (`configs/armor/`)
Types: helmets, chestplates, leggings, boots

### Foods (`configs/foods/`)
Subcategory: `canned/`

### Machines (`configs/machines/`)
Processing machines (crusher, compressor, ore_washer, etc.)

### Special (`configs/special/`)
Special items (achievement_book, wiki_book)

## Key Concepts

### Lang Prefix
All names: `name: lang:category.entity_id`

### Asset Paths (relative to config file)
- **2 levels** (`configs/category/entity.yaml`): `../../assets/`
- **3 levels** (`configs/category/subcategory/entity.yaml`): `../../../assets/`

### Recipes
Types: shaped, shapeless, smelting, blasting
```yaml
recipes:
  - type: shaped
    id: tin_block
    pattern: ["###", "###", "###"]
    ingredients:
      "#": apeirix:tin_ingot
    result: apeirix:tin_block
    count: 1
```

## Common Patterns

### Material Set (Ore)
```
materials/{material}/
├── {material}_ore.yaml
├── raw_{material}.yaml
├── {material}_ingot.yaml
├── {material}_nugget.yaml
├── {material}_block.yaml
├── {material}_ingot_dust.yaml
└── {material}_ingot_dust_pure.yaml
```

### Tool Set
```
tools/{material}/
├── pickaxe.yaml
├── axe.yaml
├── shovel.yaml
├── hoe.yaml
├── sword.yaml
└── hammer.yaml
```

### Armor Set
```
armor/{material}/
├── helmet.yaml
├── chestplate.yaml
├── leggings.yaml
└── boots.yaml
```

## Examples

### Material
```yaml
id: tin_ingot
name: lang:materials.tin_ingot
lore: lang:lore.materials.tin_ingot
texture: ../../../assets/ingots/tin_ingot.png
category: items
maxStackSize: 64
recipes: [...]
```

### Tool
```yaml
type: pickaxe
id: tin_pickaxe
name: lang:tools.tin_pickaxe
texture: ../../../assets/tin_pickaxe.png
damage: 4
durability: 375
tier: iron
materialId: apeirix:tin_ingot
recipe: {...}
```

### Armor
```yaml
type: helmet
id: tin_helmet
name: lang:armor.tin_helmet
texture: ../../../assets/items/tin_helmet.png
armorLayerTexturePath: ../../../assets/layers/tin_layer_1.png
durability: 220
protection: 2
slot: slot.armor.head
materialId: apeirix:tin_ingot
```

## Troubleshooting

**Asset not found**: Count `../` correctly based on folder depth
**Duplicate ID**: Check ID unique across all entities
**Invalid lang key**: Verify key exists in `configs/lang/`
