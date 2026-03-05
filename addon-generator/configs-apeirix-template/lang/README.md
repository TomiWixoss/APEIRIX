# Language System

Hệ thống ngôn ngữ cho APEIRIX Addon, cho phép dễ dàng đa ngôn ngữ hóa content.

## Cấu Trúc

```
lang/
├── vi_VN/              # Tiếng Việt
│   ├── materials.yaml
│   ├── tools.yaml
│   ├── armor.yaml
│   ├── foods.yaml
│   └── special.yaml
└── en_US/              # English
    ├── materials.yaml
    ├── tools.yaml
    ├── armor.yaml
    ├── foods.yaml
    └── special.yaml
```

## Cách Sử Dụng

### 1. Chọn Ngôn Ngữ Mặc Định

Trong `addon.yaml`:

```yaml
addon:
  name: APEIRIX
  language: vi_VN  # hoặc en_US
```

### 2. Định Nghĩa Lang Keys

Trong entity YAML files, dùng `lang:` prefix:

```yaml
# materials/tin/tin_ingot.yaml
id: tin_ingot
name: lang:materials.tin_ingot  # Thay vì "Thỏi Thiếc"
texture: ../../../../assets/items/tin_ingot.png
```

### 3. Thêm Translations

Trong `lang/vi_VN/materials.yaml`:

```yaml
materials:
  tin_ingot: Thỏi Thiếc
  tin_nugget: Mảnh Thiếc
  tin_block: Khối Thiếc
```

Trong `lang/en_US/materials.yaml`:

```yaml
materials:
  tin_ingot: Tin Ingot
  tin_nugget: Tin Nugget
  tin_block: Block of Tin
```

## Lang Key Format

Lang keys theo format: `category.entity_id`

### Categories:

- `materials.*` - Materials (ores, ingots, nuggets, blocks)
- `tools.*` - Tools (pickaxe, axe, shovel, hoe, sword, spear)
- `armor.*` - Armor pieces (helmet, chestplate, leggings, boots)
- `foods.*` - Food items
- `special.*` - Special items (achievement_book, etc.)

### Examples:

```yaml
# Materials
materials.tin_ingot: Thỏi Thiếc
materials.bronze_block: Khối Đồng Thanh

# Tools
tools.bronze_pickaxe: Cuốc Đồng Thanh
tools.bronze_sword: Kiếm Đồng Thanh

# Armor
armor.bronze_helmet: Mũ Đồng Thanh
armor.bronze_chestplate: Áo Giáp Đồng Thanh

# Foods
foods.canned_food: Đồ Hộp Thịt
foods.canempty: Vỏ Đồ Hộp Rỗng

# Special
special.achievement_book: Sách Thành Tựu
```

## Thêm Ngôn Ngữ Mới

1. Tạo thư mục mới: `lang/ja_JP/` (ví dụ tiếng Nhật)
2. Copy structure từ `vi_VN/` hoặc `en_US/`
3. Translate tất cả values
4. Update `addon.yaml`: `language: ja_JP`
5. Compile: `bun run dev compile configs/addon.yaml --clean`

## Fallback Behavior

Nếu lang key không tìm thấy:
- Trả về key gốc (e.g., "materials.tin_ingot")
- Hoặc fallback text nếu có

Nếu language folder không tồn tại:
- Warning trong console
- Trả về key gốc

## Lợi Ích

✅ Dễ dàng thêm ngôn ngữ mới
✅ Centralized translations
✅ Không cần edit entity files khi đổi ngôn ngữ
✅ Consistency across all content
✅ Easy maintenance và updates
