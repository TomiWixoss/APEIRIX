import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Ingot Item
 * ID: apeirix:bronze_ingot
 * Tương ứng với: bronze-ingot.md
 */

register("apeirix", "bronze_ingot_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_ingot 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:bronze_ingot", `Item should be bronze_ingot, got ${item?.typeId}`);
            test.succeed();
        } else {
            test.fail("Could not access player inventory");
        }
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("materials")
    .tag("bronze_ingot");
