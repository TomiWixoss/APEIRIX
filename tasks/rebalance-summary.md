# Game Balance Rebalance - Summary Report

## Execution Date
March 1, 2026

## Overview
Successfully rebalanced 54 YAML config files using automated TypeScript script.

## Changes Made

### 1. Tools Rebalanced (25 files)

#### Tin (Nerfed to Stone tier)
- Durability: 375 → 131
- Damage: -1 to -3 across all tools
- Tier: iron → stone
- **Rationale**: Tin is soft metal, should be early-game starter

#### Bronze (Slight buff)
- Durability: 375 (unchanged)
- Damage: +1 for pickaxe/sword
- Tier: iron (unchanged)
- **Rationale**: Bronze is proper alloy, should be viable mid-early game

#### Silver (Rebalanced)
- Durability: 375 (unchanged)
- Damage: Reduced pickaxe/axe to 4, kept sword at 6
- Tier: iron (unchanged)
- **Rationale**: Specialized for undead slaying, not general combat

#### Lead (Nerfed durability)
- Durability: 400 → 200
- Damage: unchanged
- Tier: iron (unchanged)
- **Rationale**: Lead is soft, low durability but heavy

#### Cobalt (Massive buff - Speed focused)
- Durability: 500 → 1200
- Damage: +1 for pickaxe/axe
- Tier: iron → diamond
- **NEW: miningSpeed: 12** (extremely fast)
- **Rationale**: Nether tier, speed-focused end-game material

#### Ardite (Massive buff - Durability focused)
- Durability: 500 → 2500
- Damage: +1 for sword
- Tier: iron → diamond
- **NEW: miningSpeed: 6** (slower but durable)
- **Rationale**: Nether tier, durability-focused end-game material

#### Manyullyn (Ultimate buff)
- Durability: 800 → 3000
- Damage: +2 for sword (8→10), +1 for pickaxe/axe
- Tier: diamond → netherite
- **NEW: miningSpeed: 10** (balanced)
- **Rationale**: Ultimate alloy, should surpass Netherite

### 2. Armor Rebalanced (24 files)

#### Tin (Nerfed)
- Durability: -40% across all pieces
- Protection: -1 to -2 across all pieces
- Total armor: 7 points (was 12)

#### Bronze (Unchanged)
- Kept as solid mid-tier option

#### Silver (Slight nerf)
- Protection: Reduced chestplate/leggings by 1
- Total armor: 13 points (was 15)

#### Lead (Buffed + NEW feature)
- Protection: +1 for chestplate/leggings/boots
- **NEW: knockbackResistance: 0.1 per piece**
- Total armor: 15 points (was 12)
- **Rationale**: Heavy armor, provides knockback resistance

#### Cobalt (Massive buff)
- Durability: +100% to +120% across all pieces
- Protection: +1 across all pieces
- Total armor: 19 points (was 12)

#### Ardite (Massive buff)
- Durability: +150% to +200% across all pieces
- Protection: +1 to +2 across all pieces
- Total armor: 19 points (was 12)

#### Manyullyn (Ultimate buff)
- Durability: +150% to +213% across all pieces
- Protection: +1 to +2 across all pieces
- Total armor: 25 points (was 16) - **Surpasses Netherite (20)**

### 3. Processing Machines (5 files)

#### Crusher
- Stone blocks: 40 → 60 ticks (3 seconds)
- Ore blocks: 60 → 100 ticks (5 seconds)
- **NEW: Added raw ore recipes** (raw_iron, raw_gold, raw_copper)

#### Ore Crusher MK1/MK2/MK3
- **NEW: Added raw ore recipes** for all 3 tiers
- Processing times remain tiered (MK1: slowest, MK3: fastest)

#### Ore Sieve (Major nerf)
- Gravel drop rates:
  - Iron: 15% → 5%
  - Coal: 20% → 10%
  - Copper: 10% → 5%
  - Gold: 5% → 2%
  - Tin: 8% → 3%
- Sand drop rates:
  - Copper: 10% → 3%
  - Gold: 3% → 1%
  - Diamond: 2% → 0.5%
  - Emerald: 1% → 0.3%
- **Rationale**: Prevent gravel farming from replacing mining

## Comparison with Vanilla

### Tools (Durability)
- Stone: 131
- Tin: 131 ✓ (equal to Stone)
- Iron: 250
- Lead: 200 (slightly worse than Iron)
- Bronze/Silver: 375 (better than Iron)
- Cobalt: 1200 (better than Diamond 1561)
- Diamond: 1561
- Ardite: 2500 (better than Netherite)
- Netherite: 2031
- Manyullyn: 3000 ✓ (best in game)

### Armor (Total Protection)
- Leather: 7
- Tin: 7 ✓ (equal to Leather)
- Gold: 11
- Chain: 12
- Bronze: 12
- Iron: 15
- Lead/Silver: 15 (equal to Iron)
- Diamond: 20
- Cobalt/Ardite: 19 (slightly below Diamond)
- Netherite: 20
- Manyullyn: 25 ✓ (surpasses Netherite)

## Script Details

**Location**: `addon-generator/scripts/rebalance-game-stats.ts`

**Features**:
- Automated batch updates
- Preserves YAML formatting
- Detailed change logging
- Material-aware stat application
- Cross-platform path handling

**Usage**:
```bash
cd addon-generator
bun run scripts/rebalance-game-stats.ts
```

## Next Steps

1. ✅ Review changes: `git diff`
2. ⏳ Compile: `bun run dev compile configs/addon.yaml --clean`
3. ⏳ Build: `.\build-and-deploy.ps1`
4. ⏳ In-game testing:
   - Test Tin tools (should feel like Stone)
   - Test Nether tier tools (should feel powerful)
   - Test Lead armor knockback resistance
   - Test raw ore processing in crushers
   - Test ore sieve drop rates (should be much rarer)

## Potential Concerns

1. **Manyullyn might be too OP**: 3000 durability + 10 damage + netherite tier
   - Monitor player feedback
   - Consider if crafting cost justifies power

2. **Tin might be too weak**: Equal to Stone tier
   - Players might skip Tin entirely
   - Consider if this creates good progression

3. **Ore Sieve nerf might be too harsh**: 66-70% reduction in drop rates
   - Monitor if players still use it
   - May need slight buff if completely abandoned

4. **Lead knockback resistance**: New mechanic, needs testing
   - Verify it works in-game
   - Check if 0.4 total (4 pieces × 0.1) is balanced

## Files Modified

Total: 54 files
- Tools: 25 files (pickaxes, axes, swords, shovels, hoes)
- Armor: 24 files (helmets, chestplates, leggings, boots)
- Machines: 5 files (crusher, ore_crusher_mk1/2/3, ore_sieve)

## Automation Benefits

- Consistent stat application across all materials
- No human error in manual editing
- Easy to revert or adjust if needed
- Reproducible process for future rebalances
- Complete change log for review
