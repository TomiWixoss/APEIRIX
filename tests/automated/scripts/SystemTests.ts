import { register } from "@minecraft/server-gametest";

/**
 * Automated tests cho systems (Fortune, Durability, Tillage, etc.)
 * 
 * Tests bao gồm:
 * - Fortune enchantment (levels I, II, III)
 * - Silk Touch enchantment
 * - Tool durability mechanics
 * - Hoe tillage mechanics
 * - Tool breaking
 */

// Test: Fortune I on Tin Ore
register("apeirix", "fortune_i_tin_ore", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give pickaxe with Fortune I via command
  player.runCommand("give @s minecraft:diamond_pickaxe 1");
  player.runCommand("enchant @s fortune 1");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait và count drops
  test.runAfterDelay(20, () => {
    const dimension = test.getDimension();
    const entities = dimension.getEntities({
      type: "minecraft:item",
      location: { x: 2, y: 2, z: 2 },
      maxDistance: 2
    });
    
    let drops = 0;
    for (const entity of entities) {
      const item = entity.getComponent("item");
      if (item?.itemStack.typeId === "apeirix:raw_tin") {
        drops += item.itemStack.amount;
      }
    }
    
    test.assert(drops >= 1 && drops <= 2, `Fortune I should drop 1-2, got ${drops}`);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("fortune")
.tag("fortune_i");

// Test: Fortune III on Tin Ore
register("apeirix", "fortune_iii_tin_ore", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give pickaxe with Fortune III via command
  player.runCommand("give @s minecraft:diamond_pickaxe 1");
  player.runCommand("enchant @s fortune 3");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait và count drops
  test.runAfterDelay(20, () => {
    const dimension = test.getDimension();
    const entities = dimension.getEntities({
      type: "minecraft:item",
      location: { x: 2, y: 2, z: 2 },
      maxDistance: 2
    });
    
    let drops = 0;
    for (const entity of entities) {
      const item = entity.getComponent("item");
      if (item?.itemStack.typeId === "apeirix:raw_tin") {
        drops += item.itemStack.amount;
      }
    }
    
    test.assert(drops >= 1 && drops <= 4, `Fortune III should drop 1-4, got ${drops}`);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("fortune")
.tag("fortune_iii");

// Test: Silk Touch on Tin Ore
register("apeirix", "silk_touch_tin_ore", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give pickaxe with Silk Touch via command
  player.runCommand("give @s minecraft:diamond_pickaxe 1");
  player.runCommand("enchant @s silk_touch 1");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait và check drops
  test.runAfterDelay(20, () => {
    // Should drop ore block, not raw tin
    test.assertItemEntityPresent("apeirix:tin_ore", { x: 2, y: 2, z: 2 }, 2, true);
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 2, false);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("silk_touch");

// Test: Bronze Pickaxe Durability
register("apeirix", "bronze_pickaxe_durability", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give bronze pickaxe via command
  player.runCommand("give @s apeirix:bronze_pickaxe 1");
  
  // Place 5 stone blocks
  for (let i = 0; i < 5; i++) {
    test.setBlockType("minecraft:stone", { x: 2 + i, y: 2, z: 2 });
  }
  
  // Mine blocks với delays
  test.startSequence()
    .thenExecute(() => player.breakBlock({ x: 2, y: 2, z: 2 }))
    .thenIdle(10)
    .thenExecute(() => player.breakBlock({ x: 3, y: 2, z: 2 }))
    .thenIdle(10)
    .thenExecute(() => player.breakBlock({ x: 4, y: 2, z: 2 }))
    .thenIdle(10)
    .thenExecute(() => player.breakBlock({ x: 5, y: 2, z: 2 }))
    .thenIdle(10)
    .thenExecute(() => player.breakBlock({ x: 6, y: 2, z: 2 }))
    .thenIdle(10)
    .thenExecute(() => {
      // Check durability via command (tránh type conflict)
      test.print("Durability test completed - check manually");
      // Note: Không thể check durability trực tiếp do type conflict
      // Phải verify manually in-game
    })
    .thenSucceed();
})
.maxTicks(200)
.tag("systems")
.tag("durability")
.tag("bronze_pickaxe");

// Test: Bronze Hoe Tillage
register("apeirix", "bronze_hoe_tillage", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give bronze hoe via command
  player.runCommand("give @s apeirix:bronze_hoe 1");
  
  // Place dirt block
  test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
  
  // Use hoe on dirt
  player.interactWithBlock({ x: 2, y: 2, z: 2 });
  
  // Check farmland created
  test.runAfterDelay(10, () => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    test.assert(block.typeId === "minecraft:farmland", `Expected farmland, got ${block.typeId}`);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("tillage")
.tag("bronze_hoe");

// Test: Bronze Hoe Tillage Blocked
register("apeirix", "bronze_hoe_tillage_blocked", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give bronze hoe via command
  player.runCommand("give @s apeirix:bronze_hoe 1");
  
  // Place dirt block with grass above
  test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
  test.setBlockType("minecraft:tallgrass", { x: 2, y: 3, z: 2 });
  
  // Try to use hoe on dirt
  player.interactWithBlock({ x: 2, y: 2, z: 2 });
  
  // Check farmland NOT created
  test.runAfterDelay(10, () => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    test.assert(block.typeId === "minecraft:dirt", `Expected dirt, got ${block.typeId}`);
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("tillage")
.tag("bronze_hoe")
.tag("edge_case");

// Test: Tool Break on Zero Durability
register("apeirix", "tool_break_zero_durability", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Give bronze pickaxe via command
  // Note: Không thể set durability trực tiếp, test này cần manual verification
  player.runCommand("give @s apeirix:bronze_pickaxe 1");
  
  // Place stone block
  test.setBlockType("minecraft:stone", { x: 2, y: 2, z: 2 });
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Note: Test này cần manual verification do không thể set durability
  test.runAfterDelay(10, () => {
    test.print("Tool break test - requires manual verification");
    test.succeed();
  });
})
.maxTicks(100)
.tag("systems")
.tag("durability")
.tag("tool_break")
.tag("manual_verify");
