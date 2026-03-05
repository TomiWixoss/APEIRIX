/**
 * Language Manager for Better SB
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
      case "en_US":
        this.currentLang = LANG_EN;
        break;
      case "vi_VN":
      default:
        this.currentLang = LANG_VI;
        break;
    }
  }

  /**
   * Get translated text using dot notation
   * Example: LangManager.get('ui.void.teleport')
   */
  static get(key: string): string {
    const keys = key.split(".");
    let value: any = this.currentLang;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return `[Missing: ${key}]`;
      }
    }

    return typeof value === "string" ? value : `[Invalid: ${key}]`;
  }
}
