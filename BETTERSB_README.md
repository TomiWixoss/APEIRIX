# Better SB (Better Skyblock) - Minecraft Bedrock Addon

## Project Status
Branch: `better-sb`
Started: 2026-03-05

## Concept
Better Skyblock - Enhanced skyblock experience for Minecraft Bedrock Edition with quality of life improvements, new progression paths, and expanded gameplay mechanics.

## Architecture
This addon uses the same generator framework as APEIRIX:
- **Config-driven**: YAML configs in `addon-generator/configs/`
- **TypeScript runtime**: Game logic in `scripts/`
- **Auto-generation**: Compile YAML → JSON + TypeScript

## Templates Available
- `addon-generator/configs-apeirix-template/` - Full APEIRIX config reference
- `scripts-apeirix-template/` - Full APEIRIX TypeScript reference

## Getting Started
1. Create minimal config structure in `addon-generator/configs/`
2. Create basic TypeScript structure in `scripts/`
3. Compile: `bun run dev compile configs/addon.yaml --clean`
4. Build: `.\build-and-deploy.ps1`

## Namespace
`bettersb:` - Will be defined in `configs/addon.yaml`

## Core Features Planned
- Enhanced resource generation (cobblestone, dirt, etc.)
- Custom skyblock-specific items and blocks
- Progression system tailored for skyblock
- Quality of life improvements
- Automated resource generation
- Custom challenges and achievements
- Skyblock-optimized recipes
