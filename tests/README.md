# APEIRIX Testing Documentation

Thư mục này chứa các checklist test cho từng tính năng của addon.

## Cấu trúc

```
tests/
├── blocks/          # Test cho blocks (ores, custom blocks)
├── items/           # Test cho items (tools, weapons, materials)
├── systems/         # Test cho game systems (Fortune, Durability, etc.)
├── achievements/    # Test cho achievement system
└── world-gen/       # Test cho world generation
```

## Cách sử dụng

1. Mở file checklist tương ứng với tính năng cần test
2. Thực hiện từng bước test trong game
3. Đánh dấu ✅ cho các test pass, ❌ cho test fail
4. Ghi chú lỗi nếu có

## Quy tắc

- Mỗi tính năng có 1 file checklist riêng
- Format: `[feature-name].md`
- Luôn test trong Creative và Survival mode
- Ghi rõ version Minecraft đã test
