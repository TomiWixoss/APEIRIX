# APEIRIX Addon Generator - Templates

Thư mục này chứa các template config files để tạo content cho addon.

## 📁 Templates Có Sẵn

### 1. `item-template.yaml`
Tạo simple items (materials, resources)
- Raw materials
- Ingots, nuggets
- Misc items

### 2. `block-template.yaml`
Tạo blocks với loot tables
- Storage blocks
- Decorative blocks
- Custom blocks

### 3. `ore-template.yaml`
Tạo ores với world generation
- Normal ore + deepslate variant
- World gen (features + feature_rules)
- Fortune enchantment support
- Auto-register vào OreRegistry

### 4. `tools-template.yaml`
Tạo tools (KHÔNG tạo recipes)
- Pickaxe, Axe, Shovel, Hoe, Sword
- Custom durability, damage, efficiency
- Auto-register vào ToolRegistry

### 5. `armor-template.yaml`
Tạo full armor set (KHÔNG tạo recipes)
- 4 pieces: helmet, chestplate, leggings, boots
- Attachables cho rendering
- Custom durability, protection

### 6. `food-template.yaml`
Tạo food items (PHẢI dùng section "foods", KHÔNG phải "items")
- Nutrition, saturation
- Effects (regeneration, speed, etc.)
- Using converts to (container items)
- Remove effects (như milk)
- Duration tính bằng GIÂY (tự động × 20)

### 7. `multi-file-items-foods-template.yaml`
Template cho file items.yaml chứa CẢ items thường VÀ foods
- Section "items" cho items thường (không ăn được)
- Section "foods" cho food items (có nutrition)
- Tách biệt rõ ràng giữa 2 loại

### 7. `recipes-template.yaml`
Tạo recipes
- Shaped (có pattern)
- Shapeless (không pattern)
- Smelting (furnace, blast furnace)

### 8. `multi-file-config-template.yaml`
Template cho multi-file config system
- Tách items/foods/recipes/tests thành files riêng
- Import system tự động merge
- Dễ maintain và collaborate

### 9. `complete-material-set-template.yaml`
Tạo toàn bộ material set từ ore đến tools/armor
- Ore + world gen
- Raw material, ingot, nugget, block
- Full tool set (5 tools)
- Full armor set (4 pieces)
- Tất cả recipes cần thiết

## ⚠️ Tính Năng KHÔNG Được Hỗ Trợ

CLI tool chỉ hỗ trợ các tính năng cơ bản của MCPE Addon:
- ❌ Entities/Mobs
- ❌ Particles
- ❌ Sounds
- ❌ Biomes
- ❌ Dimensions
- ❌ Custom UI
- ❌ Animations
- ❌ Models (ngoài armor)

Các tính năng này cần tạo thủ công.

## 🚀 Cách Sử Dụng

### Sử dụng template riêng lẻ:

```bash
# Copy template
cp addon-generator/templates/item-template.yaml my-items.yaml

# Edit my-items.yaml với content của bạn

# Generate
cd addon-generator
bun run dev batch -f my-items.yaml -p ..
```

### Sử dụng complete material set:

```bash
# Copy template
cp addon-generator/templates/complete-material-set-template.yaml copper-set.yaml

# Edit copper-set.yaml:
# - Đổi "example" thành "copper"
# - Đổi tên hiển thị
# - Đổi đường dẫn textures
# - Adjust stats nếu cần

# Generate toàn bộ set
cd addon-generator
bun run dev batch -f copper-set.yaml -p ..
```

## 📝 Lưu Ý

1. **Items vs Foods - QUAN TRỌNG!**
   - Items thường (không ăn được): Dùng section `items:`
   - Food items (có nutrition): Dùng section `foods:`
   - KHÔNG được trộn lẫn! Item có nutrition PHẢI ở `foods:`
   - Foods tự động có tag `minecraft:is_food`

2. **Tools và Armor KHÔNG tự động tạo recipes**
2. **Tools và Armor KHÔNG tự động tạo recipes**
   - Tạo recipes riêng trong section `recipes:`
   - Xem `recipes-template.yaml` để biết patterns

3. **Food Effects Duration**
   - Duration trong effects tính bằng GIÂY
   - Tự động convert sang ticks (× 20)
   - Ví dụ: `duration: 30` = 30 giây = 600 ticks

4. **Ore tự động tạo world generation**
4. **Ore tự động tạo world generation**
   - Features và feature_rules
   - Fortune enchantment support
   - Deepslate variant (nếu có texture)

5. **Texture paths**
5. **Texture paths**
   - Đường dẫn relative từ addon-generator folder
   - Ví dụ: `./textures/my_item.png`

6. **Item IDs**
6. **Item IDs**
   - Lowercase với underscores
   - Ví dụ: `copper_ingot`, `bronze_pickaxe`

7. **Display names**
   - Tiếng Việt
   - Ví dụ: "Thỏi Đồng", "Cuốc Đồng Thanh"

## 🎯 Workflow Khuyến Nghị

### Tạo Material Set Mới:

1. Copy `complete-material-set-template.yaml`
2. Find & Replace "example" với material name của bạn
3. Update display names
4. Update texture paths
5. Adjust stats (durability, damage, etc.)
6. Run batch command

### Tạo Content Riêng Lẻ:

1. Copy template tương ứng
2. Edit config
3. Run batch command

## 📚 Ví Dụ Thực Tế

Xem `example-config.yaml` để biết ví dụ hoàn chỉnh từ dự án thực tế (Tin & Bronze).

## 🔧 Dry Run

Test trước khi tạo thật:

```bash
bun run dev batch -f my-config.yaml -p .. --dry-run
```

## ↩️ Undo

Nếu tạo sai:

```bash
bun run dev undo -p ..
```

## 📖 Xem Lịch Sử

```bash
bun run dev history -p ..
```
