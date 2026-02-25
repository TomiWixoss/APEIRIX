---
inclusion: auto
fileMatchPattern: "**/*.yaml"
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
- ui, achievements, etc. (script UI lang)

## Workflow

1. Define translations in YAML
2. Use lang keys in configs/code
3. Compile generates output files
4. LangManager loads at runtime

**Read existing lang YAML files for exact format and available keys.**
