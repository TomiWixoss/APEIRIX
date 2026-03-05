/**
 * Can Collector Achievement - Collect 10 different canned foods
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
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
        // Event-driven: Check when inventory changes
        world.afterEvents.playerInventoryItemChange.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Only check if the changed item is a canned food
            const changedItem = event.itemStack;
            if (!changedItem || !this.CANNED_FOODS.includes(changedItem.typeId)) return;
            
            // Scan inventory for all canned foods
            const foundFoods = new Set<string>();
            const inventory = player.getComponent("inventory");
            if (!inventory?.container) return;
            
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                if (item && this.CANNED_FOODS.includes(item.typeId)) {
                    foundFoods.add(item.typeId);
                }
            }
            
            if (foundFoods.size > 0) {
                AchievementSystem.setProgress(player, this.id, foundFoods.size);
            }
        });
    }
}
