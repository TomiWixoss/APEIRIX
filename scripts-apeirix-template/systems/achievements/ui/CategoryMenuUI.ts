/**
 * Category Menu UI - Achievement list in category/phase
 * Uses JSON UI (achievement_list-style) for custom display
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { DetailUI } from "./DetailUI";
import { MainMenuUI } from "./MainMenuUI";
import { PhaseMenuUI } from "./PhaseMenuUI";

export class CategoryMenuUI {
    static async show(player: Player, categoryId: string, phaseId?: string): Promise<void> {
        const category = AchievementRegistry.getCategory(categoryId);
        if (!category) return;

        // Get achievements for this category/phase
        let achievements = AchievementRegistry.getAchievementsByCategory(categoryId);
        if (phaseId) {
            achievements = achievements.filter(a => a.phase === phaseId);
        }

        const achievementsData = achievements.map(achievement => ({
            achievement,
            unlocked: AchievementSystem.hasAchievement(player, achievement.id),
            progress: AchievementSystem.getProgress(player, achievement.id)
        }));

        const unlockedCount = achievementsData.filter(a => a.unlocked).length;
        const progressPercent = Math.floor((unlockedCount / achievements.length) * 100);

        const categoryName = LangManager.getCategoryName(categoryId);
        const progressText = LangManager.get("achievements.progress");
        const completedText = LangManager.get("achievements.completed");

        // Build title
        let titleText = categoryName;
        if (phaseId) {
            const phaseName = LangManager.get(`phases.${categoryId}.${phaseId}.name`);
            titleText = `${categoryName} - ${phaseName}`;
        }
        const jsonUITitle = `apeirix:achievement_list:${titleText}`;

        // Build body text with progress
        let bodyText = "";
        if (phaseId) {
            const phaseDesc = LangManager.get(`phases.${categoryId}.${phaseId}.desc`);
            bodyText = `${phaseDesc}\n\n`;
        }
        
        bodyText +=
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
                await DetailUI.show(player, selected.achievement.id, categoryId, phaseId);
            } else {
                // Back button
                if (phaseId && category.phases && category.phases.length > 0) {
                    await PhaseMenuUI.show(player, categoryId);
                } else {
                    await MainMenuUI.show(player);
                }
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
