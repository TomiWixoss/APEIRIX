/**
 * Bronze Age Complete Achievement - Complete all Phase 1 achievements
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";
import { EventBus } from "../../../../core/EventBus";

export class BronzeAgeCompleteAchievement extends Achievement {
    id = "bronze_age_complete";
    requirement = 1;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_ingot";
    rewards = [
        {
            item: "minecraft:diamond",
            amount: 5,
            icon: "textures/items/diamond",
            name: "Diamond"
        },
        {
            item: "minecraft:emerald",
            amount: 5,
            icon: "textures/items/emerald",
            name: "Emerald"
        }
    ];

    private readonly PHASE1_ACHIEVEMENTS = [
        "first_ore",
        "tin_collector",
        "bronze_maker",
        "alloy_master",
        "tool_crafter",
        "armor_smith",
        "crusher_user",
        "hammer_expert"
    ];

    setupTracking(): void {
        // Listen to achievement unlock events
        EventBus.on("achievement:unlocked", (player: any, achievementId: string) => {
            // Only check if it's a phase 1 achievement
            if (!this.PHASE1_ACHIEVEMENTS.includes(achievementId)) return;
            
            // Check if player already has this achievement
            if (AchievementSystem.hasAchievement(player, this.id)) return;

            // Check if all phase 1 achievements are completed
            const allCompleted = this.PHASE1_ACHIEVEMENTS.every(id =>
                AchievementSystem.hasAchievement(player, id)
            );

            if (allCompleted) {
                AchievementSystem.setProgress(player, this.id, 1);
            }
        });
    }
}
