/**
 * First Steps Achievement
 */

import { Achievement } from "../../BaseAchievement";

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
}
