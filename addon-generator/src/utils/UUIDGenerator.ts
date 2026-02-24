import { randomUUID } from 'crypto';

/**
 * UUID Generator for Minecraft addon manifests
 */
export class UUIDGenerator {
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
}
