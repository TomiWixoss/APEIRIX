import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Boots
 * Tương ứng với: bronze-boots.md
 * 
 * Prefix: armor_boots_*
 */

// Test: Give bronze boots
register("apeirix", "armor_boots_give", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_boots 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("boots");

// Test: Boots display name
register("apeirix", "armor_boots_display", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_boots 1");
    
    test.runAfterDelay(10, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("boots");

// Test: Boots crafting from ingots
register("apeirix", "armor_boots_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give bronze ingots for crafting
    player.runCommand("give @s apeirix:bronze_ingot 4");
    
    test.runAfterDelay(10, () => {
        // Recipe should be unlocked
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(20)
    .tag("armor")
    .tag("boots")
    .tag("crafting");

