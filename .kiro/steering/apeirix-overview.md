---
description: "APEIRIX quick reference - build commands and basic workflow"
---

# APEIRIX - Quick Reference

## Build Commands

```bash
.\build-and-deploy.ps1    # Full pipeline (recommended)
.\compile-only.ps1         # Only compile YAML
regolith run               # Only build TypeScript
.\export-release.ps1       # Export .mcaddon
```

## CLI-First Workflow

✅ **ĐÚNG:**
1. Edit YAML trong `configs/`
2. Compile: `bun run dev compile configs/addon.yaml --clean`
3. Build: `.\build-and-deploy.ps1`

❌ **SAI:**
- Sửa JSON trong `build/` (sẽ bị ghi đè!)

## Thêm Content

**Item/Material:**
1. Tạo `configs/materials/[material]/[item].yaml`
2. Dùng `name: lang:materials.item_id`
3. Thêm vào `index.yaml`
4. Compile & Build

**Tool/Armor/Food:** Tương tự

## Lang System

```yaml
# Entity YAML
name: lang:materials.tin_ingot

# configs/lang/vi_VN/materials.yaml
materials:
  tin_ingot: Thỏi Thiếc
```

Đổi ngôn ngữ: `addon.yaml` → `language: en_US`

## Content Hiện Có

- Materials: 9 entities (tin + bronze)
- Tools: 6 bronze tools
- Armor: 4 bronze pieces
- Foods: 12 canned foods
- Total: 31 entities, 39 recipes

## Quy Tắc Quan Trọng

- Namespace: `apeirix:`
- Không commit `build/` folder
- Dùng `lang:` prefix cho tất cả names
- Test với `/reload` trong game
