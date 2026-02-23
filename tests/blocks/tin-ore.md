# Test Checklist: Tin Ore System

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____

## 1. Tin Ore (apeirix:tin_ore)

### Spawn & Generation
- [ ] Tin ore spawn trong overworld (Y: 0-72)
- [ ] Tìm thấy tin ore trong caves
- [ ] Tìm thấy tin ore khi đào ngẫu nhiên
- [ ] Vein size hợp lý (không quá nhiều/ít)

### Mining
- [ ] Không thể đào bằng tay (không drop)
- [ ] Không thể đào bằng wooden pickaxe (không drop)
- [ ] Đào được bằng stone pickaxe → drop raw tin
- [ ] Đào được bằng iron pickaxe → drop raw tin
- [ ] Đào được bằng diamond pickaxe → drop raw tin
- [ ] Đào được bằng bronze pickaxe → drop raw tin
- [ ] Mining speed hợp lý (hardness = 3.0)

### Silk Touch
- [ ] Silk Touch → drop tin ore block
- [ ] Có thể place lại tin ore block

### Fortune
- [ ] Fortune I → drop 1-2 raw tin
- [ ] Fortune II → drop 1-3 raw tin
- [ ] Fortune III → drop 1-4 raw tin
- [ ] Fortune hoạt động với bronze pickaxe

### Texture & Display
- [ ] Texture hiển thị đúng
- [ ] Tên hiển thị: "Quặng Thiếc" (tiếng Việt)
- [ ] Icon trong inventory đúng

## 2. Deepslate Tin Ore (apeirix:deepslate_tin_ore)

### Spawn & Generation
- [ ] Deepslate tin ore spawn dưới Y=0
- [ ] Tìm thấy trong deepslate layer

### Mining
- [ ] Hardness cao hơn tin ore (4.5 vs 3.0)
- [ ] Yêu cầu stone pickaxe trở lên
- [ ] Drop raw tin (giống tin ore)

### Fortune & Silk Touch
- [ ] Fortune hoạt động giống tin ore
- [ ] Silk Touch → drop deepslate tin ore block

### Texture & Display
- [ ] Texture deepslate variant đúng
- [ ] Tên hiển thị: "Quặng Thiếc Deepslate"

## 3. Raw Tin (apeirix:raw_tin)

### Obtaining
- [ ] Drop từ tin ore khi đào
- [ ] Drop từ deepslate tin ore khi đào
- [ ] Có thể craft từ raw tin block (1 block = 9 raw tin)

### Usage
- [ ] Smelt → tin ingot
- [ ] Craft 9 raw tin → 1 raw tin block (chưa implement)

### Display
- [ ] Texture đúng
- [ ] Tên: "Thiếc Thô"
- [ ] Stack size: 64

## 4. Tin Ingot (apeirix:tin_ingot)

### Obtaining
- [ ] Smelt raw tin → tin ingot
- [ ] Smelt tin ore → tin ingot
- [ ] Smelt deepslate tin ore → tin ingot
- [ ] Craft từ tin block (1 block = 9 ingots)
- [ ] Craft từ tin nugget (9 nuggets = 1 ingot)

### Usage
- [ ] Craft 9 ingots → 1 tin block
- [ ] Craft 1 ingot → 9 tin nuggets
- [ ] Craft bronze ingot (3 copper + 1 tin = 4 bronze)

### Display
- [ ] Texture đúng
- [ ] Tên: "Thỏi Thiếc"

## 5. Tin Nugget (apeirix:tin_nugget)

### Obtaining
- [ ] Craft từ tin ingot (1 ingot = 9 nuggets)

### Usage
- [ ] Craft 9 nuggets → 1 tin ingot

### Display
- [ ] Texture đúng
- [ ] Tên: "Hạt Thiếc"

## 6. Tin Block (apeirix:tin_block)

### Crafting
- [ ] Craft từ 9 tin ingots
- [ ] Craft lại thành 9 tin ingots

### Mining
- [ ] Đào được bằng stone pickaxe trở lên
- [ ] Drop tin block (không phải ingots)

### Display
- [ ] Texture đúng
- [ ] Tên: "Khối Thiếc"
- [ ] Có thể dùng để build/decorate

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._
