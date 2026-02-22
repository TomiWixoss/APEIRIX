/**
 * Achievement Manager for APEIRIX
 */
import { ACHIEVEMENTS } from "./AchievementData";
export class AchievementManager {
    /**
     * Check if player has unlocked an achievement
     */
    static hasAchievement(player, achievementId) {
        try {
            return player.getDynamicProperty(this.PROPERTY_PREFIX + achievementId) === true;
        }
        catch (_a) {
            return false;
        }
    }
    /**
     * Get progress for an achievement
     */
    static getProgress(player, achievementId) {
        try {
            const progress = player.getDynamicProperty(this.PROGRESS_PREFIX + achievementId);
            return typeof progress === "number" ? progress : 0;
        }
        catch (_a) {
            return 0;
        }
    }
    /**
     * Set progress for an achievement
     */
    static setProgress(player, achievementId, value) {
        try {
            // Nếu đã hoàn thành thì không cập nhật nữa
            if (this.hasAchievement(player, achievementId))
                return;
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (!achievement)
                return;
            // Giới hạn progress không vượt quá requirement
            const clampedValue = Math.min(value, achievement.requirement);
            player.setDynamicProperty(this.PROGRESS_PREFIX + achievementId, clampedValue);
            // Check if achievement should be unlocked
            if (clampedValue >= achievement.requirement) {
                this.unlockAchievement(player, achievementId);
            }
        }
        catch (error) {
            console.warn(`Failed to set progress for ${achievementId}:`, error);
        }
    }
    /**
     * Increment progress for an achievement
     */
    static incrementProgress(player, achievementId, amount = 1) {
        // Nếu đã hoàn thành thì không tăng nữa
        if (this.hasAchievement(player, achievementId))
            return;
        const current = this.getProgress(player, achievementId);
        this.setProgress(player, achievementId, current + amount);
    }
    /**
     * Unlock an achievement
     */
    static unlockAchievement(player, achievementId) {
        try {
            if (this.hasAchievement(player, achievementId))
                return;
            player.setDynamicProperty(this.PROPERTY_PREFIX + achievementId, true);
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (achievement) {
                // Import UI dynamically to avoid circular dependency
                import("./AchievementUI").then(({ AchievementUI }) => {
                    AchievementUI.showUnlockNotification(player, achievementId);
                });
                player.playSound("random.levelup");
            }
        }
        catch (error) {
            console.warn(`Failed to unlock achievement ${achievementId}:`, error);
        }
    }
    /**
     * Get all achievements with their status for a player
     */
    static getAllAchievements(player) {
        return ACHIEVEMENTS.map(achievement => ({
            achievement,
            unlocked: this.hasAchievement(player, achievement.id),
            progress: this.getProgress(player, achievement.id)
        }));
    }
}
AchievementManager.PROPERTY_PREFIX = "apeirix:achievement_";
AchievementManager.PROGRESS_PREFIX = "apeirix:progress_";
//# sourceMappingURL=AchievementManager.js.map