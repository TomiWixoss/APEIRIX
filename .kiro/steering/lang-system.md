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

## Wiki System (Special Case)

Wiki data is stored separately from regular script UI lang:

### Wiki UI Text
- Location: `configs/script-lang/{language}/wiki.yaml`
- Purpose: UI labels (title, buttons, category names)
- Output: `scripts/lang/{language}.ts` (under `wiki` key)
- Usage: `LangManager.get('wiki.title')`

### Wiki Item Data
- Location: `configs/script-lang/{language}/wiki/{category}/`
- Structure: Mirrors config structure (materials/, tools/, armor/, foods/, special/)
- Purpose: Item names, descriptions, and info for wiki display
- Output: `scripts/data/GeneratedGameData.ts` (GENERATED_WIKI_ITEMS)
