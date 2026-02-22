/**
 * Achievement UI cho APEIRIX - Phiên bản ActionFormData
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
        const progressPercent = Math.floor((unlockedCount / totalAchievements) * 100);
        
        const form = new ActionFormData()
            .title("§l§6═══ THÀNH TỰU APEIRIX ═══")
            .body(
                `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `§7Tiến độ hoàn thành: §e${unlockedCount}§7/§e${totalAchievements}\n` +
                `${this.createProgressBar(progressPercent)}\n` +
                `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `§7Chọn thành tựu để xem chi tiết:`
            );

        // Thêm nút cho mỗi thành tựu
        achievements.forEach(({ achievement, unlocked, progress }) => {
            const status = unlocked ? "§a[✓]" : "§7[✗]";
            const progressPercent = Math.floor((progress / achievement.requirement) * 100);
            const progressColor = progressPercent >= 100 ? "§a" : progressPercent >= 50 ? "§e" : "§c";
            const buttonText = `${status} §r§l${achievement.name}\n§r§8${progressColor}${progressPercent}% §8hoàn thành`;
            form.button(buttonText);
        });

        form.button("§l§c✖ Đóng");

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
        
        const statusIcon = unlocked ? "§a✓" : "§7✗";
        const statusText = unlocked ? "§a§lĐÃ HOÀN THÀNH" : "§7§lCHƯA MỞ KHÓA";
        const progressText = `§e${Math.floor(progress)}§7/§e${achievement.requirement}`;
        
        const body = 
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `§7${achievement.desc}\n` +
            `§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `§7Trạng thái: ${statusIcon} ${statusText}\n\n` +
            `§7Tiến độ: ${progressText}\n` +
            `${progressBar}\n\n` +
            (unlocked 
                ? "§a§l★ CHÚC MỪNG! ★\n§7Bạn đã hoàn thành thành tựu này!" 
                : "§e§l⚡ CỐ GẮNG LÊN! ⚡\n§7Bạn sắp hoàn thành rồi!");

        const form = new ActionFormData()
            .title(`§l§6${achievement.name}`)
            .body(body)
            .button("§l§a← Quay lại Menu")
            .button("§l§c✖ Đóng");

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
        
        // Chọn màu dựa trên phần trăm
        let barColor = "§c"; // Đỏ
        if (percent >= 75) barColor = "§a"; // Xanh lá
        else if (percent >= 50) barColor = "§e"; // Vàng
        else if (percent >= 25) barColor = "§6"; // Cam
        
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

        // Hiển thị thông báo title
        player.onScreenDisplay.setTitle(`§6§l★ MỞ KHÓA THÀNH TỰU! ★`);
        player.onScreenDisplay.updateSubtitle(`§e§l${achievement.name}`);
    }
}
