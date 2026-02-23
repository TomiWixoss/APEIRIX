# Test Checklist: Bronze Tools & Weapons

**Version**: 1.0.0  
**Ngày test**: _____  
**Minecraft Version**: _____  
**Tester**: _____

## 1. Bronze Ingot (apeirix:bronze_ingot)

### Crafting
- [ ] 3 copper ingot + 1 tin ingot = 4 bronze ingot (shapeless)
- [ ] Craft từ bronze block (1 block = 9 ingots)
- [ ] Craft từ bronze nugget (9 nuggets = 1 ingot)

### Usage
- [ ] Craft bronze tools (pickaxe, axe, shovel, hoe, sword)
- [ ] Craft bronze block (9 ingots = 1 block)
- [ ] Craft bronze nugget (1 ingot = 9 nuggets)
- [ ] Repair bronze tools trong anvil

### Display
- [ ] Texture đúng (màu vàng cam sậm)
- [ ] Tên: "Thỏi Đồng Thanh"

## 2. Bronze Nugget (apeirix:bronze_nugget)

### Crafting
- [ ] 1 bronze ingot = 9 bronze nuggets
- [ ] 9 bronze nuggets = 1 bronze ingot

### Display
- [ ] Texture đúng
- [ ] Tên: "Hạt Đồng Thanh"

## 3. Bronze Block (apeirix:bronze_block)

### Crafting
- [ ] 9 bronze ingots = 1 bronze block
- [ ] 1 bronze block = 9 bronze ingots

### Mining
- [ ] Đào được bằng stone pickaxe trở lên
- [ ] Drop bronze block

### Display
- [ ] Texture đúng
- [ ] Tên: "Khối Đồng Thanh"
- [ ] Có thể dùng để build

## 4. Bronze Pickaxe (apeirix:bronze_pickaxe)

### Crafting
- [ ] Recipe đúng (3 bronze ingot + 2 stick)
- [ ] Unlock recipe khi có bronze ingot

### Stats
- [ ] Durability: 375 uses
- [ ] Mining speed: 6.0 (bằng iron)
- [ ] Attack damage: 4

### Mining
- [ ] Đào stone nhanh hơn tay
- [ ] Đào ores nhanh hơn tay
- [ ] Đào metal blocks nhanh hơn tay
- [ ] Đào được iron ore, gold ore, lapis ore, redstone ore
- [ ] Đào được tin ore, deepslate tin ore
- [ ] KHÔNG đào được diamond ore, emerald ore (cần iron+)

### Durability
- [ ] Mất 1 durability mỗi lần đào block
- [ ] Tool break khi durability = 0 (có sound "random.break")
- [ ] Unbreaking enchantment hoạt động

### Enchanting
- [ ] Có thể enchant (Efficiency, Fortune, Unbreaking, Mending)
- [ ] Enchantability: 18

### Repair
- [ ] Repair bằng bronze ingot trong anvil
- [ ] Combine 2 bronze pickaxes trong anvil

## 5. Bronze Axe (apeirix:bronze_axe)

### Crafting
- [ ] Recipe đúng (3 bronze ingot + 2 stick)

### Stats
- [ ] Durability: 375
- [ ] Mining speed: 6.0
- [ ] Attack damage: 5 (Bedrock) hoặc 9 (Java-like)

### Mining
- [ ] Chặt wood nhanh hơn
- [ ] Chặt log nhanh hơn
- [ ] Phá pumpkin nhanh hơn
- [ ] Phá plant stem nhanh hơn

### Durability & Enchanting
- [ ] Mất durability khi chặt wood
- [ ] Enchantable (Efficiency, Fortune, Unbreaking, Mending)

## 6. Bronze Shovel (apeirix:bronze_shovel)

### Crafting
- [ ] Recipe đúng (1 bronze ingot + 2 stick)

### Stats
- [ ] Durability: 375
- [ ] Mining speed: 6.0
- [ ] Attack damage: 3

### Mining
- [ ] Đào dirt nhanh hơn
- [ ] Đào sand nhanh hơn
- [ ] Đào gravel nhanh hơn
- [ ] Đào snow nhanh hơn
- [ ] Đào clay nhanh hơn
- [ ] Đào soul sand/soil nhanh hơn

### Durability & Enchanting
- [ ] Mất durability khi đào
- [ ] Enchantable

## 7. Bronze Hoe (apeirix:bronze_hoe)

### Crafting
- [ ] Recipe đúng (2 bronze ingot + 2 stick)

### Stats
- [ ] Durability: 375
- [ ] Mining speed: 6.0
- [ ] Attack damage: 4

### Tillage
- [ ] Cuốc dirt → farmland (có sound "use.grass")
- [ ] Cuốc grass block → farmland (có sound)
- [ ] Cuốc dirt path → farmland
- [ ] Cuốc coarse dirt → farmland
- [ ] KHÔNG cuốc được khi có block phía trên (cỏ cao, etc.)
- [ ] Mất 1 durability mỗi lần cuốc thành công
- [ ] KHÔNG mất durability khi cuốc fail

### Mining (Bonus)
- [ ] Phá plant blocks nhanh hơn
- [ ] Phá crop blocks nhanh hơn
- [ ] Phá leaves nhanh hơn
- [ ] Phá hay block nhanh hơn
- [ ] Phá sponge nhanh hơn

### Durability & Enchanting
- [ ] Mất durability khi phá blocks
- [ ] Enchantable

## 8. Bronze Sword (apeirix:bronze_sword)

### Crafting
- [ ] Recipe đúng (2 bronze ingot + 1 stick)

### Stats
- [ ] Durability: 375
- [ ] Attack damage: 6 (bằng iron sword)

### Combat
- [ ] Đánh mob damage đúng
- [ ] Mất durability khi đánh mob
- [ ] Có sweep attack (Java) hoặc normal attack (Bedrock)

### Mining (Bonus)
- [ ] Phá cobweb cực nhanh (speed 15)
- [ ] Phá bamboo nhanh (speed 6)

### Durability & Enchanting
- [ ] Mất durability khi combat
- [ ] Enchantable (Sharpness, Looting, Unbreaking, Mending, etc.)

## 9. General Tool Tests

### All Tools
- [ ] Tất cả tools có texture đúng
- [ ] Tất cả tools có tên tiếng Việt
- [ ] Tất cả tools có durability bar
- [ ] Tất cả tools có thể repair bằng bronze ingot
- [ ] Tất cả tools có enchantability = 18
- [ ] Tất cả tools có max stack size = 1

### Durability System
- [ ] CustomToolSystem hoạt động cho tất cả bronze tools
- [ ] Unbreaking enchantment giảm durability loss
- [ ] Tool break sound "random.break" khi hết durability
- [ ] Tool biến mất khỏi inventory khi break

## Ghi chú lỗi

_Ghi các lỗi phát hiện ở đây..._
