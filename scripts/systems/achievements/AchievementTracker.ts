/**
 * Achievement Tracker - Tracks player actions for achievements
 */

import { world, system } from "@minecraft/server";
import { AchievementSystem } from "./AchievementSystem";

export class AchievementTracker {
    private static initialized = false;

    static initialize(): void {
        if (this.initialized) return;
        this.initialized = true;

        this.trackPlayerMovement();
        this.trackBlockBreaking();
    }

    /**
     * Track player movement for "first_steps" achievement
     */
    private static trackPlayerMovement(): void {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                const velocity = player.getVelocity();
                const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);

                if (speed > 0.01) {
                    AchievementSystem.incrementProgress(player, "first_steps", speed);
                }
            }
        }, 20);
    }

    /**
     * Track block breaking for "breaker" achievement
     */
    private static trackBlockBreaking(): void {
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            AchievementSystem.incrementProgress(event.player, "breaker", 1);
        });
    }
}
