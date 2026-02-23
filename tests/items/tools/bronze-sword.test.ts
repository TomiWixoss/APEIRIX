import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Sword
 * ID: apeirix:bronze_sword
 * Tương ứng với: bronze-sword.md
 * 
 * Prefix: bronze_sword_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: Craft bronze sword (2 ingots + 1 stick)
register("apeirix", "bronze_sword_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 2");
    player.runCommand("give @s minecraft:stick 1");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_sword");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_sword")
    .tag("crafting");

// ============================================
// MINING TESTS (Bonus)
// ============================================

// Test: Break cobweb → extremely fast (speed 15)
register("apeirix", "bronze_sword_break_cobweb", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:web", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Cobweb should be broken");
        test.assertItemEntityPresent("minecraft:string", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_sword")
    .tag("mining");

// Test: Break bamboo → fast (speed 6)
register("apeirix", "bronze_sword_break_bamboo", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:bamboo", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Bamboo should be broken");
        test.assertItemEntityPresent("minecraft:bamboo", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_sword")
    .tag("mining");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Max stack size = 1
register("apeirix", "bronze_sword_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_sword")
    .tag("display");
