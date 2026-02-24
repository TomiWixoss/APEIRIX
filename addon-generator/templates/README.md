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
Tạo food items (qua items config với food properties)
- Nutrition, saturation
- Effects (regeneration, speed, etc.)
- Using converts to (container items)
- Remove effects (như milk)

### 7. `recipes-template.yaml`
Tạo recipes
- Shaped (có pattern)
- Shapeless (không pattern)
- Smelting (furnace, blast furnace)

### 8. `complete-material-set-template.yaml`
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

1. **Tools và Armor KHÔNG tự động tạo recipes**
   - Tạo recipes riêng trong section `recipes:`
   - Xem `recipes-template.yaml` để biết patterns

2. **Ore tự động tạo world generation**
   - Features và feature_rules
   - Fortune enchantment support
   - Deepslate variant (nếu có texture)

3. **Texture paths**
   - Đường dẫn relative từ addon-generator folder
   - Ví dụ: `./textures/my_item.png`

4. **Item IDs**
   - Lowercase với underscores
   - Ví dụ: `copper_ingot`, `bronze_pickaxe`

5. **Display names**
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
