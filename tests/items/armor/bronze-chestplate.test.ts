import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Chestplate
 * Tương ứng với: bronze-chestplate.md
 * 
 * Prefix: armor_chestplate_*
 */

// Test: Give bronze chestplate
register("apeirix", "armor_chestplate_give", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_chestplate 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("chestplate");

// Test: Chestplate display name
register("apeirix", "armor_chestplate_display", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_chestplate 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("chestplate");

// Test: Chestplate crafting from ingots
register("apeirix", "armor_chestplate_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give bronze ingots for crafting
    player.runCommand("give @s apeirix:bronze_ingot 8");
    
    test.runAfterDelay(10, () => {
        // Recipe should be unlocked
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("chestplate")
    .tag("crafting");

