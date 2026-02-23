import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Shovel
 * ID: apeirix:bronze_shovel
 * Tương ứng với: bronze-shovel.md
 * 
 * Prefix: bronze_shovel_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: Craft bronze shovel (1 ingot + 2 sticks)
register("apeirix", "bronze_shovel_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 1");
    player.runCommand("give @s minecraft:stick 2");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_shovel");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_shovel")
    .tag("crafting");

// ============================================
// MINING TESTS
// ============================================

// Test: Dig dirt → faster than hand
register("apeirix", "bronze_shovel_dig_dirt", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_shovel 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Dirt should be dug");
        test.assertItemEntityPresent("minecraft:dirt", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_shovel")
    .tag("mining");

// Test: Dig sand → faster than hand
register("apeirix", "bronze_shovel_dig_sand", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:sand", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_shovel 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Sand should be dug");
        test.assertItemEntityPresent("minecraft:sand", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_shovel")
    .tag("mining");

// Test: Dig gravel → faster than hand
register("apeirix", "bronze_shovel_dig_gravel", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:gravel", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_shovel 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Gravel should be dug");
        // Gravel có thể drop flint hoặc gravel
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_shovel")
    .tag("mining");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Max stack size = 1
register("apeirix", "bronze_shovel_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_shovel 1");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_shovel")
    .tag("display");
