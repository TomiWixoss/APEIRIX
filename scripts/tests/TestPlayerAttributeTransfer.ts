/**
 * Test script for Player Attribute Transfer System
 * 
 * Player cũng là Entity, nên có thể:
 * - Xem attributes của player
 * - Thêm/xóa/sửa attributes
 * - Transfer attributes giữa Player ↔ Item ↔ Entity ↔ Block
 * 
 * Usage in-game:
 * 1. /scriptevent test:check_player_attrs - Xem attributes của player (chính mình)
 * 2. /scriptevent test:add_hunger_to_player - Thêm hunger_infliction cho player
 * 3. /scriptevent test:remove_player_attr - Xóa attribute từ player
 * 4. /scriptevent test:transfer_player_to_item - Chuyển attribute từ player sang item
 * 5. /scriptevent test:transfer_item_to_player - Chuyển attribute từ item sang player
 * 6. /scriptevent test:transfer_player_to_zombie - Chuyển attribute từ player sang zombie
 * 
 * WIKI BOOK:
 * - Shift + Right-click vào player khác → Xem attributes của player đó
 * - Shift + Sneak + Use wiki book (không aim entity) → Xem attributes của chính mình
 */

import { world, system, Player } from '@minecraft/server';
import { AttributeAPI } from '../systems/attributes/AttributeAPI';
import { EntityAttributeStorage } from '../systems/attributes/EntityAttributeStorage';

export class TestPlayerAttributeTransfer {
  static initialize(): void {
    // Test 1: Check player attributes
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:check_player_attrs') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const attrs = AttributeAPI.getEntityAttributes(player);
          
          if (attrs.length === 0) {
            player.sendMessage('§7Bạn không có attributes nào');
          } else {
            player.sendMessage(`§ePlayer có ${attrs.length} attributes:`);
            for (const attr of attrs) {
              player.sendMessage(`§7- ${attr.id}: ${JSON.stringify(attr.config)}`);
            }
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 2: Add hunger_infliction to player
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:add_hunger_to_player') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          // Add hunger_infliction attribute
          EntityAttributeStorage.setAttribute(player, 'hunger_infliction', {
            duration: 100,
            amplifier: 0
          });
          
          player.sendMessage('§aĐã thêm hunger_infliction cho player');
          player.sendMessage('§7Đánh mob để test (mob sẽ bị đói)');
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 3: Remove attribute from player
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:remove_player_attr') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const attrs = AttributeAPI.getEntityAttributes(player);
          
          if (attrs.length === 0) {
            player.sendMessage('§cKhông có attribute nào để xóa');
            return;
          }
          
          // Remove first attribute
          const attrId = attrs[0].id;
          const success = EntityAttributeStorage.removeAttribute(player, attrId);
          
          if (success) {
            player.sendMessage(`§aĐã xóa attribute: ${attrId}`);
          } else {
            player.sendMessage(`§cFailed to remove attribute`);
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 4: Transfer from player to item
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_player_to_item') {
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
          
          const attrs = AttributeAPI.getEntityAttributes(player);
          if (attrs.length === 0) {
            player.sendMessage('§cPlayer không có attribute nào');
            return;
          }
          
          const attrId = attrs[0].id;
          player.sendMessage(`§eTransferring '${attrId}' from player to ${item.typeId}...`);
          
          const success = AttributeAPI.transferAttributeFromEntity(
            player,
            item,
            attrId
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Item có attribute, player mất attribute');
            
            // Force item refresh
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, item);
            
            player.sendMessage('§7Lore updated instantly!');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 5: Transfer from item to player
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_item_to_player') {
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
          
          const attrs = AttributeAPI.getAttributes(item);
          if (attrs.length === 0) {
            player.sendMessage('§cItem không có attribute nào');
            return;
          }
          
          const attrId = attrs[0].id;
          player.sendMessage(`§eTransferring '${attrId}' from ${item.typeId} to player...`);
          
          const success = AttributeAPI.transferAttributeToEntity(
            item,
            player,
            attrId
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Player có attribute, item mất attribute');
            
            // Force item refresh
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, item);
            
            player.sendMessage('§7Lore updated instantly!');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 6: Transfer from player to zombie
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_player_to_zombie') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const attrs = AttributeAPI.getEntityAttributes(player);
          if (attrs.length === 0) {
            player.sendMessage('§cPlayer không có attribute nào');
            return;
          }
          
          // Find nearest zombie
          const zombies = player.dimension.getEntities({
            type: 'minecraft:zombie',
            location: player.location,
            maxDistance: 10
          });
          
          if (zombies.length === 0) {
            player.sendMessage('§cNo zombie found nearby');
            return;
          }
          
          const zombie = zombies[0];
          const attrId = attrs[0].id;
          
          player.sendMessage(`§eTransferring '${attrId}' from player to zombie...`);
          
          const success = AttributeAPI.transferAttributeBetweenEntities(
            player,
            zombie,
            attrId
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Zombie có attribute, player mất attribute');
            player.sendMessage('§7Let zombie attack you to test');
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    console.warn('[TestPlayerAttributeTransfer] Test commands registered');
  }
}
