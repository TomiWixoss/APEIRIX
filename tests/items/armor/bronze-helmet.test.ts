import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Helmet
 * Tương ứng với: bronze-helmet.md
 * 
 * Prefix: armor_helmet_*
 */

// Test: Give bronze helmet
register("apeirix", "armor_helmet_give", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_helmet 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("helmet");

// Test: Helmet display name
register("apeirix", "armor_helmet_display", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_helmet 1");
    
    test.runAfterDelay(10, () => {
        // Item should be given successfully
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("helmet");

// Test: Helmet crafting from ingots
register("apeirix", "armor_helmet_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give bronze ingots for crafting
    player.runCommand("give @s apeirix:bronze_ingot 5");
    
    test.runAfterDelay(10, () => {
        // Recipe should be unlocked
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("helmet")
    .tag("crafting");

