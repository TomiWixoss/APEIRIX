/**
 * Recycler Achievement - Wash 50 dirty cans
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class RecyclerAchievement extends Achievement {
    id = "recycler";
    requirement = 50;
    category = "food";
    icon = "textures/items/candirty";
    rewards = [
        {
            item: "minecraft:emerald",
            amount: 5,
            icon: "textures/items/emerald",
            name: "Emerald"
        }
    ];

    setupTracking(): void {
        // Track when player washes dirty cans
        // This is tracked by CanWashingSystem
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const player = event.player;
            const block = event.block;
            
            // Check if player is near water
            if (block.typeId.includes("water") || block.typeId === "minecraft:cauldron") {
                const inventory = player.getComponent("inventory");
                if (!inventory?.container) return;
                
                // Check if player has dirty can
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item?.typeId === "apeirix:candirty") {
                        // Increment progress (actual washing is handled by CanWashingSystem)
                        const current = AchievementSystem.getProgress(player, this.id);
                        AchievementSystem.setProgress(player, this.id, current + 1);
                        break;
                    }
                }
            }
        });
    }
}
