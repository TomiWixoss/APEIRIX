/**
 * Base Achievement Definition
 */

import { RewardDefinition } from "../rewards/RewardDefinition";

export interface BaseAchievement {
    id: string;
    requirement: number;
    category: string;
    icon: string;
    rewards?: RewardDefinition[];
}

export abstract class Achievement implements BaseAchievement {
    abstract id: string;
    abstract requirement: number;
    abstract category: string;
    abstract icon: string;
    abstract rewards?: RewardDefinition[];

    /**
     * Setup tracking for this achievement
     * Each achievement implements its own tracking logic
     */
    abstract setupTracking(): void;

    /**
     * Optional: Custom unlock logic
     */
    onUnlock?(player: any): void;
}
