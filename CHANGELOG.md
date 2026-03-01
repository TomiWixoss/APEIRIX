# CHANGELOG - APEIRIX

## [2026-03-01 21:30] - Vanilla Overrides & Attribute System

### Added - Vanilla Entity Overrides
- **Player Entity Override** (`minecraft:player`)
  - Attribute: `empty_hand_combat` - Player không thể gây damage bằng tay không (0 damage)
  - Handler: `EmptyHandCombatHandler.ts`

### Added - Vanilla Item Overrides (6 wooden tools)
- **Wooden Pickaxe** (`minecraft:wooden_pickaxe`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0 damage khi combat

- **Wooden Axe** (`minecraft:wooden_axe`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0 damage khi combat

- **Wooden Shovel** (`minecraft:wooden_shovel`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0 damage khi combat

- **Wooden Hoe** (`minecraft:wooden_hoe`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0 damage khi combat

- **Wooden Sword** (`minecraft:wooden_sword`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0.5 damage khi combat (nerfed)

- **Wooden Spear** (`minecraft:wooden_spear`)
  - Attribute: `breakable` - 100% breakable khi đào ore/stone
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0.5 damage khi combat (nerfed)

### Added - Vanilla Block Overrides (22 blocks)
- **Log Blocks** (11 variants)
  - `minecraft:oak_log`
  - `minecraft:birch_log`
  - `minecraft:spruce_log`
  - `minecraft:jungle_log`
  - `minecraft:acacia_log`
  - `minecraft:dark_oak_log`
  - `minecraft:mangrove_log`
  - `minecraft:cherry_log`
  - `minecraft:pale_oak_log`
  - `minecraft:crimson_stem`
  - `minecraft:warped_stem`
  - Attribute: `requires_tool` - Yêu cầu axe để đập (không thể đập bằng tay không)

- **Stripped Log Blocks** (11 variants)
  - `minecraft:stripped_oak_log`
  - `minecraft:stripped_birch_log`
  - `minecraft:stripped_spruce_log`
  - `minecraft:stripped_jungle_log`
  - `minecraft:stripped_acacia_log`
  - `minecraft:stripped_dark_oak_log`
  - `minecraft:stripped_mangrove_log`
  - `minecraft:stripped_cherry_log`
  - `minecraft:stripped_pale_oak_log`
  - `minecraft:stripped_crimson_stem`
  - `minecraft:stripped_warped_stem`
  - Attribute: `requires_tool` - Yêu cầu axe để đập (không thể đập bằng tay không)

### Added - Hammer Tool Type (19 variants)
New tool type với special mining behavior:
- **Hammer Mining Attribute** (`hammer_mining`)
  - Đập block ra dust thay vì vanilla drops
  - Reuse logic từ Ore Crusher MK1 recipes
  - Support Fortune enchantment (33% bonus per level)
  - Handler: `HammerMiningHandler.ts`
  - Áp dụng cho tất cả hammer variants

**How it works**:
- Khi đập ore/stone blocks → drop dust (stone dust + ore dust)
- Ví dụ: Đập tin ore → tin dust + cobblestone dust (thay vì raw tin)
- Fortune enchantment tăng số lượng ore dust
- Tự động remove vanilla drops và spawn custom drops

**Hammer Variants**:
- Wooden Hammer (59 durability, tier: wooden, damage: 1)
- Stone Hammer (131 durability, tier: stone, damage: 2)
- Copper Hammer (tier: iron, damage: 3)
- Bronze Hammer (tier: iron, damage: 3)
- Tin Hammer (tier: iron, damage: 3)
- Silver Hammer (tier: iron, damage: 3)
- Iron Hammer (250 durability, tier: iron, damage: 3)
- Lead Hammer (tier: iron, damage: 3)
- Nickel Hammer (tier: iron, damage: 3)
- Platinum Hammer (tier: diamond, damage: 4)
- Electrum Hammer (tier: diamond, damage: 4)
- Invar Hammer (tier: diamond, damage: 4)
- Golden Hammer (tier: gold, damage: 2)
- Diamond Hammer (1561 durability, tier: diamond, damage: 4)
- Cobalt Hammer (tier: netherite, damage: 5)
- Ardite Hammer (tier: netherite, damage: 5)
- Manyullyn Hammer (tier: netherite, damage: 6)
- Steel Alloy Hammer (750 durability, tier: diamond, damage: 6)
- Netherite Hammer (tier: netherite, damage: 6)

**Wooden Hammer Nerfs** (giống wooden tools):
- Attribute: `breakable` - 100% breakable khi đào ore
- Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
- Attribute: `combat_damage_modifier` - 0 damage khi combat

### Technical Details
- **Total Vanilla Overrides**: 29 entities/items/blocks
  - 1 entity (player)
  - 6 items (wooden tools: pickaxe, axe, shovel, hoe, sword, spear)
  - 22 blocks (logs + stripped logs)
- **New Tool Type**: Hammer (19 variants)

- **Attribute Handlers**:
  - `EmptyHandCombatHandler` - Xử lý empty hand combat
  - `RequiresToolHandler` - Xử lý yêu cầu tool cho blocks
  - `CombatDamageModifierHandler` - Modify combat damage
  - `DurabilityModifierHandler` - Modify durability
  - `BreakableHandler` - Xử lý breakable attribute
  - `HammerMiningHandler` - Xử lý 3x3 mining cho hammer

- **Lang Support**: vi_VN, en_US
  - Block names
  - Attribute labels
  - Lore templates
  - UI messages

### Files Modified
- `addon-generator/configs/special/vanilla_overrides/` - 29 YAML configs (6 tools + 22 blocks + 1 entity)
- `addon-generator/configs/tools/hammers/` - 19 hammer configs
- `addon-generator/configs/special/index.yaml` - Import all overrides
- `scripts/systems/attributes/handlers/` - Handler implementations
  - `HammerMiningHandler.ts` - New handler for 3x3 mining
- `scripts/systems/attributes/AttributeSystem.ts` - Handler registration
- Lang files: `configs/lang/`, `configs/script-lang/`
  - Tool names (vi_VN, en_US)
  - Lore templates for all tools
  - Wiki descriptions

### Build Info
- Files generated: 411
- Compilation warnings: 1 (expected - player entity không cần lore)
