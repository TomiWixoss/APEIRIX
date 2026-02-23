import { register } from "@minecraft/server-gametest";

/**
 * Automated tests cho blocks
 * 
 * Tests bao gồm:
 * - Mining mechanics (tool requirements, drops)
 * - Block placement và breaking
 * - Loot table validation
 */

// Test: Tin Ore Mining với Stone Pickaxe
register("apeirix", "tin_ore_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe via command (tránh type conflict)
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait for drops và check
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 2, true);
  });
})
.maxTicks(100)
.tag("blocks")
.tag("tin_ore")
.tag("mining");

// Test: Tin Ore yêu cầu Pickaxe
register("apeirix", "tin_ore_requires_pickaxe", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin ore
  test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
  
  // Mine with hand (no tool)
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait và check NO drops
  test.runAfterDelay(20, () => {
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 2, false);
    test.succeed();
  });
})
.maxTicks(100)
.tag("blocks")
.tag("tin_ore")
.tag("requirements");

// Test: Deepslate Tin Ore Mining
register("apeirix", "deepslate_tin_ore_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place deepslate tin ore
  test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe via command
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait for drops
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 2, true);
  });
})
.maxTicks(100)
.tag("blocks")
.tag("deepslate_tin_ore")
.tag("mining");

// Test: Tin Block Mining
register("apeirix", "tin_block_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place tin block
  test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe via command
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait for drops - should drop tin block itself
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 2, true);
  });
})
.maxTicks(100)
.tag("blocks")
.tag("tin_block")
.tag("mining");

// Test: Bronze Block Mining
register("apeirix", "bronze_block_mining", (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // Place bronze block
  test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
  
  // Give stone pickaxe via command
  player.runCommand("give @s minecraft:stone_pickaxe 1");
  
  // Mine block
  player.breakBlock({ x: 2, y: 2, z: 2 });
  
  // Wait for drops - should drop bronze block itself
  test.succeedWhen(() => {
    test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 2, true);
  });
})
.maxTicks(100)
.tag("blocks")
.tag("bronze_block")
.tag("mining");
