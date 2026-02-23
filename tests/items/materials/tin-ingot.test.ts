import { register } from "@minecraft/server-gametest";

/**
 * Test: Tin Ingot Item
 * ID: apeirix:tin_ingot
 * Tương ứng với: tin-ingot.md
 */

register("apeirix", "tin_ingot_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:tin_ingot 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:tin_ingot", `Item should be tin_ingot, got ${item?.typeId}`);
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
    .tag("tin_ingot");
