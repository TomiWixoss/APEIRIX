/**
 * Hammer Registry - Quản lý hammer mining drops
 */

export interface HammerMiningDefinition {
  blockId: string;
  stoneDust: string;
  stoneDustCount: number;
  oreDust?: string;
  oreDustCount?: number;
}

export class HammerRegistry {
  private static blocks: Map<string, HammerMiningDefinition> = new Map();
  private static hammerIds: Set<string> = new Set();

  /**
   * Đăng ký block có thể mine bằng hammer
   */
  static registerBlock(block: HammerMiningDefinition): void {
    this.blocks.set(block.blockId, block);
  }

  /**
   * Đăng ký hammer tool ID
   */
  static registerHammer(hammerId: string): void {
    this.hammerIds.add(hammerId);
  }

  /**
   * Kiểm tra xem tool có phải hammer không
   */
  static isHammer(toolId: string): boolean {
    return this.hammerIds.has(toolId);
  }

  /**
   * Kiểm tra xem block có thể mine bằng hammer không
   */
  static isHammerMineable(blockId: string): boolean {
    return this.blocks.has(blockId);
  }

  /**
   * Lấy thông tin dust drops cho block
   */
  static getDrops(blockId: string): HammerMiningDefinition | undefined {
    return this.blocks.get(blockId);
  }

  /**
   * Lấy tất cả hammer IDs
   */
  static getAllHammerIds(): string[] {
    return Array.from(this.hammerIds);
  }

  /**
   * Lấy tất cả hammer-mineable block IDs
   */
  static getAllBlockIds(): string[] {
    return Array.from(this.blocks.keys());
  }
}
