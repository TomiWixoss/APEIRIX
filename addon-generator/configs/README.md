# Configs - Ready-to-Use Content Configurations

Thư mục này chứa các config files thực tế, sẵn sàng để generate content vào addon.

## Cách Sử Dụng

```bash
cd addon-generator
bun run dev batch -f configs/[config-file].yaml -p ..
```

## Available Configs

### 1. `canned-food-system.yaml`
**Hệ thống Đồ Hộp (Canned Food System)**

Thêm 11 loại đồ hộp vào game với đầy đủ tính năng:

#### Nhóm 1: Vỏ Đồ Hộp (Core)
- `canempty` - Vỏ đồ hộp rỗng (craft từ 3 Tin Ingot)

#### Nhóm 2: Lương Thực Cơ Bản
- `cannedmushroomsoup` - Súp nấm hộp (stack 64)
- `cannedbeets` - Súp củ dền hộp (stack 64)
- `canned_food` - Thịt hộp hầm (10 hunger, saturation cao)
- `cannedbread` - Bánh mì đóng hộp (Easter Egg)

#### Nhóm 3: Đồ Hộp Đặc Biệt (Buffs)
- `cannedcarrots` - Cà rốt hộp (Night Vision 15s)
- `canned_pumpkin` - Bí ngô hộp (Fire Resistance 15s)
- `cannedfish` - Cá mòi hộp (Water Breathing 30s)
- `cannedsalad` - Salad hộp (Xóa hiệu ứng xấu)

#### Nhóm 4: Tuyệt Phẩm
- `cannedmeal` - MRE (12 hunger + Regeneration II 5s)
- `canneddogfood` - Thức ăn chó (Nausea cho người, heal cho Sói)

**Tính năng:**
- Tất cả đồ hộp trả lại `canempty` sau khi ăn
- Stack 64 (thay vì 1 như súp thường)
- Đầy đủ recipes và effects

**Yêu cầu:**
- Đã có `tin_ingot` trong addon
- Textures trong `AssetCreator/versions/2026-02-24_cannedfood_tin/icons/`

**Chạy:**
```bash
bun run dev batch -f configs/canned-food-system.yaml -p ..
```

---

## Tạo Config Mới

1. Copy template từ `templates/` folder
2. Đổi tên và chỉnh sửa theo nhu cầu
3. Lưu vào `configs/` folder
4. Chạy với `batch -f configs/your-config.yaml`

## Lưu Ý

- Configs khác với Templates:
  - **Templates**: Mẫu tham khảo, ví dụ generic
  - **Configs**: Sẵn sàng chạy, dữ liệu thực tế
- Texture paths phải tồn tại trước khi chạy
- Kiểm tra dependencies (ví dụ: tin_ingot phải có trước)
