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

    // If configPath is a directory (no extension), add dummy file to simulate file location
    const ext = path.extname(configPath);
    if (!ext) {
      // Texture paths in YAML are relative to the YAML file, not the directory
      // So we need to add a dummy filename to make dirname() work correctly
      configPath = path.join(configPath, 'entity.yaml');
    }

    // Resolve relative to config file's directory
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
