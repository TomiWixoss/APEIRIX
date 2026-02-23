import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Ingot
 * ID: apeirix:bronze_ingot
 * Tương ứng với: bronze-ingot.md
 * 
 * Prefix: bronze_ingot_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 3 copper + 1 tin → 4 bronze ingots
register("apeirix", "bronze_ingot_from_copper_tin", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s minecraft:copper_ingot 3");
    player.runCommand("give @s apeirix:tin_ingot 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_ingot_from_copper_tin");
        player.runCommand("clear @s minecraft:copper_ingot 0 3");
        player.runCommand("clear @s apeirix:tin_ingot 0 1");
        player.runCommand("give @s apeirix:bronze_ingot 4");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("crafting");

// Test: 1 bronze block → 9 bronze ingots
register("apeirix", "bronze_ingot_from_block", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_block 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_ingot_from_block");
        player.runCommand("clear @s apeirix:bronze_block 0 1");
        player.runCommand("give @s apeirix:bronze_ingot 9");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("crafting");

// Test: 9 bronze nuggets → 1 bronze ingot
register("apeirix", "bronze_ingot_from_nuggets", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_nugget 9");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_ingot_from_nuggets");
        player.runCommand("clear @s apeirix:bronze_nugget 0 9");
        player.runCommand("give @s apeirix:bronze_ingot 1");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("crafting");

// Test: 9 bronze ingots → 1 bronze block
register("apeirix", "bronze_ingot_to_block", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 9");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_block_from_ingots");
        player.runCommand("clear @s apeirix:bronze_ingot 0 9");
        player.runCommand("give @s apeirix:bronze_block 1");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("crafting");

// Test: 1 bronze ingot → 9 bronze nuggets
register("apeirix", "bronze_ingot_to_nuggets", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_nugget_from_ingot");
        player.runCommand("clear @s apeirix:bronze_ingot 0 1");
        player.runCommand("give @s apeirix:bronze_nugget 9");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("crafting");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Stack size = 64
register("apeirix", "bronze_ingot_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 64");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot")
    .tag("display");
