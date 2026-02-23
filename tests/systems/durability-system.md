# Test Checklist: Custom Tool Durability System

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____

## 1. Basic Durability

### Bronze Pickaxe
- [ ] Durability bar hiển thị đúng
- [ ] Mất 1 durability khi đào stone
- [ ] Mất 1 durability khi đào ore
- [ ] Mất 1 durability khi đào metal block
- [ ] Tool break khi durability = 0
- [ ] Sound "random.break" khi tool break
- [ ] Tool biến mất khỏi inventory khi break

### Bronze Axe
- [ ] Mất 1 durability khi chặt wood
- [ ] Mất 1 durability khi chặt log
- [ ] Tool break đúng cách

### Bronze Shovel
- [ ] Mất 1 durability khi đào dirt
- [ ] Mất 1 durability khi đào sand
- [ ] Tool break đúng cách

### Bronze Hoe
- [ ] Mất 1 durability khi cuốc dirt → farmland
- [ ] Mất 1 durability khi cuốc grass → farmland
- [ ] KHÔNG mất durability khi cuốc fail (có block phía trên)
- [ ] Mất 1 durability khi phá plant blocks
- [ ] Tool break đúng cách

### Bronze Sword
- [ ] Mất 1 durability khi đánh mob
- [ ] Mất 1 durability khi phá cobweb
- [ ] Mất 1 durability khi phá bamboo
- [ ] Tool break đúng cách

## 2. Unbreaking Enchantment

### Unbreaking I
- [ ] ~50% chance không mất durability
- [ ] Test 20 lần, ~10 lần không mất durability

### Unbreaking II
- [ ] ~67% chance không mất durability
- [ ] Test 20 lần, ~13 lần không mất durability

### Unbreaking III
- [ ] ~75% chance không mất durability
- [ ] Test 20 lần, ~15 lần không mất durability

## 3. Tool Repair

### Anvil Repair
- [ ] Repair bronze pickaxe bằng bronze ingot
- [ ] Repair bronze axe bằng bronze ingot
- [ ] Repair bronze shovel bằng bronze ingot
- [ ] Repair bronze hoe bằng bronze ingot
- [ ] Repair bronze sword bằng bronze ingot
- [ ] Repair amount = 25% max durability per ingot

### Combine Tools
- [ ] Combine 2 bronze pickaxes trong anvil
- [ ] Durability cộng dồn + 5% bonus
- [ ] Enchantments merge đúng

### Grindstone
- [ ] Có thể remove enchantments
- [ ] Repair một phần durability

## 4. CustomToolSystem Implementation

### Script API
- [ ] CustomToolSystem.ts hoạt động
- [ ] ToolRegistry đăng ký tất cả bronze tools
- [ ] Event `playerBreakBlock` trigger đúng
- [ ] Durability component update đúng
- [ ] Equipment slot update đúng

### Hoe Tillage Special Case
- [ ] Event `playerInteractWithBlock` trigger
- [ ] Kiểm tra block là tillable
- [ ] Kiểm tra block above là air
- [ ] Verify farmland được tạo
- [ ] Chỉ damage hoe khi tillage thành công
- [ ] Sound "use.grass" play đúng

### Edge Cases
- [ ] Durability hoạt động trong Creative mode (không mất)
- [ ] Durability hoạt động trong Survival mode
- [ ] Tool break trong inventory (không rơi ra)
- [ ] Tool break khi đang cầm (biến mất ngay)
- [ ] Multiple tools cùng lúc (không conflict)

## 5. Performance

### Lag Test
- [ ] Đào 100 blocks liên tục → không lag
- [ ] Durability system không gây performance issues
- [ ] Equipment update smooth

## 6. Compatibility

### Vanilla Tools
- [ ] Durability system KHÔNG affect vanilla tools
- [ ] Chỉ affect bronze tools (custom tools)

### Other Systems
- [ ] Durability hoạt động cùng Fortune system
- [ ] Durability hoạt động cùng Efficiency enchantment
- [ ] Durability hoạt động cùng Mending enchantment

## 7. Console Logs (Debug)

### Expected Logs
- [ ] `[CustomToolSystem] Hoe damaged` khi cuốc
- [ ] `[CustomToolSystem] Sound played` khi cuốc
- [ ] `[CustomToolSystem] Farmland created` khi cuốc thành công
- [ ] `[CustomToolSystem] Block above is not air` khi cuốc fail
- [ ] Không có error logs

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._

## Durability Count Test (Optional)

### Bronze Pickaxe (375 durability)
```
Blocks mined: ___
Expected: 375 blocks
Actual: ___ blocks
Difference: ___
```
