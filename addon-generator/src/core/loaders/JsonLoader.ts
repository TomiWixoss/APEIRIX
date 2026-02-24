import { FileManager } from '../FileManager.js';
import { ContentConfig } from '../types/ConfigTypes.js';

/**
 * JSON file loader
 */
export class JsonLoader {
  static load(filePath: string): ContentConfig {
    const data = FileManager.readJSON<ContentConfig>(filePath);
    if (!data) {
      throw new Error(`Cannot read file: ${filePath}`);
    }
    return data;
  }
}
