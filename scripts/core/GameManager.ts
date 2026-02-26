/**
 * Game Manager - Main game initialization and loop
 */

import { world, system } from "@minecraft/server";
import { EventBus } from "./EventBus";
import { AchievementRegistry } from "../systems/achievements/AchievementRegistry";
import { AchievementSystem } from "../systems/achievements/AchievementSystem";
import { ItemSystem } from "../systems/items/ItemSystem";
import { LangManager } from "../lang/LangManager";
import { FortuneSystem } from "../systems/blocks/FortuneSystem";
import { CustomToolSystem } from "../systems/items/CustomToolSystem";
import { FoodEffectsSystem } from "../systems/items/FoodEffectsSystem";
import { CanWashingSystem } from "../systems/items/CanWashingSystem";
import { HammerMiningSystem } from "../systems/mining/HammerMiningSystem";
import { OreCrusherSystem } from "../systems/mining/OreCrusherSystem";
import { GameData } from "../data/GameData";

// Import achievements
import { FirstOreAchievement } from "../data/achievements/categories/metallurgy/FirstOreAchievement";
import { TinCollectorAchievement } from "../data/achievements/categories/metallurgy/TinCollectorAchievement";
import { BronzeMakerAchievement } from "../data/achievements/categories/metallurgy/BronzeMakerAchievement";
import { AlloyMasterAchievement } from "../data/achievements/categories/metallurgy/AlloyMasterAchievement";
import { ToolCrafterAchievement } from "../data/achievements/categories/metallurgy/ToolCrafterAchievement";
import { ArmorSmithAchievement } from "../data/achievements/categories/metallurgy/ArmorSmithAchievement";
import { CrusherUserAchievement } from "../data/achievements/categories/metallurgy/CrusherUserAchievement";
import { HammerExpertAchievement } from "../data/achievements/categories/metallurgy/HammerExpertAchievement";
import { BronzeAgeCompleteAchievement } from "../data/achievements/categories/metallurgy/BronzeAgeCompleteAchievement";

export class GameManager {
    private static initialized = false;

    static initialize(): void {
        if (this.initialized) return;
        this.initialized = true;

        console.warn("Initializing APEIRIX...");

        GameData.initialize();
        this.registerCategories();
        this.registerAchievements();
        this.initializeSystems();
        this.setupEventListeners();

        console.warn("APEIRIX initialized successfully!");
    }

    private static registerCategories(): void {
        // Metallurgy - Unlocked
        AchievementRegistry.registerCategory({
            id: "metallurgy",
            icon: "textures/items/bronze_ingot",
            locked: false,
            phases: [
                { id: "phase1", order: 1, locked: false }
            ]
        });

        // Alchemy - Locked
        AchievementRegistry.registerCategory({
            id: "alchemy",
            icon: "textures/items/potion_bottle_splash",
            locked: true
        });

        // Magic - Locked
        AchievementRegistry.registerCategory({
            id: "magic",
            icon: "textures/items/ender_pearl",
            locked: true
        });

        // Divinity - Locked
        AchievementRegistry.registerCategory({
            id: "divinity",
            icon: "textures/items/totem",
            locked: true
        });

        // Technology - Locked
        AchievementRegistry.registerCategory({
            id: "technology",
            icon: "textures/items/redstone_dust",
            locked: true
        });
    }

    private static registerAchievements(): void {
        // Metallurgy Phase 1 Achievements (9 achievements - removed welcome)
        const firstOre = new FirstOreAchievement();
        const tinCollector = new TinCollectorAchievement();
        const bronzeMaker = new BronzeMakerAchievement();
        const alloyMaster = new AlloyMasterAchievement();
        const toolCrafter = new ToolCrafterAchievement();
        const armorSmith = new ArmorSmithAchievement();
        const crusherUser = new CrusherUserAchievement();
        const hammerExpert = new HammerExpertAchievement();
        const bronzeAgeComplete = new BronzeAgeCompleteAchievement();

        // Register all achievements
        AchievementRegistry.registerAchievement(firstOre);
        AchievementRegistry.registerAchievement(tinCollector);
        AchievementRegistry.registerAchievement(bronzeMaker);
        AchievementRegistry.registerAchievement(alloyMaster);
        AchievementRegistry.registerAchievement(toolCrafter);
        AchievementRegistry.registerAchievement(armorSmith);
        AchievementRegistry.registerAchievement(crusherUser);
        AchievementRegistry.registerAchievement(hammerExpert);
        AchievementRegistry.registerAchievement(bronzeAgeComplete);

        // Setup tracking for each achievement
        firstOre.setupTracking();
        tinCollector.setupTracking();
        bronzeMaker.setupTracking();
        alloyMaster.setupTracking();
        toolCrafter.setupTracking();
        armorSmith.setupTracking();
        crusherUser.setupTracking();
        hammerExpert.setupTracking();
        bronzeAgeComplete.setupTracking();
    }

    private static initializeSystems(): void {
        // AchievementTracker removed - each achievement handles its own tracking
        ItemSystem.initialize();
        FortuneSystem.getInstance();
        CustomToolSystem.getInstance();
        FoodEffectsSystem.getInstance();
        CanWashingSystem.initialize();
        HammerMiningSystem.initialize();
        OreCrusherSystem.initialize();
    }

    private static setupEventListeners(): void {
        // Player spawn - give achievement book and wiki book
        world.afterEvents.playerSpawn.subscribe((event) => {
            const player = event.player;
            if (event.initialSpawn) {
                player.sendMessage(LangManager.get("welcome.title"));

                // Check if player already has achievement book (by checking any achievement)
                const hasAnyAchievement = AchievementRegistry.getAllAchievements().some(achievement =>
                    AchievementSystem.hasAchievement(player, achievement.id)
                );

                if (!hasAnyAchievement) {
                    system.runTimeout(() => {
                        try {
                            player.runCommand("give @s apeirix:achievement_book 1");
                            player.runCommand("give @s apeirix:wiki_book 1");
                            player.sendMessage(LangManager.get("welcome.firstTime"));
                        } catch (error) {
                            console.warn("Failed to give books:", error);
                        }
                    }, 20);
                } else {
                    player.sendMessage(LangManager.get("welcome.returning"));
                }
            }
        });

        // Script events - get books
        system.afterEvents.scriptEventReceive.subscribe((event) => {
            if (event.id === "apeirix:getbook") {
                const entity = event.sourceEntity;
                if (!entity) return;

                const players = world.getAllPlayers();
                const player = players.find(p => p.id === entity.id) || players[0];
                if (!player) return;

                system.run(() => {
                    try {
                        player.runCommand("give @s apeirix:achievement_book 1");
                        player.sendMessage(LangManager.get("welcome.bookReceived"));
                    } catch (error) {
                        console.error("Failed to give book:", error);
                        player.sendMessage("§cKhông thể tặng sách!");
                    }
                });
            } else if (event.id === "apeirix:getwiki") {
                const entity = event.sourceEntity;
                if (!entity) return;

                const players = world.getAllPlayers();
                const player = players.find(p => p.id === entity.id) || players[0];
                if (!player) return;

                system.run(() => {
                    try {
                        player.runCommand("give @s apeirix:wiki_book 1");
                        player.sendMessage("§a§lĐã nhận lại Bách Khoa Toàn Thư APEIRIX!");
                    } catch (error) {
                        console.error("Failed to give wiki book:", error);
                        player.sendMessage("§cKhông thể tặng sách!");
                    }
                });
            }
        });
    }
}
