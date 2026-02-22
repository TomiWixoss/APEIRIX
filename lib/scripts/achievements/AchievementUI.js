/**
 * Achievement UI cho APEIRIX - Sử dụng DDUI Framework
 */
import { CustomForm } from "@minecraft/server-ui";
import { AchievementManager } from "./AchievementManager";
import { ACHIEVEMENTS } from "./AchievementData";
export class AchievementUI {
    /**
     * Hiển thị menu thành tựu chính với DDUI
     */
    static showMainMenu(player) {
        return __awaiter(this, void 0, void 0, function* () {
            const achievements = AchievementManager.getAllAchievements(player);
            const totalAchievements = ACHIEVEMENTS.length;
            const unlockedCount = achievements.filter(a => a.unlocked).length;
            const progressPercent = Math.floor((unlockedCount / totalAchievements) * 100);
            const form = CustomForm.create(player, "§l§6═══ THÀNH TỰU APEIRIX ═══");
            // Header với progress
            form.label(`§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            form.label(`§7Tiến độ hoàn thành: §e${unlockedCount}§7/§e${totalAchievements}`);
            form.label(this.createProgressBar(progressPercent));
            form.divider();
            form.spacer();
            form.label("§7§lChọn thành tựu để xem chi tiết:");
            form.spacer();
            // Thêm button cho mỗi thành tựu
            achievements.forEach(({ achievement, unlocked, progress }) => {
                const status = unlocked ? "§a[✓]" : "§7[✗]";
                const progressPercent = Math.floor((progress / achievement.requirement) * 100);
                const progressColor = progressPercent >= 100 ? "§a" : progressPercent >= 50 ? "§e" : "§c";
                form.button(`${status} §r§l${achievement.name}`, () => this.showAchievementDetail(player, achievement, unlocked, progress), {
                    tooltip: `${progressColor}${progressPercent}% §7hoàn thành\n§8${achievement.desc}`
                });
            });
            form.spacer();
            form.divider();
            form.closeButton();
            try {
                yield form.show();
            }
            catch (error) {
                console.error("Lỗi khi hiển thị menu thành tựu:", error);
            }
        });
    }
    /**
     * Hiển thị chi tiết thành tựu với DDUI
     */
    static showAchievementDetail(player, achievement, unlocked, progress) {
        return __awaiter(this, void 0, void 0, function* () {
            const progressPercent = Math.floor((progress / achievement.requirement) * 100);
            const progressBar = this.createProgressBar(progressPercent);
            const statusIcon = unlocked ? "§a✓" : "§7✗";
            const statusText = unlocked ? "§a§lĐÃ HOÀN THÀNH" : "§7§lCHƯA MỞ KHÓA";
            const progressText = `§e${Math.floor(progress)}§7/§e${achievement.requirement}`;
            const form = CustomForm.create(player, `§l§6${achievement.name}`);
            form.label(`§8━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            form.label(`§7${achievement.desc}`);
            form.divider();
            form.spacer();
            form.label(`§7Trạng thái: ${statusIcon} ${statusText}`);
            form.spacer();
            form.label(`§7Tiến độ: ${progressText}`);
            form.label(progressBar);
            form.spacer();
            form.divider();
            if (unlocked) {
                form.label("§a§l★ CHÚC MỪNG! ★");
                form.label("§7Bạn đã hoàn thành thành tựu này!");
            }
            else {
                form.label("§e§l⚡ CỐ GẮNG LÊN! ⚡");
                form.label("§7Bạn sắp hoàn thành rồi!");
            }
            form.spacer();
            form.button("§l§a← Quay lại Menu", () => this.showMainMenu(player), { tooltip: "Quay lại danh sách thành tựu" });
            form.closeButton();
            try {
                yield form.show();
            }
            catch (error) {
                console.error("Lỗi khi hiển thị chi tiết thành tựu:", error);
            }
        });
    }
    /**
     * Tạo thanh tiến độ
     */
    static createProgressBar(percent) {
        const barLength = 20;
        const filled = Math.floor((percent / 100) * barLength);
        const empty = barLength - filled;
        // Chọn màu dựa trên phần trăm
        let barColor = "§c"; // Đỏ
        if (percent >= 75)
            barColor = "§a"; // Xanh lá
        else if (percent >= 50)
            barColor = "§e"; // Vàng
        else if (percent >= 25)
            barColor = "§6"; // Cam
        const filledBar = barColor + "█".repeat(filled);
        const emptyBar = "§8█".repeat(empty);
        return `§8[${filledBar}${emptyBar}§8] §e${percent}%`;
    }
    /**
     * Hiển thị thông báo mở khóa thành tựu
     */
    static showUnlockNotification(player, achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement)
            return;
        // Hiển thị thông báo title
        player.onScreenDisplay.setTitle(`§6§l★ MỞ KHÓA THÀNH TỰU! ★`);
        player.onScreenDisplay.updateSubtitle(`§e§l${achievement.name}`);
    }
}
//# sourceMappingURL=AchievementUI.js.map