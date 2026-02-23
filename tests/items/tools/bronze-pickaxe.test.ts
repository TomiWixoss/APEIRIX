import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Pickaxe
 * ID: apeirix:bronze_pickaxe
 * Tương ứng với: bronze-pickaxe.md
 * 
 * Prefix: bronze_pickaxe_*
 */

// ============================================
// CRAFTING TESTS
// ============================================

// Test: Craft bronze pickaxe (3 ingots + 2 sticks)
register("apeirix", "bronze_pickaxe_craft", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 3");
    player.runCommand("give @s minecraft:stick 2");
    
    test.runAfterDelay(20, () => {
        player.runCommand("recipe give @s apeirix:bronze_pickaxe");
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("crafting");

// ============================================
// MINING TESTS
// ============================================

// Test: Mine stone → faster than hand
register("apeirix", "bronze_pickaxe_mine_stone", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:stone", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Stone should be mined");
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("mining");

// Test: Mine iron ore → drop raw iron
register("apeirix", "bronze_pickaxe_mine_iron_ore", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:iron_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Iron ore should be mined");
        test.assertItemEntityPresent("minecraft:raw_iron", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("mining");

// Test: Mine tin ore → drop raw tin
register("apeirix", "bronze_pickaxe_mine_tin_ore", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Tin ore should be mined");
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("mining");

// Test: Mine tin block → drop tin block
register("apeirix", "bronze_pickaxe_mine_tin_block", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Tin block should be mined");
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("mining");

// ============================================
// ENCHANTMENT TESTS
// ============================================

// Test: Fortune I với tin ore
register("apeirix", "bronze_pickaxe_fortune_1", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    player.runCommand("enchant @s fortune 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Tin ore should be mined");
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("enchantment");

// Test: Silk Touch với tin ore → drop ore block
register("apeirix", "bronze_pickaxe_silk_touch", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    player.runCommand("enchant @s silk_touch 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", "Tin ore should be mined");
        test.assertItemEntityPresent("apeirix:tin_ore", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("enchantment");

// ============================================
// DISPLAY TESTS
// ============================================

// Test: Max stack size = 1
register("apeirix", "bronze_pickaxe_stack_size", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(20, () => {
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe")
    .tag("display");
