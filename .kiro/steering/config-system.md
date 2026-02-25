---
inclusion: auto
fileMatchPattern: "**/configs/**/*.yaml"
description: "Config system documentation - auto-included when editing config YAML files"
---

# Config System

## Cấu Trúc

**Mỗi entity = 2 files:**
- `entity.yaml` - Definition + recipes
- `entity.test.yaml` - Test commands (optional)

**Mỗi thư mục = 2 index files:**
- `index.yaml` - Import entity.yaml files
- `index.test.yaml` - Import entity.test.yaml files

## Entity Format

**Item:**
```yaml
id: tin_ingot
name: lang:materials.tin_ingot  # PHẢI dùng lang key
texture: ../../../../assets/items/tin_ingot.png
category: items
maxStackSize: 64
recipes:
  - type: smelting
    input: apeirix:tin_ore
    output: apeirix:tin_ingot
```

**Tool:**
```yaml
id: bronze_pickaxe
name: lang:tools.bronze_pickaxe
type: pickaxe
texture: ../../../../assets/tools/bronze_pickaxe.png
materialId: apeirix:bronze_ingot
durability: 375
damage: 4
tier: stone
recipe:
  type: shaped
  pattern: ["###", " S ", " S "]
  ingredients:
    "#": apeirix:bronze_ingot
    S: minecraft:stick
```

**Ore:**
```yaml
id: tin_ore
name: lang:materials.tin_ore
texturePath: ../../../../assets/blocks/tin_ore.png
deepslateTexturePath: ../../../../assets/blocks/deepslate_tin_ore.png
toolTier: stone
minY: 0
maxY: 64
veinSize: 9
veinsPerChunk: 20
```

## Main Config

```yaml
# addon.yaml
addon:
  name: APEIRIX
  language: vi_VN  # vi_VN hoặc en_US
  version: [1, 0, 0]
  minEngineVersion: [1, 21, 50]
import:
  - materials/index.yaml
  - tools/index.yaml
  - armor/index.yaml
  - foods/index.yaml
```

## Quy Tắc

- PHẢI dùng `lang:` prefix cho `name` field
- Texture paths relative to config file
- Recipe IDs phải unique
- Test commands optional nhưng recommended
