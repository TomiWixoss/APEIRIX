# CHANGELOG - APEIRIX

## [2026-03-01 21:30] - Vanilla Overrides & Attribute System

### Added - Vanilla Entity Overrides
- **Player Entity Override** (`minecraft:player`)
  - Attribute: `empty_hand_combat` - Player không thể gây damage bằng tay không (0 damage)
  - Handler: `EmptyHandCombatHandler.ts`

### Added - Vanilla Item Overrides
- **Wooden Pickaxe** (`minecraft:wooden_pickaxe`)
  - Attribute: `breakable` - 100% breakable khi đào ore
  - Attribute: `durability_modifier` - Chỉ còn 4 lần dùng
  - Attribute: `combat_damage_modifier` - 0 damage khi combat

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

### Technical Details
- **Total Vanilla Overrides**: 24 entities/items/blocks
  - 1 entity (player)
  - 1 item (wooden_pickaxe)
  - 22 blocks (logs + stripped logs)

- **Attribute Handlers**:
  - `EmptyHandCombatHandler` - Xử lý empty hand combat
  - `RequiresToolHandler` - Xử lý yêu cầu tool cho blocks
  - `CombatDamageModifierHandler` - Modify combat damage
  - `DurabilityModifierHandler` - Modify durability
  - `BreakableHandler` - Xử lý breakable attribute

- **Lang Support**: vi_VN, en_US
  - Block names
  - Attribute labels
  - Lore templates
  - UI messages

### Files Modified
- `addon-generator/configs/special/vanilla_overrides/` - 24 YAML configs
- `addon-generator/configs/special/index.yaml` - Import all overrides
- `scripts/systems/attributes/handlers/` - Handler implementations
- `scripts/systems/attributes/AttributeSystem.ts` - Handler registration
- Lang files: `configs/lang/`, `configs/script-lang/`

### Build Info
- Files generated: 411
- Compilation warnings: 1 (expected - player entity không cần lore)
