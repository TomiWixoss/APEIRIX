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
│   │   └── items/
│   │       ├── ItemSystem.ts
│   │       └── handlers/
│   │           └── AchievementBookHandler.ts
│   ├── data/                  # Data definitions
│   │   ├── achievements/
│   │   │   ├── BaseAchievement.ts      # Abstract base class
│   │   │   ├── AchievementCategory.ts
│   │   │   └── categories/
│   │   │       └── starter/
│   │   │           ├── WelcomeAchievement.ts
│   │   │           ├── FirstStepsAchievement.ts
│   │   │           └── BreakerAchievement.ts
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

