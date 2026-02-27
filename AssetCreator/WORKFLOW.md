# Quy Trình Xử Lý Ảnh với PXVG - Hướng Dẫn Đầy Đủ

## Tổng Quan

Quy trình tự động hóa việc tạo và chỉnh sửa ảnh pixel art bằng PXVG format với sự hỗ trợ của AI.

```
Bước 1: Tạo version → Copy ảnh gốc
Bước 2: Encode sang PXVG → Tạo prompt cho AI
Bước 3: AI chỉnh sửa → Trích xuất PXVG
Bước 4: Decode thành ảnh → Hoàn thành
```

---

## Chuẩn Bị

### Yêu Cầu
- Node.js đã cài đặt
- File `pixci-cli.exe` trong thư mục AssetCreator
- Ảnh gốc PNG (16x16 hoặc 32x32 pixels)

### Cấu Trúc Thư Mục
```
AssetCreator/
├── versions/              # Các version riêng biệt
│   └── YYYY-MM-DD_tên/
│       ├── reference/     # Ảnh gốc PNG
│       ├── pxvg/          # PXVG gốc (không sửa)
│       ├── pxvg-edited/   # PXVG đã chỉnh sửa
│       ├── preview/       # Preview x10
│       └── icons/         # Icon x1 (dùng trong game)
├── docs/                  # Tài liệu cho AI
├── step1-create-version.js
├── step2-encode-to-pxvg.js
├── generate-ai-prompt.js
├── extract-pxvg-from-ai.js
└── step3-decode-to-images.js
```

---

## Bước 1: Tạo Version Mới

### Lệnh
```bash
node step1-create-version.js <tên_version>
```

### Ví Dụ
```bash
# Tạo version cho công cụ đồng thanh
node step1-create-version.js bronze_tools

# Tạo version cho quặng thiếc
node step1-create-version.js tin_ores

# Tạo version cho đồ ăn đóng hộp
node step1-create-version.js canned_food
```

### Kết Quả
Tạo thư mục với timestamp:
```
versions/2026-02-27_bronze_tools/
├── reference/     (trống - chờ copy ảnh)
├── pxvg/          (trống)
├── pxvg-edited/   (trống)
├── preview/       (trống)
└── icons/         (trống)
```

### ⏸️ DỪNG LẠI - Copy Ảnh Gốc

Copy các file PNG vào thư mục `reference/`:

```bash
# Ví dụ: Copy từ Minecraft samples
cp "C:/Users/tomis/Downloads/bedrock-samples-v1.26.0.2-full/resource_pack/textures/items/copper_sword.png" versions/2026-02-27_bronze_tools/reference/

# Hoặc copy nhiều file cùng lúc
cp reference_images/*.png versions/2026-02-27_bronze_tools/reference/
```

---

## Bước 2: Encode Sang PXVG

### Lệnh
```bash
node step2-encode-to-pxvg.js <tên_version_đầy_đủ>
```

### Ví Dụ
```bash
# Encode tất cả ảnh trong reference/
node step2-encode-to-pxvg.js 2026-02-27_bronze_tools
```

### Kết Quả
Chuyển đổi tất cả PNG thành PXVG:
```
versions/2026-02-27_bronze_tools/
├── reference/
│   ├── copper_sword.png
│   ├── copper_pickaxe.png
│   └── copper_axe.png
└── pxvg/
    ├── copper_sword.pxvg.xml      ← Mới tạo
    ├── copper_pickaxe.pxvg.xml    ← Mới tạo
    └── copper_axe.pxvg.xml        ← Mới tạo
```

**Lưu ý:** Có thể có warning từ pixci-cli nhưng file vẫn được tạo thành công.

---

## Bước 3: Tạo Prompt Cho AI

### Lệnh
```bash
node generate-ai-prompt.js <tên_version_đầy_đủ>
```

### Ví Dụ
```bash
node generate-ai-prompt.js 2026-02-27_bronze_tools
```

### Kết Quả
Tạo 2 file:
1. `ai-prompt.txt` - Prompt gửi cho AI (chứa docs + tất cả PXVG)
2. `ai-response-placeholder.txt` - File để paste response của AI

### ⏸️ DỪNG LẠI - Làm Việc Với AI

**Bước 3.1: Gửi Prompt Cho AI**

1. Mở file `versions/2026-02-27_bronze_tools/ai-prompt.txt`
2. Copy toàn bộ nội dung
3. Paste vào AI (Claude, ChatGPT, v.v.)
4. Thêm yêu cầu cụ thể, ví dụ:

```
Hãy chỉnh sửa các file PXVG trên để đổi màu từ Copper (đồng) sang Bronze (đồng thanh).

Palette màu Bronze:
- Tối: #8B5A2B
- Trung bình: #A0522D  
- Sáng: #CD853F

Giữ nguyên cấu trúc, chỉ thay đổi màu trong <palette>.
```

**Bước 3.2: Lưu Response Của AI**

1. Copy toàn bộ response của AI
2. Mở file `versions/2026-02-27_bronze_tools/ai-response-placeholder.txt`
3. Xóa nội dung cũ
4. Paste response của AI vào
5. Lưu file

**Format Response Chuẩn:**
```
```pxvg:copper_sword.pxvg.xml
<?xml version="1.0" encoding="utf-8"?>
<pxvg w="16" h="16" xmlns="http://pixci.dev/pxvg">
  <palette>
    <color k="A" hex="#8B5A2BFF" />
    ...
  </palette>
  <layer id="main">
    ...
  </layer>
</pxvg>
```

```pxvg:copper_pickaxe.pxvg.xml
...
```
```

---

## Bước 4: Trích Xuất PXVG Từ AI Response

### Lệnh
```bash
node extract-pxvg-from-ai.js <tên_version_đầy_đủ> <đường_dẫn_file_response>
```

### Ví Dụ
```bash
# Trích xuất từ file placeholder
node extract-pxvg-from-ai.js 2026-02-27_bronze_tools versions/2026-02-27_bronze_tools/ai-response-placeholder.txt

# Hoặc từ file khác
node extract-pxvg-from-ai.js 2026-02-27_bronze_tools ai-response-custom.txt
```

### Kết Quả
Tự động trích xuất và lưu vào `pxvg-edited/`:
```
versions/2026-02-27_bronze_tools/
├── pxvg/              (PXVG gốc - không đổi)
└── pxvg-edited/       (PXVG đã chỉnh sửa)
    ├── copper_sword.pxvg.xml      ← Đã đổi màu
    ├── copper_pickaxe.pxvg.xml    ← Đã đổi màu
    └── copper_axe.pxvg.xml        ← Đã đổi màu
```

---

## Bước 5: Tạo Preview và Icon

### Lệnh
```bash
node step3-decode-to-images.js <tên_version_đầy_đủ>
```

### Ví Dụ
```bash
node step3-decode-to-images.js 2026-02-27_bronze_tools
```

### Kết Quả
Tạo preview (x10) và icon (x1):
```
versions/2026-02-27_bronze_tools/
├── preview/
│   ├── copper_sword.png      ← 160x160 (x10)
│   ├── copper_pickaxe.png    ← 160x160 (x10)
│   └── copper_axe.png        ← 160x160 (x10)
└── icons/
    ├── copper_sword.png      ← 16x16 (x1)
    ├── copper_pickaxe.png    ← 16x16 (x1)
    └── copper_axe.png        ← 16x16 (x1)
```

### ✅ HOÀN THÀNH

- Kiểm tra `preview/` để xem kết quả phóng to
- Copy file từ `icons/` vào `addon-generator/assets/` để sử dụng trong game

---

## Chỉnh Sửa Lại

Nếu cần chỉnh sửa thêm:

### Cách 1: Chỉnh Sửa Thủ Công
1. Mở file trong `pxvg-edited/` bằng text editor
2. Sửa màu trong `<palette>` hoặc cấu trúc trong `<layer>`
3. Chạy lại bước 5:
```bash
node step3-decode-to-images.js 2026-02-27_bronze_tools
```

### Cách 2: Dùng AI Lại
1. Chỉnh sửa yêu cầu trong prompt
2. Gửi lại cho AI
3. Paste response mới vào `ai-response-placeholder.txt`
4. Chạy lại bước 4 và 5:
```bash
node extract-pxvg-from-ai.js 2026-02-27_bronze_tools versions/2026-02-27_bronze_tools/ai-response-placeholder.txt
node step3-decode-to-images.js 2026-02-27_bronze_tools
```

---

## Palette Màu Phổ Biến

### Bronze (Đồng Thanh)
```xml
<color k="A" hex="#8B5A2BFF" />  <!-- Tối -->
<color k="B" hex="#A0522DFF" />  <!-- Trung bình -->
<color k="C" hex="#CD853FFF" />  <!-- Sáng -->
```

### Copper (Đồng)
```xml
<color k="A" hex="#9C4529FF" />
<color k="B" hex="#C15A36FF" />
<color k="C" hex="#E77C56FF" />
```

### Tin (Thiếc)
```xml
<color k="A" hex="#A8B8C0FF" />
<color k="B" hex="#C0D0D8FF" />
<color k="C" hex="#D8E8F0FF" />
```

### Steel (Thép)
```xml
<color k="A" hex="#4A5568FF" />
<color k="B" hex="#718096FF" />
<color k="C" hex="#A0AEC0FF" />
```

### Iron (Sắt)
```xml
<color k="A" hex="#5E5E5EFF" />
<color k="B" hex="#838383FF" />
<color k="C" hex="#AAAAAAFF" />
```

### Gold (Vàng)
```xml
<color k="A" hex="#DBA213FF" />
<color k="B" hex="#FCEE4BFF" />
<color k="C" hex="#FFF9AEFF" />
```

---

## Ví Dụ Quy Trình Hoàn Chỉnh

### Tạo Bộ Công Cụ Bronze

```bash
# Bước 1: Tạo version
node step1-create-version.js bronze_tools

# Copy ảnh copper từ Minecraft
cp minecraft_textures/copper_*.png versions/2026-02-27_bronze_tools/reference/

# Bước 2: Encode
node step2-encode-to-pxvg.js 2026-02-27_bronze_tools

# Bước 3: Tạo prompt
node generate-ai-prompt.js 2026-02-27_bronze_tools

# Mở ai-prompt.txt, copy và gửi cho AI với yêu cầu:
# "Đổi màu từ Copper sang Bronze (palette: #8B5A2B, #A0522D, #CD853F)"

# Paste response vào ai-response-placeholder.txt

# Bước 4: Trích xuất
node extract-pxvg-from-ai.js 2026-02-27_bronze_tools versions/2026-02-27_bronze_tools/ai-response-placeholder.txt

# Bước 5: Tạo ảnh
node step3-decode-to-images.js 2026-02-27_bronze_tools

# Kiểm tra preview/
# Copy icons/ vào addon-generator/assets/tools/
```

---

## Lưu Ý Quan Trọng

✅ **Nên làm:**
- Đặt tên version rõ ràng, mô tả nội dung
- Kiểm tra preview trước khi copy icon vào addon
- Giữ nguyên file trong `pxvg/` làm backup
- Sử dụng palette màu chuẩn để đồng nhất

❌ **Không nên:**
- Xóa file trong `pxvg/` (đó là nguồn gốc)
- Chỉnh sửa trực tiếp file trong `preview/` hoặc `icons/` (sẽ bị ghi đè)
- Dùng ảnh quá lớn (nên 16x16 hoặc 32x32)

---

## Xử Lý Lỗi

### Lỗi: "Không tìm thấy pixci-cli.exe"
```bash
# Đảm bảo file pixci-cli.exe nằm trong thư mục AssetCreator
ls pixci-cli.exe
```

### Lỗi: "Không tìm thấy version"
```bash
# Kiểm tra tên version đầy đủ (có timestamp)
ls versions/
# Dùng tên đầy đủ: 2026-02-27_bronze_tools
```

### Lỗi: "Không tìm thấy file PXVG"
```bash
# Kiểm tra đã chạy bước 2 chưa
ls versions/2026-02-27_bronze_tools/pxvg/
```

### Warning từ pixci-cli
- Bỏ qua warning, file vẫn được tạo thành công
- Preview (x10) thường hoạt động tốt
- Icon (x1) có thể lỗi nhưng không ảnh hưởng workflow

---

## Tham Khảo

- Ảnh mẫu Minecraft: `C:/Users/tomis/Downloads/bedrock-samples-v1.26.0.2-full/resource_pack/textures/`
- Docs PXVG: `AssetCreator/docs/llms.txt`
- Assets addon: `addon-generator/assets/`
