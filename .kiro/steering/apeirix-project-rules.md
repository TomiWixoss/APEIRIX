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

## Cấu Trúc Dự Án

```
├── packs/
│   ├── BP/                    # Behavior Pack
│   │   ├── scripts/main.js    # Auto-generated từ scripts/main.ts
│   │   └── texts/             # en_US.lang (nội dung tiếng Việt)
│   └── RP/                    # Resource Pack
│       └── texts/             # en_US.lang (nội dung tiếng Việt)
├── scripts/
│   ├── main.ts                # TypeScript source chính
│   ├── lang/                  # Hệ thống ngôn ngữ cho script UI
│   │   ├── LangManager.ts     # Quản lý ngôn ngữ
│   │   └── vi_VN.ts           # File ngôn ngữ tiếng Việt
│   └── achievements/          # Hệ thống thành tựu
└── config.json                # Regolith config
```

## Quy Tắc Phát Triển

- Dùng namespace `apeirix:` cho tất cả custom content
- File ngôn ngữ dùng `en_US.lang` nhưng nội dung là tiếng Việt
- Edit TypeScript trong `scripts/`, không edit `packs/BP/scripts/main.js`
- Chạy `regolith run` sau khi thay đổi, sau đó `/reload` trong game

## Hệ Thống Ngôn Ngữ

- Pack lang: `packs/BP/texts/en_US.lang` (tên item/entity/block)
- Script UI lang: `scripts/lang/vi_VN.ts` (UI text, chat)
- Dùng `LangManager.get()` thay vì hardcode text trong TypeScript

