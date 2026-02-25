/**
 * Category Menu UI - Achievement list in category
 * Uses JSON UI (achievement_list-style) for custom display
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { DetailUI } from "./DetailUI";
import { MainMenuUI } from "./MainMenuUI";

export class CategoryMenuUI {
    static async show(player: Player, categoryId: string): Promise<void> {
        const category = AchievementRegistry.getCategory(categoryId);
        if (!category) return;

        const achievements = AchievementRegistry.getAchievementsByCategory(categoryId);
        const achievementsData = achievements.map(achievement => ({
            achievement,
            unlocked: AchievementSystem.hasAchievement(player, achievement.id),
            progress: AchievementSystem.getProgress(player, achievement.id)
        }));

        const unlockedCount = achievementsData.filter(a => a.unlocked).length;
        const progressPercent = Math.floor((unlockedCount / achievements.length) * 100);

        const categoryName = LangManager.getCategoryName(categoryId);
        const categoryDesc = LangManager.getCategoryDesc(categoryId);
        const progressText = LangManager.get("achievements.progress");
        const completedText = LangManager.get("achievements.completed");

        // Build title for achievement_list-style JSON UI (wider than wiki list)
        // Format: apeirix:achievement_list:<title_text>
        const jsonUITitle = `apeirix:achievement_list:${categoryName}`;

        // Build body text with progress
        const bodyText = 
            `${categoryDesc}\n\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${progressText} §1${unlockedCount}§8/§1${achievements.length}\n` +
            `${this.createProgressBar(progressPercent)}\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const form = new ActionFormData()
            .title(jsonUITitle)
            .body(bodyText);

        achievementsData.forEach(({ achievement, unlocked, progress }) => {
            const status = unlocked ? "§2[✓]" : "§8[✗]";
            const progressPercent = Math.floor((progress / achievement.requirement) * 100);
            const progressColor = progressPercent >= 100 ? "§2" : progressPercent >= 50 ? "§6" : "§c";
            const achievementName = LangManager.getAchievementName(achievement.id);

            form.button(
                `${status} §r§l${achievementName}\n§r${progressColor}${progressPercent}% §0${completedText}`,
                achievement.icon
            );
        });

        form.button(LangManager.get("ui.back"), "textures/ui/arrow_left");

        try {
            const response = await form.show(player);

            if (response.canceled || response.selection === undefined) return;

            if (response.selection < achievementsData.length) {
                const selected = achievementsData[response.selection];
                await DetailUI.show(player, selected.achievement.id, categoryId);
            } else {
                await MainMenuUI.show(player);
            }
        } catch (error) {
            console.error("Error showing category menu:", error);
        }
    }

    private static createProgressBar(percent: number): string {
        const barLength = 20;
        const filled = Math.floor((percent / 100) * barLength);
        const empty = barLength - filled;

        let barColor = "§c";
        if (percent >= 75) barColor = "§2";
        else if (percent >= 50) barColor = "§e";
        else if (percent >= 25) barColor = "§6";

        const filledBar = barColor + "█".repeat(filled);
        const emptyBar = "§8█".repeat(empty);

        return `§8[${filledBar}${emptyBar}§8] §3${percent}%`;
    }
}
