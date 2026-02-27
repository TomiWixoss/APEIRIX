/**
 * Dust Collector Achievement - Collect 100 pure dusts
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class DustCollectorAchievement extends Achievement {
    id = "dust_collector";
    requirement = 100;
    category = "processing";
    icon = "textures/items/iron_ingot_dust_pure";
    rewards = [
        {
            item: "minecraft:iron_ingot",
            amount: 32,
            icon: "textures/items/iron_ingot",
            name: "Iron Ingot"
        }
    ];

    setupTracking(): void {
        // Periodic check for pure dusts in inventory
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                if (AchievementSystem.hasAchievement(player, this.id)) continue;
                
                let totalPureDusts = 0;
                const inventory = player.getComponent("inventory");
                if (!inventory?.container) continue;
                
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item?.typeId.includes("_pure")) {
                        totalPureDusts += item.amount;
                    }
                }
                
                if (totalPureDusts > 0) {
                    AchievementSystem.setProgress(player, this.id, totalPureDusts);
                }
            }
        }, 100); // Check every 5 seconds
    }
}
