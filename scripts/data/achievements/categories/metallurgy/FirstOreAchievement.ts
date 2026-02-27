/**
 * First Ore Achievement - Mine first tin ore
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class FirstOreAchievement extends Achievement {
    id = "first_ore";
    requirement = 1;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/raw_tin";
    rewards = [
        {
            item: "apeirix:raw_tin",
            amount: 8,
            icon: "textures/items/raw_tin",
            name: "Raw Tin"
        }
    ];

    setupTracking(): void {
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            if (event.brokenBlockPermutation.type.id === "apeirix:tin_ore" ||
                event.brokenBlockPermutation.type.id === "apeirix:deepslate_tin_ore") {
                AchievementSystem.incrementProgress(event.player, this.id, 1);
            }
        });
    }
}
