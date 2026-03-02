/**
 * Test script for Block Attribute Transfer System
 * 
 * Usage in-game:
 * 1. Hold a mangrove log item (has requires_tool: axe)
 * 2. Run command: /scriptevent test:transfer_to_dirt
 * 3. Try mining dirt without axe → Should be blocked
 * 4. Run command: /scriptevent test:transfer_back
 * 5. Try mining dirt without axe → Should work
 */

import { world, system, Player, ItemStack } from '@minecraft/server';
import { AttributeAPI } from '../systems/attributes/AttributeAPI';
import { GlobalBlockAttributeRegistry } from '../systems/attributes/GlobalBlockAttributeRegistry';

export class TestBlockAttributeTransfer {
  static initialize(): void {
    // Test 1: Transfer from item to block type
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_to_dirt') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const inventory = player.getComponent('inventory');
          if (!inventory) {
            player.sendMessage('§cNo inventory component');
            return;
          }
          
          const item = inventory.container?.getItem(player.selectedSlotIndex);
          if (!item) {
            player.sendMessage('§cNo item in hand');
            return;
          }
          
          player.sendMessage(`§eTransferring requires_tool from ${item.typeId} to minecraft:dirt...`);
          
          const success = AttributeAPI.transferAttributeToBlockType(
            item,
            'requires_tool',
            'minecraft:dirt'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Dirt now requires axe to mine');
            player.sendMessage('§7Pickup dirt item to see lore auto-apply');
            
            // Force item refresh in inventory
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, item);
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 2: Transfer from block type back to item
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_back') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const inventory = player.getComponent('inventory');
          if (!inventory) {
            player.sendMessage('§cNo inventory component');
            return;
          }
          
          const item = inventory.container?.getItem(player.selectedSlotIndex);
          if (!item) {
            player.sendMessage('§cNo item in hand');
            return;
          }
          
          player.sendMessage(`§eTransferring requires_tool from minecraft:dirt to ${item.typeId}...`);
          
          const success = AttributeAPI.transferAttributeFromBlockType(
            'minecraft:dirt',
            item,
            'requires_tool'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Dirt no longer requires axe');
            player.sendMessage('§7Try mining dirt without axe');
            
            // Force item refresh in inventory
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, item);
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 3: Check registry state
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:check_registry') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const allAttrs = GlobalBlockAttributeRegistry.getAllBlockAttributes();
          const count = Object.keys(allAttrs).length;
          
          player.sendMessage(`§eBlock Attribute Registry: ${count} block types`);
          
          for (const [blockId, attrs] of Object.entries(allAttrs)) {
            const attrList = Object.keys(attrs).join(', ');
            player.sendMessage(`§7- ${blockId}: ${attrList}`);
          }
          
          if (count === 0) {
            player.sendMessage('§7Registry is empty');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 4: Clear registry
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:clear_registry') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          GlobalBlockAttributeRegistry.clearAll();
          player.sendMessage('§aRegistry cleared');
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 5: Transfer between items (item to item)
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_item_to_item') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const inventory = player.getComponent('inventory');
          if (!inventory) {
            player.sendMessage('§cNo inventory component');
            return;
          }
          
          // Get source item (selected slot)
          const sourceItem = inventory.container?.getItem(player.selectedSlotIndex);
          if (!sourceItem) {
            player.sendMessage('§cNo source item in hand');
            return;
          }
          
          // Get target item (next slot)
          const targetSlot = (player.selectedSlotIndex + 1) % inventory.container!.size;
          const targetItem = inventory.container?.getItem(targetSlot);
          if (!targetItem) {
            player.sendMessage('§cNo target item in next slot');
            return;
          }
          
          player.sendMessage(`§eTransferring requires_tool from ${sourceItem.typeId} to ${targetItem.typeId}...`);
          
          const success = AttributeAPI.transferAttribute(
            sourceItem,
            targetItem,
            'requires_tool'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Attribute transferred between items');
            
            // Force item refresh in inventory for both items
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, sourceItem);
            AttributeAPI.forceItemRefreshInInventory(player, targetSlot, targetItem);
            
            player.sendMessage('§7Lore updated instantly!');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 6: Transfer between block types (block to block)
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_block_to_block') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          player.sendMessage(`§eTransferring requires_tool from minecraft:dirt to minecraft:cobblestone...`);
          
          const success = AttributeAPI.transferAttributeBetweenBlockTypes(
            'minecraft:dirt',
            'minecraft:cobblestone',
            'requires_tool'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Cobblestone now requires axe, dirt no longer requires axe');
            player.sendMessage('§7Try mining both blocks to verify');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 7: Transfer from tool to block (real-world use case)
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_tool_to_block') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const inventory = player.getComponent('inventory');
          if (!inventory) {
            player.sendMessage('§cNo inventory component');
            return;
          }
          
          const tool = inventory.container?.getItem(player.selectedSlotIndex);
          if (!tool) {
            player.sendMessage('§cNo tool in hand');
            return;
          }
          
          // Check if tool has any attributes
          const attrs = AttributeAPI.getAttributes(tool);
          if (attrs.length === 0) {
            player.sendMessage('§cTool has no attributes to transfer');
            return;
          }
          
          // Transfer first attribute to dirt
          const attrId = attrs[0].id;
          player.sendMessage(`§eTransferring '${attrId}' from ${tool.typeId} to minecraft:dirt...`);
          
          const success = AttributeAPI.transferAttributeToBlockType(
            tool,
            attrId,
            'minecraft:dirt'
          );
          
          if (success) {
            player.sendMessage(`§aSuccess! Dirt now has '${attrId}', tool lost it`);
            
            // Force item refresh in inventory
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, tool);
            
            player.sendMessage('§7Lore updated instantly!');
            player.sendMessage('§7Try mining dirt to verify block attribute');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    console.warn('[TestBlockAttributeTransfer] Test commands registered');
  }
}
