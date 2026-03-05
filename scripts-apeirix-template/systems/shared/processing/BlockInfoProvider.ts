/**
 * Block Info Provider - Cung cấp thông tin về blocks trong addon
 * 
 * Hỗ trợ:
 * - Phát hiện block có phải là block của addon không
 * - Lấy tên hiển thị từ generated data (đã resolve từ lang)
 * - Phát hiện loại block (machine, ore, storage, etc.)
 * 
 * Data được generate tự động từ YAML configs
 */

import { Block } from '@minecraft/server';
import { MachineStateManager } from './MachineState';
import { GENERATED_BLOCKS } from '../../../data/GeneratedGameData';

export interface BlockInfo {
  isAddonBlock: boolean;
  displayName: string;
  blockType: 'machine' | 'ore' | 'storage' | 'other';
  machineType?: string; // Chỉ có khi blockType === 'machine'
  isProcessing?: boolean; // Chỉ có khi blockType === 'machine'
}

export class BlockInfoProvider {
  private static readonly ADDON_NAMESPACE = 'apeirix:';
  
  // Build lookup map from generated data (lazy initialization)
  private static blockMap: Map<string, { blockType: string; machineType?: string; displayName: string }> | null = null;

  /**
   * Initialize block map from generated data
   */
  private static initializeBlockMap(): void {
    if (this.blockMap) return;
    
    this.blockMap = new Map();
    
    for (const block of GENERATED_BLOCKS) {
      this.blockMap.set(block.blockId, {
        blockType: block.blockType,
        machineType: (block as any).machineType, // Optional field
        displayName: block.displayName
      });
    }
  }

  /**
   * Lấy thông tin về block
   */
  static getBlockInfo(block: Block): BlockInfo {
    // Lazy init
    this.initializeBlockMap();
    
    const blockId = block.typeId;

    // Kiểm tra có phải block của addon không
    if (!blockId.startsWith(this.ADDON_NAMESPACE)) {
      return {
        isAddonBlock: false,
        displayName: '',
        blockType: 'other'
      };
    }

    // Lookup trong generated data
    const blockData = this.blockMap!.get(blockId);
    
    if (!blockData) {
      // Block không có trong generated data - fallback
      return this.getFallbackBlockInfo(blockId);
    }

    // Build block info
    const info: BlockInfo = {
      isAddonBlock: true,
      displayName: blockData.displayName,
      blockType: blockData.blockType as any
    };

    // Nếu là machine, thêm thông tin machine
    if (blockData.blockType === 'machine' && blockData.machineType) {
      info.machineType = blockData.machineType;
      
      // Check processing state
      const state = MachineStateManager.get(block.dimension.id, block.location);
      info.isProcessing = state?.isProcessing ?? false;
    }

    return info;
  }

  /**
   * Fallback cho blocks không có trong generated data
   */
  private static getFallbackBlockInfo(blockId: string): BlockInfo {
    const itemName = blockId.replace(this.ADDON_NAMESPACE, '');

    return {
      isAddonBlock: true,
      displayName: itemName, // Fallback to ID
      blockType: 'other'
    };
  }
}
