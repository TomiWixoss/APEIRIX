/**
 * Achievement Category Definition
 */

export interface AchievementCategory {
    id: string;
    icon: string;
    locked?: boolean; // New: indicates if category is locked
    phases?: AchievementPhase[]; // New: phases within category
}

export interface AchievementPhase {
    id: string;
    order: number;
    locked?: boolean;
}
