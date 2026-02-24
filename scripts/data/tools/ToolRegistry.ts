/**
 * Tool Registry - Quản lý danh sách custom tools
 */

export interface ToolDefinition {
  id: string;
  type: "pickaxe" | "axe" | "shovel" | "hoe" | "sword" | "spear";
  durability: number;
}

export class ToolRegistry {
  private static tools: Map<string, ToolDefinition> = new Map();

  /**
   * Đăng ký tool mới
   */
  static register(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  /**
   * Kiểm tra xem item có phải custom tool không
   */
  static isTool(itemId: string): boolean {
    return this.tools.has(itemId);
  }

  /**
   * Lấy thông tin tool
   */
  static getTool(itemId: string): ToolDefinition | undefined {
    return this.tools.get(itemId);
  }

  /**
   * Lấy tất cả tools theo type
   */
  static getToolsByType(type: ToolDefinition["type"]): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(tool => tool.type === type);
  }

  /**
   * Lấy tất cả tool IDs
   */
  static getAllToolIds(): string[] {
    return Array.from(this.tools.keys());
  }
}
