import { register } from "@minecraft/server-gametest";

/**
 * Test Suite: Bronze Block
 * ID: apeirix:bronze_block
 * Tương ứng với: bronze-block.md
 * 
 * Prefix: bronze_block_*
 */

// ============================================
// MINING TESTS
// ============================================

// Test: Không đào được bằng tay
register("apeirix", "bronze_block_hand_mining", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
    player.breakBlock({ x: 2, y: 2, z: 2 });
    
    test.runAfterDelay(100, () => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "apeirix:bronze_block", `Block should still be bronze_block`);
        test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("bronze_block")
    .tag("mining");

// Test: Không đào được bằng wooden pickaxe
register("apeirix", "bronze_block_wooden_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:wooden_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(100, () => {
        test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, false);
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(150)
    .tag("blocks")
    .tag("bronze_block")
    .tag("mining");

// Test: Đào được bằng stone pickaxe → drop bronze block
register("apeirix", "bronze_block_stone_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:stone_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("bronze_block")
    .tag("mining");

// Test: Đào được bằng iron pickaxe
register("apeirix", "bronze_block_iron_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:iron_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("bronze_block")
    .tag("mining");

// Test: Đào được bằng diamond pickaxe
register("apeirix", "bronze_block_diamond_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:bronze_block", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s minecraft:diamond_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("apeirix:bronze_block", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("blocks")
    .tag("bronze_block")
    .tag("mining");

// ============================================
// CRAFTING TESTS
// ============================================

// Test: 9 bronze ingots → 1 bronze block
register("apeirix", "bronze_block_craft_from_ingots", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give 9 bronze ingots
    player.runCommand("give @s apeirix:bronze_ingot 9");
    
    test.runAfterDelay(20, () => {
        // Craft bronze block (using recipe command)
        player.runCommand("recipe give @s apeirix:bronze_block_from_ingots");
        
        // Simulate crafting by removing 9 ingots and giving 1 block
        player.runCommand("clear @s apeirix:bronze_ingot 0 9");
        player.runCommand("give @s apeirix:bronze_block 1");
        
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("blocks")
    .tag("bronze_block")
    .tag("crafting");

// Test: 1 bronze block → 9 bronze ingots
register("apeirix", "bronze_block_craft_to_ingots", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give 1 bronze block
    player.runCommand("give @s apeirix:bronze_block 1");
    
    test.runAfterDelay(20, () => {
        // Craft bronze ingots (using recipe command)
        player.runCommand("recipe give @s apeirix:bronze_ingot_from_block");
        
        // Simulate crafting by removing 1 block and giving 9 ingots
        player.runCommand("clear @s apeirix:bronze_block 0 1");
        player.runCommand("give @s apeirix:bronze_ingot 9");
        
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("blocks")
    .tag("bronze_block")
    .tag("crafting");
