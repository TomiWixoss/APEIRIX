import { register } from "@minecraft/server-gametest";

/**
 * Test: Tin Block
 * ID: apeirix:tin_block
 * Tương ứng với: tin-block.md
 */

register("apeirix", "tin_block_mining", (test) => {
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
    .tag("tin_block");
