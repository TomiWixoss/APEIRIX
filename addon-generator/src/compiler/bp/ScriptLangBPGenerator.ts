import path from 'path';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from '../../utils/Logger.js';

/**
 * Generate TypeScript lang files for scripts from YAML
 * Generates BOTH vi_VN.ts and en_US.ts
 * LangManager will load the correct one based on GeneratedLanguage.ts
 */
export class ScriptLangBPGenerator {
  /**
   * Generate script lang files (vi_VN.ts, en_US.ts) from YAML
   */
  static async generate(configDir: string, outputDir: string, config?: any): Promise<void> {
    // Output to root scripts/lang folder (for TypeScript compilation)
    const scriptsLangDir = path.join(outputDir, '..', '..', 'scripts', 'lang');
    
    // Create directory if not exists
    if (!existsSync(scriptsLangDir)) {
      mkdirSync(scriptsLangDir, { recursive: true });
    }

    // Generate for BOTH languages
    const languages = ['vi_VN', 'en_US'];
    
    for (const lang of languages) {
      // Look in script-lang folder
      const uiYamlPath = path.join(configDir, 'script-lang', lang, 'ui.yaml');
      const wikiYamlPath = path.join(configDir, 'script-lang', lang, 'wiki.yaml');
      
      let langData: Record<string, any> = {};

      // Load UI YAML
      if (existsSync(uiYamlPath)) {
        const uiContent = readFileSync(uiYamlPath, 'utf-8');
        const uiData = yaml.load(uiContent) as Record<string, any>;
        langData = { ...langData, ...uiData };
      } else {
        Logger.warn(`[ScriptLangBPGenerator] UI lang file not found: ${uiYamlPath}`);
      }

      // Load Wiki YAML
      if (existsSync(wikiYamlPath)) {
        const wikiContent = readFileSync(wikiYamlPath, 'utf-8');
        const wikiData = yaml.load(wikiContent) as Record<string, any>;
        langData = { ...langData, ...wikiData };
      }

      // Load Attribute Labels YAML (for {attr:*} placeholders)
      const attributeLabelsYamlPath = path.join(configDir, 'script-lang', lang, 'attributes.yaml');
      if (existsSync(attributeLabelsYamlPath)) {
        const attributesContent = readFileSync(attributeLabelsYamlPath, 'utf-8');
        const attributesData = yaml.load(attributesContent) as Record<string, any>;
        langData = { ...langData, attributes: attributesData };
      }

      // Load Attributes YAML (for lore templates)
      // Load from lore/attributes.yaml (contains templates)
      const attributesYamlPath = path.join(configDir, 'script-lang', lang, 'lore', 'attributes.yaml');
      if (existsSync(attributesYamlPath)) {
        const attributesContent = readFileSync(attributesYamlPath, 'utf-8');
        const attributesData = yaml.load(attributesContent) as Record<string, any>;
        // Merge with existing attributes (labels + templates)
        langData.attributes = { ...langData.attributes, ...attributesData };
      }

      if (Object.keys(langData).length === 0) {
        Logger.warn(`[ScriptLangBPGenerator] No lang data found for ${lang}`);
        continue;
      }

      // Generate TypeScript content
      const tsContent = this.generateTypeScriptContent(lang, langData);

      // Write to scripts/lang/
      const outputPath = path.join(scriptsLangDir, `${lang}.ts`);
      writeFileSync(outputPath, tsContent, 'utf-8');
      
      Logger.log(`✅ Đã tạo: scripts/lang/${lang}.ts`);
    }
  }

  /**
   * Generate TypeScript content from lang data
   */
  private static generateTypeScriptContent(lang: string, data: Record<string, any>): string {
    const langName = lang === 'vi_VN' ? 'Vietnamese' : 'English';
    const constName = lang === 'vi_VN' ? 'LANG_VI' : 'LANG_EN';

    return `/**
 * ${langName} Language File for APEIRIX
 * AUTO-GENERATED from configs/script-lang/${lang}/*.yaml
 * DO NOT EDIT - Changes will be overwritten
 */

export const ${constName} = ${JSON.stringify(data, null, 4)};
`;
  }
}
