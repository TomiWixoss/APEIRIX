import { existsSync } from 'fs';
import { extname } from 'path';

export class Validator {
  static validateItemId(id: string): boolean {
    // Item ID phải là lowercase, chỉ chứa a-z, 0-9, underscore
    const regex = /^[a-z0-9_]+$/;
    return regex.test(id);
  }

  static validateDisplayName(name: string): boolean {
    // Display name không được rỗng
    return name.trim().length > 0;
  }

  static validateTexturePath(path: string): boolean {
    // Kiểm tra file tồn tại và là PNG
    if (!existsSync(path)) {
      return false;
    }
    const ext = extname(path).toLowerCase();
    return ext === '.png';
  }

  static sanitizeItemId(input: string): string {
    // Chuyển về lowercase và thay space/dash bằng underscore
    return input.toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }
}
