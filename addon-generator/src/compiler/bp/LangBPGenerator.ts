import path from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { LangGenerator } from '../../generators/LangGenerator.js';

/**
 * Generate BP lang files
 */
export class LangBPGenerator {
  static async generate(config: any, outputDir: string, configDir: string = ''): Promise<number> {
    const generator = new LangGenerator(outputDir, configDir);
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

    // Generate lang file
    generator.generate(entries, 'BP');

    // Generate languages.json
    this.generateLanguagesJson(outputDir);

    return Object.keys(entries).length;
  }

  private static generateLanguagesJson(outputDir: string): void {
    const textsDir = path.join(outputDir, 'texts');
    if (!existsSync(textsDir)) {
      mkdirSync(textsDir, { recursive: true });
    }

    const languagesJson = ['en_US'];
    const languagesPath = path.join(textsDir, 'languages.json');
    writeFileSync(languagesPath, JSON.stringify(languagesJson, null, 2));
  }
}
