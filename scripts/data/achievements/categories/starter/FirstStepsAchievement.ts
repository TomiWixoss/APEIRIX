/**
 * First Steps Achievement - Track player movement
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class FirstStepsAchievement extends Achievement {
    id = "first_steps";
    requirement = 100;
    category = "starter";
    icon = "textures/items/leather_boots";
    rewards = [
        {
            item: "minecraft:iron_ingot",
            amount: 5,
            icon: "textures/items/iron_ingot",
            name: "Thỏi Sắt"
        }
    ];

    /**
     * Track player movement every second
     */
    setupTracking(): void {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                // Skip if already unlocked
                if (AchievementSystem.hasAchievement(player, this.id)) continue;

                const velocity = player.getVelocity();
                const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

                if (speed > 0.01) {
                    AchievementSystem.incrementProgress(player, this.id, speed);
                }
            }
        }, 20);
    }
}
