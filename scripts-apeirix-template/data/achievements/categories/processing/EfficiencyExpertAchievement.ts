/**
 * Efficiency Expert Achievement - Process 1000 items through machines
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class EfficiencyExpertAchievement extends Achievement {
    id = "efficiency_expert";
    requirement = 1000;
    category = "processing";
    icon = "textures/items/diamond_dust_pure";
    rewards = [
        {
            item: "minecraft:netherite_ingot",
            amount: 1,
            icon: "textures/items/netherite_ingot",
            name: "Netherite Ingot"
        }
    ];

    setupTracking(): void {
        // This would be tracked by processing systems
        // For now, we'll track machine interactions as a proxy
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const block = event.block;
            const player = event.player;
            
            // Check if it's a processing machine
            if (block.typeId.startsWith("apeirix:") && 
                (block.typeId.includes("crusher") || 
                 block.typeId.includes("sieve") || 
                 block.typeId.includes("washer") || 
                 block.typeId.includes("compressor"))) {
                
                const current = AchievementSystem.getProgress(player, this.id);
                AchievementSystem.setProgress(player, this.id, current + 1);
            }
        });
    }
}
