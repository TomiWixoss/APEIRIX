/**
 * Welcome Achievement - Join the world for the first time
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class WelcomeAchievement extends Achievement {
    id = "welcome";
    requirement = 1;
    category = "starter";
    icon = "textures/items/achievement_book";
    rewards = [
        {
            item: "minecraft:bread",
            amount: 16,
            icon: "textures/items/bread",
            name: "Bread"
        }
    ];

    setupTracking(): void {
        // Auto-complete when player spawns
        world.afterEvents.playerSpawn.subscribe((event) => {
            const player = event.player;
            if (!event.initialSpawn) return;
            
            // Give achievement on first spawn
            AchievementSystem.setProgress(player, this.id, 1);
        });
    }
}
