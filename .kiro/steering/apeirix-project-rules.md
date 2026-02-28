---
description: "APEIRIX core rules - read code for details"
---

LUÔN TRẢ LỜI TIẾNG VIỆT!

# APEIRIX - Core Rules

## Critical Principles

### 1. Context-Gatherer First
**MANDATORY**: Use context-gatherer subagent trước khi implement (trừ khi task cực đơn giản)

### 2. Code Is Truth
Rules = overview only. Sau khi gather context:
- Đọc similar implementations
- Follow exact patterns
- Never invent new structures

## Structure

```
addon-generator/configs/  → YAML (EDIT)
addon-generator/build/    → JSON (NEVER EDIT)
scripts/                  → TypeScript game logic
scripts/data/Generated*.ts → AUTO-GENERATED
```

## Workflow

1. **Context**: Tìm similar feature, đọc files
2. **Implement**: Copy pattern, modify minimal
3. **Build**: `bun run dev compile configs/addon.yaml --clean` → `.\build-and-deploy.ps1`

## Key Concepts

### Lang System (3 types)
- **Pack Lang**: `configs/lang/` → in-game names → `build/BP/texts/`
- **Script UI Lang**: `configs/script-lang/` → UI text → `scripts/lang/*.ts`
- **Lore**: `configs/script-lang/lore/` → item descriptions → `GeneratedGameData.ts`
- Usage: `name: lang:category.item_id`, `lore: lang:lore.category.item_id`

### Asset Paths
- Relative to config file
- **2 levels**: `../../assets/`
- **3 levels**: `../../../assets/`
- Fix in YAML, not code

### Generated Files
**Never edit**: `build/`, `GeneratedGameData.ts`, `GeneratedProcessingRecipes.ts`, `scripts/lang/*.ts`

## Common Tasks

### Add Material
1. Read `docs/how-to-add-new-material.md`
2. Create textures in `configs/materials/assets/`
3. Create YAMLs in `configs/materials/{material}/`
4. Update `configs/materials/index.yaml`
5. Add lang entries
6. Compile & test

### Add Tool/Armor
Find similar → copy pattern → update textures/stats → update index → compile

### Add Processing Recipe
Edit `configs/materials/processing/*.yaml` → compile → auto-loads

## Troubleshooting

- **Asset not found**: Check `../` count in YAML path
- **Lang missing**: Verify key in `configs/lang/` or `configs/script-lang/`
- **In-game issue**: `/reload`, check console, verify generated files

## Official Minecraft Bedrock Documentation

**Local Clone**: `C:\Users\tomis\Docs\APEIRIX\minecraft-creator\`

Khi cần tài liệu về components, behaviors, hoặc JSON schemas, explore thư mục này:
- `creator/Documents/` - Tutorials & guides
- `creator/Reference/Content/` - JSON schema references
- `creator/ScriptAPI/` - Script API docs
