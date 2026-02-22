/**
 * Achievement UI cho APEIRIX
 */

import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AchievementManager } from "./AchievementManager";
import { ACHIEVEMENTS } from "./AchievementData";

export class AchievementUI {
    /**
     * Hiển thị menu thành tựu chính
     */
    static async showMainMenu(player: Player): Promise<void> {
        const achievements = AchievementManager.getAllAchievements(player);
        const totalAchievements = ACHIEVEMENTS.length;
        const unlockedCount = achievements.filter(a => a.unlocked).length;
        
        const form = new ActionFormData()
            .title("§l§6Thành Tựu APEIRIX")
            .body(
                `§7Tiến độ: §e${unlockedCount}§7/§e${totalAchievements} §7(§a${Math.floor((unlockedCount / totalAchievements) * 100)}%§7)\n\n` +
                `§7Nhấn vào thành tựu để xem chi tiết:`
            );

        // Thêm nút cho mỗi thành tựu
        achievements.forEach(({ achievement, unlocked, progress }) => {
            const status = unlocked ? "§a✓" : "§7✗";
            const progressPercent = Math.floor((progress / achievement.requirement) * 100);
            const buttonText = `${status} ${achievement.name}\n§r§7${progressPercent}%`;
            form.button(buttonText);
        });

        form.button("§cĐóng");

        try {
            const response = await form.show(player);
            
            if (response.canceled || response.selection === undefined) return;
            
            // Nếu không phải nút đóng
            if (response.selection < achievements.length) {
                const selected = achievements[response.selection];
                await this.showAchievementDetail(player, selected.achievement, selected.unlocked, selected.progress);
            }
        } catch (error) {
            console.error("Lỗi khi hiển thị menu thành tựu:", error);
        }
    }

    /**
     * Hiển thị chi tiết thành tựu
     */
    private static async showAchievementDetail(
        player: Player,
        achievement: any,
        unlocked: boolean,
        progress: number
    ): Promise<void> {
        const progressPercent = Math.floor((progress / achievement.requirement) * 100);
        const progressBar = this.createProgressBar(progressPercent);
        
        const statusText = unlocked ? "§a✓ Hoàn thành" : "§7✗ Chưa mở khóa";
        const progressText = `§e${Math.floor(progress)}§7/§e${achievement.requirement}`;
        
        const body = 
            `§7${achievement.desc}\n\n` +
            `§7Trạng thái: ${statusText}\n` +
            `§7Tiến độ: ${progressText}\n` +
            `${progressBar}\n\n` +
            (unlocked ? "§a§lĐÃ HOÀN THÀNH!" : "§7Cố gắng lên!");

        const form = new ActionFormData()
            .title(`§6${achievement.name}`)
            .body(body)
            .button("§aQuay lại")
            .button("§cĐóng");

        try {
            const response = await form.show(player);
            
            if (!response.canceled && response.selection === 0) {
                // Hiển thị menu chính lại
                await this.showMainMenu(player);
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
        
        const filledBar = "§a|".repeat(filled);
        const emptyBar = "§7|".repeat(empty);
        
        return `[${filledBar}${emptyBar}] §e${percent}%`;
    }

    /**
     * Hiển thị thông báo mở khóa thành tựu
     */
    static showUnlockNotification(player: Player, achievementId: string): void {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        // Hiển thị thông báo title
        player.onScreenDisplay.setTitle(`§6§lMở Khóa Thành Tựu!`);
        player.onScreenDisplay.updateSubtitle(`§e${achievement.name}`);
    }
}
