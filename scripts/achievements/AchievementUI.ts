/**
 * Achievement UI cho APEIRIX - Phiên bản có phân cấp và icon
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementManager } from "./AchievementManager";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from "./AchievementData";
import { LangManager } from "../lang/LangManager";

export class AchievementUI {
    /**
     * Menu chính - Chọn nhánh thành tựu
     */
    static async showMainMenu(player: Player): Promise<void> {
        const form = new ActionFormData()
            .title(LangManager.get("achievements.title"))
            .body(LangManager.get("achievements.selectCategory"));

        // Thêm nút cho mỗi category
        Object.values(ACHIEVEMENT_CATEGORIES).forEach(category => {
            const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category.id);
            const unlockedCount = categoryAchievements.filter(a => 
                AchievementManager.hasAchievement(player, a.id)
            ).length;
            
            const categoryName = LangManager.getCategoryName(category.id);
            const completedText = LangManager.get("achievements.completed");
            
            form.button(
                `§l${categoryName}\n§r§7${unlockedCount}§8/§7${categoryAchievements.length} §8${completedText}`,
                category.icon
            );
        });

        form.button(LangManager.get("ui.close"));

        try {
            const response = await form.show(player);
            
            if (response.canceled || response.selection === undefined) return;
            
            const categories = Object.values(ACHIEVEMENT_CATEGORIES);
            if (response.selection < categories.length) {
                const selectedCategory = categories[response.selection];
                await this.showCategoryMenu(player, selectedCategory.id);
            }
        } catch (error) {
            console.error("Lỗi khi hiển thị menu chính:", error);
        }
    }

    /**
     * Menu nhánh - Danh sách thành tựu trong nhánh
     */
    static async showCategoryMenu(player: Player, categoryId: string): Promise<void> {
        const category = ACHIEVEMENT_CATEGORIES[categoryId as keyof typeof ACHIEVEMENT_CATEGORIES];
        if (!category) return;

        const achievements = ACHIEVEMENTS.filter(a => a.category === categoryId);
        const achievementsData = achievements.map(achievement => ({
            achievement,
            unlocked: AchievementManager.hasAchievement(player, achievement.id),
            progress: AchievementManager.getProgress(player, achievement.id)
        }));

        const unlockedCount = achievementsData.filter(a => a.unlocked).length;
        const progressPercent = Math.floor((unlockedCount / achievements.length) * 100);

        const categoryName = LangManager.getCategoryName(categoryId);
        const categoryDesc = LangManager.getCategoryDesc(categoryId);
        const progressText = LangManager.get("achievements.progress");
        const completedText = LangManager.get("achievements.completed");

        const form = new ActionFormData()
            .title(`§l§6${categoryName}`)
            .body(
                `§7${categoryDesc}\n\n` +
                `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${progressText} §e${unlockedCount}§7/§e${achievements.length}\n` +
                `${this.createProgressBar(progressPercent)}\n` +
                `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            );

        // Thêm nút cho mỗi thành tựu
        achievementsData.forEach(({ achievement, unlocked, progress }) => {
            const status = unlocked ? "§a[✓]" : "§7[✗]";
            const progressPercent = Math.floor((progress / achievement.requirement) * 100);
            const progressColor = progressPercent >= 100 ? "§a" : progressPercent >= 50 ? "§e" : "§c";
            const achievementName = LangManager.getAchievementName(achievement.id);
            
            form.button(
                `${status} §r§l${achievementName}\n§r§8${progressColor}${progressPercent}% §8${completedText}`,
                achievement.icon
            );
        });

        form.button(LangManager.get("ui.back"), "textures/ui/arrow_left");

        try {
            const response = await form.show(player);
            
            if (response.canceled || response.selection === undefined) return;
            
            if (response.selection < achievementsData.length) {
                const selected = achievementsData[response.selection];
                await this.showAchievementDetail(player, selected.achievement, selected.unlocked, selected.progress, categoryId);
            } else {
                // Nút quay lại
                await this.showMainMenu(player);
            }
        } catch (error) {
            console.error("Lỗi khi hiển thị menu nhánh:", error);
        }
    }

    /**
     * Chi tiết thành tựu
     */
    private static async showAchievementDetail(
        player: Player,
        achievement: any,
        unlocked: boolean,
        progress: number,
        categoryId: string
    ): Promise<void> {
        const progressPercent = Math.floor((progress / achievement.requirement) * 100);
        const progressBar = this.createProgressBar(progressPercent);
        
        const statusIcon = unlocked ? "§a✓" : "§7✗";
        const statusText = unlocked 
            ? LangManager.get("achievements.statusCompleted")
            : LangManager.get("achievements.statusLocked");
        const progressText = `§e${Math.floor(progress)}§7/§e${achievement.requirement}`;
        
        const achievementName = LangManager.getAchievementName(achievement.id);
        const achievementDesc = LangManager.getAchievementDesc(achievement.id);
        const statusLabel = LangManager.get("achievements.status");
        const progressLabel = LangManager.get("achievements.progress");
        
        let rewardText = "";
        if (achievement.reward) {
            const rewardLabel = LangManager.get("achievements.reward");
            const rewardStatus = unlocked 
                ? LangManager.get("achievements.rewardReceived")
                : LangManager.get("achievements.rewardPending");
            
            rewardText = `\n§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${rewardLabel}\n` +
                `§7${achievement.reward.item} §ex${achievement.reward.amount}\n` +
                rewardStatus;
        }
        
        const endMessage = unlocked 
            ? LangManager.get("achievements.congratulations")
            : LangManager.get("achievements.keepGoing");
        
        const body = 
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `§7${achievementDesc}\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `${statusLabel} ${statusIcon} ${statusText}\n\n` +
            `${progressLabel} ${progressText}\n` +
            `${progressBar}` +
            rewardText +
            `\n\n` +
            endMessage;

        const form = new ActionFormData()
            .title(`§l§6${achievementName}`)
            .body(body)
            .button(LangManager.get("ui.backToList"), "textures/ui/arrow_left")
            .button(LangManager.get("ui.close"));

        try {
            const response = await form.show(player);
            
            if (!response.canceled && response.selection === 0) {
                await this.showCategoryMenu(player, categoryId);
            }
        } catch (error) {
            console.error("Lỗi khi hiển thị chi tiết thành tựu:", error);
        }
    }

    /**
     * Tạo thanh tiến độ
     */
    private static createProgressBar(percent: number): string {
        const barLength = 20;
        const filled = Math.floor((percent / 100) * barLength);
        const empty = barLength - filled;
        
        let barColor = "§c";
        if (percent >= 75) barColor = "§a";
        else if (percent >= 50) barColor = "§e";
        else if (percent >= 25) barColor = "§6";
        
        const filledBar = barColor + "█".repeat(filled);
        const emptyBar = "§8█".repeat(empty);
        
        return `§8[${filledBar}${emptyBar}§8] §e${percent}%`;
    }

    /**
     * Hiển thị thông báo mở khóa thành tựu
     */
    static showUnlockNotification(player: Player, achievementId: string): void {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        const achievementName = LangManager.getAchievementName(achievementId);
        const unlockedTitle = LangManager.get("achievements.unlocked");
        
        player.onScreenDisplay.setTitle(unlockedTitle);
        player.onScreenDisplay.updateSubtitle(`§e§l${achievementName}`);
        
        // Tặng phần thưởng nếu có
        if (achievement.reward) {
            try {
                player.runCommand(`give @s ${achievement.reward.item} ${achievement.reward.amount}`);
                const receivedText = LangManager.get("achievements.received");
                player.sendMessage(`${receivedText} §e${achievement.reward.item} x${achievement.reward.amount}`);
            } catch (error) {
                console.warn("Không thể tặng phần thưởng:", error);
            }
        }
    }
}
