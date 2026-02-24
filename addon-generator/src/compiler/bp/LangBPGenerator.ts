import path from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { LangGenerator } from '../../generators/LangGenerator.js';

/**
 * Generate BP lang files
 */
export class LangBPGenerator {
  static async generate(config: any, outputDir: string): Promise<number> {
    const generator = new LangGenerator(outputDir);
    const entries: Record<string, string> = {};

    // Collect all lang entries
    if (config.items) {
      for (const item of config.items) {
        if (item.name) {
          entries[`item.apeirix.${item.id}.name`] = item.name;
        }
      }
    }

    if (config.tools) {
      for (const tool of config.tools) {
        if (tool.name) {
          entries[`item.apeirix.${tool.id}.name`] = tool.name;
        }
      }
    }

    if (config.armor) {
      for (const armor of config.armor) {
        if (armor.name) {
          entries[`item.apeirix.${armor.id}.name`] = armor.name;
        }
      }
    }

    if (config.foods) {
      for (const food of config.foods) {
        if (food.name) {
          entries[`item.apeirix.${food.id}.name`] = food.name;
        }
      }
    }

    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.name) {
          entries[`tile.apeirix:${block.id}.name`] = block.name;
        }
      }
    }

    if (config.ores) {
      for (const ore of config.ores) {
        if (ore.name) {
          entries[`tile.apeirix:${ore.id}.name`] = ore.name;
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
