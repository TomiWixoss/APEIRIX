---
description: "Architecture overview - auto-included when editing TypeScript"
---

# Architecture Overview

**Note: Read actual code for implementation details.**

## CLI Tool (addon-generator)

### Compilation Pipeline
ConfigLoader → Loaders → Compilers → Generators → Output

### Key Directories
- `src/generators/` - Content generators
- `src/compiler/` - BP/RP compilers
- `src/core/loaders/` - YAML/config loaders
- `configs/` - Source YAML files
- `build/` - Generated output

## Game Systems (scripts)

### Core Architecture
- Registry Pattern for data management
- Event-driven with EventBus
- System-based organization
- Auto-generated data integration

### Key Directories
- `scripts/core/` - GameManager, EventBus
- `scripts/systems/` - Game systems
- `scripts/data/` - Registries + GeneratedGameData
- `scripts/lang/` - LangManager + generated lang files

## Auto-Generated Files

**Never Edit:**
- `build/BP/` and `build/RP/`
- `scripts/data/GeneratedGameData.ts`
- Generated lang files

**Edit These:**
- `configs/**/*.yaml`
- `scripts/**/*.ts` (except generated)

## Design Patterns

Read existing implementations to understand:
- How registries work
- How systems initialize
- How UI is structured
- How handlers are registered
