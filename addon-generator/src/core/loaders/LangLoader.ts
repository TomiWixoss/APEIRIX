import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * LangLoader - Load language files from configs/lang/
 */
export class LangLoader {
  private langCache: Map<string, Record<string, any>> = new Map();
  private currentLanguage: string = 'vi_VN'; // Default

  /**
   * Set current language
   */
  setLanguage(lang: string): void {
    this.currentLanguage = lang;
  }

  /**
   * Load all lang files for a specific language
   * @param configDir - Base config directory (e.g., "addon-generator/configs")
   * @param language - Language code (e.g., "vi_VN", "en_US")
   */
  loadLanguage(configDir: string, language: string): Record<string, any> {
    const cacheKey = `${configDir}:${language}`;
    
    if (this.langCache.has(cacheKey)) {
      return this.langCache.get(cacheKey)!;
    }

    const langDir = path.join(configDir, 'lang', language);
    
    if (!fs.existsSync(langDir)) {
      console.warn(`[LangLoader] Language directory not found: ${langDir}`);
      return {};
    }

    const langData: Record<string, any> = {};
    const langFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.yaml'));

    for (const file of langFiles) {
      const filePath = path.join(langDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = yaml.load(content) as Record<string, any>;
        Object.assign(langData, data);
      } catch (error) {
        console.error(`[LangLoader] Failed to load ${filePath}:`, error);
      }
    }

    this.langCache.set(cacheKey, langData);
    return langData;
  }

  /**
   * Get translated text by key
   * @param key - Lang key (e.g., "materials.tin_ingot", "tools.bronze_pickaxe")
   * @param configDir - Base config directory
   * @param fallback - Fallback text if key not found
   */
  get(key: string, configDir: string, fallback?: string): string {
    const langData = this.loadLanguage(configDir, this.currentLanguage);
    
    const keys = key.split('.');
    let value: any = langData;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.langCache.clear();
  }
}

// Singleton instance
export const langLoader = new LangLoader();
