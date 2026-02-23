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
                `§l${categoryName}\n§r§3${unlockedCount}§0/§3${categoryAchievements.length} §0${completedText}`,
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
                `${progressText} §3${unlockedCount}§8/§3${achievements.length}\n` +
                `${this.createProgressBar(progressPercent)}\n` +
                `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
            );

        // Thêm nút cho mỗi thành tựu
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
        
        const statusIcon = unlocked ? "§2✓" : "§8✗";
        const statusText = unlocked 
            ? LangManager.get("achievements.statusCompleted")
            : LangManager.get("achievements.statusLocked");
        const progressText = `§3${Math.floor(progress)}§8/§3${achievement.requirement}`;
        
        const achievementName = LangManager.getAchievementName(achievement.id);
        const achievementDesc = LangManager.getAchievementDesc(achievement.id);
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
        
        // Thêm nút cho từng reward (đặt trước nút quay lại)
        if (achievement.rewards && achievement.rewards.length > 0) {
            achievement.rewards.forEach((reward: any, index: number) => {
                const claimed = AchievementManager.hasClaimedReward(player, achievement.id, index);
                let buttonText = "";
                
                if (claimed) {
                    buttonText = `§2✓ Đã nhận\n§8${reward.name} §7x${reward.amount}`;
                } else if (unlocked) {
                    buttonText = `§6Nhận\n§0${reward.name} §0x${reward.amount}`;
                } else {
                    buttonText = `§8✗ Chưa mở khóa\n§8${reward.name} §7x${reward.amount}`;
                }
                
                form.button(buttonText, reward.icon);
            });
        }
        
        // Nút quay lại
        form.button(LangManager.get("ui.backToList"), "textures/ui/arrow_left");
        
        // Nút đóng
        form.button(LangManager.get("ui.close"));

        try {
            const response = await form.show(player);
            
            if (response.canceled || response.selection === undefined) return;
            
            const rewardCount = achievement.rewards ? achievement.rewards.length : 0;
            const backButtonIndex = rewardCount; // Nút quay lại sau các reward
            const closeButtonIndex = rewardCount + 1; // Nút đóng cuối cùng
            
            // Nút quay lại
            if (response.selection === backButtonIndex) {
                await this.showCategoryMenu(player, categoryId);
                return;
            }
            
            // Nút đóng
            if (response.selection === closeButtonIndex) {
                return;
            }
            
            // Xử lý nhận reward
            if (achievement.rewards && achievement.rewards.length > 0) {
                const rewardIndex = response.selection; // Reward buttons ở đầu
                
                if (rewardIndex >= 0 && rewardIndex < achievement.rewards.length) {
                    const reward = achievement.rewards[rewardIndex];
                    const claimed = AchievementManager.hasClaimedReward(player, achievement.id, rewardIndex);
                    
                    if (!claimed && unlocked) {
                        // Tặng reward
                        try {
                            player.runCommand(`give @s ${reward.item} ${reward.amount}`);
                            AchievementManager.claimReward(player, achievement.id, rewardIndex);
                            player.sendMessage(`${LangManager.get("achievements.received")} §e${reward.name} x${reward.amount}`);
                            player.playSound("random.orb");
                            
                            // Hiển thị lại UI để cập nhật trạng thái
                            await this.showAchievementDetail(player, achievement, unlocked, progress, categoryId);
                        } catch (error) {
                            console.warn("Không thể tặng phần thưởng:", error);
                            player.sendMessage("§cKhông thể nhận phần thưởng!");
                        }
                    } else if (!unlocked) {
                        player.sendMessage("§cBạn cần hoàn thành thành tựu trước!");
                    } else {
                        player.sendMessage("§cBạn đã nhận phần thưởng này rồi!");
                    }
                }
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
        if (percent >= 75) barColor = "§2";
        else if (percent >= 50) barColor = "§e";
        else if (percent >= 25) barColor = "§6";
        
        const filledBar = barColor + "█".repeat(filled);
        const emptyBar = "§8█".repeat(empty);
        
        return `§8[${filledBar}${emptyBar}§8] §3${percent}%`;
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
    }
}
