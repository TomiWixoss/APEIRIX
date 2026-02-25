# Phase 13: Gameplay Features - Scripts & Effects

**Status:** CHƯA IMPLEMENT
**Priority:** ⭐⭐⭐ (TRUNG BÌNH)

---

## 📋 Tổng Quan

Script-based gameplay features:
- Armor set effects
- Tool special abilities
- Block interactions
- Trading system
- Achievement expansion

---

## 🎯 Features to Implement

### 1. Armor Set Effects System

**Script:** `scripts/systems/armor/ArmorSetEffectsSystem.ts`

**Effects:**
- **Invar Full Set** → Fire Resistance
- **Cupronickel Helmet** → Water Breathing
- **Duralumin Full Set** → Speed boost (no penalty)
- **Electrum Full Set** → +50% XP from kills
- **Mithril Full Set** → Glow + Feather Falling + Speed
- **Adamantite Full Set** → Knockback Resistance 100%
- **Cobalt Steel Full Set** → Haste I
- **Tungsten Steel Full Set** → Projectile Protection

**Implementation:**
```typescript
class ArmorSetEffectsSystem {
  private checkArmorSets(player: Player) {
    const equipment = player.getComponent('equippable');
    
    // Check Invar full set
    if (this.hasFullSet(equipment, 'invar')) {
      player.addEffect('fire_resistance', 999999, 0, false);
    }
    
    // Check Cupronickel helmet
    if (this.hasHelmet(equipment, 'cupronickel')) {
      player.addEffect('water_breathing', 999999, 0, false);
    }
    
    // ... more checks
  }
}
```

### 2. Tool Special Abilities

**Script:** `scripts/systems/tools/ToolAbilitiesSystem.ts`

**Abilities:**
- **Hammer (all tiers)** → 3x3 mining (toggle với sneak)
- **Spear (all tiers)** → Throwable weapon (right-click)
- **Cobalt Steel Tools** → No speed penalty underwater
- **Tungsten Steel Sword** → Armor piercing damage
- **Mithril Tools** → Glow effect + bonus XP

**Implementation:**
```typescript
class ToolAbilitiesSystem {
  private handleHammerMining(player: Player, block: Block) {
    if (player.isSneaking) {
      // Mine 3x3 area
      this.mine3x3Area(block.location);
    }
  }
  
  private handleSpearThrow(player: Player, item: ItemStack) {
    // Spawn projectile entity
    this.throwSpear(player, item);
  }
}
```

### 3. Block Interactions

**Script:** `scripts/systems/blocks/BlockInteractionSystem.ts`

**Interactions:**
- **Metal Doors** → Heavy doors cần redstone
- **Metal Chests** → Explosion-resistant
- **Metal Hoppers** → Faster transfer rate
- **Alloy Mixing Table** → UI form (đã có)

### 4. Trading System

**Script:** `scripts/systems/trading/CoinTradingSystem.ts`

**Features:**
- Craft coins từ nuggets
- Trade coins với villagers
- Special trades cho rare metals
- Coin values:
  - Bronze Coin: 1 emerald
  - Silver Coin: 2 emeralds
  - Gold Coin: 5 emeralds
  - Platinum Coin: 10 emeralds

### 5. Achievement Expansion

**Script:** `scripts/systems/achievements/MetallurgyAchievements.ts`

**New Achievements:**
- "Bronze Age" - Craft first Bronze tool
- "Steel Worker" - Craft first Steel tool
- "Precious Collector" - Collect all precious metals
- "Master Metallurgist" - Craft all alloy types
- "Mithril Miner" - Find Mithril ore
- "Adamantite Armor" - Craft full Adamantite set
- "Cosmic Power" - Craft Meteoric Iron
- "Ultimate Smith" - Craft all end-game alloys

---

## 📁 File Structure

```
scripts/systems/
├── armor/
│   ├── ArmorSetEffectsSystem.ts
│   └── ArmorEffectsRegistry.ts
├── tools/
│   ├── ToolAbilitiesSystem.ts
│   └── ToolAbilitiesRegistry.ts
├── blocks/
│   ├── BlockInteractionSystem.ts
│   └── MetalBlockRegistry.ts
├── trading/
│   ├── CoinTradingSystem.ts
│   └── CoinRegistry.ts
└── achievements/
    ├── MetallurgyAchievements.ts
    └── AchievementRegistry.ts
```

---

## 💻 Implementation Priority

### Phase 13.1: Armor Effects (Cao)
1. Create ArmorSetEffectsSystem
2. Implement effect checking
3. Add all armor set effects
4. Test in-game

### Phase 13.2: Tool Abilities (Cao)
1. Create ToolAbilitiesSystem
2. Implement hammer 3x3 mining
3. Implement spear throwing
4. Add special tool effects

### Phase 13.3: Block Interactions (Trung Bình)
1. Metal door mechanics
2. Metal chest protection
3. Metal hopper speed

### Phase 13.4: Trading (Thấp)
1. Coin crafting recipes
2. Villager trade integration
3. Coin values

### Phase 13.5: Achievements (Thấp)
1. Define new achievements
2. Integrate với existing system
3. Test unlock conditions

---

## 🎮 Testing Checklist

### Armor Effects
- [ ] Invar full set gives Fire Resistance
- [ ] Cupronickel helmet gives Water Breathing
- [ ] Duralumin armor no speed penalty
- [ ] Electrum armor +50% XP
- [ ] Mithril armor glow + effects
- [ ] Adamantite armor knockback immunity
- [ ] Effects remove when armor removed

### Tool Abilities
- [ ] Hammer 3x3 mining works
- [ ] Spear throwing works
- [ ] Cobalt Steel no underwater penalty
- [ ] Tungsten Steel armor piercing
- [ ] Mithril tools glow

### Block Interactions
- [ ] Metal doors require redstone
- [ ] Metal chests resist explosions
- [ ] Metal hoppers transfer faster

### Trading
- [ ] Coins craft correctly
- [ ] Villagers accept coins
- [ ] Trade values correct

### Achievements
- [ ] All achievements unlock correctly
- [ ] Achievement UI displays properly

---

## 📊 Performance Considerations

### Optimization
- Cache armor checks (don't check every tick)
- Use event-driven approach
- Batch effect applications
- Minimize script calls

### Best Practices
- Use registries for data
- Event-based systems
- Efficient player queries
- Proper cleanup

---

## 🎯 Success Criteria

- [ ] All armor effects work correctly
- [ ] All tool abilities functional
- [ ] Block interactions smooth
- [ ] Trading system integrated
- [ ] Achievements unlock properly
- [ ] No performance issues
- [ ] Clean code architecture

---

**COMPLETE!** All 13 phases documented.

**APEIRIX - Complete Metallurgy System Documentation ✅**
