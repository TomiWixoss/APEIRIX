/**
 * Breaker Achievement
 */

import { Achievement } from "../../BaseAchievement";

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
}
