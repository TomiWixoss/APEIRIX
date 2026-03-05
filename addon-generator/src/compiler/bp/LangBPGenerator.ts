import path from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { LangGenerator } from '../../generators/LangGenerator.js';

/**
 * Generate BP lang files
 */
export class LangBPGenerator {
  static async generate(config: any, outputDir: string, configDir: string = ''): Promise<number> {
    const language = config.addon?.language || config.language || 'en_US';
    const generator = new LangGenerator(outputDir, configDir, language);
    const entries: Record<string, string> = {};

    // Collect all lang entries
    if (config.items) {
      for (const item of config.items) {
        if (item.name) {
          const displayName = generator.resolveName(item.name);
          entries[`item.apeirix.${item.id}.name`] = displayName;
        }
      }
    }

    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.name) {
          const displayName = generator.resolveName(tool.name);
          entries[`item.apeirix.${tool.id}.name`] = displayName;
        }
      }
    }

    if (config.armor) {
      for (const armor of config.armor) {
        if (armor.name) {
          const displayName = generator.resolveName(armor.name);
          entries[`item.apeirix.${armor.id}.name`] = displayName;
        }
      }
    }

    if (config.foods) {
      for (const food of config.foods) {
        if (food.name) {
          const displayName = generator.resolveName(food.name);
          entries[`item.apeirix.${food.id}.name`] = displayName;
        }
      }
    }

    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.name) {
          const displayName = generator.resolveName(block.name);
          entries[`tile.apeirix:${block.id}.name`] = displayName;
        }
      }
    }

    if (config.ores) {
      for (const ore of config.ores) {
        if (ore.name) {
          const displayName = generator.resolveName(ore.name);
          entries[`tile.apeirix:${ore.id}.name`] = displayName;
        }
      }
    }

    // Resolve pack name and description from lang
    let packName: string | undefined;
    let packDescription: string | undefined;
    
    if (config.addon?.name) {
      packName = generator.resolveName(config.addon.name);
    }
    if (config.addon?.description) {
      packDescription = generator.resolveName(config.addon.description);
    }

    // Generate lang file with pack metadata
    const version = config.addon?.version as [number, number, number] | undefined;
    generator.generate(entries, 'BP', packName, packDescription, version);

    // Generate languages.json
    this.generateLanguagesJson(outputDir, language);

    return Object.keys(entries).length;
  }

  private static generateLanguagesJson(outputDir: string, language: string = 'en_US'): void {
    const textsDir = path.join(outputDir, 'texts');
    if (!existsSync(textsDir)) {
      mkdirSync(textsDir, { recursive: true });
    }

    const languagesJson = [language];
    const languagesPath = path.join(textsDir, 'languages.json');
    writeFileSync(languagesPath, JSON.stringify(languagesJson, null, 2));
  }
}
