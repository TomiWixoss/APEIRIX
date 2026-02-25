import path from 'path';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';

/**
 * Generate TypeScript lang files for scripts from YAML
 * Generates BOTH vi_VN.ts and en_US.ts
 * LangManager will load the correct one based on GeneratedLanguage.ts
 */
export class ScriptLangBPGenerator {
  /**
   * Generate script lang files (vi_VN.ts, en_US.ts) from YAML
   */
  static async generate(configDir: string, outputDir: string): Promise<void> {
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
      const langYamlPath = path.join(configDir, 'script-lang', lang, 'ui.yaml');
      
      if (!existsSync(langYamlPath)) {
        console.warn(`[ScriptLangBPGenerator] UI lang file not found: ${langYamlPath}`);
        continue;
      }

      // Load YAML
      const yamlContent = readFileSync(langYamlPath, 'utf-8');
      const langData = yaml.load(yamlContent) as Record<string, any>;

      // Generate TypeScript content
      const tsContent = this.generateTypeScriptContent(lang, langData);

      // Write to scripts/lang/
      const outputPath = path.join(scriptsLangDir, `${lang}.ts`);
      writeFileSync(outputPath, tsContent, 'utf-8');
      
      console.log(`✅ Đã tạo: scripts/lang/${lang}.ts`);
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
 * AUTO-GENERATED from configs/script-lang/${lang}/ui.yaml
 * DO NOT EDIT - Changes will be overwritten
 */

export const ${constName} = ${JSON.stringify(data, null, 4)};
`;
  }
}
