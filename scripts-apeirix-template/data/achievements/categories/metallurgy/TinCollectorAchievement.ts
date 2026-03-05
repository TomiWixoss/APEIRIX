/**
 * Tin Collector Achievement - Collect 64 tin ore
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class TinCollectorAchievement extends Achievement {
    id = "tin_collector";
    requirement = 64;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/raw_tin";
    rewards = [
        {
            item: "minecraft:coal",
            amount: 32,
            icon: "textures/items/coal",
            name: "Coal"
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
