import { register } from "@minecraft/server-gametest";

/**
 * Automated tests cho blocks
 * 
 * Tests bao gồm:
 * - Mining mechanics với SimulatedPlayer
 * - Loot table validation
 * - Tool requirements
 */

// Test: Tin Ore Mining với Stone Pickaxe
register("apeirix", "tin_ore_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Wait a bit for tool, then start mining
  test.runAfterDelay(10, () => {
    player.breakBlock({ x: 2, y: 2, z: 2 });
  });
  
  // Poll until block is broken AND item drops
  test.succeedWhen(() => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    // Check block is air (mined successfully)
    test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
    // Check for item drop
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
  });
})
.structureName("apeirix:empty")
.maxTicks(200)
.tag("blocks")
.tag("tin_ore")
.tag("mining");

// Test: Deepslate Tin Ore Mining
register("apeirix", "deepslate_tin_ore_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place deepslate tin ore
  test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Wait a bit for tool, then start mining
  test.runAfterDelay(10, () => {
    player.breakBlock({ x: 2, y: 2, z: 2 });
  });
  
  // Poll until block is broken AND item drops
  test.succeedWhen(() => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
  });
})
.structureName("apeirix:empty")
.maxTicks(200)
.tag("blocks")
.tag("deepslate_tin_ore")
.tag("mining");

// Test: Tin Block Mining
register("apeirix", "tin_block_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin block
  test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Wait a bit for tool, then start mining
  test.runAfterDelay(10, () => {
    player.breakBlock({ x: 2, y: 2, z: 2 });
  });
  
  // Poll until block is broken AND item drops
  test.succeedWhen(() => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
    test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, true);
  });
})
.structureName("apeirix:empty")
.maxTicks(200)
.tag("blocks")
.tag("tin_block")
.tag("mining");

// Test: Bronze Block Mining
register("apeirix", "bronze_block_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place bronze block
  test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Wait a bit for tool, then start mining
  test.runAfterDelay(10, () => {
    player.breakBlock({ x: 2, y: 2, z: 2 });
  });
  
  // Poll until block is broken AND item drops
  test.succeedWhen(() => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
    test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, true);
  });
})
.structureName("apeirix:empty")
.maxTicks(200)
.tag("blocks")
.tag("bronze_block")
.tag("mining");

// Test: Tin Ore yêu cầu Pickaxe (không đào được bằng tay)
register("apeirix", "tin_ore_requires_pickaxe", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Try to mine with hand (no tool)
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait a reasonable time, then check block is still there
  test.runAfterDelay(100, () => {
    const block = test.getBlock({ x: 2, y: 2, z: 2 });
    // Block should still be tin ore (not broken)
    test.assert(block.typeId === "apeirix:tin_ore", `Block should still be tin_ore, got ${block.typeId}`);
    // No item drops
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, false);
    test.succeed();
  });
})
.structureName("apeirix:empty")
.maxTicks(150)
.tag("blocks")
.tag("tin_ore")
.tag("requirements");

// Test: Loot Tables (using destroyBlock for instant testing)
register("apeirix", "loot_tables", (test) => {
  // Test tin ore loot
  test.setBlockType("apeirix:tin_ore", { x: 1, y: 2, z: 1 });
  test.destroyBlock({ x: 1, y: 2, z: 1 });
  
  // Test deepslate tin ore loot
  test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 1 });
  test.destroyBlock({ x: 2, y: 2, z: 1 });
  
  // Test tin block loot
  test.setBlockType("apeirix:tin_block", { x: 3, y: 2, z: 1 });
  test.destroyBlock({ x: 3, y: 2, z: 1 });
  
  // Test bronze block loot
  test.setBlockType("apeirix:bronze_block", { x: 4, y: 2, z: 1 });
  test.destroyBlock({ x: 4, y: 2, z: 1 });
  
  // Check all drops
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 1, y: 2, z: 1 }, 2, true);
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 1 }, 2, true);
    test.assertItemEntityPresent("apeirix:tin_block", { x: 3, y: 2, z: 1 }, 2, true);
    test.assertItemEntityPresent("apeirix:bronze_block", { x: 4, y: 2, z: 1 }, 2, true);
  });
})
.structureName("apeirix:empty")
.maxTicks(50)
.tag("blocks")
.tag("loot");
