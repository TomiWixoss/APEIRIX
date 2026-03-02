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
            
            // Update item in inventory
            inventory.container?.setItem(player.selectedSlotIndex, item);
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
            
            // Update item in inventory
            inventory.container?.setItem(player.selectedSlotIndex, item);
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
    
    console.warn('[TestBlockAttributeTransfer] Test commands registered');
  }
}
