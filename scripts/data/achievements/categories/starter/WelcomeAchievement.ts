/**
 * Welcome Achievement
 */

import { Achievement } from "../../BaseAchievement";
import { Player } from "@minecraft/server";

export class WelcomeAchievement extends Achievement {
    id = "welcome";
    requirement = 1;
    category = "starter";
    icon = "textures/items/book_writable";
    rewards = [
        {
            item: "minecraft:diamond",
            amount: 1,
            icon: "textures/items/diamond",
            name: "Kim Cương"
        }
    ];

    /**
     * Welcome achievement is auto-unlocked on first join
     * No tracking needed
     */
    setupTracking(): void {
        // Auto-unlocked by GameManager on first spawn
    }
}
