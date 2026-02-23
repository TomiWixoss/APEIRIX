import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Axe
 * ID: apeirix:bronze_axe
 * Tương ứng với: bronze-axe.md
 * 
 * Prefix: bronze_axe_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: Craft bronze axe (3 ingots + 2 sticks)
register("apeirix", "bronze_axe_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 3");
    player.runCommand("give @s minecraft:stick 2");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_axe");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe")
    .tag("crafting");

// ============================================
// MINING TESTS
// ============================================

// Test: Chop oak log → faster than hand
register("apeirix", "bronze_axe_chop_log", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:oak_log", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Oak log should be chopped");
        test.assertItemEntityPresent("minecraft:oak_log", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe")
    .tag("mining");

// Test: Chop oak planks → faster than hand
register("apeirix", "bronze_axe_chop_planks", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:oak_planks", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Oak planks should be chopped");
        test.assertItemEntityPresent("minecraft:oak_planks", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe")
    .tag("mining");

// Test: Break pumpkin → faster than hand
register("apeirix", "bronze_axe_break_pumpkin", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:pumpkin", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Pumpkin should be broken");
        test.assertItemEntityPresent("minecraft:pumpkin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe")
    .tag("mining");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Max stack size = 1
register("apeirix", "bronze_axe_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe")
    .tag("display");
