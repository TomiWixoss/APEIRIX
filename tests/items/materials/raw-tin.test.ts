import { register } from "@minecraft/server-gametest";

/**
 * Test: Raw Tin Item
 * ID: apeirix:raw_tin
 * Tương ứng với: raw-tin.md
 */

register("apeirix", "raw_tin_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    // Give item
    player.runCommand("give @s apeirix:raw_tin 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:raw_tin", `Item should be raw_tin, got ${item?.typeId}`);
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
    .tag("raw_tin");
