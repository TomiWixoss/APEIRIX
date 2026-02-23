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
