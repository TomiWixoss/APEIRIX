import { register } from "@minecraft/server-gametest";

/**
 * Test: Tin Nugget Item
 * ID: apeirix:tin_nugget
 * Tương ứng với: tin-nugget.md
 */

register("apeirix", "tin_nugget_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_nugget 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:tin_nugget", `Item should be tin_nugget, got ${item?.typeId}`);
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
    .tag("tin_nugget");
