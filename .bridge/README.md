# Bridge v2 Integration cho APEIRIX

## Tổng quan

Thư mục này chứa config và extensions cho Bridge v2 editor, giúp tạo blocks/items/ores nhanh chóng.

## Cấu trúc

```
.bridge/
├── config.json                 # Bridge project config
├── extensions/
│   └── apeirix-presets/       # Custom presets extension
│       ├── manifest.json       # Extension metadata
│       └── presets/
│           ├── ore.json        # Ore preset definition
│           └── templates/      # Template files
│               ├── ore/
│               ├── item/
│               ├── block/
│               └── recipe/
└── README.md                   # File này
```

## Cách sử dụng

### 1. Mở project trong Bridge v2

1. Mở Bridge v2: https://editor.bridge-core.app
2. Click "Open Folder" và chọn thư mục APEIRIX
3. Bridge sẽ tự động detect `.bridge/config.json`

### 2. Sử dụng Presets

1. Trong Bridge v2, click "New File"
2. Chọn preset (ví dụ: "[APEIRIX] Ore")
3. Điền thông tin:
   - Ore Name: `silver` (lowercase, no spaces)
   - Display Name: `Quặng Bạc`
   - Map Color: `#c0c0c0`
   - Raw Item Drop: `raw_silver`
   - Min/Max Y: `0` / `64`
   - Iterations: `20`
   - Ore Count: `9`
4. Click "Create"

Bridge sẽ tự động tạo:
- `BP/blocks/silver_ore.json`
- `BP/blocks/deepslate_silver_ore.json`
- `BP/loot_tables/blocks/silver_ore.json`
- `BP/loot_tables/blocks/deepslate_silver_ore.json`
- `BP/features/silver_ore_scatter.json`
- `BP/feature_rules/silver_ore_feature.json`
- Append vào `en_US.lang` files

### 3. Thêm Templates mới

1. Copy template từ Bridge v2 hoặc tạo mới
2. Đặt vào `.bridge/extensions/apeirix-presets/presets/templates/`
3. Thay hardcoded values bằng variables: `{{VARIABLE_NAME}}`
4. Update preset definition trong `presets/ore.json`

## Presets có sẵn

### [APEIRIX] Ore
Tạo ore block hoàn chỉnh với:
- Normal ore block
- Deepslate ore variant
- Loot tables
- World generation (feature + feature_rule)
- Language entries

## Tạo Preset mới

1. Tạo file JSON trong `.bridge/extensions/apeirix-presets/presets/`
2. Define fields và createFiles
3. Tạo template files tương ứng

Ví dụ: `tool_set.json`
```json
{
  "name": "[APEIRIX] Tool Set",
  "description": "Tạo bộ tools hoàn chỉnh (pickaxe, axe, shovel, hoe, sword)",
  "icon": "mdi-hammer-wrench",
  "category": "fileType.item",
  "fields": [
    ["Material Name", "PRESET_PATH"],
    ["Display Name", "DISPLAY_NAME"],
    ["Durability", "DURABILITY", 250],
    ["Mining Speed", "MINING_SPEED", 4.0],
    ["Attack Damage", "ATTACK_DAMAGE", 5]
  ],
  "createFiles": [
    ["BP/items/{{PRESET_PATH}}_pickaxe.json", "tool_pickaxe.json"],
    ["BP/items/{{PRESET_PATH}}_axe.json", "tool_axe.json"],
    ["BP/items/{{PRESET_PATH}}_shovel.json", "tool_shovel.json"],
    ["BP/items/{{PRESET_PATH}}_hoe.json", "tool_hoe.json"],
    ["BP/items/{{PRESET_PATH}}_sword.json", "tool_sword.json"]
  ]
}
```

## Tips

- Dùng Bridge v2 để tạo files nhanh, sau đó chỉnh sửa chi tiết
- Templates support Molang và JSON comments
- Có thể dùng Bridge compiler để build project
- Extensions có thể share qua GitHub

## Tài liệu

- Bridge v2 Docs: https://bridge-core.app/guide/
- Extension API: https://bridge-core.github.io/extension-docs/
- Presets Guide: https://bridge-core.app/guide/misc/presets.html
