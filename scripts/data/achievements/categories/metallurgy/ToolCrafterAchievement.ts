/**
 * Tool Crafter Achievement - Craft complete bronze tool set
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
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
        // Track when player picks up bronze tools
        world.afterEvents.entitySpawn.subscribe((event) => {
            if (event.entity.typeId !== "minecraft:item") return;
            
            const checkInterval = system.runInterval(() => {
                try {
                    const item = event.entity;
                    if (!item.isValid) {
                        system.clearRun(checkInterval);
                        return;
                    }

                    const itemStack = item.getComponent("item")?.itemStack;
                    if (!itemStack || !this.BRONZE_TOOLS.includes(itemStack.typeId)) {
                        system.clearRun(checkInterval);
                        return;
                    }

                    // Find nearby players
                    const nearbyPlayers = world.getAllPlayers().filter(p => {
                        const distance = Math.sqrt(
                            Math.pow(p.location.x - item.location.x, 2) +
                            Math.pow(p.location.y - item.location.y, 2) +
                            Math.pow(p.location.z - item.location.z, 2)
                        );
                        return distance < 2;
                    });

                    if (nearbyPlayers.length > 0) {
                        system.clearRun(checkInterval);
                        
                        const player = nearbyPlayers[0];
                        if (!AchievementSystem.hasAchievement(player, this.id)) {
                            // Count unique tools in inventory
                            const inventory = player.getComponent("inventory");
                            if (inventory && inventory.container) {
                                const foundTools = new Set<string>();
                                for (let i = 0; i < inventory.container.size; i++) {
                                    const invItem = inventory.container.getItem(i);
                                    if (invItem && this.BRONZE_TOOLS.includes(invItem.typeId)) {
                                        foundTools.add(invItem.typeId);
                                    }
                                }
                                AchievementSystem.setProgress(player, this.id, foundTools.size);
                            }
                        }
                    }
                } catch (error) {
                    system.clearRun(checkInterval);
                }
            }, 20);

            system.runTimeout(() => {
                system.clearRun(checkInterval);
            }, 200);
        });
    }
}
