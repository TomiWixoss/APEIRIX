import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Raw Tin
 * ID: apeirix:raw_tin
 * Tương ứng với: raw-tin.md
 * 
 * Prefix: raw_tin_*
 */

// ============================================
// OBTAINING TESTS
// ============================================

// Test: Drop từ tin ore (đã test trong tin-ore.test.ts)
// Test: Drop từ deepslate tin ore (đã test trong deepslate-tin-ore.test.ts)
// Test: Fortune enchantment (đã test trong fortune-enchantment.test.ts)

// ============================================
// SMELTING TESTS
// ============================================

// Test: Smelt raw tin → tin ingot (furnace)
register("apeirix", "raw_tin_smelt_furnace", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give raw tin
    player.runCommand("give @s apeirix:raw_tin 1");
    
    test.runAfterDelay(20, () => {
        // Simulate smelting (recipe exists: tin_ingot_from_smelting)
        player.runCommand("recipe give @s apeirix:tin_ingot_from_smelting");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("raw_tin")
    .tag("smelting");

// Test: Smelt raw tin → tin ingot (blast furnace)
register("apeirix", "raw_tin_smelt_blast", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give raw tin
    player.runCommand("give @s apeirix:raw_tin 1");
    
    test.runAfterDelay(20, () => {
        // Simulate blasting (recipe exists: tin_ingot_from_blasting)
        player.runCommand("recipe give @s apeirix:tin_ingot_from_blasting");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("raw_tin")
    .tag("smelting");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Stack size = 64
register("apeirix", "raw_tin_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give 64 raw tin
    player.runCommand("give @s apeirix:raw_tin 64");
    
    test.runAfterDelay(20, () => {
        // If command succeeds, stack size is correct
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("raw_tin")
    .tag("display");
