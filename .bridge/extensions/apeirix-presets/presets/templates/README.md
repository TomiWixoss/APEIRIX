# APEIRIX Bridge v2 Templates

## Hướng dẫn

Copy các template files từ Bridge v2 vào thư mục này để sử dụng trong presets.

## Cấu trúc

```
templates/
├── ore/
│   ├── ore_block.json          # Template cho ore block
│   ├── deepslate_ore_block.json # Template cho deepslate ore
│   ├── ore_loot.json           # Template cho loot table
│   ├── ore_feature.json        # Template cho feature
│   └── ore_feature_rule.json   # Template cho feature rule
├── item/
│   ├── simple_item.json        # Template cho item đơn giản
│   ├── tool_item.json          # Template cho tool
│   └── weapon_item.json        # Template cho weapon
├── block/
│   ├── simple_block.json       # Template cho block đơn giản
│   └── storage_block.json      # Template cho storage block
└── recipe/
    ├── crafting_shaped.json    # Template cho shaped recipe
    ├── crafting_shapeless.json # Template cho shapeless recipe
    └── smelting.json           # Template cho smelting recipe
```

## Variables

Các biến có thể dùng trong templates:

### Ore Preset
- `{{PRESET_PATH}}` - Tên ore (lowercase, no spaces)
- `{{DISPLAY_NAME}}` - Tên hiển thị (Tiếng Việt)
- `{{MAP_COLOR}}` - Màu trên map (HEX)
- `{{RAW_ITEM}}` - Item drop từ ore
- `{{MIN_Y}}` - Y level tối thiểu
- `{{MAX_Y}}` - Y level tối đa
- `{{ITERATIONS}}` - Số veins per chunk
- `{{ORE_COUNT}}` - Số ore per vein

### Item Preset
- `{{PRESET_PATH}}` - Tên item
- `{{DISPLAY_NAME}}` - Tên hiển thị
- `{{MAX_STACK_SIZE}}` - Stack size
- `{{DURABILITY}}` - Độ bền (cho tools)

### Block Preset
- `{{PRESET_PATH}}` - Tên block
- `{{DISPLAY_NAME}}` - Tên hiển thị
- `{{MAP_COLOR}}` - Màu trên map
- `{{DESTROY_TIME}}` - Thời gian phá

## Cách sử dụng

1. Copy template files từ Bridge v2 vào thư mục tương ứng
2. Thay thế hardcoded values bằng variables `{{VARIABLE_NAME}}`
3. Preset sẽ tự động replace variables khi generate files

## Ví dụ

### ore_block.json
```json
{
  "format_version": "1.21.80",
  "minecraft:block": {
    "description": {
      "identifier": "apeirix:{{PRESET_PATH}}_ore"
    },
    "components": {
      "minecraft:map_color": "{{MAP_COLOR}}",
      "minecraft:loot": "loot_tables/blocks/{{PRESET_PATH}}_ore.json"
    }
  }
}
```
