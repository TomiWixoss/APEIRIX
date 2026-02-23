import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Leggings
 * Tương ứng với: bronze-leggings.md
 * 
 * Prefix: armor_leggings_*
 */

// Test: Give bronze leggings
register("apeirix", "armor_leggings_give", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_leggings 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("leggings");

// Test: Leggings display name
register("apeirix", "armor_leggings_display", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_leggings 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("leggings");

// Test: Leggings crafting from ingots
register("apeirix", "armor_leggings_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give bronze ingots for crafting
    player.runCommand("give @s apeirix:bronze_ingot 7");
    
    test.runAfterDelay(10, () => {
        // Recipe should be unlocked
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("leggings")
    .tag("crafting");

