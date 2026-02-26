/**
 * Alloy Master Achievement - Create 32 bronze ingots
 */

import { Achievement } from "../../BaseAchievement";
import { world, system } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class AlloyMasterAchievement extends Achievement {
    id = "alloy_master";
    requirement = 32;
    category = "metallurgy";
    phase = "phase1";
    icon = "textures/items/bronze_ingot";
    rewards = [
        {
            item: "minecraft:diamond",
            amount: 2,
            icon: "textures/items/diamond",
            name: "Diamond"
        }
    ];

    setupTracking(): void {
        // Track when player picks up bronze ingot
        world.afterEvents.entitySpawn.subscribe((event) => {
            if (event.entity.typeId !== "minecraft:item") return;
            
            // Check nearby players every second after item spawns
            const checkInterval = system.runInterval(() => {
                try {
                    const item = event.entity;
                    if (!item.isValid) {
                        system.clearRun(checkInterval);
                        return;
                    }

                    const itemStack = item.getComponent("item")?.itemStack;
                    if (!itemStack || itemStack.typeId !== "apeirix:bronze_ingot") {
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
                        
                        // Update progress for nearby player
                        const player = nearbyPlayers[0];
                        if (!AchievementSystem.hasAchievement(player, this.id)) {
                            const current = AchievementSystem.getProgress(player, this.id);
                            AchievementSystem.setProgress(player, this.id, current + itemStack.amount);
                        }
                    }
                } catch (error) {
                    system.clearRun(checkInterval);
                }
            }, 20);

            // Clear after 10 seconds if not picked up
            system.runTimeout(() => {
                system.clearRun(checkInterval);
            }, 200);
        });
    }
}
