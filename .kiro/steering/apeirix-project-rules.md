---
inclusion: always
---

# Quy Tắc Dự Án APEIRIX

## Tổng Quan Dự Án

**APEIRIX** - Addon Minecraft Bedrock Edition thêm mọi thứ vào game.

## Thông Tin Chính

- **Loại**: Minecraft Bedrock Addon
- **Build System**: Regolith
- **Ngôn ngữ**: TypeScript → JavaScript
- **Ngôn ngữ hiển thị**: Tiếng Việt (trong file en_US.lang)
- **Namespace**: `apeirix:`

## Lệnh Build

### Build và Deploy sang Preview
```bash
.\build-and-deploy.ps1
```

Lệnh này sẽ:
1. Compile TypeScript với Regolith
2. Copy packs sang Minecraft Preview
3. Sẵn sàng test với `/reload` trong game

### Chỉ Build (không deploy)
```bash
regolith run
```

### Chỉ Deploy (sau khi đã build)
```bash
.\deploy-preview.ps1
```

## Cấu Trúc Dự Án

```
APEIRIX/
├── addon-generator/           # CLI Tool (xem addon-generator/README.md)
│   ├── src/
│   │   ├── index.ts
│   │   ├── cli/              # Command registrations
│   │   ├── commands/         # Command handlers
│   │   ├── core/             # Core utilities
│   │   └── generators/       # Content generators
│   ├── templates/            # Mẫu tham khảo, ví dụ generic
│   ├── configs/              # Config files sẵn sàng chạy
│   ├── tests/                # CLI tool tests
│   └── package.json
├── packs/
│   ├── BP/                   # Behavior Pack
│   │   ├── blocks/
│   │   ├── items/
│   │   ├── recipes/
│   │   ├── loot_tables/
│   │   ├── features/
│   │   ├── feature_rules/
│   │   ├── functions/
│   │   ├── scripts/main.js   # Auto-generated
│   │   └── texts/en_US.lang
│   └── RP/                   # Resource Pack
│       ├── textures/
│       │   ├── blocks/
│       │   ├── items/
│       │   ├── models/armor/
│       │   ├── terrain_texture.json
│       │   └── item_texture.json
│       ├── attachables/
│       └── texts/en_US.lang
├── scripts/                  # TypeScript source
│   ├── main.ts
│   ├── core/
│   ├── systems/
│   ├── data/
│   └── lang/
├── tests/                    # Game tests
│   ├── blocks/
│   ├── items/
│   ├── systems/
│   └── index.test.ts
└── config.json              # Regolith config
```

## Quy Tắc Phát Triển

- Dùng namespace `apeirix:` cho tất cả custom content
- File ngôn ngữ dùng `en_US.lang` nhưng nội dung là tiếng Việt
- Edit TypeScript trong `scripts/`, không edit `packs/BP/scripts/main.js`
- Chạy `regolith run` sau khi thay đổi, sau đó `/reload` trong game

## ⚠️ QUY TẮC CLI-FIRST WORKFLOW (CỰC KỲ QUAN TRỌNG)

**LUÔN LUÔN SỬ DỤNG CLI ĐỂ TẠO/SỬA JSON FILES**

### Nguyên tắc bắt buộc:

1. **KHÔNG BAO GIỜ** trực tiếp thêm/xóa/sửa file JSON trong `packs/BP/` hoặc `packs/RP/`
2. **LUÔN LUÔN** sử dụng CLI tool (`addon-generator`) để tạo content
3. **NẾU CÓ LỖI/SAI/THIẾU/CẦN THÊM** → Cập nhật CLI Generator, KHÔNG sửa JSON trực tiếp

### Workflow đúng:

```bash
# ✅ ĐÚNG: Sửa generator
1. Phát hiện lỗi trong JSON (ví dụ: thiếu category, thiếu unlock, sai format)
2. Cập nhật generator tương ứng trong addon-generator/src/generators/
3. Chạy lại CLI để regenerate: bun run dev batch configs/[config-name].yaml
4. Verify kết quả

# ❌ SAI: Sửa JSON trực tiếp
1. Phát hiện lỗi trong packs/BP/items/bronze_spear.json
2. Mở file và sửa trực tiếp
3. ❌ KHÔNG LÀM NHƯ VẬY!
```

### Lý do:

- **Consistency**: Tất cả content được tạo theo cùng 1 chuẩn
- **Maintainability**: Sửa 1 lần trong generator, áp dụng cho tất cả items
- **Reproducibility**: Có thể regenerate bất cứ lúc nào từ config
- **History**: CLI có history và undo/rollback
- **Automation**: Tự động update GameData.ts, textures, lang files

### Khi nào được sửa JSON trực tiếp:

- **KHÔNG BAO GIỜ** (trừ khi đang debug CLI tool)
- Nếu cần thay đổi, luôn update generator trước

### Generators cần update thường xuyên:

- `addon-generator/src/generators/tools/` - Tool generators
- `addon-generator/src/generators/ItemGenerator.ts` - Item generator
- `addon-generator/src/generators/BlockGenerator.ts` - Block generator
- `addon-generator/src/generators/RecipeGenerator.ts` - Recipe generator
- `addon-generator/src/generators/ArmorGenerator.ts` - Armor generator
- `addon-generator/src/generators/FoodGenerator.ts` - Food generator

## Kiến Trúc & Design Patterns

- **OOP**: Inheritance, Encapsulation, Polymorphism, Composition
- **Registry Pattern**: Quản lý achievements, categories
- **Observer Pattern**: EventBus cho decoupling
- **Strategy Pattern**: Mỗi achievement có tracking logic riêng
- **Single Responsibility**: Mỗi file 1 trách nhiệm
- **Open/Closed**: Thêm achievement mới không chỉnh code cũ

## Hệ Thống Ngôn Ngữ

- Pack lang: `packs/BP/texts/en_US.lang` (tên item/entity/block)
- Script UI lang: `scripts/lang/vi_VN.ts` (UI text, chat)
- Dùng `LangManager.get()` thay vì hardcode text trong TypeScript

## Quy Tắc Màu Sắc UI

- UI body (ngoài nút): Dùng màu sáng để dễ đọc
- Trong nút: Dùng màu tối để tương phản với nền trắng của nút

## CLI Tool (addon-generator)

**Xem chi tiết:** [addon-generator/README.md](addon-generator/README.md)

CLI tool tự động tạo content cho addon với đầy đủ tính năng:
- Items, Blocks, Ores (với world gen), Tools, Armor
- Recipes (shaped/shapeless/smelting)
- Batch generation từ YAML/JSON config
- **Multi-file config system** (tách items/recipes/tests)
- **Test function generation** (custom commands trong YAML)
- Dry-run mode và Undo/Rollback
- Tự động tạo test files
- Tự động quét custom pickaxes

```bash
cd addon-generator
bun install
bun run dev --help
```

### Multi-File Config System

Tách config thành nhiều files để dễ quản lý:

```
configs/
├── my-system/
│   ├── main.yaml      # File chính với imports
│   ├── items.yaml     # Tất cả items
│   ├── recipes.yaml   # Tất cả recipes
│   └── tests.yaml     # Test functions
```

**main.yaml:**
```yaml
importItems: items.yaml
importRecipes: recipes.yaml
importTests: tests.yaml
```

**items.yaml:**
```yaml
items:
  - id: my_item
    name: "My Item"
    texture: ./path/to/texture.png
    nutrition: 4
    saturation: 4.8
```

**recipes.yaml:**
```yaml
recipes:
  - type: shapeless
    id: my_item
    ingredients: [item1, item2]
    result: my_item
    unlock: [item1]
```

**tests.yaml:**
```yaml
items:
  - id: my_item
    testCommands:
      - "clear @s"
      - "give @s apeirix:my_item 64"
      - 'tellraw @s {"text":"Test!","color":"gold"}'
```

**Chạy:**
```bash
bun run dev batch -f configs/my-system/main.yaml
```

**Lợi ích:**
- Tách biệt concerns (items/recipes/tests)
- Dễ maintain và update
- Có thể reuse recipes/tests
- Giảm conflict khi nhiều người làm việc

### Test Functions

CLI tự động tạo `.mcfunction` files trong `packs/BP/functions/tests/`:

```yaml
# tests.yaml
items:
  - id: my_food
    testCommands:
      - "# Test: My Food"
      - "clear @s"
      - "give @s apeirix:my_food 64"
      - "effect @s saturation 1 255 true"
      - 'tellraw @s {"text":"Test info","color":"gold"}'
      - "playsound random.levelup @s"
```

**Trong game:**
```
/function tests/food/my_food
```

#### Thêm Ore Mới
1. Tạo block JSON trong `packs/BP/blocks/`
2. Tạo loot table trong `packs/BP/loot_tables/blocks/`
3. Tạo feature & feature_rule trong `packs/BP/features/` và `packs/BP/feature_rules/`
4. Thêm texture vào `packs/RP/textures/blocks/`
5. Đăng ký trong `terrain_texture.json`
6. Thêm tên vào `en_US.lang` (cả BP và RP)
7. **Đăng ký trong `scripts/data/GameData.ts` → `registerOres()`**

#### Thêm Tool/Weapon Mới
1. Tạo item JSON trong `packs/BP/items/`
2. Tạo recipes trong `packs/BP/recipes/`
3. Thêm texture vào `packs/RP/textures/items/`
4. Đăng ký trong `item_texture.json`
5. Thêm tên vào `en_US.lang` (cả BP và RP)
6. **Đăng ký trong `scripts/data/GameData.ts` → `registerTools()`**

#### Thêm Tillable Block Mới
1. **Đăng ký trong `scripts/data/GameData.ts` → `registerTillables()`**
2. Chỉ định `blockId`, `resultBlock`, và `sound`

### Registry Pattern
- **OreRegistry**: Quản lý ores với Fortune support
- **ToolRegistry**: Quản lý custom tools với durability
- **TillableRegistry**: Quản lý blocks có thể cuốc
- **GameData**: Central registration point cho tất cả content

## Testing Structure

### Cấu trúc Test
```
tests/
├── README.md                    # Hướng dẫn testing
├── index.test.ts                # Import tất cả automated tests
├── _templates/                  # Templates cho test files
│   ├── block-test-template.md
│   ├── item-test-template.md
│   ├── tool-test-template.md
│   └── system-test-template.md
├── blocks/                      # Test cho từng block riêng
│   ├── tin-ore.md               # Manual test checklist
│   ├── tin-ore.test.ts          # Automated GameTest
│   ├── deepslate-tin-ore.md
│   ├── deepslate-tin-ore.test.ts
│   ├── tin-block.md
│   ├── tin-block.test.ts
│   ├── bronze-block.md
│   └── bronze-block.test.ts
├── items/                       # Test cho từng item riêng
│   ├── materials/
│   │   ├── raw-tin.md
│   │   ├── raw-tin.test.ts
│   │   ├── tin-ingot.md
│   │   ├── tin-ingot.test.ts
│   │   ├── tin-nugget.md
│   │   ├── tin-nugget.test.ts
│   │   ├── bronze-ingot.md
│   │   ├── bronze-ingot.test.ts
│   │   ├── bronze-nugget.md
│   │   └── bronze-nugget.test.ts
│   └── tools/
│       ├── bronze-pickaxe.md
│       ├── bronze-pickaxe.test.ts
│       ├── bronze-axe.md
│       ├── bronze-axe.test.ts
│       ├── bronze-shovel.md
│       ├── bronze-shovel.test.ts
│       ├── bronze-hoe.md
│       ├── bronze-hoe.test.ts
│       ├── bronze-sword.md
│       └── bronze-sword.test.ts
├── systems/                     # Test cho từng system riêng
│   ├── fortune-enchantment.md
│   ├── fortune-enchantment.test.ts
│   ├── custom-tool-durability.md
│   ├── custom-tool-durability.test.ts
│   └── achievement-system.md
└── world-gen/                   # Test cho world generation
    └── tin-ore-generation.md
```

### Automated Tests (GameTest Framework)

#### Chạy Tests
```
# Trong game:
/gametest run apeirix:tin_ore_mining
/gametest runset blocks
/gametest runall
```

#### Test Structure
- Mỗi `.md` file có `.test.ts` tương ứng
- Dùng `@minecraft/server-gametest` với `SimulatedPlayer`
- Import tất cả trong `tests/index.test.ts`
- Enable/disable trong `scripts/main.ts`

### Nguyên tắc Testing

1. **Mỗi item/block/system = 1 file test**
   - Dễ tìm kiếm và cập nhật
   - Không ảnh hưởng test khác
   - Scalable khi thêm content mới

2. **Sử dụng templates**
   - Copy template tương ứng từ `_templates/`
   - Đổi tên file theo format: `[name].md` (lowercase với dashes)
   - Điền thông tin cụ thể
   - Giữ format nhất quán

3. **Naming convention**
   - Lowercase với dashes: `bronze-pickaxe.md`
   - Tên file = tên item/block
   - Dễ đọc, dễ sort

4. **Metadata bắt buộc**
   ```markdown
   **Item/Block**: [Tên hiển thị]
   **ID**: `apeirix:[id]`
   **Version**: [version]
   **Ngày test**: [date]
   **Tester**: [name]
   **Status**: [ ] Not Tested | [ ] Pass | [ ] Fail
   ```

### Thêm Test Mới

#### Thêm Block Test
1. Copy `tests/_templates/block-test-template.md`
2. Đổi tên thành `tests/blocks/[block-name].md`
3. Tạo `tests/blocks/[block-name].test.ts` với GameTest code
4. Import trong `tests/index.test.ts`
5. Test và tick checkbox
6. Update status trong `tests/README.md`

#### Thêm Item Test
1. Copy `tests/_templates/item-test-template.md`
2. Đổi tên thành `tests/items/[category]/[item-name].md`
3. Tạo `tests/items/[category]/[item-name].test.ts`
4. Import trong `tests/index.test.ts`
5. Test và tick checkbox
6. Update status trong `tests/README.md`

#### Thêm Tool Test
1. Copy `tests/_templates/tool-test-template.md`
2. Đổi tên thành `tests/items/tools/[tool-name].md`
3. Tạo `tests/items/tools/[tool-name].test.ts`
4. Import trong `tests/index.test.ts`
5. Test và tick checkbox
6. Update status trong `tests/README.md`

#### Thêm System Test
1. Copy `tests/_templates/system-test-template.md`
2. Đổi tên thành `tests/systems/[system-name].md`
3. Tạo `tests/systems/[system-name].test.ts`
4. Import trong `tests/index.test.ts`
5. Test và tick checkbox
6. Update status trong `tests/README.md`

### Quy tắc Test

- Test trong Creative và Survival mode
- Ghi rõ version Minecraft đã test
- Đánh dấu ✅ cho pass, ❌ cho fail
- Ghi chú lỗi chi tiết nếu fail
- Update status trong `tests/README.md` sau khi test

