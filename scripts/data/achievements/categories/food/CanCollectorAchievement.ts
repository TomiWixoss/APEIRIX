/**
 * Can Collector Achievement - Collect 10 different canned foods
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class CanCollectorAchievement extends Achievement {
    id = "can_collector";
    requirement = 10;
    category = "food";
    icon = "textures/items/canned_food";
    rewards = [
        {
            item: "apeirix:canempty",
            amount: 16,
            icon: "textures/items/canempty",
            name: "Empty Can"
        }
    ];

    private readonly CANNED_FOODS = [
        "apeirix:canned_food",
        "apeirix:canned_pumpkin",
        "apeirix:cannedbeets",
        "apeirix:cannedbread",
        "apeirix:cannedcarrots",
        "apeirix:canneddogfood",
        "apeirix:cannedfish",
        "apeirix:cannedmeal",
        "apeirix:cannedmushroomsoup",
        "apeirix:cannedsalad",
        "apeirix:luncheonmeat",
        "apeirix:fruit_salad",
        "apeirix:chickensoup",
        "apeirix:cookies"
    ];

    setupTracking(): void {
        // Periodic check for different canned foods
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                if (AchievementSystem.hasAchievement(player, this.id)) continue;
                
                const foundFoods = new Set<string>();
                const inventory = player.getComponent("inventory");
                if (!inventory?.container) continue;
                
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item && this.CANNED_FOODS.includes(item.typeId)) {
                        foundFoods.add(item.typeId);
                    }
                }
                
                if (foundFoods.size > 0) {
                    AchievementSystem.setProgress(player, this.id, foundFoods.size);
                }
            }
        }, 100); // Check every 5 seconds
    }
}
