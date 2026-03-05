/**
 * First Craft Achievement - Craft your first item
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class FirstCraftAchievement extends Achievement {
    id = "first_craft";
    requirement = 1;
    category = "starter";
    icon = "textures/items/tin_nugget";
    rewards = [
        {
            item: "minecraft:stick",
            amount: 32,
            icon: "textures/items/stick",
            name: "Stick"
        }
    ];

    setupTracking(): void {
        // Track when player crafts anything
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const block = event.block;
            if (block.typeId !== "minecraft:crafting_table") return;
            
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Check if player has any items (simple detection)
            const inventory = player.getComponent("inventory");
            if (inventory?.container && inventory.container.size > 0) {
                AchievementSystem.setProgress(player, this.id, 1);
            }
        });
    }
}
