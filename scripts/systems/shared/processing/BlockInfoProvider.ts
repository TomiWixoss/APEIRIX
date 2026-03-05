/**
 * Block Info Provider - Cung cấp thông tin về blocks
 * Better SB - Simplified version (no machines yet)
 */

import { Block } from '@minecraft/server';

export interface BlockInfo {
  displayName: string;
  blockType: string;
}

export class BlockInfoProvider {
  /**
   * Lấy thông tin về block - hiển thị tên cho MỌI blocks
   */
  static getBlockInfo(block: Block): BlockInfo {
    const blockId = block.typeId;
    
    // Format tên: minecraft:stone -> Stone
    const displayName = this.formatBlockName(blockId);
    
    return {
      displayName,
      blockType: 'block'
    };
  }

  /**
   * Format block ID thành tên hiển thị
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
