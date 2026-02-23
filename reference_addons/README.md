# Reference Addons

Thư mục này chứa các addon mẫu từ cộng đồng để tham khảo cách implement features.

## Cách sử dụng

1. Tải addon (.mcaddon hoặc .zip) từ nguồn uy tín
2. Giải nén vào thư mục con trong `reference_addons/`
3. Đọc và phân tích code để học cách implement
4. **KHÔNG** copy trực tiếp - chỉ tham khảo approach và structure

## Nguồn addon tốt

- **MCPEDL**: https://mcpedl.com/
- **Bedrock Wiki**: https://wiki.bedrock.dev/
- **CurseForge Bedrock**: https://www.curseforge.com/minecraft-bedrock/addons
- **GitHub**: Search "minecraft bedrock addon"

## Lưu ý

- Tôn trọng bản quyền của tác giả
- Chỉ dùng để học tập, không redistribute
- Đọc license trước khi sử dụng code
- Credit tác giả nếu lấy ý tưởng từ addon của họ

## Cấu trúc đề xuất

```
reference_addons/
├── spears/                    # Addon về spears
│   ├── BP/
│   ├── RP/
│   └── README.md             # Ghi chú về addon này
├── custom-armor/             # Addon về armor
│   ├── BP/
│   ├── RP/
│   └── README.md
└── throwable-weapons/        # Addon về throwable items
    ├── BP/
    ├── RP/
    └── README.md
```

## Features cần tham khảo

- [ ] Spear mechanics (throwable + melee)
- [ ] Custom armor với effects
- [ ] Projectile entities
- [ ] Custom enchantments
- [ ] Advanced durability systems
- [ ] Particle effects
- [ ] Sound events
- [ ] Animation controllers
