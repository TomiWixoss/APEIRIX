# APEIRIX Testing Documentation

Thư mục này chứa manual test checklists (.md) và automated tests (.test.ts) cho từng tính năng của addon.

## Cấu trúc Test

```
tests/
├── README.md                    # File này
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

## Automated Tests (GameTest)

### Chạy Tests
```
# Trong game, chạy một test cụ thể:
/gametest run apeirix:tin_ore_mining

# Chạy tất cả tests với tag:
/gametest runset blocks

# Chạy tất cả tests:
/gametest runall
```

### Test Tags
- `blocks` - Tất cả block tests
- `items` - Tất cả item tests
- `tools` - Tất cả tool tests
- `materials` - Tất cả material tests
- `systems` - Tất cả system tests

### Cấu trúc Test File (.test.ts)
```typescript
import { register } from "@minecraft/server-gametest";

register("apeirix", "test_name", (test) => {
    // Test logic here
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("category");
```

## Nguyên tắc

### 1. Mỗi item/block = 1 file test
- Dễ tìm kiếm
- Dễ cập nhật
- Không ảnh hưởng test khác

### 2. Sử dụng templates
- Copy template tương ứng
- Điền thông tin cụ thể
- Giữ format nhất quán

### 3. Naming convention
- Lowercase với dashes: `bronze-pickaxe.md`
- Tên file = tên item/block
- Dễ đọc, dễ sort

### 4. Metadata bắt buộc
```markdown
**Item/Block**: [Tên]
**ID**: [namespace:id]
**Version**: [version]
**Ngày test**: [date]
**Tester**: [name]
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail
```

## Cách thêm test mới

### Thêm block mới
1. Copy `_templates/block-test-template.md`
2. Đổi tên thành `blocks/[block-name].md`
3. Điền thông tin block
4. Test và tick checkbox

### Thêm item mới
1. Copy `_templates/item-test-template.md`
2. Đổi tên thành `items/[category]/[item-name].md`
3. Điền thông tin item
4. Test và tick checkbox

### Thêm tool mới
1. Copy `_templates/tool-test-template.md`
2. Đổi tên thành `items/tools/[tool-name].md`
3. Điền thông tin tool
4. Test và tick checkbox

### Thêm system mới
1. Copy `_templates/system-test-template.md`
2. Đổi tên thành `systems/[system-name].md`
3. Điền thông tin system
4. Test và tick checkbox

## Test Status

### Blocks
- [ ] tin-ore.md
- [ ] deepslate-tin-ore.md
- [ ] tin-block.md

### Items - Materials
- [ ] raw-tin.md
- [ ] tin-ingot.md
- [ ] tin-nugget.md
- [ ] bronze-ingot.md
- [ ] bronze-nugget.md
- [ ] bronze-block.md

### Items - Tools
- [ ] bronze-pickaxe.md
- [ ] bronze-axe.md
- [ ] bronze-shovel.md
- [ ] bronze-hoe.md
- [ ] bronze-sword.md

### Systems
- [ ] fortune-system.md
- [ ] durability-system.md
- [ ] hoe-tillage-system.md
- [ ] achievement-system.md

### World Gen
- [ ] tin-ore-generation.md

## Quy tắc test

1. Test trong Creative và Survival mode
2. Ghi rõ version Minecraft đã test
3. Đánh dấu ✅ cho pass, ❌ cho fail
4. Ghi chú lỗi chi tiết nếu fail
5. Update status trong README.md này
