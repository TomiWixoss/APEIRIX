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

### Chỉ Build (KHÔNG deploy - dùng Minecraft thường, không phải Preview)
```bash
regolith run
```

Lệnh này sẽ:
1. Compile TypeScript với Regolith
2. Export trực tiếp sang `development_behavior_packs` và `development_resource_packs` của Minecraft Bedrock thường
3. Sẵn sàng test với `/reload` trong game

### Build và Deploy sang Preview (CHỈ KHI CẦN)
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
# ✅ ĐÚNG: Sửa generator và regenerate
1. Phát hiện lỗi trong JSON (ví dụ: thiếu category, thiếu unlock, sai format)
2. Cập nhật generator tương ứng trong addon-generator/src/generators/
3. Chạy lại CLI để regenerate: bun run dev compile configs/addon.yaml
4. Verify kết quả trong build/

# ❌ SAI: Sửa JSON trực tiếp
1. Phát hiện lỗi trong packs/BP/items/bronze_spear.json
2. Mở file và sửa trực tiếp
3. ❌ KHÔNG LÀM NHƯ VẬY!

# ✅ ĐÚNG: Thêm entity mới
1. Tạo entity file mới: configs/materials/copper/copper_ingot.yaml
2. Thêm recipes vào trong file đó
3. Thêm vào import list trong configs/addon.yaml
4. Compile: bun run dev compile configs/addon.yaml

# ✅ ĐÚNG: Sửa entity hiện có
1. Edit file entity: configs/materials/tin/tin_ingot.yaml
2. Sửa properties hoặc recipes trong file đó
3. Compile lại: bun run dev compile configs/addon.yaml
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
- Items, Blocks, Ores (với world gen), Tools, Armor, Foods
- Recipes (shaped/shapeless/smelting) - embedded trong entity files
- Batch generation từ YAML config
- **Single-entity config system** (1 file = 1 entity + recipes)
- **Test function generation** (custom commands trong YAML)
- **Auto texture copying** từ assets/ directory
- **Pack icon management**
- Type-safe với TypeScript

```bash
cd addon-generator
bun install
bun run dev compile configs/addon.yaml
```

### Config Structure (Sau Tái Cấu Trúc)

**Nguyên tắc: 1 file = 1 entity + recipes của nó**

```
addon-generator/
├── configs/
│   ├── addon.yaml              # Main config (chỉ cần compile file này)
│   ├── README.md
│   ├── materials/
│   │   ├── tin/
│   │   │   ├── raw_tin.yaml    # Entity + recipes
│   │   │   ├── tin_ingot.yaml  # Entity + recipes
│   │   │   ├── tin_nugget.yaml # Entity + recipes
│   │   │   ├── tin_block.yaml  # Entity + recipes
│   │   │   └── tin_ore.yaml    # Entity + recipes + world gen
│   │   └── bronze/
│   │       ├── bronze_ingot.yaml
│   │       ├── bronze_nugget.yaml
│   │       └── bronze_block.yaml
│   ├── tools/bronze/
│   │   ├── pickaxe.yaml        # Tool + recipe
│   │   ├── axe.yaml
│   │   ├── shovel.yaml
│   │   ├── hoe.yaml
│   │   ├── sword.yaml
│   │   └── spear.yaml
│   ├── armor/bronze/
│   │   ├── helmet.yaml         # Armor piece + recipes
│   │   ├── chestplate.yaml
│   │   ├── leggings.yaml
│   │   └── boots.yaml
│   ├── foods/canned-food/
│   │   ├── canempty.yaml       # Food + recipe + test
│   │   ├── candirty.yaml
│   │   ├── cannedmushroomsoup.yaml
│   │   └── ... (12 files total)
│   └── special/
│       └── achievement-book.yaml
└── assets/
    ├── icons/
    │   ├── pack_icon_bp.png
    │   └── pack_icon_rp.png
    ├── items/
    ├── blocks/
    ├── tools/
    ├── armor/
    │   ├── items/
    │   └── layers/
    └── foods/
```

### Entity File Format

**Mỗi entity file chứa:**
1. Entity definition (id, name, texture, properties)
2. Recipes của entity đó (nếu có)
3. Test commands (optional)

**Ví dụ - tin_ingot.yaml:**
```yaml
id: tin_ingot
name: Thỏi Thiếc
texture: ../../../../assets/items/tin_ingot.png
category: items
maxStackSize: 64
recipes:
  - type: smelting
    id: tin_ingot_from_ore_smelting
    input: apeirix:tin_ore
    output: apeirix:tin_ingot
    count: 1
  - type: shaped
    id: tin_ingot_from_nuggets
    pattern:
      - "###"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:tin_nugget
    result: apeirix:tin_ingot
    count: 1
    unlock:
      - apeirix:tin_nugget
```

**Ví dụ - pickaxe.yaml:**
```yaml
id: bronze_pickaxe
name: Cuốc Đồng Thanh
type: pickaxe
texture: ../../../../assets/tools/bronze_pickaxe.png
materialId: apeirix:bronze_ingot
durability: 250
damage: 4
efficiency: 6
enchantability: 14
tier: stone
recipe:
  type: shaped
  id: bronze_pickaxe
  pattern:
    - "###"
    - " S "
    - " S "
  ingredients:
    "#": apeirix:bronze_ingot
    S: minecraft:stick
  result: apeirix:bronze_pickaxe
  unlock:
    - apeirix:bronze_ingot
```

### Main Config (addon.yaml)

File duy nhất cần compile, import tất cả entity files:

```yaml
addon:
  name: APEIRIX
  description: Addon Minecraft Bedrock Edition thêm mọi thứ vào game
  version: [1, 0, 0]
  minEngineVersion: [1, 21, 50]
  icons:
    bp: ../assets/icons/pack_icon_bp.png
    rp: ../assets/icons/pack_icon_rp.png
import:
  - materials/tin/raw_tin.yaml
  - materials/tin/tin_ingot.yaml
  - materials/tin/tin_nugget.yaml
  - materials/tin/tin_block.yaml
  - materials/tin/tin_ore.yaml
  - materials/bronze/bronze_ingot.yaml
  - materials/bronze/bronze_nugget.yaml
  - materials/bronze/bronze_block.yaml
  - tools/bronze/pickaxe.yaml
  - tools/bronze/axe.yaml
  # ... (tất cả entity files)
```

### Compile Command

```bash
# Compile tất cả từ main config
bun run dev compile configs/addon.yaml

# Output: build/BP/ và build/RP/
# - 28 items
# - 4 blocks (2 blocks + 2 ores)
# - 49 recipes (extracted từ entity files)
# - 13 test functions
# - 34 textures (copied từ assets/)
# - 4 attachables (armor)
# - 2 pack icons
```

### Lợi Ích Của Cấu Trúc Mới

1. **1 file = 1 responsibility**: Mỗi entity có file riêng với recipes đi kèm
2. **Không còn recipes.yaml riêng**: Recipes luôn đi kèm entity, không bị thất lạc
3. **Dễ thêm/xóa/sửa**: Chỉ cần edit 1 file duy nhất
4. **Texture organization**: Tất cả textures trong assets/ với cấu trúc rõ ràng
5. **Auto texture path fixing**: CLI tự động fix relative paths
6. **Type-safe**: Full TypeScript support, 0 type errors
7. **Pack icons**: Tự động copy từ assets/icons/

### Test Functions

CLI tự động tạo `.mcfunction` files trong `build/BP/functions/tests/`:

```yaml
# Trong entity file
testCommands:
  - "# Test: Thỏi Thiếc"
  - "clear @s"
  - "give @s apeirix:tin_ingot 64"
  - 'tellraw @s {"text":"Test complete!","color":"gold"}'
```

**Trong game:**
```
/function tests/items/tin_ingot
```

#### Thêm Ore Mới
1. Tạo ore entity file: `configs/materials/[material]/[ore_name].yaml`
2. Định nghĩa ore properties, textures, world gen settings
3. Thêm smelting recipes vào trong file đó
4. Thêm vào import list trong `configs/addon.yaml`
5. Compile: `bun run dev compile configs/addon.yaml`
6. **Đăng ký trong `scripts/data/GameData.ts` → `registerOres()`**

#### Thêm Tool/Weapon Mới
1. Tạo tool entity file: `configs/tools/[material]/[tool_type].yaml`
2. Định nghĩa tool properties, texture, stats
3. Thêm crafting recipe vào trong file đó
4. Thêm vào import list trong `configs/addon.yaml`
5. Compile: `bun run dev compile configs/addon.yaml`
6. **Đăng ký trong `scripts/data/GameData.ts` → `registerTools()`**

#### Thêm Item/Material Mới
1. Tạo item entity file: `configs/materials/[material]/[item_name].yaml`
2. Định nghĩa item properties, texture
3. Thêm recipes (crafting, smelting) vào trong file đó
4. Thêm vào import list trong `configs/addon.yaml`
5. Compile: `bun run dev compile configs/addon.yaml`

#### Thêm Food Mới
1. Tạo food entity file: `configs/foods/[category]/[food_name].yaml`
2. Định nghĩa nutrition, saturation, texture
3. Thêm recipe vào trong file đó
4. Thêm testCommands (optional)
5. Thêm vào import list trong `configs/addon.yaml`
6. Compile: `bun run dev compile configs/addon.yaml`

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

