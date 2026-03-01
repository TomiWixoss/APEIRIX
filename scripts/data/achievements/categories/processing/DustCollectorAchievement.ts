/**
 * Dust Collector Achievement - Collect 100 pure dusts
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
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
        // Event-driven: Check when inventory changes
        world.afterEvents.playerInventoryItemChange.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Only check if the changed item is a pure dust
            const changedItem = event.itemStack;
            if (!changedItem || !changedItem.typeId.includes("_pure")) return;
            
            // Count all pure dusts in inventory
            let totalPureDusts = 0;
            const inventory = player.getComponent("inventory");
            if (!inventory?.container) return;
            
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                if (item?.typeId.includes("_pure")) {
                    totalPureDusts += item.amount;
                }
            }
            
            if (totalPureDusts > 0) {
                AchievementSystem.setProgress(player, this.id, totalPureDusts);
            }
        });
    }
}
