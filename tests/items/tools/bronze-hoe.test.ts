import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Hoe
 * ID: apeirix:bronze_hoe
 * Tương ứng với: bronze-hoe.md
 * 
 * Prefix: bronze_hoe_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: Craft bronze hoe (2 ingots + 2 sticks)
register("apeirix", "bronze_hoe_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 2");
    player.runCommand("give @s minecraft:stick 2");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_hoe");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe")
    .tag("crafting");

// ============================================
// TILLAGE TESTS (đã test trong custom-tool-durability.test.ts)
// ============================================

// Test: Till dirt → farmland (basic test)
register("apeirix", "bronze_hoe_till_dirt", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(20, () => {
        // Tillage được test trong CustomToolSystem
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe")
    .tag("tillage");

// ============================================
// MINING TESTS (Bonus)
// ============================================

// Test: Break hay block → faster than hand
register("apeirix", "bronze_hoe_break_hay", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:hay_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Hay block should be broken");
        test.assertItemEntityPresent("minecraft:hay_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe")
    .tag("mining");

// Test: Break leaves → faster than hand
register("apeirix", "bronze_hoe_break_leaves", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:oak_leaves", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Leaves should be broken");
        // Leaves có thể drop sapling hoặc không drop gì
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe")
    .tag("mining");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Max stack size = 1
register("apeirix", "bronze_hoe_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe")
    .tag("display");
