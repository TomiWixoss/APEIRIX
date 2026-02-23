import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Deepslate Tin Ore Block
 * ID: apeirix:deepslate_tin_ore
 * Tương ứng với: deepslate-tin-ore.md
 * 
 * Prefix: deepslate_tin_ore_*
 */

// ============================================
// 2. MINING TESTS
// ============================================

// Test: Yêu cầu stone pickaxe trở lên
register("apeirix", "deepslate_tin_ore_hand_mining", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    player.breakBlock({ x: 2, y: 2, z: 2 });
    
    test.runAfterDelay(100, () => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "apeirix:deepslate_tin_ore", `Block should still be deepslate_tin_ore`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("mining");

// Test: Không đào được bằng wooden pickaxe
register("apeirix", "deepslate_tin_ore_wooden_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:wooden_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(100, () => {
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("mining");

// Test: Đào được bằng stone pickaxe → drop raw tin
register("apeirix", "deepslate_tin_ore_stone_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:stone_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("mining");

// Test: Đào được bằng iron pickaxe
register("apeirix", "deepslate_tin_ore_iron_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:iron_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("mining");

// Test: Đào được bằng diamond pickaxe
register("apeirix", "deepslate_tin_ore_diamond_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:diamond_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("mining");

// ============================================
// 3. ENCHANTMENT TESTS
// ============================================

// Test: Silk Touch → drop deepslate tin ore block
register("apeirix", "deepslate_tin_ore_silk_touch", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s silk_touch 1");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("enchantment");

// Test: Fortune I → drop 1-2 raw tin
register("apeirix", "deepslate_tin_ore_fortune_1", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    
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
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("enchantment")
    .tag("fortune");

// Test: Fortune II → drop 1-3 raw tin
register("apeirix", "deepslate_tin_ore_fortune_2", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:deepslate_tin_ore", { x: 2, y: 2, z: 2 });
    
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
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("enchantment")
    .tag("fortune");

// Test: Fortune III → drop 1-4 raw tin
register("apeirix", "deepslate_tin_ore_fortune_3", (test) => {
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
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("deepslate_tin_ore")
    .tag("enchantment")
    .tag("fortune");
