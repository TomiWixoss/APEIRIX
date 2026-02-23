/**
 * Achievement Registry - Manages all achievements
 */

import { Registry } from "../../core/Registry";
import { Achievement } from "../../data/achievements/BaseAchievement";
import { AchievementCategory } from "../../data/achievements/AchievementCategory";

export class AchievementRegistry {
    private static achievements = new Registry<Achievement>();
    private static categories = new Registry<AchievementCategory>();

    static registerAchievement(achievement: Achievement): void {
        this.achievements.register(achievement.id, achievement);
    }

    static registerCategory(category: AchievementCategory): void {
        this.categories.register(category.id, category);
    }

    static getAchievement(id: string): Achievement | undefined {
        return this.achievements.get(id);
    }

    static getAllAchievements(): Achievement[] {
        return this.achievements.getAll();
    }

    static getAchievementsByCategory(categoryId: string): Achievement[] {
        return this.achievements.getAll().filter(a => a.category === categoryId);
    }

    static getCategory(id: string): AchievementCategory | undefined {
        return this.categories.get(id);
    }

    static getAllCategories(): AchievementCategory[] {
        return this.categories.getAll();
    }
}
