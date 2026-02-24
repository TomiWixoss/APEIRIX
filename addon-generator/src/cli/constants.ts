import { join } from 'path';

/**
 * Default project root - parent directory của addon-generator
 * Khi chạy từ addon-generator/, project root sẽ là APEIRIX/
 */
export const DEFAULT_PROJECT_ROOT = join(process.cwd(), '..');
