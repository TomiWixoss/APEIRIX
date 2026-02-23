/**
 * Detail UI - Achievement detail view
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementRegistry } from "../AchievementRegistry";
import { AchievementSystem } from "../AchievementSystem";
import { LangManager } from "../../../lang/LangManager";
import { CategoryMenuUI } from "./CategoryMenuUI";

export class DetailUI {
    static async show(player: Player, achievementId: string, categoryId: string): Promise<void> {
        const achievement = AchievementRegistry.getAchievement(achievementId);
        if (!achievement) return;

        const unlocked = AchievementSystem.hasAchievement(player, achievementId);
        const progress = AchievementSystem.getProgress(player, achievementId);
        const progressPercent = Math.floor((progress / achievement.requirement) * 100);
        const progressBar = this.createProgressBar(progressPercent);

        const statusIcon = unlocked ? "§2✓" : "§8✗";
        const statusText = unlocked
            ? LangManager.get("achievements.statusCompleted")
            : LangManager.get("achievements.statusLocked");
        const progressText = `§3${Math.floor(progress)}§8/§3${achievement.requirement}`;

        const achievementName = LangManager.getAchievementName(achievementId);
        const achievementDesc = LangManager.getAchievementDesc(achievementId);
        const statusLabel = LangManager.get("achievements.status");
        const progressLabel = LangManager.get("achievements.progress");

        const endMessage = unlocked
            ? LangManager.get("achievements.congratulations")
            : LangManager.get("achievements.keepGoing");

        const body =
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `§7${achievementDesc}\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${statusLabel} ${statusIcon} ${statusText}\n\n` +
            `${progressLabel} ${progressText}\n` +
            `${progressBar}\n\n` +
            endMessage;

        const form = new ActionFormData()
            .title(`§l§6${achievementName}`)
            .body(body);

        // Add reward buttons
        if (achievement.rewards && achievement.rewards.length > 0) {
            achievement.rewards.forEach((reward, index) => {
                const claimed = AchievementSystem.hasClaimedReward(player, achievementId, index);
                let buttonText = "";

                if (claimed) {
                    buttonText = `§2✓ Đã nhận\n§8${reward.name} §8x${reward.amount}`;
                } else if (unlocked) {
                    buttonText = `§6Nhận\n§0${reward.name} §0x${reward.amount}`;
                } else {
                    buttonText = `§8✗ Chưa mở khóa\n§8${reward.name} §8x${reward.amount}`;
                }

                form.button(buttonText, reward.icon);
            });
        }

        form.button(LangManager.get("ui.backToList"), "textures/ui/arrow_left");
        form.button(LangManager.get("ui.close"));

        try {
            const response = await form.show(player);

            if (response.canceled || response.selection === undefined) return;

            const rewardCount = achievement.rewards ? achievement.rewards.length : 0;
            const backButtonIndex = rewardCount;
            const closeButtonIndex = rewardCount + 1;

            if (response.selection === backButtonIndex) {
                await CategoryMenuUI.show(player, categoryId);
                return;
            }

            if (response.selection === closeButtonIndex) {
                return;
            }

            // Handle reward claim
            if (achievement.rewards && response.selection < rewardCount) {
                const success = AchievementSystem.claimReward(player, achievementId, response.selection);

                if (success) {
                    await this.show(player, achievementId, categoryId);
                } else if (!unlocked) {
                    player.sendMessage("§cBạn cần hoàn thành thành tựu trước!");
                } else {
                    player.sendMessage("§cBạn đã nhận phần thưởng này rồi!");
                }
            }
        } catch (error) {
            console.error("Error showing detail UI:", error);
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
