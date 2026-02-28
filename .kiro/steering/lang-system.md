---
description: "Lang system - 3 types: Pack, Script UI, Lore + Wiki"
---

# Lang System

## 3 Systems

### 1. Pack Lang
- `configs/lang/{lang}/` → `build/BP/texts/` (in-game names)
- Usage: `name: lang:materials.tin_ingot`
- Categories: materials, tools, armor, foods, special, blocks

### 2. Script UI Lang
- `configs/script-lang/{lang}/` → `scripts/lang/{lang}.ts` (UI text)
- Usage: `LangManager.get('ui.wiki.title')`
- Categories: ui, achievements, wiki

### 3. Lore
- `configs/script-lang/{lang}/lore/` → `GeneratedGameData.ts` (item descriptions)
- Usage: `lore: lang:lore.materials.tin_ingot`
- Auto-applies to items in inventory
- Categories: materials, tools, armor, foods

## Wiki System

Wiki có 2 phần:

### Wiki UI Text
- Location: `configs/script-lang/{lang}/wiki.yaml`
- Purpose: UI labels (title, buttons, category names)
- Output: `scripts/lang/{lang}.ts`
- Usage: `LangManager.get('wiki.title')`

### Wiki Descriptions
- Location: `configs/script-lang/{lang}/wiki/{category}.yaml`
- Purpose: Item descriptions for wiki display
- Output: `GeneratedGameData.ts` (GENERATED_WIKI_ITEMS)
- Usage: `wikiDescription: lang:wiki.materials.tin_ingot`
- Categories: materials, tools, armor, foods

**Difference from Lore:**
- **Lore**: Shows on item tooltip (multi-line with colors)
- **Wiki**: Shows in wiki UI when viewing item details (single paragraph)

## Examples

### Pack Lang
```yaml
# configs/lang/vi_VN/materials.yaml
materials:
  tin_ingot: "Thỏi Thiếc"
```
→ `build/BP/texts/vi_VN.lang`: `item.apeirix:tin_ingot=Thỏi Thiếc`

### Script UI Lang
```yaml
# configs/script-lang/vi_VN/ui.yaml
ui:
  wiki:
    title: "§l§0BÁCH KHOA TOÀN THƯ"
```
→ `scripts/lang/vi_VN.ts`: `{ ui: { wiki: { title: "..." } } }`
→ Usage: `LangManager.get('ui.wiki.title')`

### Lore
```yaml
# configs/script-lang/vi_VN/lore/materials.yaml
tin_ingot:
  - "§7Thỏi thiếc sáng bóng"
  - "§6Loại: §fVật Liệu"
```
→ Entity YAML: `lore: lang:lore.materials.tin_ingot`
→ Auto-applies to items in inventory

### Wiki Description
```yaml
# configs/script-lang/vi_VN/wiki/materials.yaml
tin_ingot: "Thỏi Thiếc cơ bản. Vật liệu nền tảng để chế tạo đồ hộp hoặc nấu hợp kim Đồng Thanh."
```
→ Entity YAML: `wikiDescription: lang:wiki.materials.tin_ingot`
→ Shows in wiki UI detail view

## Format Codes
- Colors: `§0-9,a-f` (0=black, 7=gray, a=green, c=red, e=yellow, f=white)
- Format: `§l`=bold, `§o`=italic, `§r`=reset

## Workflow
1. Add to `configs/lang/` or `configs/script-lang/`
2. Reference in YAML:
   - `name: lang:category.id`
   - `lore: lang:lore.category.id`
   - `wikiDescription: lang:wiki.category.id`
3. Compile: `bun run dev compile configs/addon.yaml`
4. Auto-generates output files
