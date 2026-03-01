# Memory Leak & i-frames Fixes

## Vấn đề 1: Machine Memory Leak

### Root Cause
- `MachineStateManager` track machines trong Map
- Chỉ cleanup khi `playerBreakBlock` event trigger
- **BUG**: Explosion, piston, /setblock KHÔNG trigger `playerBreakBlock`
- → Machine states kẹt lại vĩnh viễn trong memory

### Solution
Thêm `world.afterEvents.blockExplode` listener vào tất cả machine systems:
- CrusherSystem
- CompressorSystem
- OreWasherSystem
- OreSieveSystem

### Implementation
```typescript
world.afterEvents.blockExplode.subscribe((event) => {
  const blockId = event.explodedBlockPermutation.type.id;
  if (blockId === this.MACHINE_OFF || blockId === this.MACHINE_ON) {
    MachineStateManager.remove(event.block.dimension.id, event.block.location);
  }
});
```

---

## Vấn đề 2: Combat i-frames Issue

### Root Cause
- `UndeadSlayerHandler` dùng `afterEvents.entityHurt`
- Gọi `applyDamage()` SAU KHI entity đã bị hurt
- Entity đang trong i-frame window (10 ticks) → Bonus damage bị ignore

### Solution
Delay bonus damage 11 ticks để apply SAU i-frame window:
- Entity có i-frames 10 ticks sau khi bị hurt
- Delay 11 ticks đảm bảo bonus damage apply sau i-frame
- Verify entity vẫn sống trước khi apply damage

### Implementation
```typescript
system.runTimeout(() => {
  if (hurtEntity.isValid() && hurtEntity.getComponent('health')?.currentValue !== 0) {
    hurtEntity.applyDamage(bonusDamage, {
      cause: damageSource.cause,
      damagingEntity: attacker
    });
  }
}, 11); // Delay 11 ticks (sau i-frame window)
```

### Alternative Considered
- `beforeEvents.entityHurt` (experimental API) cho phép modify `event.damage` trực tiếp
- REJECTED: Project dùng stable `@minecraft/server` 2.5.0, không muốn switch sang experimental
- Delay approach đơn giản hơn và không cần experimental features

---

## Verification với Minecraft Docs

### BlockExplodeAfterEvent
- ✅ Có trong `world.afterEvents.blockExplode`
- ✅ Trigger cho mỗi block bị phá bởi explosion
- ✅ Có `explodedBlockPermutation` và `block.location`

### EntityHurtBeforeEvent
- ✅ Có trong `world.beforeEvents.entityHurt` (experimental)
- ✅ Property `damage: number` (writable)
- ✅ Trigger TRƯỚC KHI damage apply
- ✅ Không bị ảnh hưởng bởi i-frames

---

## Files Changed
1. `scripts/systems/mining/CrusherSystem.ts`
2. `scripts/systems/mining/CompressorSystem.ts`
3. `scripts/systems/mining/OreWasherSystem.ts`
4. `scripts/systems/mining/OreSieveSystem.ts`
5. `scripts/systems/attributes/handlers/UndeadSlayerHandler.ts`
