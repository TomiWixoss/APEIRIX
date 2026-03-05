/**
 * First Can Achievement - Craft your first empty can
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class FirstCanAchievement extends Achievement {
    id = "first_can";
    requirement = 1;
    category = "food";
    icon = "textures/items/canempty";
    rewards = [
        {
            item: "apeirix:tin_ingot",
            amount: 8,
            icon: "textures/items/tin_ingot",
            name: "Tin Ingot"
        }
    ];

    setupTracking(): void {
        // Event-driven: Check when inventory changes
        world.afterEvents.playerInventoryItemChange.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Only check if the changed item is empty can
            const changedItem = event.itemStack;
            if (!changedItem || changedItem.typeId !== "apeirix:canempty") return;
            
            // Achievement unlocked!
            AchievementSystem.setProgress(player, this.id, 1);
        });
    }
}
