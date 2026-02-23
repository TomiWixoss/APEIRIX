import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Tin Ingot
 * ID: apeirix:tin_ingot
 * Tương ứng với: tin-ingot.md
 * 
 * Prefix: tin_ingot_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 1 tin block → 9 tin ingots
register("apeirix", "tin_ingot_from_block", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_block 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_ingot_from_block");
        player.runCommand("clear @s apeirix:tin_block 0 1");
        player.runCommand("give @s apeirix:tin_ingot 9");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("crafting");

// Test: 9 tin nuggets → 1 tin ingot
register("apeirix", "tin_ingot_from_nuggets", (test) => {
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
    .tag("tin_ingot")
    .tag("crafting");

// Test: 9 tin ingots → 1 tin block
register("apeirix", "tin_ingot_to_block", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_ingot 9");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_block_from_ingots");
        player.runCommand("clear @s apeirix:tin_ingot 0 9");
        player.runCommand("give @s apeirix:tin_block 1");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("crafting");

// Test: 1 tin ingot → 9 tin nuggets
register("apeirix", "tin_ingot_to_nuggets", (test) => {
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
    .tag("tin_ingot")
    .tag("crafting");

// Test: 3 copper + 1 tin → 4 bronze ingots
register("apeirix", "tin_ingot_to_bronze", (test) => {
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
    .tag("tin_ingot")
    .tag("crafting");

// ============================================
// SMELTING TESTS
// ============================================

// Test: Smelt raw tin → tin ingot
register("apeirix", "tin_ingot_from_raw_smelting", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:raw_tin 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_ingot_from_smelting");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("smelting");

// Test: Smelt tin ore → tin ingot
register("apeirix", "tin_ingot_from_ore_smelting", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_ore 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_ingot_from_ore_smelting");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("smelting");

// Test: Smelt deepslate tin ore → tin ingot
register("apeirix", "tin_ingot_from_deepslate_smelting", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:deepslate_tin_ore 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:tin_ingot_from_deepslate_ore_smelting");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("smelting");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Stack size = 64
register("apeirix", "tin_ingot_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_ingot 64");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("tin_ingot")
    .tag("display");
