import { parse as parseYaml } from 'yaml';
import { FileManager } from '../FileManager.js';
import { ContentConfig } from '../types/ConfigTypes.js';

/**
 * YAML file loader
 */
export class YamlLoader {
  static load(filePath: string): ContentConfig {
    const content = FileManager.readText(filePath);
    if (!content) {
      throw new Error(`Cannot read file: ${filePath}`);
    }

    try {
      return parseYaml(content) as ContentConfig;
    } catch (error) {
      throw new Error(`Invalid YAML in ${filePath}: ${error}`);
    }
  }
}
