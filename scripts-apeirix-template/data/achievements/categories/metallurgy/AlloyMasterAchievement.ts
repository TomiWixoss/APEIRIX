/**
 * Alloy Master Achievement - Create 32 bronze ingots
 * 
 * OPTIMIZED: Track qua crafting event thay vì scan item entities
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class AlloyMasterAchievement extends Achievement {
    id = "alloy_master";
    requirement = 32;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_ingot";
    rewards = [
        {
            item: "minecraft:diamond",
            amount: 2,
            icon: "textures/items/diamond",
            name: "Diamond"
        }
    ];

    setupTracking(): void {
        // Track khi player sử dụng alloy mixing table (craft bronze)
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const block = event.block;
            if (block.typeId !== "apeirix:alloy_mixing_table") return;
            
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Count bronze ingots in inventory
            const inventory = player.getComponent("inventory");
            if (!inventory?.container) return;
            
            let totalBronze = 0;
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                if (item?.typeId === "apeirix:bronze_ingot") {
                    totalBronze += item.amount;
                }
            }
            
            if (totalBronze > 0) {
                AchievementSystem.setProgress(player, this.id, totalBronze);
            }
        });
    }
}
