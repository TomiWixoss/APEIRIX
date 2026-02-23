import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Hoe Tool
 * ID: apeirix:bronze_hoe
 * Tương ứng với: bronze-hoe.md
 */

register("apeirix", "bronze_hoe_tillage", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("minecraft:dirt", { x: 2, y: 1, z: 2 });
    player.runCommand("give @s apeirix:bronze_hoe 1");
    
    test.runAfterDelay(10, () => {
        player.interactWithBlock({ x: 2, y: 1, z: 2 });
    });
    
    test.runAfterDelay(40, () => {
        const block = test.getBlock({ x: 2, y: 1, z: 2 });
        test.assert(
            block.typeId === "minecraft:farmland",
            `Block should be farmland, got ${block.typeId}`
        );
        test.succeed();
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("items")
    .tag("tools")
    .tag("bronze_hoe");
