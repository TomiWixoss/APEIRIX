# APEIRIX Asset Creator

## Cấu trúc thư mục
```
AssetCreator/
├── icons/        # Ảnh PNG 16x16 (dùng trong game)
├── pxvg/         # File PXVG nguồn (chỉnh sửa được)
├── preview/      # Ảnh preview scale lớn để xem
├── reference/     # Ảnh tham khảo gốc
├── docs/         # Tài liệu hướng dẫn LLMs
└── pixci-cli.exe # Công cụ chuyển đổi
```

## Workflow cho AI

### 1. Tạo icon mới
1. Viết file PXVG trong `pxvg/`
2. Decode để xem preview:
   ```bash
   pixci-cli.exe decode pxvg/ten_file.pxvg.xml -o preview/ten_file.png --scale 10
   ```

### 2. Chỉnh sửa từ ảnh có sẵn
1. Encode ảnh sang PXVG:
   ```bash
   pixci-cli.exe encode reference/anh_goc.png -o pxvg/ten_file.pxvg.xml -f pxvg
   ```
2. Chỉnh sửa PXVG
3. Decode để xem kết quả

### 3. Xuất icon cuối cùng
```bash
pixci-cli.exe decode pxvg/ten_file.pxvg.xml -o icons/ten_file.png --scale 1
```

## Các icon hiện có
- `apeirix_core.png` - Lõi APEIRIX
- `book_apeirix.png` - Sách APEIRIX
