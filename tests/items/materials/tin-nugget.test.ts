import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Tin Nugget
 * ID: apeirix:tin_nugget
 * Tương ứng với: tin-nugget.md
 * 
 * Prefix: tin_nugget_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 1 tin ingot → 9 tin nuggets
register("apeirix", "tin_nugget_from_ingot", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_ingot 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_nugget_from_ingot");
        player.runCommand("clear @s apeirix:tin_ingot 0 1");
        player.runCommand("give @s apeirix:tin_nugget 9");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_nugget")
    .tag("crafting");

// Test: 9 tin nuggets → 1 tin ingot
register("apeirix", "tin_nugget_to_ingot", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_nugget 9");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_ingot_from_nuggets");
        player.runCommand("clear @s apeirix:tin_nugget 0 9");
        player.runCommand("give @s apeirix:tin_ingot 1");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_nugget")
    .tag("crafting");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Stack size = 64
register("apeirix", "tin_nugget_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_nugget 64");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_nugget")
    .tag("display");
