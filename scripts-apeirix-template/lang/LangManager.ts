/**
 * Language Manager for APEIRIX
 * Automatically loads language based on addon config
 */

import { LANG_VI } from "./vi_VN";
import { LANG_EN } from "./en_US";
import { GENERATED_LANGUAGE } from "../data/GeneratedLanguage";

// Language type
type LangData = typeof LANG_VI;

export class LangManager {
    private static instance: LangManager;
    private static currentLang: LangData = LANG_VI;
    private static initialized = false;

    /**
     * Get singleton instance
     */
    static getInstance(): LangManager {
        if (!this.instance) {
            this.instance = new LangManager();
            this.init();
        }
        return this.instance;
    }

    /**
     * Initialize language from generated config
     */
    static init(): void {
        if (this.initialized) return;
        
        // Load language from generated config
        this.setLanguage(GENERATED_LANGUAGE);
        
        this.initialized = true;
    }

    /**
     * Set language manually
     */
    static setLanguage(lang: string): void {
        switch (lang) {
            case 'en_US':
                this.currentLang = LANG_EN;
                break;
            case 'vi_VN':
            default:
                this.currentLang = LANG_VI;
                break;
        }
    }

    /**
     * Get translated text
     */
    get(key: string): string {
        return LangManager.get(key);
    }

    /**
     * Get translated text (static)
     */
    static get(key: string): string {
        // Auto-initialize on first use
        if (!this.initialized) {
            this.init();
        }
        
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
