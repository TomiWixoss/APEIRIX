/**
 * Main Menu UI - Achievement category selection
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { CategoryMenuUI } from "./CategoryMenuUI";

export class MainMenuUI {
    static async show(player: Player): Promise<void> {
        const form = new ActionFormData()
            .title(LangManager.get("achievements.title"))
            .body(LangManager.get("achievements.selectCategory"));

        const categories = AchievementRegistry.getAllCategories();

        categories.forEach(category => {
            const categoryAchievements = AchievementRegistry.getAchievementsByCategory(category.id);
            const unlockedCount = categoryAchievements.filter(a =>
                AchievementSystem.hasAchievement(player, a.id)
            ).length;

            const categoryName = LangManager.getCategoryName(category.id);
            const completedText = LangManager.get("achievements.completed");

            form.button(
                `§l${categoryName}\n§r§3${unlockedCount}§0/§3${categoryAchievements.length} §0${completedText}`,
                category.icon
            );
        });

        form.button(LangManager.get("ui.close"));

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
