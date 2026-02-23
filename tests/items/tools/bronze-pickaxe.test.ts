import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Pickaxe Tool
 * ID: apeirix:bronze_pickaxe
 * Tương ứng với: bronze-pickaxe.md
 */

register("apeirix", "bronze_pickaxe_mining", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:stone", { x: 2, y: 2, z: 2 });
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        test.assertItemEntityPresent("minecraft:cobblestone", { x: 2, y: 2, z: 2 }, 3, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("items")
    .tag("tools")
    .tag("bronze_pickaxe");
