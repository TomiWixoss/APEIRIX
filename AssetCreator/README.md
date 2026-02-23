# APEIRIX Asset Creator

Nơi tìm các ảnh mẫu từ MineCraft: C:\Users\tomis\Downloads\bedrock-samples-v1.26.0.2-full\resource_pack\textures

## Cấu trúc thư mục
```
AssetCreator/
├── icons/         # Ảnh PNG 16x16 (dùng trong game)
├── pxvg/          # File PXVG nguồn (chỉnh sửa được)
├── preview/       # Ảnh preview scale lớn để xem
├── reference/     # Ảnh tham khảo gốc
├── armor_layers/  # Armor layer textures (64x32)
├── docs/          # Tài liệu hướng dẫn LLMs
└── pixci-cli.exe  # Công cụ chuyển đổi
```

## Cách chạy lệnh pixci-cli.exe (QUAN TRỌNG)

Do lỗi Unicode trên Windows, phải chạy qua PowerShell với UTF-8:

```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe <command> 2>&1 | Out-Null"
```

Hoặc chạy từng lệnh:
```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe encode reference/copper_ingot.png -o pxvg/bronze_ingot.pxvg.xml -f pxvg 2>&1 | Out-Null"
```

## Workflow đầy đủ cho AI

### Bước 1: Copy ảnh mẫu từ Minecraft
```bash
# Copy từ thư mục Minecraft texture
cp "C:\Users\tomis\Downloads\bedrock-samples-v1.26.0.2-full\resource_pack\textures\items\copper_ingot.png" reference/
cp "C:\Users\tomis\Downloads\bedrock-samples-v1.26.0.2-full\resource_pack\textures\blocks\copper_block.png" reference/
cp "C:\Users\tomis\Downloads\bedrock-samples-v1.26.0.2-full\resource_pack\textures\items\copper_sword.png" reference/
# ... các file khác
```

### Bước 2: Encode ảnh sang PXVG
```powershell
# Encode (cần PowerShell để tránh lỗi Unicode)
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe encode reference/copper_ingot.png -o pxvg/bronze_ingot.pxvg.xml -f pxvg 2>&1 | Out-Null"
```

### Bước 3: Chỉnh sửa palette trong file PXVG
- Mở file `.pxvg.xml` bằng text editor
- Sửa các màu trong thẻ `<palette>` để tạo màu mới
- Ví dụ palette đồng (copper): `#9C4529`, `#C15A36`, `#E77C56`
- Ví dụ palette bronze: `#8B5A2B`, `#A0522D`, `#CD853F`

### Bước 4: Decode để xem preview
```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe decode pxvg/bronze_ingot.pxvg.xml -o preview/bronze_ingot.png --scale 10 2>&1 | Out-Null"
```

### Bước 5: Xuất icon cuối cùng
```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe decode pxvg/bronze_ingot.pxvg.xml -o icons/bronze_ingot.png --scale 1 2>&1 | Out-Null"
```

## Lệnh encode/decode hàng loạt

Encode nhiều file:
```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe encode reference/copper_nugget.png -o pxvg/bronze_nugget.pxvg.xml -f pxvg 2>&1 | Out-Null; .\pixci-cli.exe encode reference/copper_sword.png -o pxvg/bronze_sword.pxvg.xml -f pxvg 2>&1 | Out-Null; .\pixci-cli.exe encode reference/copper_pickaxe.png -o pxvg/bronze_pickaxe.pxvg.xml -f pxvg 2>&1 | Out-Null"
```

Decode nhiều file:
```powershell
powershell -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Set-Location 'C:\Users\tomis\Docs\APEIRIX\AssetCreator'; .\pixci-cli.exe decode pxvg/bronze_ingot.pxvg.xml -o preview/bronze_ingot.png --scale 10 2>&1 | Out-Null; .\pixci-cli.exe decode pxvg/bronze_block.pxvg.xml -o preview/bronze_block.png --scale 10 2>&1 | Out-Null"
```

## Các icon hiện có

### Bronze (Đồng thanh)
- `bronze_ingot.png` - Thỏi bronze
- `bronze_block.png` - Khối bronze
- `bronze_nugget.png` - Hạt bronze
- `bronze_sword.png` - Kiếm bronze
- `bronze_pickaxe.png` - Cúp bronze
- `bronze_axe.png` - Rìu bronze
- `bronze_shovel.png` - Xẻng bronze
- `bronze_hoe.png` - Cuốc bronze
- `bronze_spear.png` - Giáo bronze

### Bronze Armor (Giáp Đồng thanh)
- `bronze_helmet.png` - Mũ giáp bronze (16x16)
- `bronze_chestplate.png` - Áo giáp bronze (16x16)
- `bronze_leggings.png` - Quần giáp bronze (16x16)
- `bronze_boots.png` - Giày giáp bronze (16x16)
- `bronze_layer_1.png` - Layer 1: helmet, chestplate, boots (64x32)
- `bronze_layer_2.png` - Layer 2: leggings (64x32)

### Ore (Quặng)
- `copper_*.png`, `iron_*.png`, `gold_*.png`, `tin_*.png`
- `coal_ore.png`, `lapis_ore.png`, `emerald_ore.png`, `diamond_ore.png`, `redstone_ore.png`
- `deepslate_*_ore.png` - Phiên bản deepslate

### Items
- `apeirix_core.png` - Lõi APEIRIX
- `book_apeirix.png` - Sách APEIRIX
- `book_normal.png` - Sách thường
