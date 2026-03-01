import { existsSync } from 'fs';
import { extname } from 'path';

/**
 * Core validation logic - không phụ thuộc vào context
 */
export class Validator {
  static validateItemId(id: string): boolean {
    // Allow vanilla items with minecraft: prefix
    if (id.startsWith('minecraft:')) {
      const vanillaId = id.substring('minecraft:'.length);
      const regex = /^[a-z0-9_]+$/;
      return regex.test(vanillaId);
    }
    
    // Custom items (no namespace)
    const regex = /^[a-z0-9_]+$/;
    return regex.test(id);
  }

  static validateDisplayName(name: string): boolean {
    return name.trim().length > 0;
  }

  static validateTexturePath(path: string): boolean {
    if (!existsSync(path)) return false;
    const ext = extname(path).toLowerCase();
    return ext === '.png';
  }

  static sanitizeItemId(input: string): string {
    return input.toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
