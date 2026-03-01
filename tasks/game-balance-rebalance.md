# Game Balance Rebalance Plan

## 1. Material Tier Rebalance

### Early Tier (Overworld - Pre-Nether)
**Tin** (Weakest - Early game starter):
- Tools: durability 131 (= Stone), damage -1 from current
- Armor: durability -40%, protection -1 from current
- Tier: stone

**Bronze** (Mid-early game - Alloy upgrade):
- Tools: durability 375 (keep), damage 5 (pickaxe/axe), 6 (sword)
- Armor: durability 320/300/260/220 (keep), protection 2/5/4/1 (keep)
- Tier: iron

**Silver** (Special - Undead Slayer):
- Tools: durability 375 (keep), damage 6 (sword keep), 4 (pickaxe/axe)
- Armor: durability 320/300/260/220 (keep), protection 2/5/4/2
- Tier: iron
- Keep undead_slayer attribute

**Lead** (Heavy - Knockback Resistance):
- Tools: durability 200, damage 4-6 (keep)
- Armor: durability 320/300/260/220 (keep), protection 2/6/5/2
- **ADD knockback_resistance: 0.1 per piece**
- Tier: iron

### Nether Tier (End-game)
**Cobalt** (Speed-focused):
- Tools: durability 1200, damage 6 (sword), 5 (pickaxe/axe), **miningSpeed: 12**
- Armor: durability 440/640/600/520, protection 3/7/6/3 (Total: 19)
- Tier: diamond

**Ardite** (Durability-focused):
- Tools: durability 2500, damage 7 (sword), 5 (pickaxe/axe), **miningSpeed: 6**
- Armor: durability 550/800/750/650, protection 3/7/6/3 (Total: 19)
- Tier: diamond

**Manyullyn** (Ultimate - Balanced):
- Tools: durability 3000, damage 10 (sword), 6 (pickaxe/axe), **miningSpeed: 10**
- Armor: durability 700/1000/938/813, protection 4/9/8/4 (Total: 25 > Netherite 20)
- Tier: netherite

## 2. Processing System Rebalance

### Crusher & Ore Crusher
- Base processing time: 100 ticks (5 seconds) for ores
- Stone blocks: 60 ticks (3 seconds)
- **ADD Raw Ore recipes** (minecraft:raw_iron, raw_gold, raw_copper)

### Ore Crusher MK Tiers
- MK1: 100 ticks, 64 uses per coal block
- MK2: 60 ticks, 32 uses per coal block
- MK3: 30 ticks, 16 uses per coal block

### Ore Sieve (Nerf)
- Processing time: 100 ticks (5 seconds)
- Gravel drop rates:
  - Iron: 5% (was 15%)
  - Coal: 10% (was 20%)
  - Copper: 5% (was 10%)
  - Gold: 2% (was 5%)
  - Tin: 3% (was 8%)
- Sand drop rates:
  - Copper: 3% (was 10%)
  - Gold: 1% (was 3%)
  - Diamond: 0.5% (was 2%)
  - Emerald: 0.3% (was 1%)

## 3. Implementation Steps

1. Update all Tin tools/armor (reduce stats)
2. Update Bronze tools (increase sword damage to 6)
3. Update Silver tools/armor (rebalance)
4. Update Lead armor (add knockback_resistance)
5. Update Cobalt tools/armor (massive buff + miningSpeed)
6. Update Ardite tools/armor (massive buff + miningSpeed)
7. Update Manyullyn tools/armor (massive buff)
8. Update crusher.yaml (increase processingTime, add raw ores)
9. Update ore_crusher_mk1/2/3.yaml (rebalance times, add raw ores)
10. Update ore_sieve.yaml (nerf drop rates, increase time)

## Vanilla Reference
- Stone: 131 durability
- Iron: 250 durability, 6 damage (sword)
- Diamond: 1561 durability, 7 damage (sword)
- Netherite: 2031 durability, 8 damage (sword), 20 armor points
