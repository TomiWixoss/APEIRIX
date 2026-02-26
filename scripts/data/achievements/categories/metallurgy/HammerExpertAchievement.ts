/**
 * Hammer Expert Achievement - Use hammer to mine 100 blocks
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";
import { HammerRegistry } from "../../../mining/HammerRegistry";

export class HammerExpertAchievement extends Achievement {
    id = "hammer_expert";
    requirement = 100;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_hammer";
    rewards = [
        {
            item: "apeirix:bronze_hammer",
            amount: 1,
            icon: "textures/items/bronze_hammer",
            name: "Bronze Hammer"
        }
    ];

    setupTracking(): void {
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            const itemStack = event.itemStackBeforeBreak;
            if (!itemStack) return;

            // Check if item is a hammer
            if (HammerRegistry.isHammer(itemStack.typeId)) {
                AchievementSystem.incrementProgress(event.player, this.id, 1);
            }
        });
    }
}
