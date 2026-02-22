/**
 * Achievement Tracker - Listens to game events and tracks progress
 */
import { world, system } from "@minecraft/server";
import { AchievementManager } from "./AchievementManager";
export class AchievementTracker {
    /**
     * Initialize all achievement trackers
     */
    static initialize() {
        this.trackWelcome();
        this.trackMovement();
        this.trackBlockBreaking();
    }
    /**
     * Track "Welcome to APEIRIX" achievement
     */
    static trackWelcome() {
        world.afterEvents.playerSpawn.subscribe((event) => {
            if (event.initialSpawn) {
                AchievementManager.setProgress(event.player, "welcome", 1);
            }
        });
    }
    /**
     * Track "First Steps" achievement - Walk 100 blocks
     */
    static trackMovement() {
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                const currentPos = player.location;
                const lastPos = this.playerPositions.get(player.id);
                if (lastPos) {
                    const distance = Math.sqrt(Math.pow(currentPos.x - lastPos.x, 2) +
                        Math.pow(currentPos.z - lastPos.z, 2));
                    if (distance > 0.1 && distance < 10) { // Prevent teleport counting
                        AchievementManager.incrementProgress(player, "first_steps", distance);
                    }
                }
                this.playerPositions.set(player.id, currentPos);
            }
        }, 20); // Check every second
    }
    /**
     * Track "Breaker" achievement - Break 10 blocks
     */
    static trackBlockBreaking() {
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            AchievementManager.incrementProgress(event.player, "breaker", 1);
        });
    }
}
AchievementTracker.playerPositions = new Map();
//# sourceMappingURL=AchievementTracker.js.map