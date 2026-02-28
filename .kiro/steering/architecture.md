---
description: "Architecture - CLI tool + Game systems"
---

# Architecture

## Overview
**CLI Tool** (addon-generator): YAML → JSON
**Game Systems** (scripts): TypeScript runtime

## CLI Tool

### Pipeline
ConfigLoader → Loaders → Compilers → Generators → Output

### Key Parts
- `src/compiler/` - BPCompiler, RPCompiler, Compiler
- `src/generators/` - ItemGenerator, BlockGenerator, RecipeGenerator, GameDataGenerator, etc.
- `src/core/loaders/` - MaterialLoader, ToolLoader, ArmorLoader, LangLoader, etc.
- `configs/` - YAML source (EDIT)
- `build/` - JSON output (NEVER EDIT)

### Flow
1. Load YAML configs
2. Parse entities (materials, tools, armor, foods, etc.)
3. Generate BP JSON (items, blocks, recipes, features, loot_tables)
4. Generate RP JSON (attachables, textures)
5. Generate TypeScript (GeneratedGameData.ts, GeneratedProcessingRecipes.ts, lang files)
6. Copy assets

### Key Generators
- **GameDataGenerator**: → `GeneratedGameData.ts` (ores, tools, foods, wiki items, lore, blocks)
- **ProcessingRecipeGenerator**: → `GeneratedProcessingRecipes.ts` (machine recipes)
- **LangGenerator**: → `build/BP/texts/*.lang`, `scripts/lang/*.ts`

## Game Systems

### Architecture
- **Event-Driven**: EventBus + Minecraft events
- **Registry Pattern**: Centralized data (OreRegistry, ToolRegistry, FoodRegistry, etc.)
- **System-Based**: Modular systems (AchievementSystem, LoreSystem, WikiUI, etc.)
- **Auto-Generated Integration**: Load from GeneratedGameData.ts

### Key Parts
- `core/` - GameManager, EventBus
- `systems/` - achievements, attributes, blocks, items, lore, mining, wiki
- `data/` - Registries, GeneratedGameData.ts, GeneratedProcessingRecipes.ts
- `lang/` - LangManager, generated lang files

### Initialization
```typescript
GameManager.initialize():
  1. GameData.initialize()
  2. ProcessingRecipeRegistry.loadFromGenerated()
  3. registerCategories()
  4. registerAchievements()
  5. initializeSystems()
  6. setupEventListeners()
```

### System Pattern
```typescript
export class MySystem {
  static initialize(): void {
    // Load from generated data
    // Subscribe to events
  }
}
```

### Registry Pattern
```typescript
OreRegistry.register(ore);
const ore = OreRegistry.get('apeirix:tin_ore');
```

## Integration Flow
```
YAML Config
  ↓ Compile
Generated Files (JSON + TypeScript)
  ↓ Runtime
Systems load data → Registries populate → Event handlers setup
  ↓
In-Game Behavior
```

## Auto-Generated Files
**NEVER EDIT**:
- `build/BP/**/*.json`
- `build/RP/**/*.json`
- `scripts/data/GeneratedGameData.ts`
- `scripts/data/GeneratedProcessingRecipes.ts`
- `scripts/lang/*.ts`

**EDIT**:
- `configs/**/*.yaml`
- `scripts/**/*.ts` (except generated)
