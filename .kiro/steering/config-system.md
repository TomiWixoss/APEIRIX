---
description: "Config system overview - auto-included when editing YAML configs"
---

# Config System Overview

**Note: Read existing YAML files to understand exact format.**

## Structure

Each entity has:
- `entity.yaml` - Main definition

Each directory has:
- `index.yaml` - Imports entity files

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
- Don't edit generated JSON

## Asset Path Handling

**CRITICAL: When adding new items and getting "asset not found" warnings:**

❌ DON'T: Edit logic/code to fix paths
✅ DO: Fix the path in YAML config file

Asset paths in YAML are relative to the config file location. Number of `../` depends on folder depth:

**2 levels deep** (`configs/category/item.yaml`):
- `texture: ../../assets/items/achievement_book.png`
- Examples: `special/`, `tools/` (root level items)

**3 levels deep** (`configs/category/subcategory/item.yaml`):
- `texture: ../../../assets/items/tin_ingot.png`
- Examples: `materials/bronze/`, `foods/canned-food/`, `armor/bronze/`, `tools/bronze/`

If compilation shows missing asset warnings:
1. Check the actual asset file location
2. Count folder depth from config file to `configs/`
3. Update the `texture:` path with correct number of `../`
4. Recompile - don't modify PathResolver or generator logic

**Common patterns:**
- Items: `../../assets/items/` or `../../../assets/items/`
- Tools: `../../assets/tools/` or `../../../assets/tools/`
- Armor items: `../../../assets/armor/items/`
- Armor layers: `../../../assets/armor/layers/`
- Foods: `../../../assets/foods/`
- Blocks: `../../../assets/blocks/`

**Read existing YAML files for exact format and structure.**
