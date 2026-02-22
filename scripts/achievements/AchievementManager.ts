/**
 * Achievement Manager for APEIRIX
 */

import { Player } from "@minecraft/server";
import { ACHIEVEMENTS, Achievement } from "./AchievementData";

export class AchievementManager {
    private static readonly PROPERTY_PREFIX = "apeirix:achievement_";
    private static readonly PROGRESS_PREFIX = "apeirix:progress_";

    /**
     * Check if player has unlocked an achievement
     */
    static hasAchievement(player: Player, achievementId: string): boolean {
        try {
            return player.getDynamicProperty(this.PROPERTY_PREFIX + achievementId) === true;
        } catch {
            return false;
        }
    }

    /**
     * Get progress for an achievement
     */
    static getProgress(player: Player, achievementId: string): number {
        try {
            const progress = player.getDynamicProperty(this.PROGRESS_PREFIX + achievementId);
            return typeof progress === "number" ? progress : 0;
        } catch {
            return 0;
        }
    }

    /**
     * Set progress for an achievement
     */
    static setProgress(player: Player, achievementId: string, value: number): void {
        try {
            // Nếu đã hoàn thành thì không cập nhật nữa
            if (this.hasAchievement(player, achievementId)) return;
            
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (!achievement) return;
            
            // Giới hạn progress không vượt quá requirement
            const clampedValue = Math.min(value, achievement.requirement);
            player.setDynamicProperty(this.PROGRESS_PREFIX + achievementId, clampedValue);
            
            // Check if achievement should be unlocked
            if (clampedValue >= achievement.requirement) {
                this.unlockAchievement(player, achievementId);
            }
        } catch (error) {
            console.warn(`Failed to set progress for ${achievementId}:`, error);
        }
    }

    /**
     * Increment progress for an achievement
     */
    static incrementProgress(player: Player, achievementId: string, amount: number = 1): void {
        // Nếu đã hoàn thành thì không tăng nữa
        if (this.hasAchievement(player, achievementId)) return;
        
        const current = this.getProgress(player, achievementId);
        this.setProgress(player, achievementId, current + amount);
    }

    /**
     * Unlock an achievement
     */
    static unlockAchievement(player: Player, achievementId: string): void {
        try {
            if (this.hasAchievement(player, achievementId)) return;

            player.setDynamicProperty(this.PROPERTY_PREFIX + achievementId, true);
            
            const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
            if (achievement) {
                // Import UI dynamically to avoid circular dependency
                import("./AchievementUI").then(({ AchievementUI }) => {
                    AchievementUI.showUnlockNotification(player, achievementId);
                });
                
                player.playSound("random.levelup");
            }
        } catch (error) {
            console.warn(`Failed to unlock achievement ${achievementId}:`, error);
        }
    }

    /**
     * Get all achievements with their status for a player
     */
    static getAllAchievements(player: Player): Array<{achievement: Achievement, unlocked: boolean, progress: number}> {
        return ACHIEVEMENTS.map(achievement => ({
            achievement,
            unlocked: this.hasAchievement(player, achievement.id),
            progress: this.getProgress(player, achievement.id)
        }));
    }
}
