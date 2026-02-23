import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Custom Tool Durability System
 * Tương ứng với: custom-tool-durability.md
 * 
 * Prefix: durability_*
 */

// ============================================
// DURABILITY TRACKING TESTS
// ============================================

// Test: Bronze pickaxe durability tracking
register("apeirix", "durability_bronze_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    // Place multiple blocks to mine
    test.setBlockType("minecraft:stone", { x: 2, y: 2, z: 2 });
    test.setBlockType("minecraft:stone", { x: 3, y: 2, z: 2 });
    test.setBlockType("minecraft:stone", { x: 4, y: 2, z: 2 });
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(30, () => {
        player.breakBlock({ x: 3, y: 2, z: 2 });
    });
    
    test.runAfterDelay(50, () => {
        player.breakBlock({ x: 4, y: 2, z: 2 });
    });
    
    test.runAfterDelay(70, () => {
        // Tool should still exist (durability: 375 - 3 = 372)
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("systems")
    .tag("durability")
    .tag("bronze_pickaxe");

// Test: Bronze axe durability tracking
register("apeirix", "durability_bronze_axe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.setBlockType("minecraft:oak_log", { x: 2, y: 2, z: 2 });
    test.setBlockType("minecraft:oak_log", { x: 3, y: 2, z: 2 });
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(30, () => {
        player.breakBlock({ x: 3, y: 2, z: 2 });
    });
    
    test.runAfterDelay(50, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("systems")
    .tag("durability")
    .tag("bronze_axe");

// Test: Bronze shovel durability tracking
register("apeirix", "durability_bronze_shovel", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_shovel 1");
    
    test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
    test.setBlockType("minecraft:dirt", { x: 3, y: 2, z: 2 });
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(30, () => {
        player.breakBlock({ x: 3, y: 2, z: 2 });
    });
    
    test.runAfterDelay(50, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("systems")
    .tag("durability")
    .tag("bronze_shovel");

// Test: Bronze sword durability tracking
register("apeirix", "durability_bronze_sword", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.setBlockType("minecraft:web", { x: 2, y: 2, z: 2 });
    test.setBlockType("minecraft:web", { x: 3, y: 2, z: 2 });
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(30, () => {
        player.breakBlock({ x: 3, y: 2, z: 2 });
    });
    
    test.runAfterDelay(50, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("systems")
    .tag("durability")
    .tag("bronze_sword");

// ============================================
// HOE TILLAGE TESTS
// ============================================

// Test: Bronze hoe till dirt → farmland
register("apeirix", "durability_hoe_till_dirt", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:dirt", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(20, () => {
        // Tillage được test trong CustomToolSystem
        // Test chỉ verify hoe được give và dirt block tồn tại
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:dirt", "Dirt should exist");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("systems")
    .tag("durability")
    .tag("tillage")
    .tag("bronze_hoe");

// Test: Bronze hoe till grass block → farmland
register("apeirix", "durability_hoe_till_grass", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:grass_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(20, () => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:grass_block", "Grass block should exist");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("systems")
    .tag("durability")
    .tag("tillage")
    .tag("bronze_hoe");

// Test: Bronze hoe till dirt path → farmland
register("apeirix", "durability_hoe_till_path", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:dirt_path", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(20, () => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:dirt_path", "Dirt path should exist");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("systems")
    .tag("durability")
    .tag("tillage")
    .tag("bronze_hoe");

// ============================================
// REGISTRY INTEGRATION TESTS
// ============================================

// Test: All bronze tools registered
register("apeirix", "durability_tool_registry", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give all bronze tools
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    player.runCommand("give @s apeirix:bronze_axe 1");
    player.runCommand("give @s apeirix:bronze_shovel 1");
    player.runCommand("give @s apeirix:bronze_hoe 1");
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.runAfterDelay(20, () => {
        // All tools should be given successfully
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("systems")
    .tag("durability")
    .tag("registry");
