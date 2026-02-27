/**
 * Crusher User Achievement - Use ore crusher for the first time
 */

import { Achievement } from "../../BaseAchievement";
import { EventBus } from "../../../../core/EventBus";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class CrusherUserAchievement extends Achievement {
    id = "crusher_user";
    requirement = 1;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/cobblestone_dust";
    rewards = [
        {
            item: "apeirix:cobblestone_dust",
            amount: 16,
            icon: "textures/items/cobblestone_dust",
            name: "Cobblestone Dust"
        }
    ];

    setupTracking(): void {
        EventBus.on("orecrusher:used", (player: any) => {
            AchievementSystem.incrementProgress(player, this.id, 1);
        });
    }
}
