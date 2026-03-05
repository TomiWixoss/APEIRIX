/**
 * First Mine Achievement - Mine your first block
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class FirstMineAchievement extends Achievement {
    id = "first_mine";
    requirement = 1;
    category = "starter";
    icon = "textures/items/cobblestone_dust";
    rewards = [
        {
            item: "minecraft:torch",
            amount: 16,
            icon: "textures/items/torch",
            name: "Torch"
        }
    ];

    setupTracking(): void {
        // Track when player breaks any block
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            AchievementSystem.setProgress(player, this.id, 1);
        });
    }
}
