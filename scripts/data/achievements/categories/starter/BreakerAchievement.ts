/**
 * Breaker Achievement - Track block breaking
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class BreakerAchievement extends Achievement {
    id = "breaker";
    requirement = 10;
    category = "starter";
    icon = "textures/items/iron_pickaxe";
    rewards = [
        {
            item: "minecraft:coal",
            amount: 16,
            icon: "textures/items/coal",
            name: "Than Đá"
        }
    ];

    /**
     * Track block breaking events
     */
    setupTracking(): void {
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            AchievementSystem.incrementProgress(event.player, this.id, 1);
        });
    }
}
