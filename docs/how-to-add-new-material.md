# Hướng Dẫn Thêm Material Mới (Ore/Alloy)

## Tổng Quan

Có 2 loại materials:
1. **ORE** - Quặng tự nhiên (Tin, Silver, Nickel, Lead)
2. **ALLOY** - Hợp kim (Bronze, Steel, Electrum, Invar)

---

## PHẦN 1: CHUẨN BỊ ASSETS

### 1.1. Ore Materials (20 textures)
```
assets/{material_name}/
├── {material}_ore.png
├── deepslate_{material}_ore.png
├── raw_{material}.png
├── {material}_ingot.png
├── {material}_nugget.png
├── {material}_block.png
├── {material}_ingot_dust.png
├── {material}_ingot_dust_pure.png
├── {material}_pickaxe.png
├── {material}_axe.png
├── {material}_shovel.png
├── {material}_hoe.png
├── {material}_sword.png
├── {material}_hammer.png
├── {material}_helmet.png
├── {material}_chestplate.png
├── {material}_leggings.png
├── {material}_boots.png
├── {material}_layer_1.png
└── {material}_layer_2.png
```

### 1.2. Alloy Materials (18 textures)
```
assets/{alloy_name}/
├── raw_{alloy}.png
├── {alloy}_ingot.png
├── {alloy}_nugget.png
├── {alloy}_block.png
├── {alloy}_ingot_dust.png
├── {alloy}_ingot_dust_pure.png
├── {alloy}_pickaxe.png
├── {alloy}_axe.png
├── {alloy}_shovel.png
├── {alloy}_hoe.png
├── {alloy}_sword.png
├── {alloy}_hammer.png
├── {alloy}_helmet.png
├── {alloy}_chestplate.png
├── {alloy}_leggings.png
├── {alloy}_boots.png
├── {alloy}_layer_1.png
└── {alloy}_layer_2.png
```

---

## PHẦN 2: TẠO CONFIG FILES

### 2.1. Cấu Trúc Thư Mục

```
configs/
├── materials/{material_name}/
│   ├── index.yaml
│   ├── {material}_ore.yaml (chỉ cho ORE)
│   ├── raw_{material}.yaml
│   ├── {material}_ingot.yaml
│   ├── {material}_nugget.yaml
│   ├── {material}_block.yaml
│   ├── {material}_ingot_dust.yaml
│   └── {material}_ingot_dust_pure.yaml
├── tools/{material_name}/
│   ├── index.yaml
│   ├── pickaxe.yaml
│   ├── axe.yaml
│   ├── shovel.yaml
│   ├── hoe.yaml
│   ├── sword.yaml
│   └── hammer.yaml
└── armor/{material_name}/
    ├── index.yaml
    ├── helmet.yaml
    ├── chestplate.yaml
    ├── leggings.yaml
    └── boots.yaml
```

---

## PHẦN 3: STATS REFERENCE

### 3.1. Ore Stats Examples

| Material | Tier | Durability | Enchant | Spawn Y | Vein Size | Veins/Chunk | Tool Req |
|----------|------|------------|---------|---------|-----------|-------------|----------|
| Tin      | Iron | 375        | 18      | 0-64    | 9         | 20          | Stone    |
| Silver   | Iron | 375        | 18      | -64-32  | 6         | 8           | Iron     |
| Nickel   | Iron | 450        | 14      | -32-16  | 6         | 8           | Iron     |
| Lead     | Iron | 400        | 12      | -64-0   | 7         | 6           | Iron     |

### 3.2. Alloy Stats Examples

| Alloy    | Recipe                  | Tier | Durability | Enchant |
|----------|-------------------------|------|------------|---------|
| Bronze   | 3 Copper + 1 Tin → 4    | Iron | 375        | 18      |
| Steel    | 3 Iron + 1 Coal → 4     | Dia  | 750        | 22      |
| Electrum | 1 Gold + 1 Silver → 2   | Iron | 425        | 20      |
| Invar    | 2 Iron + 1 Nickel → 3   | Iron | 500        | 10      |

### 3.3. Armor Durability Pattern

```yaml
helmet: 220
chestplate: 320
leggings: 300
boots: 260
```

### 3.4. Armor Protection Pattern

```yaml
helmet: 2
chestplate: 5
leggings: 4
boots: 1
```

### 3.5. Tool Damage Pattern

```yaml
pickaxe: 4
axe: 5
shovel: 3
hoe: 4
sword: 6
hammer: 4
```

---

## PHẦN 4: TEMPLATE FILES

### 4.1. Materials Index
```yaml
# configs/materials/{material}/index.yaml
import:
  - {material}_ore.yaml          # Chỉ cho ORE
  - raw_{material}.yaml
  - {material}_ingot.yaml
  - {material}_nugget.yaml
  - {material}_block.yaml
  - {material}_ingot_dust.yaml
  - {material}_ingot_dust_pure.yaml
```


### 4.2. Ore Config Template
```yaml
# configs/materials/{material}/{material}_ore.yaml
id: {material}_ore
name: lang:materials.{material}_ore
texturePath: ../../../assets/{material}/{material}_ore.png
deepslateTexturePath: ../../../assets/{material}/deepslate_{material}_ore.png
rawItemId: raw_{material}
destroyTime: 12.0
deepslateDestroyTime: 18.0
explosionResistance: 3
toolTier: iron                    # stone/iron/diamond
minY: -32                         # Spawn range
maxY: 16
veinSize: 6                       # Ore per vein
veinsPerChunk: 8                  # Veins per chunk
fortuneMultiplier: 2
dustItemId: {material}_ingot_dust
stoneDustCount: 4
oreDustCount: 9
recipes:
  - type: smelting
    id: {material}_ingot_from_ore_smelting
    input: apeirix:{material}_ore
    output: apeirix:{material}_ingot
    count: 1
  - type: blasting
    id: {material}_ingot_from_ore_blasting
    input: apeirix:{material}_ore
    output: apeirix:{material}_ingot
    count: 1
  - type: smelting
    id: {material}_ingot_from_deepslate_ore_smelting
    input: apeirix:deepslate_{material}_ore
    output: apeirix:{material}_ingot
    count: 1
  - type: blasting
    id: {material}_ingot_from_deepslate_ore_blasting
    input: apeirix:deepslate_{material}_ore
    output: apeirix:{material}_ingot
    count: 1
  - type: smelting
    id: {material}_ingot_from_smelting
    input: apeirix:raw_{material}
    output: apeirix:{material}_ingot
    count: 1
  - type: blasting
    id: {material}_ingot_from_blasting
    input: apeirix:raw_{material}
    output: apeirix:{material}_ingot
    count: 1
```

### 4.3. Raw Material Config
```yaml
# configs/materials/{material}/raw_{material}.yaml
id: raw_{material}
name: lang:materials.raw_{material}
texture: ../../../assets/{material}/raw_{material}.png
category: items
maxStackSize: 64
edibleByRustMite: false           # true cho alloy, false cho ore quý
recipes:
  - type: smelting
    id: {material}_ingot_from_raw_smelting
    input: apeirix:raw_{material}
    output: apeirix:{material}_ingot
    count: 1
  - type: blasting
    id: {material}_ingot_from_raw_blasting
    input: apeirix:raw_{material}
    output: apeirix:{material}_ingot
    count: 1
```

### 4.4. Ingot Config
```yaml
# configs/materials/{material}/{material}_ingot.yaml
id: {material}_ingot
name: lang:materials.{material}_ingot
texture: ../../../assets/{material}/{material}_ingot.png
category: items
maxStackSize: 64
recipes:
  - type: shaped
    id: apeirix:{material}_ingot_from_nuggets
    pattern:
      - "###"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:{material}_nugget
    result: apeirix:{material}_ingot
    count: 1
    unlock:
      - apeirix:{material}_nugget
  - type: shapeless
    id: apeirix:{material}_ingot_from_block
    ingredients:
      - apeirix:{material}_block
    result: apeirix:{material}_ingot
    count: 9
    unlock:
      - apeirix:{material}_block
```

### 4.5. Nugget Config
```yaml
# configs/materials/{material}/{material}_nugget.yaml
id: {material}_nugget
name: lang:materials.{material}_nugget
texture: ../../../assets/{material}/{material}_nugget.png
category: items
maxStackSize: 64
recipes:
  - type: shapeless
    id: {material}_nugget_from_ingot
    ingredients:
      - apeirix:{material}_ingot
    result: apeirix:{material}_nugget
    count: 9
    unlock:
      - apeirix:{material}_ingot
```

### 4.6. Block Config
```yaml
# configs/materials/{material}/{material}_block.yaml
id: {material}_block
name: lang:materials.{material}_block
texture: ../../../assets/{material}/{material}_block.png
category: construction
destroyTime: 18.0
explosionResistance: 6
mapColor: "#e8e8e8"               # Màu trên map
requiresTool: true
toolTier: iron                    # stone/iron/diamond
miningSpeed: 5
drops: apeirix:{material}_block
recipes:
  - type: shaped
    id: {material}_block_from_ingots
    pattern:
      - "###"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:{material}_ingot
    result: apeirix:{material}_block
    count: 1
    unlock:
      - apeirix:{material}_ingot
  - type: shapeless
    id: apeirix:{material}_ingot_from_block
    ingredients:
      - apeirix:{material}_block
    result: apeirix:{material}_ingot
    count: 9
    unlock:
      - apeirix:{material}_block
```

### 4.7. Dust Config (ORE)
```yaml
# configs/materials/{material}/{material}_ingot_dust.yaml
id: {material}_ingot_dust
name: lang:materials.{material}_ingot_dust
texture: ../../../assets/{material}/{material}_ingot_dust.png
category: items
maxStackSize: 64
edibleByRustMite: true
recipes:
  - type: shaped
    id: raw_{material}_from_dust
    pattern:
      - "###"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:{material}_ingot_dust
    result: apeirix:raw_{material}
    count: 1
    craftingTags:
      - alloy_mixing_crafting
    unlock:
      - apeirix:{material}_ingot_dust
```

### 4.8. Dust Config (ALLOY)
```yaml
# configs/materials/{alloy}/{alloy}_ingot_dust.yaml
id: {alloy}_ingot_dust
name: lang:materials.{alloy}_ingot_dust
texture: ../../../assets/{alloy}/{alloy}_ingot_dust.png
category: items
maxStackSize: 64
edibleByRustMite: true
recipes:
  # VÍ DỤ: Bronze = 3 Copper + 1 Tin → 4 Bronze
  - type: shapeless
    id: {alloy}_ingot_dust_from_materials
    ingredients:
      - apeirix:material1_dust
      - apeirix:material1_dust
      - apeirix:material1_dust
      - apeirix:material2_dust
    result: apeirix:{alloy}_ingot_dust
    count: 4
    unlock:
      - apeirix:material1_dust
      - apeirix:material2_dust
    craftingTags:
      - alloy_mixing_crafting
  - type: shaped
    id: raw_{alloy}_from_dust
    pattern:
      - "###"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:{alloy}_ingot_dust
    result: apeirix:raw_{alloy}
    count: 1
    craftingTags:
      - alloy_mixing_crafting
    unlock:
      - apeirix:{alloy}_ingot_dust
```

### 4.9. Pure Dust Config
```yaml
# configs/materials/{material}/{material}_ingot_dust_pure.yaml
id: {material}_ingot_dust_pure
name: lang:materials.{material}_ingot_dust_pure
texture: ../../../assets/{material}/{material}_ingot_dust_pure.png
category: items
maxStackSize: 64
edibleByRustMite: true
recipes:
  - type: shaped
    id: raw_{material}_from_pure_dust
    pattern:
      - "##"
      - "##"
    ingredients:
      "#": apeirix:{material}_ingot_dust_pure
    result: apeirix:raw_{material}
    count: 1
    craftingTags:
      - alloy_mixing_crafting
    unlock:
      - apeirix:{material}_ingot_dust_pure
  - type: smelting
    id: {material}_ingot_from_dust_smelting
    input: apeirix:{material}_ingot_dust_pure
    output: apeirix:{material}_ingot
    count: 1
  - type: blasting
    id: {material}_ingot_from_dust_blasting
    input: apeirix:{material}_ingot_dust_pure
    output: apeirix:{material}_ingot
    count: 1
```


---

## PHẦN 5: TOOLS TEMPLATES

### 5.1. Tools Index
```yaml
# configs/tools/{material}/index.yaml
import:
  - pickaxe.yaml
  - axe.yaml
  - shovel.yaml
  - hoe.yaml
  - sword.yaml
  - hammer.yaml
```

### 5.2. Pickaxe Template
```yaml
# configs/tools/{material}/pickaxe.yaml
type: pickaxe
id: {material}_pickaxe
name: lang:tools.{material}_pickaxe
texture: ../../../assets/{material}/{material}_pickaxe.png
damage: 4
category: equipment
group: itemGroup.name.pickaxe
diggerTags:
  - minecraft:is_pickaxe_item_destructible
  - stone
  - metal
  - rock
  - wood
  - log
recipe:
  type: shaped
  id: {material}_pickaxe
  pattern:
    - "###"
    - " S "
    - " S "
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_pickaxe
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 450                   # Điều chỉnh theo material
enchantability: 14                # Điều chỉnh theo material
tier: iron                        # stone/iron/diamond
```

### 5.3. Axe Template
```yaml
# configs/tools/{material}/axe.yaml
type: axe
id: {material}_axe
name: lang:tools.{material}_axe
texture: ../../../assets/{material}/{material}_axe.png
damage: 5
category: equipment
group: itemGroup.name.axe
diggerTags:
  - wood
  - log
  - pumpkin
  - plant_stem
recipe:
  type: shaped
  id: {material}_axe
  pattern:
    - "##"
    - "#S"
    - " S"
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_axe
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 450
enchantability: 14
tier: iron
```

### 5.4. Shovel Template
```yaml
# configs/tools/{material}/shovel.yaml
type: shovel
id: {material}_shovel
name: lang:tools.{material}_shovel
texture: ../../../assets/{material}/{material}_shovel.png
damage: 3
category: equipment
group: itemGroup.name.shovel
diggerTags:
  - dirt
  - sand
  - gravel
  - snow
  - clay
  - soul_sand
  - soul_soil
  - powder_snow
recipe:
  type: shaped
  id: {material}_shovel
  pattern:
    - "#"
    - S
    - S
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_shovel
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 450
enchantability: 14
tier: iron
```

### 5.5. Hoe Template
```yaml
# configs/tools/{material}/hoe.yaml
type: hoe
id: {material}_hoe
name: lang:tools.{material}_hoe
texture: ../../../assets/{material}/{material}_hoe.png
damage: 4
category: equipment
group: itemGroup.name.hoe
tags:
  - minecraft:is_hoe
diggerTags:
  - plant
  - crop
  - leaves
  - hay_block
  - sponge
  - sculk
  - nether_wart_block
  - warped_wart_block
  - shroomlight
  - target
recipe:
  type: shaped
  id: {material}_hoe
  pattern:
    - "##"
    - " S"
    - " S"
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_hoe
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 450
enchantability: 14
tier: iron
```

### 5.6. Sword Template
```yaml
# configs/tools/{material}/sword.yaml
type: sword
id: {material}_sword
name: lang:tools.{material}_sword
texture: ../../../assets/{material}/{material}_sword.png
damage: 6
category: equipment
group: itemGroup.name.sword
specialBlocks:
  - block: minecraft:web
    speed: 15
  - block: minecraft:bamboo
    speed: 6
recipe:
  type: shaped
  id: {material}_sword
  pattern:
    - "#"
    - "#"
    - S
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_sword
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 450
enchantability: 14
tier: iron
```

### 5.7. Hammer Template
```yaml
# configs/tools/{material}/hammer.yaml
type: hammer
id: {material}_hammer
name: lang:tools.{material}_hammer
texture: ../../../assets/{material}/{material}_hammer.png
damage: 4
category: equipment
group: itemGroup.name.hammer
diggerTags:
  - minecraft:is_pickaxe_item_destructible
  - stone
  - metal
  - rock
recipe:
  type: shaped
  id: {material}_hammer
  pattern:
    - "###"
    - "###"
    - " S "
  ingredients:
    "#": apeirix:{material}_ingot
    S: minecraft:stick
  result: apeirix:{material}_hammer
  count: 1
  unlock:
    - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
durability: 675                   # 1.5x tool durability
enchantability: 14
tier: iron
miningSpeed: 8.0
areaOfEffect: 3x3
```

---

## PHẦN 6: ARMOR TEMPLATES

### 6.1. Armor Index
```yaml
# configs/armor/{material}/index.yaml
import:
  - helmet.yaml
  - chestplate.yaml
  - leggings.yaml
  - boots.yaml
```

### 6.2. Helmet Template
```yaml
# configs/armor/{material}/helmet.yaml
type: helmet
id: {material}_helmet
name: lang:armor.{material}_helmet
texture: ../../../assets/{material}/{material}_helmet.png
durability: 220
protection: 2
category: equipment
group: itemGroup.name.helmet
slot: slot.armor.head
enchantSlot: armor_head
geometry: geometry.humanoid.armor.helmet
armorLayer: {material}_layer_1
armorLayerTexturePath: ../../../assets/{material}/{material}_layer_1.png
tags:
  - minecraft:trimmable_armors
recipes:
  - type: shaped
    id: {material}_helmet
    pattern:
      - "###"
      - "# #"
    ingredients:
      "#": apeirix:{material}_ingot
    result: apeirix:{material}_helmet
    count: 1
    unlock:
      - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
enchantability: 14
```

### 6.3. Chestplate Template
```yaml
# configs/armor/{material}/chestplate.yaml
type: chestplate
id: {material}_chestplate
name: lang:armor.{material}_chestplate
texture: ../../../assets/{material}/{material}_chestplate.png
durability: 320
protection: 5
category: equipment
group: itemGroup.name.chestplate
slot: slot.armor.chest
enchantSlot: armor_torso
geometry: geometry.humanoid.armor.chestplate
armorLayer: {material}_layer_1
armorLayerTexturePath: ../../../assets/{material}/{material}_layer_1.png
tags:
  - minecraft:trimmable_armors
recipes:
  - type: shaped
    id: {material}_chestplate
    pattern:
      - "# #"
      - "###"
      - "###"
    ingredients:
      "#": apeirix:{material}_ingot
    result: apeirix:{material}_chestplate
    count: 1
    unlock:
      - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
enchantability: 14
```

### 6.4. Leggings Template
```yaml
# configs/armor/{material}/leggings.yaml
type: leggings
id: {material}_leggings
name: lang:armor.{material}_leggings
texture: ../../../assets/{material}/{material}_leggings.png
durability: 300
protection: 4
category: equipment
group: itemGroup.name.leggings
slot: slot.armor.legs
enchantSlot: armor_legs
geometry: geometry.humanoid.armor.leggings
armorLayer: {material}_layer_2
armorLayerTexturePath: ../../../assets/{material}/{material}_layer_2.png
tags:
  - minecraft:trimmable_armors
recipes:
  - type: shaped
    id: {material}_leggings
    pattern:
      - "###"
      - "# #"
      - "# #"
    ingredients:
      "#": apeirix:{material}_ingot
    result: apeirix:{material}_leggings
    count: 1
    unlock:
      - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
enchantability: 14
```

### 6.5. Boots Template
```yaml
# configs/armor/{material}/boots.yaml
type: boots
id: {material}_boots
name: lang:armor.{material}_boots
texture: ../../../assets/{material}/{material}_boots.png
durability: 260
protection: 1
category: equipment
group: itemGroup.name.boots
slot: slot.armor.feet
enchantSlot: armor_feet
geometry: geometry.humanoid.armor.boots
armorLayer: {material}_layer_1
armorLayerTexturePath: ../../../assets/{material}/{material}_layer_1.png
tags:
  - minecraft:trimmable_armors
recipes:
  - type: shaped
    id: {material}_boots
    pattern:
      - "# #"
      - "# #"
    ingredients:
      "#": apeirix:{material}_ingot
    result: apeirix:{material}_boots
    count: 1
    unlock:
      - apeirix:{material}_ingot
materialId: apeirix:{material}_ingot
enchantability: 14
```


---

## PHẦN 7: LANG FILES

### 7.1. Materials Lang (vi_VN)
```yaml
# configs/lang/vi_VN/materials.yaml
materials:
  # {Material Name}
  raw_{material}: {Material} Thô
  {material}_ingot: Thỏi {Material}
  {material}_nugget: Mảnh {Material}
  {material}_block: Khối {Material}
  {material}_ore: Quặng {Material}                    # Chỉ cho ORE
  deepslate_{material}_ore: Quặng {Material} Đá Sâu  # Chỉ cho ORE
  {material}_ingot_dust: Bụi {Material}
  {material}_ingot_dust_pure: Bụi {Material} Tinh Khiết
```

### 7.2. Tools Lang (vi_VN)
```yaml
# configs/lang/vi_VN/tools.yaml
tools:
  {material}_pickaxe: Cuốc {Material}
  {material}_axe: Rìu {Material}
  {material}_shovel: Xẻng {Material}
  {material}_hoe: Cuốc {Material}
  {material}_sword: Kiếm {Material}
  {material}_hammer: Búa {Material}
```

### 7.3. Armor Lang (vi_VN)
```yaml
# configs/lang/vi_VN/armor.yaml
armor:
  {material}_helmet: Mũ {Material}
  {material}_chestplate: Áo Giáp {Material}
  {material}_leggings: Quần {Material}
  {material}_boots: Giày {Material}
```

---

## PHẦN 8: CẬP NHẬT INDEX FILES

### 8.1. Materials Index
```yaml
# configs/materials/index.yaml
import:
  - tin/index.yaml
  - bronze/index.yaml
  - steel/index.yaml
  - silver/index.yaml
  - nickel/index.yaml
  - lead/index.yaml
  - electrum/index.yaml
  - invar/index.yaml
  - {material}/index.yaml          # THÊM DÒNG NÀY
  - dusts/index.yaml
  - processing/index.yaml
```

### 8.2. Tools Index
```yaml
# configs/tools/index.yaml
import:
  - bronze/index.yaml
  - steel/index.yaml
  - silver/index.yaml
  - nickel/index.yaml
  - lead/index.yaml
  - electrum/index.yaml
  - invar/index.yaml
  - {material}/index.yaml          # THÊM DÒNG NÀY
  - hammer/index.yaml
```

### 8.3. Armor Index
```yaml
# configs/armor/index.yaml
import:
  - bronze/index.yaml
  - steel/index.yaml
  - silver/index.yaml
  - nickel/index.yaml
  - lead/index.yaml
  - electrum/index.yaml
  - invar/index.yaml
  - {material}/index.yaml          # THÊM DÒNG NÀY
```

---

## PHẦN 9: THÊM VÀO PROCESSING MACHINES

### 9.1. Ore Washer (Chỉ cho materials có dust)
```yaml
# configs/materials/processing/ore_washer.yaml
processingRecipes:
  # ... existing recipes ...
  
  # {Material} dust
  - input: apeirix:{material}_ingot_dust
    pureDust: apeirix:{material}_ingot_dust_pure
    stoneDust: apeirix:cobblestone_dust
```

### 9.2. Ore Crusher MK1/MK2/MK3 (Chỉ cho ORE)
```yaml
# configs/materials/processing/ore_crusher_mk1.yaml
# configs/materials/processing/ore_crusher_mk2.yaml
# configs/materials/processing/ore_crusher_mk3.yaml
processingRecipes:
  # ... existing recipes ...
  
  # Custom ores - {Material}
  - input: apeirix:{material}_ore
    stoneDust: apeirix:cobblestone_dust
    stoneDustCount: 4
    oreDust: apeirix:{material}_ingot_dust
    oreDustCount: 9
  - input: apeirix:deepslate_{material}_ore
    stoneDust: apeirix:deepslate_dust
    stoneDustCount: 4
    oreDust: apeirix:{material}_ingot_dust
    oreDustCount: 9
```

### 9.3. Crusher (Chỉ cho ORE)
```yaml
# configs/materials/processing/crusher.yaml
processingRecipes:
  # ... existing recipes ...
  
  # Custom ores - {Material}
  - input: apeirix:{material}_ore
    output: apeirix:{material}_ingot_dust
    outputCount: 9
    processingTime: 60
  - input: apeirix:deepslate_{material}_ore
    output: apeirix:{material}_ingot_dust
    outputCount: 9
    processingTime: 60
```

---

## PHẦN 10: CHECKLIST HOÀN THÀNH

### 10.1. Ore Material Checklist
- [ ] Tạo 20 texture files trong `assets/{material}/`
- [ ] Tạo 8 material config files
- [ ] Tạo 6 tool config files
- [ ] Tạo 4 armor config files
- [ ] Tạo 3 index.yaml files
- [ ] Cập nhật 3 lang files (materials, tools, armor)
- [ ] Cập nhật 3 main index files
- [ ] Thêm vào ore_washer.yaml
- [ ] Thêm vào ore_crusher_mk1/mk2/mk3.yaml
- [ ] Thêm vào crusher.yaml
- [ ] Compile: `bun run dev compile configs/addon.yaml --clean`
- [ ] Kiểm tra không có lỗi

### 10.2. Alloy Material Checklist
- [ ] Tạo 18 texture files trong `assets/{alloy}/`
- [ ] Tạo 6 material config files (không có ore)
- [ ] Tạo 6 tool config files
- [ ] Tạo 4 armor config files
- [ ] Tạo 3 index.yaml files
- [ ] Cập nhật 3 lang files (materials, tools, armor)
- [ ] Cập nhật 3 main index files
- [ ] Thêm vào ore_washer.yaml
- [ ] Thêm alloy recipe vào {alloy}_ingot_dust.yaml
- [ ] Compile: `bun run dev compile configs/addon.yaml --clean`
- [ ] Kiểm tra không có lỗi

---

## PHẦN 11: COMMON ALLOY RECIPES

### Bronze (Đồng Thanh)
```yaml
# 3 Copper + 1 Tin → 4 Bronze
ingredients:
  - apeirix:copper_ingot_dust
  - apeirix:copper_ingot_dust
  - apeirix:copper_ingot_dust
  - apeirix:tin_ingot_dust
result: apeirix:bronze_ingot_dust
count: 4
```

### Steel (Thép)
```yaml
# 3 Iron + 1 Coal → 4 Steel
ingredients:
  - apeirix:iron_ingot_dust
  - apeirix:iron_ingot_dust
  - apeirix:iron_ingot_dust
  - apeirix:coal_dust
result: apeirix:steel_alloy_dust
count: 4
```

### Electrum
```yaml
# 1 Gold + 1 Silver → 2 Electrum
ingredients:
  - apeirix:gold_ingot_dust
  - apeirix:silver_ingot_dust
result: apeirix:electrum_ingot_dust
count: 2
```

### Invar
```yaml
# 2 Iron + 1 Nickel → 3 Invar
ingredients:
  - apeirix:iron_ingot_dust
  - apeirix:iron_ingot_dust
  - apeirix:nickel_ingot_dust
result: apeirix:invar_ingot_dust
count: 3
```

---

## PHẦN 12: TIPS & BEST PRACTICES

### 12.1. Texture Paths
- **3 levels deep**: `../../../assets/{material}/`
- Luôn kiểm tra số lượng `../` dựa trên độ sâu folder

### 12.2. Stats Balance
- **Common Ore** (Tin): durability 375, enchant 18, spawn nhiều
- **Uncommon Ore** (Silver, Nickel): durability 400-450, enchant 14-18, spawn ít hơn
- **Rare Ore** (Lead): durability 400, enchant 12, spawn hiếm
- **Alloy**: durability tùy thuộc vào materials, enchant tùy thuộc vào công dụng

### 12.3. Spawn Settings
- **Surface Ore**: minY: 0, maxY: 64
- **Underground Ore**: minY: -32, maxY: 16
- **Deep Ore**: minY: -64, maxY: 0
- **Very Rare**: veinsPerChunk: 5-8
- **Common**: veinsPerChunk: 15-20

### 12.4. Tool Tier
- **stone**: Có thể đào stone tier blocks
- **iron**: Có thể đào iron tier blocks (diamond ore, gold ore, etc.)
- **diamond**: Có thể đào diamond tier blocks (obsidian, ancient debris)

### 12.5. Compile & Test
```bash
# Compile configs
bun run dev compile configs/addon.yaml --clean

# Build full addon
.\build-and-deploy.ps1

# Nếu có lỗi, kiểm tra:
# 1. Texture paths đúng chưa
# 2. Lang keys đã thêm chưa
# 3. Index files đã update chưa
# 4. Recipe IDs unique chưa
```

---

## KẾT LUẬN

File này cung cấp đầy đủ template và hướng dẫn để thêm material mới (ore hoặc alloy) vào APEIRIX addon. Chỉ cần:

1. Chuẩn bị textures
2. Copy templates và thay thế `{material}` bằng tên material
3. Điều chỉnh stats phù hợp
4. Cập nhật index files và lang files
5. Thêm vào processing machines
6. Compile và test

**Lưu ý**: Luôn follow pattern của materials hiện có để đảm bảo consistency!
