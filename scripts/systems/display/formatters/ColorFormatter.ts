/**
 * Color Formatter - Color codes và formatting
 */

export class ColorFormatter {
  // Color codes
  static readonly COLORS = {
    BLACK: '§0',
    DARK_BLUE: '§1',
    DARK_GREEN: '§2',
    DARK_AQUA: '§3',
    DARK_RED: '§4',
    DARK_PURPLE: '§5',
    GOLD: '§6',
    GRAY: '§7',
    DARK_GRAY: '§8',
    BLUE: '§9',
    GREEN: '§a',
    AQUA: '§b',
    RED: '§c',
    LIGHT_PURPLE: '§d',
    YELLOW: '§e',
    WHITE: '§f',
    RESET: '§r'
  };

  // Tier colors
  static readonly TIER_COLORS: Record<string, string> = {
    'wooden': '§7',
    'stone': '§8',
    'iron': '§f',
    'gold': '§6',
    'diamond': '§b',
    'netherite': '§5'
  };

  /**
   * Get color cho tier
   */
  static getTierColor(tier: string): string {
    return this.TIER_COLORS[tier] || this.COLORS.GRAY;
  }

  /**
   * Format tool status icon
   */
  static getToolStatusIcon(hasCorrectTool: boolean): string {
    return hasCorrectTool ? '§a✓' : '§c✗';
  }
}
