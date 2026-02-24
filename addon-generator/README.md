# APEIRIX Addon Generator

CLI tool để tự động sinh file JSON cho APEIRIX addon với Bun.

## Cài Đặt

```bash
cd addon-generator
bun install
```

## Sử Dụng

### Development Mode

```bash
# BẮT BUỘC có đủ 3 tham số: id, name, texture
bun run dev item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png

# Với options tùy chỉnh
bun run dev item -i rare_gem -n "Ngọc Quý" -t ./gem.png -c equipment -s 16
```

### Build & Install Globally

```bash
bun run build
bun link
```

Sau đó có thể dùng ở bất kỳ đâu:

```bash
apeirix item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png
```

## Commands

### `apeirix item`

Tạo empty item mới với đầy đủ file cần thiết.

**Cú pháp:**
```bash
apeirix item -i <id> -n <name> -t <texture> [options]
```

**Tham số BẮT BUỘC:**
- `-i, --id <id>` - Item ID (tự động sanitize về lowercase + underscore)
- `-n, --name <name>` - Display name (tiếng Việt)
- `-t, --texture <path>` - Đường dẫn texture PNG (phải tồn tại)

**Nếu thiếu bất kỳ tham số nào, tool sẽ báo lỗi và dừng lại.**

**Options:**
- `-i, --id <id>` - Item ID (lowercase, underscore)
- `-n, --name <name>` - Display name (tiếng Việt)
- `-t, --texture <path>` - Đường dẫn texture PNG (BẮT BUỘC)
- `-c, --category <category>` - Menu category (default: items)
- `-s, --stack-size <size>` - Max stack size (default: 64)
- `-p, --project <path>` - Project root path (default: current directory)

**Ví dụ:**
```bash
# Tạo item đơn giản
apeirix item -i magic_stone -n "Đá Ma Thuật" -t ./textures/magic_stone.png

# Tạo item với category và stack size tùy chỉnh
apeirix item -i rare_gem -n "Ngọc Quý" -t ./gem.png -c equipment -s 16

# Chỉ định project path
apeirix item -i test_item -n "Test" -t ./test.png -p ../my-addon
```

## Tool Làm Gì?

Khi chạy `apeirix item`, tool sẽ:

1. ✅ Validate tất cả input (ID, name, texture)
2. ✅ Tạo file `packs/BP/items/<id>.json` từ template
3. ✅ Copy texture vào `packs/RP/textures/items/<id>.png`
4. ✅ Thêm texture entry vào `packs/RP/textures/item_texture.json`
5. ✅ Thêm display name vào `packs/BP/texts/en_US.lang`
6. ✅ Thêm display name vào `packs/RP/texts/en_US.lang`
7. ✅ Hiển thị hướng dẫn các bước tiếp theo

**Nếu thiếu bất kỳ thông tin nào (ID, name, texture), tool sẽ BÁO LỖI và dừng lại.**

## Các Bước Sau Khi Generate

1. Build: `.\build-and-deploy.ps1`
2. Test trong game: `/give @s apeirix:<id>`

## Mở Rộng Tương Lai

- [ ] `apeirix block` - Tạo block
- [ ] `apeirix tool` - Tạo tool với durability
- [ ] `apeirix armor` - Tạo armor set
- [ ] `apeirix ore` - Tạo ore với world gen
- [ ] `apeirix recipe` - Tạo crafting recipe

## Cấu Trúc

```
addon-generator/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/
│   │   └── item.ts           # Item generation logic
│   ├── templates/
│   │   └── item/
│   │       └── empty.json    # Empty item template
│   └── utils/
│       ├── file.ts           # File operations
│       ├── registry.ts       # Update registries
│       └── validator.ts      # Input validation
└── package.json
```

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **Styling**: Chalk
