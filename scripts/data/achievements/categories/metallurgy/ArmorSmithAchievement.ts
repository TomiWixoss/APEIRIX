/**
 * Armor Smith Achievement - Craft complete bronze armor set
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class ArmorSmithAchievement extends Achievement {
    id = "armor_smith";
    requirement = 4; // helmet, chestplate, leggings, boots
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_chestplate";
    rewards = [
        {
            item: "minecraft:gold_ingot",
            amount: 8,
            icon: "textures/items/gold_ingot",
            name: "Gold Ingot"
        }
    ];

    private readonly BRONZE_ARMOR = [
        "apeirix:bronze_helmet",
        "apeirix:bronze_chestplate",
        "apeirix:bronze_leggings",
        "apeirix:bronze_boots"
    ];

    setupTracking(): void {
        // Track when player picks up bronze armor
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
                    if (!itemStack || !this.BRONZE_ARMOR.includes(itemStack.typeId)) {
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
                            // Count unique armor pieces in inventory
                            const inventory = player.getComponent("inventory");
                            if (inventory && inventory.container) {
                                const foundArmor = new Set<string>();
                                for (let i = 0; i < inventory.container.size; i++) {
                                    const invItem = inventory.container.getItem(i);
                                    if (invItem && this.BRONZE_ARMOR.includes(invItem.typeId)) {
                                        foundArmor.add(invItem.typeId);
                                    }
                                }
                                AchievementSystem.setProgress(player, this.id, foundArmor.size);
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
