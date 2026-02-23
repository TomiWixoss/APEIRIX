/**
 * Welcome Achievement
 */

import { Achievement } from "../../BaseAchievement";

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
}
