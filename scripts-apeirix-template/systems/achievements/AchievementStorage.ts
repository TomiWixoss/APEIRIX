/**
 * Achievement Storage - Handles dynamic properties
 */

import { Player } from "@minecraft/server";

export class AchievementStorage {
    private static readonly PROPERTY_PREFIX = "apeirix:achievement_";
    private static readonly PROGRESS_PREFIX = "apeirix:progress_";
    private static readonly REWARD_PREFIX = "apeirix:reward_";

    static hasAchievement(player: Player, achievementId: string): boolean {
        try {
            return player.getDynamicProperty(this.PROPERTY_PREFIX + achievementId) === true;
        } catch {
            return false;
        }
    }

    static setAchievement(player: Player, achievementId: string): void {
        try {
            player.setDynamicProperty(this.PROPERTY_PREFIX + achievementId, true);
        } catch (error) {
            console.warn(`Failed to set achievement ${achievementId}:`, error);
        }
    }

    static getProgress(player: Player, achievementId: string): number {
        try {
            const progress = player.getDynamicProperty(this.PROGRESS_PREFIX + achievementId);
            return typeof progress === "number" ? progress : 0;
        } catch {
            return 0;
        }
    }

    static setProgress(player: Player, achievementId: string, value: number): void {
        try {
            player.setDynamicProperty(this.PROGRESS_PREFIX + achievementId, value);
        } catch (error) {
            console.warn(`Failed to set progress for ${achievementId}:`, error);
        }
    }

    static hasClaimedReward(player: Player, achievementId: string, rewardIndex: number): boolean {
        try {
            return player.getDynamicProperty(`${this.REWARD_PREFIX}${achievementId}_${rewardIndex}`) === true;
        } catch {
            return false;
        }
    }

    static setClaimedReward(player: Player, achievementId: string, rewardIndex: number): void {
        try {
            player.setDynamicProperty(`${this.REWARD_PREFIX}${achievementId}_${rewardIndex}`, true);
        } catch (error) {
            console.warn(`Failed to claim reward ${achievementId}_${rewardIndex}:`, error);
        }
    }
}
