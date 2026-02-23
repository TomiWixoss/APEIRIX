# Test: [Block Name]

**Block**: [Tên hiển thị]  
**ID**: `apeirix:[block_id]`  
**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____  
**Status**: [ ] Not Tested | [ ] Pass | [ ] Fail

---

## 1. Basic Properties

### Display
- [ ] Texture hiển thị đúng
- [ ] Tên hiển thị đúng (tiếng Việt)
- [ ] Icon trong inventory đúng
- [ ] Tooltip text đúng (nếu có)

### Placement
- [ ] Có thể place block
- [ ] Block placement sound đúng
- [ ] Collision box đúng
- [ ] Selection box đúng

## 2. Mining

### Tool Requirements
- [ ] Không thể đào bằng tay (nếu yêu cầu tool)
- [ ] Đào được bằng [tool tier] trở lên
- [ ] Drop đúng item khi đào
- [ ] Không drop khi dùng sai tool

### Mining Speed
- [ ] Hardness value: [value]
- [ ] Mining speed hợp lý
- [ ] Efficiency enchantment hoạt động (nếu applicable)

### Drops
- [ ] Drop đúng item
- [ ] Drop đúng số lượng
- [ ] Silk Touch hoạt động (nếu applicable)
- [ ] Fortune hoạt động (nếu applicable)

## 3. Loot Table

### Configuration
- [ ] Loot table file tồn tại
- [ ] Loot table format đúng
- [ ] Conditions đúng (tool, enchantment, etc.)

## 4. World Generation (nếu có)

### Spawn
- [ ] Block spawn trong world
- [ ] Y-level đúng
- [ ] Biome distribution đúng
- [ ] Frequency hợp lý

## 5. Interactions

### Player Interactions
- [ ] Click chuột phải hoạt động (nếu có)
- [ ] Break animation đúng
- [ ] Particle effects đúng (nếu có)

### Block States (nếu có)
- [ ] States chuyển đổi đúng
- [ ] Visual update đúng

## 6. Compatibility

### Vanilla Mechanics
- [ ] Hoạt động với vanilla tools
- [ ] Hoạt động với vanilla enchantments
- [ ] Không conflict với vanilla blocks

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

---

## Checklist hoàn thành

- [ ] Tất cả tests pass
- [ ] Không có lỗi critical
- [ ] Performance tốt
- [ ] Ready for release
