---
description: "Language system overview - auto-included when editing YAML"
---

# Language System Overview

**Note: Read existing lang files to understand exact structure.**

## Two Separate Systems

### 1. Pack Lang (YAML → Pack Lang Files)
- Location: `configs/lang/{language}/`
- Purpose: Item/block names in-game
- Output: `build/BP/texts/` and `build/RP/texts/`
- Usage: `name: lang:category.item_id` in entity YAML

### 2. Script UI Lang (YAML → TypeScript)
- Location: `configs/script-lang/{language}/`
- Purpose: UI text in scripts
- Output: `scripts/lang/{language}.ts`
- Usage: `LangManager.get('key')` in TypeScript

## Key Concepts

- Language selected in `addon.yaml`
- All entity names use `lang:` prefix
- Lang keys format: `category.entity_id`
- Auto-generated files, don't edit output

## Categories

- materials, tools, armor, foods, special (pack lang)
- ui, achievements, wiki (script UI lang)

## Wiki System

### Wiki UI Text
- Location: `configs/script-lang/{language}/wiki.yaml`
- Purpose: UI labels (title, buttons, category names)
- Output: `scripts/lang/{language}.ts` (under `wiki` key)
- Usage: `LangManager.get('wiki.title')`

### Wiki Item Descriptions
- Location: `configs/script-lang/{language}/wiki/{category}.yaml`
  - `wiki/materials.yaml` - Material descriptions
  - `wiki/tools.yaml` - Tool descriptions
  - `wiki/armor.yaml` - Armor descriptions
  - `wiki/foods.yaml` - Food descriptions
- Format: `item_id: "description text"`
- Purpose: Item descriptions for wiki display
- Output: `scripts/data/GeneratedGameData.ts` (GENERATED_WIKI_ITEMS)

### Using Wiki Descriptions in Entity YAMLs

Add `wikiDescription` field with lang key prefix:

```yaml
# configs/materials/ingots/tin_ingot.yaml
id: tin_ingot
name: lang:materials.tin_ingot
wikiDescription: lang:wiki.materials.tin_ingot  # References wiki lang file
texture: ../assets/ingots/tin_ingot.png
```

Then add descriptions to wiki lang files:

```yaml
# configs/script-lang/vi_VN/wiki/materials.yaml
tin_ingot: "Thỏi thiếc dùng để chế tạo hợp kim đồng thanh."
```

```yaml
# configs/script-lang/en_US/wiki/materials.yaml
tin_ingot: "Tin ingot used to craft bronze alloy."
```

Compile: `bun run dev compile configs/addon.yaml`

### Benefits

- Centralized description management
- Easy multi-language support
- Consistent with name field pattern (`lang:` prefix)
- Descriptions stay in sync across languages
