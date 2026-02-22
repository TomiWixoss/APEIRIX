---
inclusion: always
---

# APEIRIX Project Rules

## Project Overview

**APEIRIX** - Minecraft Bedrock Edition addon that adds everything to the game.

## Key Information

- **Type**: Minecraft Bedrock Addon
- **Build System**: Regolith
- **Language**: TypeScript → JavaScript
- **Supported Languages**: English (en_US), Vietnamese (vi_VN)
- **Namespace**: `apeirix:`

## Build Command

```bash
regolith run
```

This compiles TypeScript and deploys to Minecraft's development packs folder.

## Project Structure

```
├── packs/
│   ├── BP/                    # Behavior Pack
│   │   ├── scripts/main.js    # Auto-generated from scripts/main.ts
│   │   └── texts/             # en_US.lang, vi_VN.lang
│   └── RP/                    # Resource Pack
│       └── texts/             # en_US.lang, vi_VN.lang
├── scripts/main.ts            # TypeScript source (edit here)
└── config.json                # Regolith config
```

## Development Rules

- Use `apeirix:` namespace for all custom content
- Add translations to both `en_US.lang` and `vi_VN.lang` files
- Edit TypeScript in `scripts/main.ts`, never edit `packs/BP/scripts/main.js`
- Run `regolith run` after changes, then `/reload` in-game
