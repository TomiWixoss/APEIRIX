/**
 * Armor Smith Achievement - Craft complete bronze armor set
 * 
 * OPTIMIZED: Track qua equip event thay vì scan item entities
 */

import { Achievement } from "../../BaseAchievement";
import { world, EquipmentSlot } from "@minecraft/server";
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
        // Event-driven: Check when inventory changes
        world.afterEvents.playerInventoryItemChange.subscribe((event) => {
            const player = event.player;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            // Only check if the changed item is bronze armor
            const changedItem = event.itemStack;
            if (!changedItem || !this.BRONZE_ARMOR.includes(changedItem.typeId)) return;
            
            // Check both inventory and equipped armor
            this.checkPlayerArmor(player);
        });
        
        // Also check on spawn (for equipped armor)
        world.afterEvents.playerSpawn.subscribe((event) => {
            if (!AchievementSystem.hasAchievement(event.player, this.id)) {
                this.checkPlayerArmor(event.player);
            }
        });
    }

    private checkPlayerArmor(player: any): void {
        try {
            const foundArmor = new Set<string>();
            
            // Check equipped armor
            const equipment = player.getComponent("equippable");
            if (equipment) {
                const slots = [
                    EquipmentSlot.Head,
                    EquipmentSlot.Chest,
                    EquipmentSlot.Legs,
                    EquipmentSlot.Feet
                ];
                
                for (const slot of slots) {
                    const item = equipment.getEquipment(slot);
                    if (item && this.BRONZE_ARMOR.includes(item.typeId)) {
                        foundArmor.add(item.typeId);
                    }
                }
            }
            
            // Check inventory
            const inventory = player.getComponent("inventory");
            if (inventory?.container) {
                for (let i = 0; i < inventory.container.size; i++) {
                    const item = inventory.container.getItem(i);
                    if (item && this.BRONZE_ARMOR.includes(item.typeId)) {
                        foundArmor.add(item.typeId);
                    }
                }
            }
            
            if (foundArmor.size > 0) {
                AchievementSystem.setProgress(player, this.id, foundArmor.size);
            }
        } catch (error) {
            // Player không còn valid
        }
    }
}
