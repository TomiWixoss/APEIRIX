# APEIRIX - Project Rules

## 📚 Documentation Structure

- **apeirix-overview.md** - Quick reference, build commands, basic workflow
- **config-system.md** - YAML config format và entity definitions
- **lang-system.md** - Language system (auto-included khi edit YAML)
- **architecture.md** - CLI tool và game systems architecture (auto-included khi edit TypeScript)

## Tổng Quan

**APEIRIX** - Minecraft Bedrock Addon với CLI-first workflow

- Build System: Regolith + Custom CLI (addon-generator)
- Languages: TypeScript → JavaScript, YAML → JSON
- Namespace: `apeirix:`
- Version: 1.0.0
- Min Engine: 1.21.50

## ⚠️ CLI-FIRST WORKFLOW (QUAN TRỌNG)

### Nguyên Tắc

1. **KHÔNG BAO GIỜ** sửa JSON trong `addon-generator/build/`
2. **LUÔN LUÔN** edit YAML trong `addon-generator/configs/`
3. **NẾU THIẾU TÍNH NĂNG** → Sửa generator trong `addon-generator/src/generators/`
4. Build output là auto-generated, không commit

### Workflow Đúng

```bash
# ✅ Thêm/sửa entity
1. Edit: configs/materials/tin/tin_ingot.yaml
2. Compile: bun run dev compile configs/addon.yaml --clean
3. Build: .\build-and-deploy.ps1
4. Test: /reload trong game

# ✅ Sửa generator
1. Phát hiện: JSON thiếu tính năng
2. Sửa: addon-generator/src/generators/ItemGenerator.ts
3. Regenerate: bun run dev compile configs/addon.yaml --clean

# ❌ SAI
Sửa JSON trong build/ → Sẽ bị ghi đè!
```

## Build Commands

```bash
.\build-and-deploy.ps1    # Full pipeline (recommended)
.\compile-only.ps1         # Chỉ compile YAML
regolith run               # Chỉ build TypeScript
.\export-release.ps1       # Export .mcaddon
```

## Cấu Trúc Dự Án (Simplified)

```
APEIRIX/
├── addon-generator/        # CLI Tool
│   ├── src/               # TypeScript source
│   │   ├── compiler/      # BPCompiler, RPCompiler
│   │   ├── core/          # ConfigLoader, Validator
│   │   │   └── loaders/   # YamlLoader, LangLoader
│   │   └── generators/    # Content generators
│   ├── configs/           # YAML configs
│   │   ├── lang/          # Language files (vi_VN, en_US)
│   │   ├── materials/     # Materials (tin, bronze)
│   │   ├── tools/         # Tools (bronze)
│   │   ├── armor/         # Armor (bronze)
│   │   ├── foods/         # Foods (canned)
│   │   └── addon.yaml     # Main entry
│   ├── assets/            # Source textures
│   └── build/             # Generated output (không commit)
├── scripts/               # Game logic (TypeScript)
│   ├── core/              # GameManager, EventBus
│   ├── systems/           # Game systems
│   ├── data/              # Registries + GeneratedGameData.ts
│   └── lang/              # UI lang (vi_VN.ts)
├── build/                 # Regolith output (deployed)
└── exports/               # .mcaddon exports
```

## Thêm Content Mới

### Item/Material
1. Tạo: `configs/materials/[material]/[item].yaml`
2. Dùng: `name: lang:materials.item_id`
3. Thêm vào: `index.yaml`
4. Compile & Build

### Tool
1. Tạo: `configs/tools/[material]/[tool_type].yaml`
2. Types: pickaxe, axe, shovel, hoe, sword, spear
3. Thêm vào index
4. Auto-registered trong GeneratedGameData.ts

### Armor/Food
Tương tự như trên

## Hệ Thống Ngôn Ngữ

**📖 Chi tiết:** Xem `lang-system.md`

**Tóm tắt:**
- Dùng `lang:` prefix: `name: lang:materials.tin_ingot`
- Định nghĩa trong `configs/lang/{language}/`
- Chọn ngôn ngữ: `addon.yaml` → `language: vi_VN`
- Auto-generate pack lang files

## Testing

### In-Game Tests
```
/function tests/items/tin_ingot
/function tests/items_all
/function tests/tools_all
```

### Manual Testing
- Creative: Textures, names, tooltips
- Survival: Recipes, durability, effects
- World gen: Ore generation

## Content Hiện Có

- Materials: 9 entities (tin + bronze)
- Tools: 6 bronze tools (375 durability)
- Armor: 4 bronze pieces
- Foods: 12 canned foods
- Special: 1 item (achievement_book)
- **Total**: 31 entities, 39 recipes

## Quy Tắc Phát Triển

- Namespace `apeirix:` cho tất cả content
- Dùng `lang:` prefix cho tất cả names
- Edit YAML trong `configs/`, không edit JSON trong `build/`
- Edit TypeScript trong `scripts/`, không edit `build/APEIRIX_bp/scripts/`
- Test với `/reload` trong game
- Commit YAML configs, không commit generated files
