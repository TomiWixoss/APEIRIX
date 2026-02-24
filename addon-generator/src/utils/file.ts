import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';

export class FileUtils {
  static ensureDir(filePath: string): void {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  static readJSON(filePath: string): any {
    if (!existsSync(filePath)) {
      return null;
    }
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  static writeJSON(filePath: string, data: any): void {
    this.ensureDir(filePath);
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  static readLines(filePath: string): string[] {
    if (!existsSync(filePath)) {
      return [];
    }
    return readFileSync(filePath, 'utf-8').split('\n');
  }

  static writeLines(filePath: string, lines: string[]): void {
    this.ensureDir(filePath);
    writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }

  static copyFile(sourcePath: string, destPath: string): void {
    this.ensureDir(destPath);
    copyFileSync(sourcePath, destPath);
  }

  static replaceTemplate(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }
}
