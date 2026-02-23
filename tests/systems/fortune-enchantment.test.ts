import { register } from "@minecraft/server-gametest";

/**
 * Test: Fortune Enchantment System
 * Tương ứng với: fortune-enchantment.md
 * 
 * Test Fortune enchantment trên custom ores
 */

register("apeirix", "fortune_system_tin_ore", (test) => {
    const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
    
    test.setBlockType("apeirix:tin_ore", { x: 2, y: 2, z: 2 });
    
    // Give pickaxe first, then enchant with Fortune III (Bedrock way)
    player.runCommand("give @s diamond_pickaxe 1");
    test.runAfterDelay(5, () => {
        player.runCommand("enchant @s fortune 3");
    });
    
    test.runAfterDelay(15, () => {
        player.breakBlock({ x: 2, y: 2, z: 2 });
    });
    
    test.succeedWhen(() => {
        const block = test.getBlock({ x: 2, y: 2, z: 2 });
        test.assert(block.typeId === "minecraft:air", `Block should be air, got ${block.typeId}`);
        // Fortune III có thể drop 1-4 items
        test.assertItemEntityPresent("apeirix:raw_tin", { x: 2, y: 2, z: 2 }, 5, true);
    });
})
    .structureName("apeirix:empty")
    .maxTicks(200)
    .tag("systems")
    .tag("fortune");
