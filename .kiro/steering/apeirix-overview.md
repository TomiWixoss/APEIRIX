---
description: "APEIRIX quick reference"
---

# APEIRIX - Quick Reference

**Note: This is a high-level overview. Always read actual code for accurate information.**

## Build Commands

- `.\build-and-deploy.ps1` - Full pipeline
- `.\compile-only.ps1` - YAML compilation only
- `regolith run` - TypeScript build only
- `.\export-release.ps1` - Export .mcaddon

## Workflow

1. Edit YAML in `configs/`
2. Compile: `bun run dev compile configs/addon.yaml --clean`
3. Build: `.\build-and-deploy.ps1`
4. Test: `/reload` in-game

## Key Principles

- Edit YAML configs, not generated JSON
- Use `lang:` prefix for all names
- Follow existing patterns when adding features
- Test incrementally

## Project Info

- Namespace: `apeirix:`
- Version: 1.0.0
- Min Engine: 1.21.50
- Languages: vi_VN, en_US
