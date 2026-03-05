/**
 * Ore Registry - Quản lý danh sách custom ore blocks
 */

export interface OreDefinition {
  blockId: string;
  dropItem: string;
  dropCount: number;
  fortuneEnabled: boolean;
}

export class OreRegistry {
  private static ores: Map<string, OreDefinition> = new Map();

  /**
   * Đăng ký ore mới
   */
  static register(ore: OreDefinition): void {
    this.ores.set(ore.blockId, ore);
  }

  /**
   * Kiểm tra xem block có phải custom ore không
   */
  static isOre(blockId: string): boolean {
    return this.ores.has(blockId);
  }

  /**
   * Lấy thông tin ore
   */
  static getOre(blockId: string): OreDefinition | undefined {
    return this.ores.get(blockId);
  }

  /**
   * Lấy tất cả ores có Fortune enabled
   */
  static getFortuneEnabledOres(): OreDefinition[] {
    return Array.from(this.ores.values()).filter(ore => ore.fortuneEnabled);
  }

  /**
   * Lấy tất cả ore block IDs
   */
  static getAllOreIds(): string[] {
    return Array.from(this.ores.keys());
  }
}
