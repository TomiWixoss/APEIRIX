/**
 * First Can Achievement - Craft your first empty can
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
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
        // Periodic check for empty can in inventory
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                if (AchievementSystem.hasAchievement(player, this.id)) continue;
                
                const inventory = player.getComponent("inventory");
                if (!inventory?.container) continue;
                
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item?.typeId === "apeirix:canempty") {
                        AchievementSystem.setProgress(player, this.id, 1);
                        break;
                    }
                }
            }
        }, 100); // Check every 5 seconds
    }
}
