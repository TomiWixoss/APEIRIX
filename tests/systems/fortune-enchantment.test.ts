import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Fortune Enchantment System
 * Tương ứng với: fortune-enchantment.md
 * 
 * Prefix: fortune_*
 */

// ============================================
// FORTUNE LEVEL TESTS
// ============================================

// Test: Fortune III với tin ore (diamond pickaxe)
register("apeirix", "fortune_system_tin_ore", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    // Give pickaxe first, then enchant with Fortune III (Bedrock way)
    player.runCommand("give @s diamond_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.runCommand("enchant @s fortune 3");
    });
    
    test.runAfterDelay(20, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        // Fortune III có thể drop 1-4 items
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 5, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("tin_ore");

// Test: Fortune III với deepslate tin ore
register("apeirix", "fortune_system_deepslate", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s fortune 3");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 5, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("deepslate_tin_ore");

// Test: Fortune I với tin ore
register("apeirix", "fortune_system_level_1", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s fortune 1");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        // Fortune I: 1-2 drops
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("tin_ore");

// Test: Fortune II với tin ore
register("apeirix", "fortune_system_level_2", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s fortune 2");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        // Fortune II: 1-3 drops
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 4, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("tin_ore");

// ============================================
// TOOL COMPATIBILITY TESTS
// ============================================

// Test: Fortune với bronze pickaxe
register("apeirix", "fortune_bronze_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s fortune 3");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 5, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("bronze_pickaxe");

// Test: Fortune với iron pickaxe
register("apeirix", "fortune_iron_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s iron_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.runCommand("enchant @s fortune 3");
    });
    
    test.runAfterDelay(20, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 5, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("iron_pickaxe");

// ============================================
// SILK TOUCH PRIORITY TESTS
// ============================================

// Test: Silk Touch override Fortune
register("apeirix", "fortune_silk_touch_priority", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        // Silk Touch should override Fortune
        player.runCommand("enchant @s silk_touch 1");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        // Should drop ore block, not raw tin
        test.assertItemEntityPresent("apeirix:tin_ore", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune")
    .tag("silk_touch");

// ============================================
// REGISTRY INTEGRATION TESTS
// ============================================

// Test: OreRegistry integration
register("apeirix", "fortune_ore_registry", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Test both ores are registered
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 3, y: 2, z: 2 });
    
    test.runAfterDelay(20, () => {
        // Both blocks should exist
        const block1 = test.getBlock({ x: 2, y: 2, z: 2 });
        const block2 = test.getBlock({ x: 3, y: 2, z: 2 });
        test.assert(block1.typeId === "apeirix:tin_ore", "Tin ore should exist");
        test.assert(block2.typeId === "apeirix:deepslate_tin_ore", "Deepslate tin ore should exist");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("systems")
    .tag("fortune")
    .tag("registry");
