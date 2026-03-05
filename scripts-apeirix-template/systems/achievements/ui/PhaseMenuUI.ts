/**
 * Phase Menu UI - Phase selection within category
 * Uses JSON UI (achievement_list-style) for custom display
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { CategoryMenuUI } from "./CategoryMenuUI";
import { MainMenuUI } from "./MainMenuUI";

export class PhaseMenuUI {
    static async show(player: Player, categoryId: string): Promise<void> {
        const category = AchievementRegistry.getCategory(categoryId);
        if (!category || !category.phases) return;

        const categoryName = LangManager.getCategoryName(categoryId);
        const categoryDesc = LangManager.getCategoryDesc(categoryId);

        // Build title for achievement_list-style JSON UI
        const jsonUITitle = `apeirix:achievement_list:${categoryName}`;

        // Build body text
        const bodyText = 
            `${categoryDesc}\n\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `§0Chọn Phase để xem thành tựu:\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const form = new ActionFormData()
            .title(jsonUITitle)
            .body(bodyText);

        // Sort phases by order
        const sortedPhases = [...category.phases].sort((a, b) => a.order - b.order);

        sortedPhases.forEach(phase => {
            const phaseName = LangManager.get(`phases.${categoryId}.${phase.id}.name`);
            const phaseDesc = LangManager.get(`phases.${categoryId}.${phase.id}.desc`);
            
            if (phase.locked) {
                // Locked phase
                form.button(
                    `${phaseName}\n§8§l[KHÓA] §r§8${phaseDesc}`,
                    "textures/ui/lock_color"
                );
            } else {
                // Unlocked phase - show progress
                const phaseAchievements = AchievementRegistry.getAchievementsByCategory(categoryId)
                    .filter(a => a.phase === phase.id);
                const unlockedCount = phaseAchievements.filter(a =>
                    AchievementSystem.hasAchievement(player, a.id)
                ).length;

                const completedText = LangManager.get("achievements.completed");

                form.button(
                    `${phaseName}\n§r§1${unlockedCount}§0/§1${phaseAchievements.length} §0${completedText}`,
                    "textures/ui/check"
                );
            }
        });

        form.button(LangManager.get("ui.back"), "textures/ui/arrow_left");

        try {
            const response = await form.show(player);

            if (response.canceled || response.selection === undefined) return;

            const backButtonIndex = sortedPhases.length;

            if (response.selection === backButtonIndex) {
                await MainMenuUI.show(player);
                return;
            }

            if (response.selection < sortedPhases.length) {
                const selectedPhase = sortedPhases[response.selection];
                
                if (selectedPhase.locked) {
                    player.sendMessage("§c§lPhase này hiện đang bị khóa!");
                    player.playSound("random.break");
                    await this.show(player, categoryId);
                    return;
                }

                await CategoryMenuUI.show(player, categoryId, selectedPhase.id);
            }
        } catch (error) {
            console.error("Error showing phase menu:", error);
        }
    }
}
