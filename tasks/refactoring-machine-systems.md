# Refactoring Machine Systems

## Vấn đề 1: Code Duplication (DRY Violation)

### Root Cause
4 machine systems (Crusher, Compressor, OreSieve, OreWasher) có 90% code giống nhau:
- `initialize()` - Event registration (place/break/interact)
- `getDirectionFromPlayer()` - Calculate player facing direction
- `checkHopperInputs()` - Hopper automation logic
- Event subscriptions pattern

### Solution
Tạo `BaseMachineSystem` abstract class:
- Extract common logic vào base class
- Subclasses chỉ cần define constants và specific behavior
- Giảm từ ~200 lines/file → ~50 lines/file

### Benefits
- DRY: Sửa bug 1 lần thay vì 4 lần
- Maintainability: Thêm machine mới dễ dàng
- Consistency: Tất cả machines hoạt động giống nhau

---

## Vấn đề 2: Block Direction Flicker

### Root Cause
```typescript
block.setType(this.MACHINE_ON); // Update 1: Change block type
try {
  const perm = block.permutation.withState('apeirix:direction', dir);
  block.setPermutation(perm); // Update 2: Set direction
} catch {}
```
- 2 block updates trong 1 tick → visual flicker
- `setType()` reset tất cả states → mất direction
- `setPermutation()` sau đó restore direction

### Solution
```typescript
import { BlockPermutation } from '@minecraft/server';
const newPerm = BlockPermutation.resolve(this.MACHINE_ON, {
  'apeirix:direction': currentDirection
});
block.setPermutation(newPerm); // Single atomic update
```
- 1 block update duy nhất
- Atomic operation: type + states cùng lúc
- No flicker

---

## Implementation Plan

### Phase 1: Create BaseMachineSystem
1. Tạo `scripts/systems/shared/processing/BaseMachineSystem.ts`
2. Extract common logic từ CrusherSystem
3. Define abstract methods/properties

### Phase 2: Refactor Existing Systems
1. CrusherSystem extends BaseMachineSystem
2. CompressorSystem extends BaseMachineSystem
3. OreSieveSystem extends BaseMachineSystem
4. OreWasherSystem extends BaseMachineSystem (special: 2 inputs)

### Phase 3: Fix Block Direction
1. Replace `setType() + setPermutation()` pattern
2. Use `BlockPermutation.resolve()` atomic update
3. Apply to all 4 systems

---

## Files to Create/Modify

**New**:
- `scripts/systems/shared/processing/BaseMachineSystem.ts`

**Modify**:
- `scripts/systems/mining/CrusherSystem.ts`
- `scripts/systems/mining/CompressorSystem.ts`
- `scripts/systems/mining/OreSieveSystem.ts`
- `scripts/systems/mining/OreWasherSystem.ts`

**Not Touching**:
- `scripts/systems/mining/OreCrusherSystem.ts` (different architecture)

---

## Risks & Concerns

1. **Breaking Changes**: Refactoring có thể introduce bugs
   - Mitigation: Test từng system sau khi refactor
   - Keep original logic intact, chỉ move code

2. **OreWasherSystem Special Case**: Cần 2 inputs (ore + water bucket)
   - Mitigation: Override `handlePlayerInteraction()` method
   - Base class vẫn handle common logic

3. **BlockPermutation.resolve() Compatibility**:
   - Need verify API support trong @minecraft/server 2.5.0
   - Fallback to old pattern nếu không support

---

## Success Criteria

- [ ] BaseMachineSystem created với common logic
- [ ] 4 systems refactored và extend base class
- [ ] Code giảm từ ~800 lines → ~400 lines (50% reduction)
- [ ] All systems vẫn hoạt động như cũ
- [ ] Block direction không flicker
- [ ] Pass diagnostics
- [ ] Test in-game
