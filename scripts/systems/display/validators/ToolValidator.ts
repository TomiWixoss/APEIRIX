/**
 * Tool Validator - Kiểm tra tool requirements
 */

import { BlockInfo } from '../BlockInfoProvider';

export class ToolValidator {
  /**
   * Kiểm tra xem player có đang cầm đúng tool không
   */
  static checkPlayerTool(player: any, blockInfo: BlockInfo): boolean {
    try {
      const inventory = player.getComponent('inventory');
      if (!inventory || !inventory.container) {
        return false;
      }
      
      const heldItem = inventory.container.getItem(player.selectedSlotIndex);
      
      // Không cầm gì = hand
      if (!heldItem) {
        return blockInfo.toolRequired === 'hand' || blockInfo.toolRequired === null;
      }
      
      const itemTypeId = heldItem.typeId.toLowerCase();
      
      // Check if holding correct tool type
      if (blockInfo.toolRequired === 'hand' || blockInfo.toolRequired === null) {
        // Block có thể đập bằng tay, bất kỳ tool nào cũng OK
        return true;
      }
      
      // Check tool type
      const requiredTool = blockInfo.toolRequired;
      if (!itemTypeId.includes(requiredTool)) {
        return false;
      }
      
      // Check tool tier if required
      if (blockInfo.toolTier) {
        return this.checkToolTier(itemTypeId, blockInfo.toolTier);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Kiểm tra tier của tool có đủ không
   */
  static checkToolTier(itemTypeId: string, requiredTier: string): boolean {
    const tierHierarchy = ['wooden', 'stone', 'iron', 'gold', 'diamond', 'netherite'];
    const requiredIndex = tierHierarchy.indexOf(requiredTier);
    
    if (requiredIndex === -1) {
      return true; // Unknown tier, assume OK
    }
    
    // Check item tier
    for (let i = requiredIndex; i < tierHierarchy.length; i++) {
      if (itemTypeId.includes(tierHierarchy[i])) {
        return true;
      }
    }
    
    return false;
  }
}
