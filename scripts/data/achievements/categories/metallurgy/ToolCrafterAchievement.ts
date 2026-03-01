/**
 * Tool Crafter Achievement - Craft complete bronze tool set
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class ToolCrafterAchievement extends Achievement {
    id = "tool_crafter";
    requirement = 5; // pickaxe, axe, shovel, hoe, sword
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_pickaxe";
    rewards = [
        {
            item: "minecraft:emerald",
            amount: 3,
            icon: "textures/items/emerald",
            name: "Emerald"
        }
    ];

    private readonly BRONZE_TOOLS = [
        "apeirix:bronze_pickaxe",
        "apeirix:bronze_axe",
        "apeirix:bronze_shovel",
        "apeirix:bronze_hoe",
        "apeirix:bronze_sword"
    ];

    setupTracking(): void {
        // Event-driven: Check when inventory changes
        world.afterEvents.playerInventoryItemChange.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Only check if the changed item is a bronze tool
            const changedItem = event.itemStack;
            if (!changedItem || !this.BRONZE_TOOLS.includes(changedItem.typeId)) return;
            
            // Count unique tools in inventory
            const inventory = player.getComponent("inventory");
            if (!inventory?.container) return;
            
            const foundTools = new Set<string>();
            for (let i = 0; i < inventory.container.size; i++) {
                const item = inventory.container.getItem(i);
                if (item && this.BRONZE_TOOLS.includes(item.typeId)) {
                    foundTools.add(item.typeId);
                }
            }
            
            if (foundTools.size > 0) {
                AchievementSystem.setProgress(player, this.id, foundTools.size);
            }
        });
    }
}
