# APEIRIX Addon Compiler

Compiler để chuyển đổi YAML configs thành Minecraft Bedrock addon.

## Cài Đặt

```bash
cd addon-generator
bun install
```

## Sử Dụng

### Compile YAML config

```bash
# Compile config mặc định
bun run dev compile

# Compile config cụ thể
bun run dev compile -c configs/materials/tin-material.yaml

# Compile với output tùy chỉnh
bun run dev compile -c configs/addon.yaml -o build

# Clean output trước khi compile
bun run dev compile --clean

# Verbose output
bun run dev compile -v
```

## Cấu Trúc Dự Án

```
addon-generator/
├── src/
│   ├── compiler/          # Core compiler
│   │   ├── Compiler.ts           # Main orchestrator
│   │   ├── BPCompiler.ts         # Behavior Pack compiler
│   │   ├── RPCompiler.ts         # Resource Pack compiler
│   │   ├── ManifestGenerator.ts  # Manifest generator
│   │   └── AssetCopier.ts        # Asset copier
│   ├── core/              # Core utilities
│   │   ├── ConfigLoader.ts       # YAML config loader
│   │   ├── FileManager.ts        # File operations
│   │   └── Validator.ts          # Validation
│   ├── generators/        # JSON generators
│   │   ├── ItemGenerator.ts
│   │   ├── BlockGenerator.ts
│   │   ├── RecipeGenerator.ts
│   │   ├── ArmorGenerator.ts
│   │   ├── FoodGenerator.ts
│   │   └── tools/
│   ├── templates/         # Manifest templates
│   └── utils/             # Utilities
├── configs/               # YAML configs
│   ├── materials/
│   ├── tools/
│   ├── armor/
│   ├── canned-food/
│   └── special/
├── templates/             # YAML templates
└── assets/                # Pack icons

```

## YAML Config Format

Xem các templates trong `templates/` và examples trong `configs/`.

### Ví dụ: Material Set

```yaml
addon:
  name: "My Addon"
  description: "My custom addon"
  version: [1, 0, 0]
  minEngineVersion: [1, 21, 0]

items:
  - id: my_ingot
    name: "My Ingot"
    texture: ./textures/my_ingot.png
    category: items

blocks:
  - id: my_block
    name: "My Block"
    texture: ./textures/my_block.png
    category: construction

recipes:
  - type: shaped
    id: my_block_from_ingots
    pattern: ["###", "###", "###"]
    ingredients: { "#": "apeirix:my_ingot" }
    result: apeirix:my_block
```

## Workflow

1. Tạo YAML config trong `configs/`
2. Compile: `bun run dev compile -c configs/your-config.yaml`
3. Output sẽ ở `build/BP` và `build/RP`
4. Copy sang `packs/` của dự án chính
5. Run `regolith run` để build addon

## Documentation

- [COMPILER-DESIGN.md](COMPILER-DESIGN.md) - Thiết kế compiler
- [COMPILER-USAGE.md](COMPILER-USAGE.md) - Hướng dẫn sử dụng
- [COMPILER-TODO.md](COMPILER-TODO.md) - TODO list
- [MIGRATION-CHECKLIST.md](MIGRATION-CHECKLIST.md) - Checklist chuyển đổi dự án
- [CODE-REUSE-MAP.md](CODE-REUSE-MAP.md) - Code reuse mapping

## Templates

Xem `templates/` để biết các template YAML có sẵn:
- `complete-material-set-template.yaml` - Material set đầy đủ
- `tools-template.yaml` - Tool set
- `armor-template.yaml` - Armor set
- `food-template.yaml` - Food items
- `multi-file-config-template.yaml` - Multi-file config

## License

MIT
