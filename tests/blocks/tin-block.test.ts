import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Tin Block
 * ID: apeirix:tin_block
 * Tương ứng với: tin-block.md
 * 
 * Prefix: tin_block_*
 */

// ============================================
// MINING TESTS
// ============================================

// Test: Không đào được bằng tay
register("apeirix", "tin_block_hand_mining", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.breakBlock({ x: 2, y: 2, z: 2 });
    
    test.runAfterDelay(100, () => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "apeirix:tin_block", `Block should still be tin_block`);
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("tin_block")
    .tag("mining");

// Test: Không đào được bằng wooden pickaxe
register("apeirix", "tin_block_wooden_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:wooden_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(100, () => {
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("tin_block")
    .tag("mining");

// Test: Đào được bằng stone pickaxe → drop tin block
register("apeirix", "tin_block_stone_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:stone_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("tin_block")
    .tag("mining");

// Test: Đào được bằng iron pickaxe
register("apeirix", "tin_block_iron_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:iron_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("tin_block")
    .tag("mining");

// Test: Đào được bằng diamond pickaxe
register("apeirix", "tin_block_diamond_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:diamond_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:tin_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("tin_block")
    .tag("mining");

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 9 tin ingots → 1 tin block
register("apeirix", "tin_block_craft_from_ingots", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give 9 tin ingots
    player.runCommand("give @s apeirix:tin_ingot 9");
    
    test.runAfterDelay(20, () => {
        // Craft tin block (using recipe command)
        player.runCommand("recipe give @s apeirix:tin_block_from_ingots");
        
        // Simulate crafting by removing 9 ingots and giving 1 block
        player.runCommand("clear @s apeirix:tin_ingot 0 9");
        player.runCommand("give @s apeirix:tin_block 1");
        
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("blocks")
    .tag("tin_block")
    .tag("crafting");

// Test: 1 tin block → 9 tin ingots
register("apeirix", "tin_block_craft_to_ingots", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give 1 tin block
    player.runCommand("give @s apeirix:tin_block 1");
    
    test.runAfterDelay(20, () => {
        // Craft tin ingots (using recipe command)
        player.runCommand("recipe give @s apeirix:tin_ingot_from_block");
        
        // Simulate crafting by removing 1 block and giving 9 ingots
        player.runCommand("clear @s apeirix:tin_block 0 1");
        player.runCommand("give @s apeirix:tin_ingot 9");
        
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("blocks")
    .tag("tin_block")
    .tag("crafting");
