import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Nugget
 * ID: apeirix:bronze_nugget
 * Tương ứng với: bronze-nugget.md
 * 
 * Prefix: bronze_nugget_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 1 bronze ingot → 9 bronze nuggets
register("apeirix", "bronze_nugget_from_ingot", (test) => {
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
    .tag("bronze_nugget")
    .tag("crafting");

// Test: 9 bronze nuggets → 1 bronze ingot
register("apeirix", "bronze_nugget_to_ingot", (test) => {
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
    .tag("bronze_nugget")
    .tag("crafting");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Stack size = 64
register("apeirix", "bronze_nugget_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_nugget 64");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_nugget")
    .tag("display");
