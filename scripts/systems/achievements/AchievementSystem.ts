/**
 * Achievement System - Main system controller
 */

import { Player } from "@minecraft/server";
import { EventBus } from "../../core/EventBus";
import { AchievementRegistry } from "./AchievementRegistry";
import { AchievementStorage } from "./AchievementStorage";
import { LangManager } from "../../lang/LangManager";

export class AchievementSystem {
    /**
     * Check if player has achievement
     */
    static hasAchievement(player: Player, achievementId: string): boolean {
        return AchievementStorage.hasAchievement(player, achievementId);
    }

    /**
     * Get achievement progress
     */
    static getProgress(player: Player, achievementId: string): number {
        return AchievementStorage.getProgress(player, achievementId);
    }

    /**
     * Set achievement progress
     */
    static setProgress(player: Player, achievementId: string, value: number): void {
        if (this.hasAchievement(player, achievementId)) return;

        const achievement = AchievementRegistry.getAchievement(achievementId);
        if (!achievement) return;

        const clampedValue = Math.min(value, achievement.requirement);
        AchievementStorage.setProgress(player, achievementId, clampedValue);

        // Custom tracking logic
        if (achievement.onTrack) {
            achievement.onTrack(player, clampedValue);
        }

        // Check unlock
        if (clampedValue >= achievement.requirement) {
            this.unlockAchievement(player, achievementId);
        }
    }

    /**
     * Increment achievement progress
     */
    static incrementProgress(player: Player, achievementId: string, amount: number = 1): void {
        if (this.hasAchievement(player, achievementId)) return;

        const current = this.getProgress(player, achievementId);
        this.setProgress(player, achievementId, current + amount);
    }

    /**
     * Unlock achievement
     */
    static unlockAchievement(player: Player, achievementId: string): void {
        if (this.hasAchievement(player, achievementId)) return;

        AchievementStorage.setAchievement(player, achievementId);

        const achievement = AchievementRegistry.getAchievement(achievementId);
        if (!achievement) return;

        // Custom unlock logic
        if (achievement.onUnlock) {
            achievement.onUnlock(player);
        }

        // Emit event
        EventBus.emit("achievement:unlocked", player, achievementId);

        // Show notification
        this.showUnlockNotification(player, achievementId);
        player.playSound("random.levelup");
    }

    /**
     * Show unlock notification
     */
    private static showUnlockNotification(player: Player, achievementId: string): void {
        const achievementName = LangManager.getAchievementName(achievementId);
        const unlockedTitle = LangManager.get("achievements.unlocked");

        player.onScreenDisplay.setTitle(unlockedTitle);
        player.onScreenDisplay.updateSubtitle(`§e§l${achievementName}`);
    }

    /**
     * Claim reward
     */
    static claimReward(player: Player, achievementId: string, rewardIndex: number): boolean {
        if (!this.hasAchievement(player, achievementId)) return false;
        if (AchievementStorage.hasClaimedReward(player, achievementId, rewardIndex)) return false;

        const achievement = AchievementRegistry.getAchievement(achievementId);
        if (!achievement || !achievement.rewards) return false;

        const reward = achievement.rewards[rewardIndex];
        if (!reward) return false;

        try {
            player.runCommand(`give @s ${reward.item} ${reward.amount}`);
            AchievementStorage.setClaimedReward(player, achievementId, rewardIndex);
            player.sendMessage(`${LangManager.get("achievements.received")} §e${reward.name} x${reward.amount}`);
            player.playSound("random.orb");
            return true;
        } catch (error) {
            console.warn("Failed to give reward:", error);
            return false;
        }
    }

    /**
     * Check if reward is claimed
     */
    static hasClaimedReward(player: Player, achievementId: string, rewardIndex: number): boolean {
        return AchievementStorage.hasClaimedReward(player, achievementId, rewardIndex);
    }
}
