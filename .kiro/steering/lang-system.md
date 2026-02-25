---
inclusion: auto
fileMatchPattern: "**/*.yaml"
description: "Language system documentation - auto-included when editing YAML files"
---

# Hệ Thống Ngôn Ngữ (Language System)

## Config Lang System (YAML → Pack Lang Files)

### Cấu trúc
```
configs/lang/
├── vi_VN/              # Tiếng Việt
│   ├── materials.yaml
│   ├── tools.yaml
│   ├── armor.yaml
│   ├── foods.yaml
│   └── special.yaml
├── en_US/              # English
│   └── ...
└── README.md
```

### Cách Sử Dụng

**1. Chọn ngôn ngữ trong `addon.yaml`:**
```yaml
addon:
  language: vi_VN  # hoặc en_US
```

**2. Dùng lang keys trong entity YAML:**
```yaml
# ✅ ĐÚNG
id: tin_ingot
name: lang:materials.tin_ingot

# ❌ SAI - Không hardcode
id: tin_ingot
name: Thỏi Thiếc
```

**3. Định nghĩa translations:**

`configs/lang/vi_VN/materials.yaml`:
```yaml
materials:
  tin_ingot: Thỏi Thiếc
  bronze_ingot: Thỏi Đồng Thanh
```

`configs/lang/en_US/materials.yaml`:
```yaml
materials:
  tin_ingot: Tin Ingot
  bronze_ingot: Bronze Ingot
```

### Lang Key Format

Format: `category.entity_id`

Categories:
- `materials.*` - Materials (ores, ingots, nuggets, blocks)
- `tools.*` - Tools (pickaxe, axe, shovel, hoe, sword, spear)
- `armor.*` - Armor pieces
- `foods.*` - Food items
- `special.*` - Special items

### Output

- Generated: `build/BP/texts/en_US.lang` và `build/RP/texts/en_US.lang`
- Format: `item.apeirix:tin_ingot=Thỏi Thiếc`
- Auto-generated từ lang keys

### Thêm Ngôn Ngữ Mới

1. Tạo: `configs/lang/ja_JP/`
2. Copy structure từ `vi_VN/`
3. Translate tất cả values
4. Update `addon.yaml`: `language: ja_JP`
5. Compile: `bun run dev compile configs/addon.yaml --clean`

## Script UI Lang System (YAML → TypeScript)

### Cấu trúc (RIÊNG BIỆT với Pack Lang)
```
configs/script-lang/        # Script UI lang (RIÊNG BIỆT)
├── vi_VN/
│   └── ui.yaml            # UI translations
└── en_US/
    └── ui.yaml            # UI translations
```

### Cách Sử Dụng

**1. Định nghĩa trong YAML:**

`configs/script-lang/vi_VN/ui.yaml`:
```yaml
ui:
  close: "§l§c✖ Đóng"
  back: "§l§0← Quay lại"

achievements:
  title: "§l§6═══ THÀNH TỰU APEIRIX ═══"
  progress: "§7Tiến độ:"
```

**2. Auto-generate TypeScript:**
- Compile tự động tạo: `scripts/lang/vi_VN.ts` và `scripts/lang/en_US.ts`
- Format: TypeScript constants với AUTO-GENERATED header

**3. Sử dụng trong code:**
```typescript
import { LangManager } from './lang/LangManager';

// Auto-loads language từ GeneratedLanguage.ts
const title = LangManager.get('achievements.title');
const progress = LangManager.get('achievements.progress');
```

### Output Files

- Generated: `scripts/lang/vi_VN.ts`, `scripts/lang/en_US.ts`
- Config: `scripts/data/GeneratedLanguage.ts` (language setting)
- Auto-loaded bởi `LangManager.init()`

## Quy Tắc

✅ **LUÔN:**
- Dùng `lang:` prefix trong YAML
- Định nghĩa translations trong `configs/lang/`
- Dùng `LangManager.get()` trong TypeScript

❌ **KHÔNG:**
- Hardcode text trong YAML
- Hardcode text trong TypeScript
- Edit generated lang files trong `build/`
