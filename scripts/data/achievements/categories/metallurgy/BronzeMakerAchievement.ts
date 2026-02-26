/**
 * Bronze Maker Achievement - Create first bronze ingot
 */

import { Achievement } from "../../BaseAchievement";
import { world, ItemStack } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class BronzeMakerAchievement extends Achievement {
    id = "bronze_maker";
    requirement = 1;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_ingot";
    rewards = [
        {
            item: "apeirix:bronze_ingot",
            amount: 4,
            icon: "textures/items/bronze_ingot",
            name: "Bronze Ingot"
        }
    ];

    setupTracking(): void {
        // Track when player gets bronze ingot in inventory
        world.afterEvents.itemCompleteUse.subscribe((event) => {
            const player = event.source;
            const inventory = player.getComponent("inventory");
            if (!inventory) return;

            // Check if player has bronze ingot
            for (let i = 0; i < inventory.container!.size; i++) {
                const item = inventory.container!.getItem(i);
                if (item && item.typeId === "apeirix:bronze_ingot") {
                    AchievementSystem.setProgress(player, this.id, 1);
                    break;
                }
            }
        });
    }
}
