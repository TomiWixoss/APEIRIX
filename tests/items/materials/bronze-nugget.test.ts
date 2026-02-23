import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Nugget Item
 * ID: apeirix:bronze_nugget
 * Tương ứng với: bronze-nugget.md
 */

register("apeirix", "bronze_nugget_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_nugget 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:bronze_nugget", `Item should be bronze_nugget, got ${item?.typeId}`);
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
    .tag("bronze_nugget");
