---
inclusion: auto
fileMatchPattern: "**/src/**/*.ts"
---

# Architecture

## CLI Tool (addon-generator)

### Compilation Flow
```
ConfigLoader → YamlLoader → ConfigMerger → EntityNormalizer
    ↓
BPCompiler (items, blocks, recipes, lang, tests)
    ↓
RPCompiler (textures, attachables, lang)
    ↓
AssetCopier (textures, icons)
    ↓
ManifestGenerator (BP + RP manifests)
```

### Key Components

**Generators:** `src/generators/`
- ItemGenerator, BlockGenerator, OreGenerator
- RecipeGenerator, ArmorGenerator, FoodGenerator
- LangGenerator, TextureGenerator
- Tool Generators (Pickaxe, Axe, Shovel, Hoe, Sword, Spear)

**Compilers:** `src/compiler/`
- Compiler (orchestrator)
- BPCompiler, RPCompiler
- ManifestGenerator, AssetCopier

**Loaders:** `src/core/loaders/`
- YamlLoader, JsonLoader
- ConfigMerger, EntityNormalizer
- LangLoader (NEW)

## Game Systems (scripts)

### Design Patterns
- Registry Pattern: OreRegistry, ToolRegistry, FoodRegistry
- Observer Pattern: EventBus
- Strategy Pattern: BaseAchievement
- Singleton Pattern: FortuneSystem, CustomToolSystem

### Core Systems
- GameManager: Initialization orchestrator
- EventBus: Event-driven architecture
- GameData: Central registration (imports GeneratedGameData.ts)

### Game Systems
- FortuneSystem: Fortune enchantment cho custom ores
- CustomToolSystem: Tool durability + Unbreaking
- FoodEffectsSystem: Apply effects khi ăn
- CanWashingSystem: Rửa lon
- AchievementSystem: Tracking + UI + rewards

## Auto-Generated Files

**KHÔNG EDIT:**
- `build/BP/` và `build/RP/` - Generated JSON
- `scripts/data/GeneratedGameData.ts` - Auto-generated từ CLI
- `build/BP/texts/en_US.lang` - Generated lang files

**CÓ THỂ EDIT:**
- `configs/**/*.yaml` - Entity definitions
- `scripts/**/*.ts` - Game logic
- `configs/lang/**/*.yaml` - Translations
