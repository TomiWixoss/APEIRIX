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
import { GameData } from "../data/GameData";

// Import achievements
import { WelcomeAchievement } from "../data/achievements/categories/starter/WelcomeAchievement";
import { FirstStepsAchievement } from "../data/achievements/categories/starter/FirstStepsAchievement";
import { BreakerAchievement } from "../data/achievements/categories/starter/BreakerAchievement";

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
        AchievementRegistry.registerCategory({
            id: "starter",
            icon: "textures/items/book_normal"
        });
    }

    private static registerAchievements(): void {
        const welcomeAchievement = new WelcomeAchievement();
        const firstStepsAchievement = new FirstStepsAchievement();
        const breakerAchievement = new BreakerAchievement();

        AchievementRegistry.registerAchievement(welcomeAchievement);
        AchievementRegistry.registerAchievement(firstStepsAchievement);
        AchievementRegistry.registerAchievement(breakerAchievement);

        // Setup tracking for each achievement
        welcomeAchievement.setupTracking();
        firstStepsAchievement.setupTracking();
        breakerAchievement.setupTracking();
    }

    private static initializeSystems(): void {
        // AchievementTracker removed - each achievement handles its own tracking
        ItemSystem.initialize();
        FortuneSystem.getInstance();
        CustomToolSystem.getInstance();
        FoodEffectsSystem.getInstance();
        CanWashingSystem.initialize();
    }

    private static setupEventListeners(): void {
        // Player spawn - give achievement book
        world.afterEvents.playerSpawn.subscribe((event) => {
            const player = event.player;
            if (event.initialSpawn) {
                player.sendMessage(LangManager.get("welcome.title"));

                const hasWelcomeAchievement = AchievementSystem.hasAchievement(player, "welcome");

                if (!hasWelcomeAchievement) {
                    system.runTimeout(() => {
                        try {
                            player.runCommand("give @s apeirix:achievement_book 1");
                            player.sendMessage(LangManager.get("welcome.firstTime"));
                        } catch (error) {
                            console.warn("Failed to give achievement book:", error);
                        }
                    }, 20);
                } else {
                    player.sendMessage(LangManager.get("welcome.returning"));
                }
            }
        });

        // Script event - get book
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
            }
        });
    }
}
