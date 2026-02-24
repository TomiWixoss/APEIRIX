import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'fs';
import { dirname } from 'path';

/**
 * Core file operations - không phụ thuộc vào logic business
 */
export class FileManager {
  static ensureDir(filePath: string): void {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  static exists(filePath: string): boolean {
    return existsSync(filePath);
  }

  static readJSON<T = any>(filePath: string): T | null {
    if (!existsSync(filePath)) return null;
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }

  static writeJSON(filePath: string, data: any): void {
    this.ensureDir(filePath);
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  static readText(filePath: string): string | null {
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, 'utf-8');
  }

  static writeText(filePath: string, content: string): void {
    this.ensureDir(filePath);
    writeFileSync(filePath, content, 'utf-8');
  }

  static copyFile(source: string, dest: string): void {
    this.ensureDir(dest);
    copyFileSync(source, dest);
  }

  static readLines(filePath: string): string[] {
    const content = this.readText(filePath);
    return content ? content.split('\n') : [];
  }

  static writeLines(filePath: string, lines: string[]): void {
    this.writeText(filePath, lines.join('\n'));
  }

  static deleteFile(filePath: string): void {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
