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
     * Optional: Custom tracking logic
     */
    onTrack?(player: any, progress: number): void;

    /**
     * Optional: Custom unlock logic
     */
    onUnlock?(player: any): void;
}
