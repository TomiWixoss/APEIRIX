import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Axe Tool
 * ID: apeirix:bronze_axe
 * Tương ứng với: bronze-axe.md
 */

register("apeirix", "bronze_axe_chopping", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:oak_log", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_axe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("minecraft:oak_log", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_axe");
