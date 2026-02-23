# Automated Testing với GameTest Framework

## Tổng quan

GameTest Framework là hệ thống testing tự động được tích hợp sẵn trong Minecraft Bedrock Edition, cho phép tạo unit tests để kiểm tra game mechanics, block behaviors, item interactions, và system logic.

**Nguồn tham khảo:**
- [Bedrock Wiki - GameTests](https://wiki.bedrock.dev/scripting/game-tests)
- [Microsoft Learn - GameTest API](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/minecraft-server-gametest)
- [Microsoft Docs - Test Class](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-gametest/test)

## Cấu trúc

```
tests/automated/
├── README.md                    # File này - Hướng dẫn chi tiết
├── scripts/                     # Test scripts (TypeScript)
│   ├── BlockTests.ts           # Tests cho blocks (mining, drops, etc.)
│   ├── ItemTests.ts            # Tests cho items (crafting, stacking, etc.)
│   ├── ToolTests.ts            # Tests cho tools (durability, mining speed, etc.)
│   ├── SystemTests.ts          # Tests cho systems (Fortune, Silk Touch, etc.)
│   └── index.ts                # Export tất cả tests
└── structures/                  # Test structures (optional)
    └── test_arena.mcstructure   # Pre-built test environments
```

## Setup

### 1. Cài đặt Dependencies

Đã cài đặt qua npm:
```bash
npm install @minecraft/server-gametest@latest
```

### 2. Thêm vào Manifest

File `packs/BP/manifest.json` cần có:
```json
{
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "2.7.0-beta"
    },
    {
      "module_name": "@minecraft/server-gametest",
      "version": "1.0.0-beta.1.21.60-preview.24"
    }
  ]
}
```

**Lưu ý:** 
- Version `@minecraft/server`: `2.7.0-beta` (beta)
- Version `@minecraft/server-gametest`: `1.0.0-beta.1.21.60-preview.24` (beta)
- Kiểm tra [package.json](../../../package.json) để biết version hiện tại đang dùng

### 3. Compile Tests

Tests được compile cùng với main scripts qua Regolith:
```bash
regolith run
```

### 4. Enable trong World

Trong world settings, bật:
- **Beta APIs** (nếu dùng beta version)
- **GameTest Framework** toggle

### 5. Run Tests In-Game

Reload scripts sau khi compile:
```
/reload
```

Chạy tests:
```
/gametest run <testClassName>:<testName>
/gametest runall
/gametest runset <tag>
/gametest runthis
/gametest runthese
```

## Viết Tests

### Cấu trúc Test cơ bản

```typescript
import { register } from "@minecraft/server-gametest";
import { Test } from "@minecraft/server-gametest";

register("apeirix", "test_name", (test: Test) => {
  // Setup: Spawn entities, place blocks, etc.
  
  // Action: Perform test actions
  
  // Assert: Check results
  
  // Success/Fail
  test.succeed(); // hoặc test.fail("reason")
})
.maxTicks(100)        // Timeout sau 100 ticks (5 giây)
.structureName("...")  // Optional: Load structure
.tag("category")       // Tag để group tests
.required(true);       // Test bắt buộc pass
```

### Test Methods quan trọng

#### Setup Methods
- `test.spawn(entityId, location)` - Spawn entity
- `test.spawnSimulatedPlayer(location, name, gameMode)` - Spawn fake player
- `test.setBlockType(blockType, location)` - Đặt block
- `test.spawnItem(itemStack, location)` - Spawn item entity

#### Assertion Methods
- `test.assertBlockPresent(blockType, location, isPresent)` - Kiểm tra block
- `test.assertEntityPresent(entityId, location, searchDistance, isPresent)` - Kiểm tra entity
- `test.assertEntityPresentInArea(entityId, isPresent)` - Kiểm tra entity trong test area
- `test.assertItemEntityPresent(itemType, location, searchDistance, isPresent)` - Kiểm tra item drop
- `test.assert(condition, message)` - Custom assertion

#### Success/Fail Methods
- `test.succeed()` - Đánh dấu test pass ngay lập tức
- `test.succeedWhen(callback)` - Pass khi callback không throw error
- `test.succeedOnTick(tick)` - Pass tại tick cụ thể
- `test.fail(message)` - Đánh dấu test fail với message

#### Utility Methods
- `test.runAfterDelay(ticks, callback)` - Chạy callback sau delay
- `test.idle(ticks)` - Đợi một số ticks (async)
- `test.getBlock(location)` - Lấy block tại vị trí
- `test.getDimension()` - Lấy dimension của test

### Example 1: Block Mining Test

```typescript
import { register } from "@minecraft/server-gametest";
import { ItemStack } from "@minecraft/server";

register("apeirix", "tin_ore_mining", (test) => {
  // Spawn simulated player
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin ore block
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe to player
  const pickaxe = new ItemStack("minecraft:stone_pickaxe", 1);
  const inventory = player.getComponent("inventory");
  inventory.container.addItem(pickaxe);
  
  // Break the block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Check if raw tin dropped
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 2, true);
  });
})
.maxTicks(100)
.tag("blocks")
.tag("tin_ore");
```

### Example 2: Tool Durability Test

```typescript
register("apeirix", "bronze_pickaxe_durability", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 });
  
  // Give bronze pickaxe
  const pickaxe = new ItemStack("apeirix:bronze_pickaxe", 1);
  const inventory = player.getComponent("inventory");
  inventory.container.addItem(pickaxe);
  
  // Place 10 stone blocks
  for (let i = 0; i < 10; i++) {
    test.setBlockType("minecraft:stone", { x: 2 + i, y: 2, z: 2 });
  }
  
  // Mine all blocks with delays
  test.startSequence()
    .thenExecute(() => player.breakBlock({ x: 2, y: 2, z: 2 }))
    .thenIdle(5)
    .thenExecute(() => player.breakBlock({ x: 3, y: 2, z: 2 }))
    .thenIdle(5)
    // ... repeat for all blocks
    .thenExecute(() => {
      // Check durability
      const tool = inventory.container.getItem(0);
      const durability = tool?.getComponent("durability");
      test.assert(durability?.damage === 10, `Expected damage 10, got ${durability?.damage}`);
    })
    .thenSucceed();
})
.maxTicks(200)
.tag("tools")
.tag("durability");
```

### Example 3: Fortune Enchantment Test

```typescript
register("apeirix", "fortune_iii_tin_ore", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 });
  
  // Create pickaxe with Fortune III
  const pickaxe = new ItemStack("minecraft:diamond_pickaxe", 1);
  const enchantable = pickaxe.getComponent("enchantable");
  if (enchantable) {
    enchantable.addEnchantment({ type: "fortune", level: 3 });
  }
  
  const inventory = player.getComponent("inventory");
  inventory.container.addItem(pickaxe);
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Count drops (Fortune III = 1-4 drops)
  test.runAfterDelay(10, () => {
    const dimension = test.getDimension();
    const entities = dimension.getEntities({
      type: "minecraft:item",
      location: { x: 2, y: 2, z: 2 },
      maxDistance: 2
    });
    
    let count = 0;
    for (const entity of entities) {
      const item = entity.getComponent("item");
      if (item?.itemStack.typeId === "apeirix:raw_tin") {
        count += item.itemStack.amount;
      }
    }
    
    test.assert(count >= 1 && count <= 4, `Fortune III should drop 1-4, got ${count}`);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("fortune");
```

## GameTest Commands

### Chạy Tests

```bash
# Chạy tất cả tests
/gametest runall

# Chạy tests theo tag
/gametest runset blocks
/gametest runset tools
/gametest runset systems
/gametest runset fortune

# Chạy test cụ thể
/gametest run apeirix:tin_ore_mining
/gametest run apeirix:bronze_pickaxe_durability

# Chạy test gần nhất
/gametest runthis

# Chạy tất cả tests gần đó
/gametest runthese
```

### Quản lý Tests

```bash
# Xem vị trí test gần nhất
/gametest pos

# Xóa tất cả test structures
/gametest clearall

# Xóa test structures trong radius
/gametest clearall 50

# Tạo test structure mới
/gametest create test_name 10 5 10
```

### Reload Scripts

```bash
# Reload tất cả scripts và functions (Minecraft 1.19+)
/reload
```

## Test Tags (Categories)

Sử dụng tags để group tests theo category:

- `blocks` - Block placement, mining, drops
- `items` - Item crafting, stacking, usage
- `tools` - Tool durability, mining speed, enchantments
- `systems` - Game systems (Fortune, Silk Touch, etc.)
- `durability` - Tool durability mechanics
- `fortune` - Fortune enchantment
- `silk_touch` - Silk Touch enchantment
- `tillage` - Hoe tillage mechanics
- `crafting` - Recipe validation
- `worldgen` - World generation (khó test tự động)

## Test Results

Kết quả test hiển thị trong chat và console:

### Success
```
✅ [apeirix:tin_ore_mining] PASSED in 45 ticks
```

### Failure
```
❌ [apeirix:tin_ore_mining] FAILED: Expected raw tin drop, got nothing
```

### Timeout
```
⏱️ [apeirix:bronze_pickaxe_durability] TIMEOUT after 200 ticks
```

### Debug với test.print()

```typescript
register("apeirix", "debug_test", (test) => {
  test.print("Starting test...");
  
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 });
  test.print(`Player spawned at ${player.location.x}, ${player.location.y}, ${player.location.z}`);
  
  // ... test logic
  
  test.print("Test completed!");
  test.succeed();
});
```

## Limitations & Best Practices

### Không thể test tự động:
- ❌ UI interactions (ActionForm, ModalForm)
- ❌ Visual effects (textures, particles, animations)
- ❌ Sound effects (phải nghe manual)
- ❌ Player experience (feel, balance, fun factor)
- ❌ Multiplayer sync issues
- ❌ Performance/lag issues
- ❌ World generation (quá phức tạp, test manual)

### Có thể test tự động:
- ✅ Block placement/breaking
- ✅ Item drops và loot tables
- ✅ Crafting recipes
- ✅ Tool durability
- ✅ Enchantment effects (Fortune, Silk Touch, Unbreaking)
- ✅ System logic (FortuneSystem, CustomToolSystem)
- ✅ Registry operations
- ✅ Event handling
- ✅ Entity spawning và behavior
- ✅ Block states và properties

### Best Practices

1. **Keep tests small và focused**
   - Mỗi test chỉ test 1 feature cụ thể
   - Dễ debug khi fail
   - Chạy nhanh hơn

2. **Use descriptive names**
   ```typescript
   // ❌ Bad
   register("apeirix", "test1", ...)
   
   // ✅ Good
   register("apeirix", "tin_ore_drops_raw_tin_with_stone_pickaxe", ...)
   ```

3. **Use tags để organize**
   ```typescript
   register("apeirix", "test_name", ...)
     .tag("blocks")
     .tag("tin_ore")
     .tag("mining");
   ```

4. **Clear error messages**
   ```typescript
   // ❌ Bad
   test.assert(drops > 0, "Failed");
   
   // ✅ Good
   test.assert(drops > 0, `Expected at least 1 drop, got ${drops}`);
   ```

5. **Cleanup test area**
   ```typescript
   test.runOnFinish(() => {
     test.killAllEntities();
     // Clear blocks if needed
   });
   ```

6. **Keep maxTicks reasonable**
   - Simple tests: 50-100 ticks (2.5-5 giây)
   - Complex tests: 200-400 ticks (10-20 giây)
   - Quá lâu = test chậm, khó debug

7. **Use GameTestSequence cho complex tests**
   ```typescript
   test.startSequence()
     .thenExecute(() => { /* step 1 */ })
     .thenIdle(10)
     .thenExecute(() => { /* step 2 */ })
     .thenIdle(10)
     .thenSucceed();
   ```

8. **Test edge cases**
   - Mining without proper tool
   - Tool breaking at 0 durability
   - Hoe tillage blocked by plant above
   - Fortune with different levels (I, II, III)

9. **Deterministic tests**
   - Tests phải cho kết quả consistent
   - Tránh random behavior (trừ khi test random)
   - Use fixed seeds nếu cần

10. **Fast feedback**
    - Run tests thường xuyên
    - Fix failures ngay lập tức
    - Don't accumulate broken tests

## Troubleshooting

### Test không chạy
1. Kiểm tra `/reload` đã chạy chưa
2. Kiểm tra Beta APIs enabled trong world settings
3. Kiểm tra manifest.json có dependencies đúng
4. Kiểm tra console log có errors

### Test timeout
1. Tăng `.maxTicks()` value
2. Kiểm tra `succeedWhen()` callback có throw error không
3. Use `test.print()` để debug
4. Simplify test logic

### SimulatedPlayer không hoạt động
1. Spawn player ở vị trí hợp lệ (có ground)
2. Đợi vài ticks trước khi interact
3. Use `test.idle()` giữa các actions

### Assertion fails
1. Use `test.print()` để log values
2. Check timing - có thể cần `runAfterDelay()`
3. Verify block/item IDs đúng
4. Check search distance đủ lớn

### Enchantment không work
1. Verify enchantment type string đúng
2. Check component exists trước khi add enchantment
3. Ensure tool có enchantable component

## CI/CD Integration (Advanced)

Có thể integrate GameTest với CI/CD pipeline:

1. **Bedrock Dedicated Server**
   - Run server headless
   - Execute tests via RCON
   - Parse console output

2. **Automated Test Runner**
   ```bash
   # Example script
   bedrock_server --gametest
   ```

3. **Parse Results**
   - Grep console logs
   - Count PASSED/FAILED
   - Generate report

4. **Report to CI**
   - GitHub Actions
   - Jenkins
   - GitLab CI

## Resources

### Official Documentation
- [Microsoft Learn - GameTest Module](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-gametest/minecraft-server-gametest)
- [Microsoft Docs - Test Class](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-gametest/test)
- [Bedrock Wiki - GameTests](https://wiki.bedrock.dev/scripting/game-tests)

### Community Resources
- [Minecraft Bedrock Add-Ons Discord](https://discord.gg/minecraft-addons)
- [Bedrock Wiki Discord](https://discord.gg/XjV87YN)
- [MCTools.dev Code Sandbox](https://mctools.dev/)

### Example Repositories
- [minecraft-gametests (Vanilla)](https://github.com/mojang/minecraft-gametests)
- [minecraft-scripting-samples](https://github.com/microsoft/minecraft-scripting-samples)

## Next Steps

1. ✅ Setup dependencies (`@minecraft/server-gametest`)
2. ✅ Create initial test files (BlockTests.ts, SystemTests.ts)
3. ⏳ Implement remaining tests (ToolTests.ts, ItemTests.ts)
4. ⏳ Create index.ts to export all tests
5. ⏳ Update manifest.json với correct versions
6. ⏳ Test in-game và fix issues
7. ⏳ Document test results
8. ⏳ Integrate với development workflow

---

**Cập nhật:** 2026-02-23  
**Version:** 1.0.0  
**Minecraft Version:** 1.21.50+
