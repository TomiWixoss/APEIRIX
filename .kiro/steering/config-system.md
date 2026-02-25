---
description: "Config system overview - auto-included when editing YAML configs"
---

# Config System Overview

**Note: Read existing YAML files to understand exact format.**

## Structure

Each entity typically has:
- `entity.yaml` - Main definition
- `entity.test.yaml` - Test commands (optional)

Each directory has:
- `index.yaml` - Imports entity files
- `index.test.yaml` - Imports test files

## Key Concepts

- All names use `lang:` prefix
- Texture paths are relative to config file
- Recipes defined in entity YAML
- Main config is `addon.yaml`

## Entity Types

- Materials (items, ores, blocks)
- Tools (pickaxe, axe, shovel, hoe, sword, spear)
- Armor (helmet, chestplate, leggings, boots)
- Foods (with effects)
- Special items

## Rules

- Use `lang:` prefix for names
- Follow existing file patterns
- Test after changes
- Don't edit generated JSON

**Read existing YAML files for exact format and structure.**
