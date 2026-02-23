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

```bash
regolith run
```

Lệnh này compile TypeScript và deploy vào thư mục development packs của Minecraft.

## Development Tools

### Bedrock Development CLI
Tool CLI/API để generate và modify files trong addon development.

**Cài đặt**: Đã cài như dev dependency (v3.2.0)
**Config**: `bedrock.config.json` với namespace `apeirix`

**Commands hữu ích**:
```bash
# Tạo files mới
npx bed new item <name> --bpath packs/BP --rpath packs/RP
npx bed new block <name> --bpath packs/BP --rpath packs/RP
npx bed new entity <name> --bpath packs/BP --rpath packs/RP
npx bed new function <name> --bpath packs/BP

# Modify entities
npx bed entity component --bpath packs/BP
npx bed entity property <name> --bpath packs/BP
npx bed entity anim <name> --bpath packs/BP

# Project management
npx bed project install --bpath packs/BP --rpath packs/RP
npx bed format addon apeirix --bpath packs/BP --rpath packs/RP

# Xem help
npx bed --help
npx bed new --help
npx bed entity --help
```

**Lưu ý**: 
- Tool tự động thêm namespace `apeirix:` từ config
- Luôn chỉ định `--bpath packs/BP --rpath packs/RP`
- Sau khi tạo file, cần chạy `regolith run` để build

**API Documentation**: [bedrock-development docs](https://www.npmjs.com/package/bedrock-development)

## Cấu Trúc Dự Án

```
├── packs/
│   ├── BP/                    # Behavior Pack
│   │   ├── blocks/            # Block definitions
│   │   ├── items/             # Item definitions
│   │   ├── recipes/           # Crafting recipes
│   │   ├── loot_tables/       # Loot tables
│   │   ├── features/          # World generation features
│   │   ├── feature_rules/     # Feature placement rules
│   │   ├── functions/         # Commands
│   │   ├── scripts/main.js    # Auto-generated từ scripts/main.ts
│   │   └── texts/             # en_US.lang (nội dung tiếng Việt)
│   └── RP/                    # Resource Pack
│       ├── textures/          # Texture files
│       │   ├── blocks/        # Block textures
│       │   ├── items/         # Item textures
│       │   ├── terrain_texture.json
│       │   └── item_texture.json
│       └── texts/             # en_US.lang (nội dung tiếng Việt)
├── scripts/
│   ├── main.ts                # Entry point
│   ├── core/                  # Core systems
│   │   ├── GameManager.ts     # Main initialization
│   │   ├── EventBus.ts        # Event system (Observer pattern)
│   │   └── Registry.ts        # Registry pattern
│   ├── systems/               # Game systems
│   │   ├── achievements/
│   │   │   ├── AchievementSystem.ts    # Main logic
│   │   │   ├── AchievementRegistry.ts  # Achievement registry
│   │   │   ├── AchievementStorage.ts   # Dynamic properties
│   │   │   └── ui/
│   │   │       ├── MainMenuUI.ts
│   │   │       ├── CategoryMenuUI.ts
│   │   │       └── DetailUI.ts
│   │   ├── items/
│   │   │   ├── ItemSystem.ts
│   │   │   ├── CustomToolSystem.ts     # Custom tool durability & hoe tillage
│   │   │   └── handlers/
│   │   │       └── AchievementBookHandler.ts
│   │   └── blocks/
│   │       └── FortuneSystem.ts        # Fortune enchantment for ores
│   ├── data/                  # Data definitions & registries
│   │   ├── GameData.ts        # Central data registration
│   │   ├── achievements/
│   │   │   ├── BaseAchievement.ts      # Abstract base class
│   │   │   ├── AchievementCategory.ts
│   │   │   └── categories/
│   │   │       └── starter/
│   │   │           ├── WelcomeAchievement.ts
│   │   │           ├── FirstStepsAchievement.ts
│   │   │           └── BreakerAchievement.ts
│   │   ├── blocks/
│   │   │   ├── OreRegistry.ts          # Ore definitions
│   │   │   └── TillableRegistry.ts     # Tillable block definitions
│   │   ├── tools/
│   │   │   └── ToolRegistry.ts         # Tool definitions
│   │   └── rewards/
│   │       └── RewardDefinition.ts
│   └── lang/                  # Language system
│       ├── LangManager.ts
│       └── vi_VN.ts
└── config.json                # Regolith config
```

## Quy Tắc Phát Triển

- Dùng namespace `apeirix:` cho tất cả custom content
- File ngôn ngữ dùng `en_US.lang` nhưng nội dung là tiếng Việt
- Edit TypeScript trong `scripts/`, không edit `packs/BP/scripts/main.js`
- Chạy `regolith run` sau khi thay đổi, sau đó `/reload` trong game

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

## Thêm Content Mới

### Thêm Ore Mới
1. Tạo block JSON trong `packs/BP/blocks/`
2. Tạo loot table trong `packs/BP/loot_tables/blocks/`
3. Tạo feature & feature_rule trong `packs/BP/features/` và `packs/BP/feature_rules/`
4. Thêm texture vào `packs/RP/textures/blocks/`
5. Đăng ký trong `terrain_texture.json`
6. Thêm tên vào `en_US.lang` (cả BP và RP)
7. **Đăng ký trong `scripts/data/GameData.ts` → `registerOres()`**

### Thêm Tool/Weapon Mới
1. Tạo item JSON trong `packs/BP/items/`
2. Tạo recipes trong `packs/BP/recipes/`
3. Thêm texture vào `packs/RP/textures/items/`
4. Đăng ký trong `item_texture.json`
5. Thêm tên vào `en_US.lang` (cả BP và RP)
6. **Đăng ký trong `scripts/data/GameData.ts` → `registerTools()`**

### Thêm Tillable Block Mới
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
├── _templates/                  # Templates cho test files
│   ├── block-test-template.md
│   ├── item-test-template.md
│   ├── tool-test-template.md
│   └── system-test-template.md
├── blocks/                      # Test cho từng block riêng
│   ├── tin-ore.md
│   ├── deepslate-tin-ore.md
│   ├── tin-block.md
│   └── bronze-block.md
├── items/                       # Test cho từng item riêng
│   ├── materials/
│   │   ├── raw-tin.md
│   │   ├── tin-ingot.md
│   │   ├── tin-nugget.md
│   │   ├── bronze-ingot.md
│   │   └── bronze-nugget.md
│   └── tools/
│       ├── bronze-pickaxe.md
│       ├── bronze-axe.md
│       ├── bronze-shovel.md
│       ├── bronze-hoe.md
│       └── bronze-sword.md
├── systems/                     # Test cho từng system riêng
│   ├── fortune-enchantment.md
│   ├── custom-tool-durability.md
│   └── achievement-system.md
└── world-gen/                   # Test cho world generation
    └── tin-ore-generation.md
```

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
3. Điền thông tin block
4. Test và tick checkbox
5. Update status trong `tests/README.md`

#### Thêm Item Test
1. Copy `tests/_templates/item-test-template.md`
2. Đổi tên thành `tests/items/[category]/[item-name].md`
3. Điền thông tin item
4. Test và tick checkbox
5. Update status trong `tests/README.md`

#### Thêm Tool Test
1. Copy `tests/_templates/tool-test-template.md`
2. Đổi tên thành `tests/items/tools/[tool-name].md`
3. Điền thông tin tool (stats, mining, durability, etc.)
4. Test và tick checkbox
5. Update status trong `tests/README.md`

#### Thêm System Test
1. Copy `tests/_templates/system-test-template.md`
2. Đổi tên thành `tests/systems/[system-name].md`
3. Điền thông tin system (purpose, dependencies, features)
4. Test và tick checkbox
5. Update status trong `tests/README.md`

### Quy tắc Test

- Test trong Creative và Survival mode
- Ghi rõ version Minecraft đã test
- Đánh dấu ✅ cho pass, ❌ cho fail
- Ghi chú lỗi chi tiết nếu fail
- Update status trong `tests/README.md` sau khi test

