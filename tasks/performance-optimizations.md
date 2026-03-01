# Performance Optimizations

## Vấn đề 1: RustMite Spatial Queries (MODERATE)

### Root Cause
- CHECK_INTERVAL = 15 ticks (0.75s) → 20 checks/sec
- Scans ALL dimensions (overworld, nether, end) mỗi lần
- Mỗi Rust Mite gọi `getEntities({ maxDistance: 8 })` → O(N) spatial query
- 50 Rust Mites × 20 checks/sec = 1,000 spatial queries/sec

### Solution
- Tăng CHECK_INTERVAL từ 15 → 30 ticks (1.5s)
- Giảm 50% số lần check → 500 queries/sec
- Trade-off: Response time chậm hơn 0.75s (acceptable cho AI behavior)

---

## Vấn đề 2: DisplayHandler Raycast (HIGH)

### Root Cause
- CHECK_INTERVAL = 5 ticks (0.25s) → 4 raycasts/sec per player
- 10 players = 40 raycasts/sec
- Không cache, không check player movement

### Solution
- Tăng CHECK_INTERVAL từ 5 → 10 ticks (0.5s)
- Giảm 50% số raycasts → 20 raycasts/sec (10 players)
- Trade-off: HUD update chậm hơn 0.25s (vẫn smooth)

---

## Vấn đề 3: Machine Processing Loops (CRITICAL)

### Root Cause
- Mỗi machine system có riêng `runInterval(..., 1)` loop
- 5 machine types × 20 ticks/sec = 100 processing checks/sec
- Mỗi check iterate qua ALL machines trong MachineStateManager
- 50 machines = 5,000 operations/sec

### Solution Option A: Consolidate Loops (RECOMMENDED)
- Merge tất cả machine processing vào 1 loop duy nhất
- Giảm từ 5 loops → 1 loop
- Giảm 80% overhead

### Solution Option B: Increase Interval (SIMPLER)
- Tăng interval từ 1 → 5 ticks
- Giảm 80% số checks
- Trade-off: Progress bar update mỗi 0.25s thay vì mỗi tick

**DECISION**: Chọn Option B (simpler, minimal code change)

---

## Vấn đề 4: WikiUI Array Search (LOW)

### Root Cause
- `scanInventory()` dùng `.find()` trên GENERATED_WIKI_ITEMS array
- O(N) search × 36 slots = O(36N)
- 200 wiki items = ~7,200 operations per wiki open

### Solution
- Convert GENERATED_WIKI_ITEMS array → Map<string, WikiItem>
- O(1) lookup thay vì O(N)
- Giảm từ 7,200 → 36 operations

---

## Performance Impact Summary

| Optimization | Before | After | Improvement |
|--------------|--------|-------|-------------|
| RustMite Checks | 1,000/sec | 500/sec | 50% reduction |
| Display Raycasts | 40/sec (10p) | 20/sec (10p) | 50% reduction |
| Machine Processing | 5,000 ops/sec | 1,000 ops/sec | 80% reduction |
| Wiki Scanning | 7,200 ops | 36 ops | 99.5% reduction |

**Total CPU Reduction**: ~70-80% for these systems

---

## Files to Change
1. `scripts/systems/attributes/handlers/RustMiteEdibleHandler.ts`
2. `scripts/systems/shared/processing/DisplayHandler.ts`
3. `scripts/systems/mining/CrusherSystem.ts`
4. `scripts/systems/mining/CompressorSystem.ts`
5. `scripts/systems/mining/OreWasherSystem.ts`
6. `scripts/systems/mining/OreSieveSystem.ts`
7. `scripts/systems/wiki/WikiUI.ts`
