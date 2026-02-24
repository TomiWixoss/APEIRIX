import path from 'path';
import { existsSync } from 'fs';

/**
 * Path resolution utilities for compiler
 */
export class PathResolver {
  /**
   * Resolve path relative to config file directory
   */
  static resolveFromConfig(configPath: string, relativePath: string): string {
    const configDir = path.dirname(configPath);
    return path.resolve(configDir, relativePath);
  }

  /**
   * Resolve texture path
   * Supports both relative and absolute paths
   */
  static resolveTexture(configPath: string, texturePath: string): string {
    // If absolute, return as-is
    if (path.isAbsolute(texturePath)) {
      return texturePath;
    }

    // Resolve relative to config directory
    return this.resolveFromConfig(configPath, texturePath);
  }

  /**
   * Validate that a file exists
   */
  static validateFile(filePath: string): boolean {
    return existsSync(filePath);
  }

  /**
   * Get relative path from source to target
   */
  static getRelativePath(from: string, to: string): string {
    return path.relative(from, to);
  }

  /**
   * Normalize path separators to forward slashes (for JSON)
   */
  static normalize(filePath: string): string {
    return filePath.replace(/\\/g, '/');
  }
}
