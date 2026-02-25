---
description: "APEIRIX project rules and development guidelines"
---

ALLWAYS RESPOND AS VIETNAMESE!

# APEIRIX - Development Rules

## ⚠️ CRITICAL PRINCIPLE

**CODE IS THE SOURCE OF TRUTH - NOT RULES**

Rules are high-level guidelines only. Before implementing anything:
1. Read existing similar implementations
2. Follow established patterns exactly
3. Never invent new structures without checking codebase first

## Project Structure

- **addon-generator/** - CLI tool for YAML → JSON compilation
- **scripts/** - Game logic (TypeScript)
- **configs/** - YAML source files (edit these)
- **build/** - Generated output (never edit)

## Development Workflow

1. **Context Gathering Phase**
   - Find similar existing feature
   - Read all related files thoroughly
   - Understand the exact pattern used

2. **Implementation Phase**
   - Copy structure from existing code
   - Modify only what's necessary
   - Keep architecture consistent

3. **Testing Phase**
   - Compile YAML configs
   - Build TypeScript
   - Test in-game with /reload

## Key Principles

- **CLI-First**: Edit YAML in configs/, not JSON in build/
- **Pattern Consistency**: Follow existing code patterns exactly
- **No Assumptions**: Read code before making decisions
- **Incremental Testing**: Test after each small change

## Build Commands

- `.\build-and-deploy.ps1` - Full pipeline
- `.\compile-only.ps1` - YAML compilation only
- `regolith run` - TypeScript build only

## Documentation Files

Other steering files provide context but are NOT authoritative:
- apeirix-overview.md - Quick reference
- config-system.md - YAML format guide
- lang-system.md - Language system guide
- architecture.md - Architecture overview

**Always verify information by reading actual code.**
