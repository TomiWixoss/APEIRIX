/**
 * Block Info Provider - Cung cấp thông tin về blocks
 * Better SB - Simplified version (no machines yet)
 * Supports localized names from resource packs (e.g., Vietnamese)
 */

import { Block } from '@minecraft/server';

export interface BlockInfo {
  displayName: string;
  blockType: string;
  localizationKey: string | null; // Key để translate theo ngôn ngữ player
}

export class BlockInfoProvider {
  /**
   * Lấy thông tin về block - hiển thị tên đã được localize
   */
  static getBlockInfo(block: Block): BlockInfo {
    // Lấy localization key để Minecraft tự translate
    const localizationKey = this.getBlockLocalizationKey(block);
    
    // Fallback name nếu không có localization key (format từ block ID)
    const displayName = this.formatBlockName(block.typeId);
    
    return {
      displayName,
      blockType: 'block',
      localizationKey
    };
  }

  /**
   * Lấy localization key của block
   * Trả về key để Minecraft client tự translate theo ngôn ngữ của player
   */
  private static getBlockLocalizationKey(block: Block): string | null {
    try {
      // Tạo ItemStack từ block để lấy localizationKey
      const itemStack = block.getItemStack(1);
      
      if (itemStack && itemStack.localizationKey) {
        return itemStack.localizationKey;
      }
    } catch (error) {
      // Một số blocks không thể convert thành ItemStack
    }
    
    return null;
  }

  /**
   * Fallback: Format block ID thành tên hiển thị
   */
  private static formatBlockName(blockId: string): string {
    // Remove namespace (minecraft:, apeirix:, etc.)
    let name = blockId.includes(':') ? blockId.split(':')[1] : blockId;
    
    // Replace underscores with spaces and capitalize
    name = name.replace(/_/g, ' ');
    name = name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return name;
  }
}
