/**
 * RequiresToolHandler - Prevents breaking blocks without required tool
 * 
 * Attribute config:
 * ```yaml
 * attributes:
 *   requires_tool:
 *     toolType: axe | pickaxe
 * ```
 */

import { world, Player, Block, ItemStack, system } from '@minecraft/server';
import { hasAttribute, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { LangManager } from '../../../lang/LangManager';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';
import { AttributeResolver } from '../AttributeResolver';

export class RequiresToolHandler {
  static readonly ATTRIBUTE_ID = 'requires_tool';
  static readonly TEMPLATE_KEY = 'requires_tool_template';

  /**
   * Get lore template key for this attribute
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }

  /**
   * Process lore placeholders
   * 
   * DYNAMIC: Uses AttributeResolver to get resolved config (static + dynamic)
   */
  static processLorePlaceholders(itemId: string, line: string, itemStack?: ItemStack): string {
    let config: any;
    
    // If itemStack provided, resolve dynamic attributes
    if (itemStack) {
      const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID, system.currentTick);
      config = resolved?.config;
    } else {
      // Fallback to static config (for compile-time generation)
      config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    }
    
    if (!config) return line;

    const toolType = config.toolType || 'axe';

    // Translate tool type
    const toolTypeTranslated = toolType === 'axe' ? LangManager.get('tool_type.axe') : LangManager.get('tool_type.pickaxe');

    return line.replace(/{tool_type}/g, toolTypeTranslated);
  }

  /**
   * Initialize handler - subscribe to block break events
   */
  static initialize(): void {
    console.warn('[RequiresToolHandler] Initializing...');

    // Register with PlaceholderRegistry for lore processing
    PlaceholderRegistry.registerAttributeHandler(this);

    // Subscribe to player break block before event
    world.beforeEvents.playerBreakBlock.subscribe((event) => {
      this.onPlayerBreakBlock(event);
    });

    console.warn('[RequiresToolHandler] Initialized');
  }

  /**
   * Handle player break block event
   */
  private static onPlayerBreakBlock(event: any): void {
    const { player, block } = event;
    
    // Get block type ID
    const blockTypeId = block.typeId;
    
    // Check if this block has requires_tool attribute
    if (!hasAttribute(blockTypeId, this.ATTRIBUTE_ID)) {
      return;
    }

    // Get attribute config
    const config = getAttributeConfig(blockTypeId, this.ATTRIBUTE_ID);
    if (!config) return;

    const requiredToolType = config.toolType || 'axe';

    // Get player's equipped item
    const equippedItem = player.getComponent('minecraft:equippable')?.getEquipment('Mainhand');

    // Check if player has correct tool type
    if (!this.hasCorrectToolType(equippedItem, requiredToolType)) {
      // Cancel the break event
      event.cancel = true;

      // Show message on action bar (must use system.run to escape restricted context)
      const toolTypeTranslated = requiredToolType === 'axe' ? LangManager.get('tool_type.axe') : LangManager.get('tool_type.pickaxe');
      const message = LangManager.get('message.requires_tool').replace('{tool_type}', toolTypeTranslated);
      
      system.run(() => {
        player.onScreenDisplay.setActionBar(message);
      });
    }
  }

  /**
   * Check if player has correct tool type (simplified - no tier check)
   */
  private static hasCorrectToolType(item: ItemStack | undefined, requiredType: string): boolean {
    if (!item) return false;

    const tags = item.getTags();

    // Check tool type only
    const requiredTag = requiredType === 'axe' ? 'minecraft:is_axe' : 'minecraft:is_pickaxe';
    return tags.includes(requiredTag);
  }
}
