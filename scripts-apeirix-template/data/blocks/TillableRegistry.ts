/**
 * Tillable Registry - Quản lý blocks có thể cuốc
 */

export interface TillableDefinition {
  blockId: string;
  resultBlock: string;
  sound?: string;
}

export class TillableRegistry {
  private static tillables: Map<string, TillableDefinition> = new Map();

  /**
   * Đăng ký tillable block mới
   */
  static register(tillable: TillableDefinition): void {
    this.tillables.set(tillable.blockId, tillable);
  }

  /**
   * Kiểm tra xem block có thể cuốc không
   */
  static isTillable(blockId: string): boolean {
    return this.tillables.has(blockId);
  }

  /**
   * Lấy thông tin tillable
   */
  static getTillable(blockId: string): TillableDefinition | undefined {
    return this.tillables.get(blockId);
  }

  /**
   * Đăng ký nhiều vanilla tillable blocks
   */
  static registerVanillaTillables(): void {
    const vanillaTillables = [
      "minecraft:dirt",
      "minecraft:grass_block",
      "minecraft:dirt_path",
      "minecraft:coarse_dirt"
    ];

    vanillaTillables.forEach(blockId => {
      this.register({
        blockId,
        resultBlock: "farmland",
        sound: "use.grass"
      });
    });
  }
}
