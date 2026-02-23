/**
 * Language Manager for APEIRIX
 */

import { LANG_VI } from "./vi_VN";

export class LangManager {
    private static currentLang = LANG_VI;

    /**
     * Get translated text
     */
    static get(key: string): string {
        const keys = key.split('.');
        let value: any = this.currentLang;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }
        
        return typeof value === 'string' ? value : key;
    }

    /**
     * Get achievement name
     */
    static getAchievementName(id: string): string {
        return this.get(`achievementNames.${id}`);
    }

    /**
     * Get achievement description
     */
    static getAchievementDesc(id: string): string {
        return this.get(`achievementDescs.${id}`);
    }

    /**
     * Get category name
     */
    static getCategoryName(id: string): string {
        return this.get(`categories.${id}.name`);
    }

    /**
     * Get category description
     */
    static getCategoryDesc(id: string): string {
        return this.get(`categories.${id}.desc`);
    }
}
