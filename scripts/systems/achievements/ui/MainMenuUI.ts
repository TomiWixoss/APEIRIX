/**
 * Main Menu UI - Achievement category selection
 * Uses JSON UI (achievement_list-style) for custom display
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { CategoryMenuUI } from "./CategoryMenuUI";

export class MainMenuUI {
    static async show(player: Player): Promise<void> {
        const categories = AchievementRegistry.getAllCategories();

        // Build title for achievement_list-style JSON UI (wider than wiki list)
        // Format: apeirix:achievement_list:<title_text>
        const titleText = LangManager.get("achievements.title");
        const jsonUITitle = `apeirix:achievement_list:${titleText}`;

        // Build body text
        const bodyText = LangManager.get("achievements.selectCategory");

        const form = new ActionFormData()
            .title(jsonUITitle)
            .body(bodyText);

        categories.forEach(category => {
            const categoryAchievements = AchievementRegistry.getAchievementsByCategory(category.id);
            const unlockedCount = categoryAchievements.filter(a =>
                AchievementSystem.hasAchievement(player, a.id)
            ).length;

            const categoryName = LangManager.getCategoryName(category.id);
            const completedText = LangManager.get("achievements.completed");

            form.button(
                `§l${categoryName}\n§r§1${unlockedCount}§0/§1${categoryAchievements.length} §0${completedText}`,
                category.icon
            );
        });

        try {
            const response = await form.show(player);

            if (response.canceled || response.selection === undefined) return;

            if (response.selection < categories.length) {
                const selectedCategory = categories[response.selection];
                await CategoryMenuUI.show(player, selectedCategory.id);
            }
        } catch (error) {
            console.error("Error showing main menu:", error);
        }
    }
}
