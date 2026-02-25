import { randomUUID } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

interface UUIDCache {
  version: string;
  uuids: {
    bp: string;
    rp: string;
    bpModule: string;
    bpScript: string;
    rpModule: string;
  };
}

/**
 * UUID Generator for Minecraft addon manifests
 * Tự động cache UUID theo version để dễ debug
 */
export class UUIDGenerator {
  private static cacheFile = '.uuid-cache.json'; // Lưu trong current working directory

  /**
   * Generate a random UUID v4
   */
  static generate(): string {
    return randomUUID();
  }

  /**
   * Validate UUID format
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Generate or validate UUID
   * If "auto", generate new UUID
   * Otherwise validate and return existing UUID
   */
  static getOrGenerate(uuid: string | undefined): string {
    if (!uuid || uuid === 'auto') {
      return this.generate();
    }
    
    if (!this.isValid(uuid)) {
      throw new Error(`Invalid UUID format: ${uuid}`);
    }
    
    return uuid;
  }

  /**
   * Load UUID cache từ file
   */
  private static loadCache(): UUIDCache | null {
    if (!existsSync(this.cacheFile)) {
      return null;
    }

    try {
      const content = readFileSync(this.cacheFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('⚠️  Không thể đọc UUID cache, sẽ tạo mới');
      return null;
    }
  }

  /**
   * Save UUID cache vào file
   */
  private static saveCache(cache: UUIDCache): void {
    try {
      writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
      console.warn('⚠️  Không thể lưu UUID cache');
    }
  }

  /**
   * Get hoặc generate UUIDs dựa trên version
   * - Nếu version giống cache → dùng UUID cũ (dễ debug)
   * - Nếu version khác → generate UUID mới
   */
  static getUUIDsForVersion(version: [number, number, number]): {
    bp: string;
    rp: string;
    bpModule: string;
    bpScript: string;
    rpModule: string;
  } {
    const versionString = version.join('.');
    const cache = this.loadCache();

    // Nếu version giống cache → dùng UUID cũ
    if (cache && cache.version === versionString) {
      console.log(`📌 Dùng UUID cache cho version ${versionString} (dễ debug)`);
      return cache.uuids;
    }

    // Version khác → generate UUID mới
    console.log(`🆕 Generate UUID mới cho version ${versionString}`);
    const newUUIDs = {
      bp: this.generate(),
      rp: this.generate(),
      bpModule: this.generate(),
      bpScript: this.generate(),
      rpModule: this.generate()
    };

    // Save cache
    this.saveCache({
      version: versionString,
      uuids: newUUIDs
    });

    return newUUIDs;
  }
}
