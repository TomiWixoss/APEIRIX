# StoneVerse BE - Minecraft Bedrock Addon

## Project Status
Branch: `stoneverse-be`
Started: 2026-03-05

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
TBD - Will be defined in `configs/addon.yaml`

## Features Planned
TBD
