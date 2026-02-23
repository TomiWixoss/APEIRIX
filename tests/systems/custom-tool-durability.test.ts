import { register } from "@minecraft/server-gametest";

/**
 * Test: Custom Tool Durability System
 * Tương ứng với: custom-tool-durability.md
 * 
 * Test durability tracking cho custom tools
 */

register("apeirix", "tool_durability_bronze_pickaxe", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    player.runCommand("give @s apeirix:bronze_pickaxe 1");
    
    // Place multiple blocks to mine
    test.setBlockType("minecraft:stone", { x: 2, y: 2, z: 2 });
    test.setBlockType("minecraft:stone", { x: 3, y: 2, z: 2 });
    test.setBlockType("minecraft:stone", { x: 4, y: 2, z: 2 });
    
    test.runAfterDelay(10, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.runAfterDelay(30, () => {
        player.breakBlock({ x: 3, y: 2, z: 2 });
    });
    
    test.runAfterDelay(50, () => {
        player.breakBlock({ x: 4, y: 2, z: 2 });
    });
    
    test.runAfterDelay(70, () => {
        const inventory = player.getComponent("inventory");
        const container = inventory?.container;
        
        if (container) {
            const item = container.getItem(0);
            // Tool should still exist (not broken yet)
            test.assert(item?.typeId === "apeirix:bronze_pickaxe", "Tool should still exist");
            test.succeed();
        } else {
            test.fail("Could not access player inventory");
        }
    });
})
    .structureName("apeirix:empty")
    .maxTicks(100)
    .tag("systems")
    .tag("durability");
