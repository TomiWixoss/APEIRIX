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
import { OreSieveSystem } from "../systems/mining/OreSieveSystem";
import { OreWasherSystem } from "../systems/mining/OreWasherSystem";
import { CompressorSystem } from "../systems/mining/CompressorSystem";
import { CrusherSystem } from "../systems/mining/CrusherSystem";
import { RustMiteItemEatingSystem } from "../systems/entities/RustMiteItemEatingSystem";
import { DisplayHandler } from "../systems/shared/processing/DisplayHandler";
import { GameData } from "../data/GameData";
import { ProcessingRecipeRegistry } from "../data/processing/ProcessingRecipeRegistry";
import { GENERATED_PROCESSING_RECIPES } from "../data/GeneratedProcessingRecipes";

// Import achievements - Metallurgy
import { FirstOreAchievement } from "../data/achievements/categories/metallurgy/FirstOreAchievement";
import { TinCollectorAchievement } from "../data/achievements/categories/metallurgy/TinCollectorAchievement";
import { BronzeMakerAchievement } from "../data/achievements/categories/metallurgy/BronzeMakerAchievement";
import { AlloyMasterAchievement } from "../data/achievements/categories/metallurgy/AlloyMasterAchievement";
import { ToolCrafterAchievement } from "../data/achievements/categories/metallurgy/ToolCrafterAchievement";
import { ArmorSmithAchievement } from "../data/achievements/categories/metallurgy/ArmorSmithAchievement";
import { CrusherUserAchievement } from "../data/achievements/categories/metallurgy/CrusherUserAchievement";
import { HammerExpertAchievement } from "../data/achievements/categories/metallurgy/HammerExpertAchievement";
import { BronzeAgeCompleteAchievement } from "../data/achievements/categories/metallurgy/BronzeAgeCompleteAchievement";

// Import achievements - Starter
import { WelcomeAchievement } from "../data/achievements/categories/starter/WelcomeAchievement";
import { FirstMineAchievement } from "../data/achievements/categories/starter/FirstMineAchievement";
import { FirstCraftAchievement } from "../data/achievements/categories/starter/FirstCraftAchievement";

// Import achievements - Food
import { FirstCanAchievement } from "../data/achievements/categories/food/FirstCanAchievement";
import { CanCollectorAchievement } from "../data/achievements/categories/food/CanCollectorAchievement";
import { RecyclerAchievement } from "../data/achievements/categories/food/RecyclerAchievement";

// Import achievements - Processing
import { ProcessingMasterAchievement } from "../data/achievements/categories/processing/ProcessingMasterAchievement";
import { DustCollectorAchievement } from "../data/achievements/categories/processing/DustCollectorAchievement";
import { EfficiencyExpertAchievement } from "../data/achievements/categories/processing/EfficiencyExpertAchievement";

export class GameManager {
    private static initialized = false;

    static initialize(): void {
        if (this.initialized) return;
        this.initialized = true;

        console.warn("Initializing APEIRIX...");

        GameData.initialize();
        ProcessingRecipeRegistry.loadFromGenerated(GENERATED_PROCESSING_RECIPES);
        this.registerCategories();
        this.registerAchievements();
        this.initializeSystems();
        this.setupEventListeners();

        console.warn("APEIRIX initialized successfully!");
    }

    private static registerCategories(): void {
        // Starter - Unlocked
        AchievementRegistry.registerCategory({
            id: "starter",
            icon: "textures/items/achievement_book",
            locked: false
        });

        // Metallurgy - Unlocked
        AchievementRegistry.registerCategory({
            id: "metallurgy",
            icon: "textures/items/bronze_ingot",
            locked: false,
            phases: [
                { id: "phase1", order: 1, locked: false }
            ]
        });

        // Food - Unlocked
        AchievementRegistry.registerCategory({
            id: "food",
            icon: "textures/items/canned_food",
            locked: false
        });

        // Processing - Unlocked
        AchievementRegistry.registerCategory({
            id: "processing",
            icon: "textures/blocks/crusher_front",
            locked: false
        });
    }

    private static registerAchievements(): void {
        // Starter Achievements (3 achievements)
        const welcome = new WelcomeAchievement();
        const firstMine = new FirstMineAchievement();
        const firstCraft = new FirstCraftAchievement();

        // Metallurgy Phase 1 Achievements (9 achievements)
        const firstOre = new FirstOreAchievement();
        const tinCollector = new TinCollectorAchievement();
        const bronzeMaker = new BronzeMakerAchievement();
        const alloyMaster = new AlloyMasterAchievement();
        const toolCrafter = new ToolCrafterAchievement();
        const armorSmith = new ArmorSmithAchievement();
        const crusherUser = new CrusherUserAchievement();
        const hammerExpert = new HammerExpertAchievement();
        const bronzeAgeComplete = new BronzeAgeCompleteAchievement();

        // Food Achievements (3 achievements)
        const firstCan = new FirstCanAchievement();
        const canCollector = new CanCollectorAchievement();
        const recycler = new RecyclerAchievement();

        // Processing Achievements (3 achievements)
        const processingMaster = new ProcessingMasterAchievement();
        const dustCollector = new DustCollectorAchievement();
        const efficiencyExpert = new EfficiencyExpertAchievement();

        // Register all achievements
        // Starter
        AchievementRegistry.registerAchievement(welcome);
        AchievementRegistry.registerAchievement(firstMine);
        AchievementRegistry.registerAchievement(firstCraft);
        
        // Metallurgy
        AchievementRegistry.registerAchievement(firstOre);
        AchievementRegistry.registerAchievement(tinCollector);
        AchievementRegistry.registerAchievement(bronzeMaker);
        AchievementRegistry.registerAchievement(alloyMaster);
        AchievementRegistry.registerAchievement(toolCrafter);
        AchievementRegistry.registerAchievement(armorSmith);
        AchievementRegistry.registerAchievement(crusherUser);
        AchievementRegistry.registerAchievement(hammerExpert);
        AchievementRegistry.registerAchievement(bronzeAgeComplete);

        // Food
        AchievementRegistry.registerAchievement(firstCan);
        AchievementRegistry.registerAchievement(canCollector);
        AchievementRegistry.registerAchievement(recycler);

        // Processing
        AchievementRegistry.registerAchievement(processingMaster);
        AchievementRegistry.registerAchievement(dustCollector);
        AchievementRegistry.registerAchievement(efficiencyExpert);

        // Setup tracking for each achievement
        // Starter
        welcome.setupTracking();
        firstMine.setupTracking();
        firstCraft.setupTracking();

        // Metallurgy
        firstOre.setupTracking();
        tinCollector.setupTracking();
        bronzeMaker.setupTracking();
        alloyMaster.setupTracking();
        toolCrafter.setupTracking();
        armorSmith.setupTracking();
        crusherUser.setupTracking();
        hammerExpert.setupTracking();
        bronzeAgeComplete.setupTracking();

        // Food
        firstCan.setupTracking();
        canCollector.setupTracking();
        recycler.setupTracking();

        // Processing
        processingMaster.setupTracking();
        dustCollector.setupTracking();
        efficiencyExpert.setupTracking();
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
        OreSieveSystem.initialize();
        OreWasherSystem.initialize();
        CompressorSystem.initialize();
        CrusherSystem.initialize();
        RustMiteItemEatingSystem.initialize();
        DisplayHandler.initialize(); // Hiển thị thông tin máy xử lý
    }

    private static setupEventListeners(): void {
        // Player spawn - give achievement book and wiki book (only once per player)
        world.afterEvents.playerSpawn.subscribe((event) => {
            const player = event.player;
            if (event.initialSpawn) {
                // Check if player already received books
                const hasReceivedBooks = player.getDynamicProperty("apeirix:books_received");
                
                if (!hasReceivedBooks) {
                    player.sendMessage(LangManager.get("welcome.title"));

                    // Give books on first spawn only
                    system.runTimeout(() => {
                        try {
                            player.runCommand("give @s apeirix:achievement_book 1");
                            player.runCommand("give @s apeirix:wiki_book 1");
                            player.sendMessage(LangManager.get("welcome.firstTime"));
                            
                            // Mark as received
                            player.setDynamicProperty("apeirix:books_received", true);
                        } catch (error) {
                            console.warn("Failed to give books:", error);
                        }
                    }, 20);
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
