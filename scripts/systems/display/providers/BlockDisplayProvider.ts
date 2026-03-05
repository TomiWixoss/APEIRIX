/**
 * Block Display Provider - Xử lý hiển thị thông tin blocks
 */

import { Block } from '@minecraft/server';
import { IDisplayProvider, DisplayInfo } from './IDisplayProvider';
import { BlockInfoProvider } from '../BlockInfoProvider';
import { ToolValidator } from '../validators/ToolValidator';
import { RawMessageFormatter } from '../formatters/RawMessageFormatter';
import { ColorFormatter } from '../formatters/ColorFormatter';
import { LangManager } from '../../../lang/LangManager';

export class BlockDisplayProvider implements IDisplayProvider {
  canHandle(target: any): boolean {
    return target && target.typeId !== undefined && target.dimension !== undefined;
  }

  getDisplayInfo(player: any, target: any): DisplayInfo | null {
    const block = target as Block;
    
    // Skip air blocks
    if (block.typeId === 'minecraft:air') {
      return null;
    }

    const blockInfo = BlockInfoProvider.getBlockInfo(block);
    const toolInfo = this.getToolRequirementText(blockInfo);
    const hasCorrectTool = ToolValidator.checkPlayerTool(player, blockInfo);
    const toolStatus = ColorFormatter.getToolStatusIcon(hasCorrectTool);

    // Build message
    if (blockInfo.localizationKey) {
      const prefix = ColorFormatter.COLORS.AQUA;
      const suffix = toolInfo ? ` §7| ${toolStatus} ${toolInfo}` : '';
      
      return {
        message: RawMessageFormatter.createTranslateMessage(
          blockInfo.localizationKey,
          prefix,
          suffix
        ),
        priority: 10
      };
    } else {
      // Fallback: dùng displayName
      const text = toolInfo 
        ? `§b${blockInfo.displayName} §7| ${toolStatus} ${toolInfo}`
        : `§b${blockInfo.displayName}`;
      
      return {
        message: RawMessageFormatter.createTextMessage(text),
        priority: 10
      };
    }
  }

  /**
   * Lấy text hiển thị cho tool requirement
   */
  private getToolRequirementText(blockInfo: any): string | null {
    if (!blockInfo.toolRequired) {
      return null;
    }
    
    // Hand mineable
    if (blockInfo.toolRequired === 'hand') {
      return `§7${LangManager.get('ui.display.tool.hand')}`;
    }
    
    // Tool required
    const toolName = LangManager.get(`ui.display.tool.${blockInfo.toolRequired}`);
    
    if (blockInfo.toolTier) {
      const color = ColorFormatter.getTierColor(blockInfo.toolTier);
      const tierName = LangManager.get(`ui.display.tier.${blockInfo.toolTier}`);
      return `${color}${toolName} ${tierName}+`;
    }
    
    return `§7${toolName}`;
  }
}
