/**
 * Processing Master Achievement - Use all processing machines
 */

import { Achievement } from "../../BaseAchievement";
import { world } from "@minecraft/server";
import { AchievementSystem } from "../../../../systems/achievements/AchievementSystem";

export class ProcessingMasterAchievement extends Achievement {
    id = "processing_master";
    requirement = 7; // crusher, sieve, washer, compressor, alloy table, ore_crusher_mk1, ore_crusher_mk2
    category = "processing";
    icon = "textures/items/iron_ingot_dust_pure";
    rewards = [
        {
            item: "minecraft:diamond",
            amount: 5,
            icon: "textures/items/diamond",
            name: "Diamond"
        }
    ];

    private readonly PROCESSING_MACHINES = [
        "apeirix:crusher",
        "apeirix:ore_sieve",
        "apeirix:ore_washer",
        "apeirix:compressor",
        "apeirix:alloy_mixing_table",
        "apeirix:ore_crusher_mk1",
        "apeirix:ore_crusher_mk2"
    ];

    private usedMachines = new Map<string, Set<string>>(); // player name -> set of machines

    setupTracking(): void {
        // Track when player interacts with processing machines
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const player = event.player;
            const block = event.block;
            
            if (!this.PROCESSING_MACHINES.includes(block.typeId)) return;
            if (AchievementSystem.hasAchievement(player, this.id)) return;
            
            const playerName = player.name;
            if (!this.usedMachines.has(playerName)) {
                this.usedMachines.set(playerName, new Set());
            }
            
            const machines = this.usedMachines.get(playerName)!;
            machines.add(block.typeId);
            
            AchievementSystem.setProgress(player, this.id, machines.size);
        });
    }
}
