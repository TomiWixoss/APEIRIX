import { register } from "@minecraft/server-gametest";

/**
 * Test: Bronze Sword Weapon
 * ID: apeirix:bronze_sword
 * Tương ứng với: bronze-sword.md
 */

register("apeirix", "bronze_sword_item", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_sword 1");
    
    test.runAfterDelay(20, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            test.assert(item?.typeId === "apeirix:bronze_sword", `Item should be bronze_sword, got ${item?.typeId}`);
            test.succeed();
        } else {
            test.fail("Could not access player inventory");
        }
    });
})
    .structureName("apeirix:empty")
    .maxTicks(50)
    .tag("items")
    .tag("tools")
    .tag("bronze_sword");
