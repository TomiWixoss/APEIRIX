/**
 * Block Info Provider - Cung cấp thông tin về blocks
 * Better SB - Simplified version (no machines yet)
 * Supports localized names from resource packs (e.g., Vietnamese)
 */

import { Block, ItemStack } from '@minecraft/server';

export interface BlockInfo {
  displayName: string;
  blockType: string;
}

export class BlockInfoProvider {
  /**
   * Lấy thông tin về block - hiển thị tên đã được localize
   */
  static getBlockInfo(block: Block): BlockInfo {
    // Lấy tên đã được localize từ game (hỗ trợ resource pack tiếng Việt)
    const displayName = this.getLocalizedBlockName(block);
    
    return {
      displayName,
      blockType: 'block'
    };
  }

  /**
   * Lấy tên block đã được localize từ game
   * Hỗ trợ resource pack ngôn ngữ (Vietnamese, etc.)
   */
  private static getLocalizedBlockName(block: Block): string {
    try {
      // Tạo ItemStack từ block để lấy nameTag (localized)
      const itemStack = block.getItemStack(1);
      
      if (itemStack && itemStack.nameTag) {
        return itemStack.nameTag;
      }
    } catch (error) {
      // Một số blocks không thể convert thành ItemStack
    }
    
    // Fallback: Format từ block ID
    return this.formatBlockName(block.typeId);
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
