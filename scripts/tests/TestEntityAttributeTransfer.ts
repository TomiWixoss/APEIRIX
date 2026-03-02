/**
 * Test script for Entity Attribute Transfer System
 * 
 * Usage in-game:
 * 1. Get a zombie nearby
 * 2. Run: /scriptevent test:add_hunger_to_zombie
 * 3. Let zombie attack you → Should get hunger effect
 * 4. Run: /scriptevent test:transfer_zombie_to_item
 * 5. Check item lore → Should show entity attribute
 */

import { world, system, Player, Entity } from '@minecraft/server';
import { AttributeAPI } from '../systems/attributes/AttributeAPI';
import { EntityAttributeStorage } from '../systems/attributes/EntityAttributeStorage';

export class TestEntityAttributeTransfer {
  static initialize(): void {
    // Test 1: Add hunger_infliction to zombie
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:add_hunger_to_zombie') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
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
          
          // Add hunger_infliction attribute
          EntityAttributeStorage.setAttribute(zombie, 'hunger_infliction', {
            duration: 100,
            amplifier: 0
          });
          
          player.sendMessage(`§aAdded hunger_infliction to zombie`);
          player.sendMessage(`§7Let it attack you to test`);
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });

    
    // Test 2: Transfer from zombie to item
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_zombie_to_item') {
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
          
          // Find nearest zombie with attribute
          const zombies = player.dimension.getEntities({
            type: 'minecraft:zombie',
            location: player.location,
            maxDistance: 10
          });
          
          let zombieWithAttr: Entity | undefined;
          for (const zombie of zombies) {
            if (EntityAttributeStorage.hasAttributes(zombie)) {
              zombieWithAttr = zombie;
              break;
            }
          }
          
          if (!zombieWithAttr) {
            player.sendMessage('§cNo zombie with attributes found');
            return;
          }
          
          player.sendMessage(`§eTransferring hunger_infliction from zombie to ${item.typeId}...`);
          
          const success = AttributeAPI.transferAttributeFromEntity(
            zombieWithAttr,
            item,
            'hunger_infliction'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Item now has entity attribute');
            
            // Force item refresh in inventory (remove/add trick)
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
    
    // Test 3: Transfer from item back to zombie
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:transfer_item_to_zombie') {
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
          
          player.sendMessage(`§eTransferring hunger_infliction from ${item.typeId} to zombie...`);
          
          const success = AttributeAPI.transferAttributeToEntity(
            item,
            zombie,
            'hunger_infliction'
          );
          
          if (success) {
            player.sendMessage('§aSuccess! Zombie now has attribute from item');
            player.sendMessage('§7Let it attack you to test');
            
            // Force item refresh in inventory (remove/add trick)
            AttributeAPI.forceItemRefreshInInventory(player, player.selectedSlotIndex, item);
          } else {
            player.sendMessage('§cFailed to transfer attribute');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    // Test 4: Check entity attributes
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === 'test:check_entity_attrs') {
        if (!(event.sourceEntity instanceof Player)) return;
        const player = event.sourceEntity as Player;
        
        try {
          const zombies = player.dimension.getEntities({
            type: 'minecraft:zombie',
            location: player.location,
            maxDistance: 10
          });
          
          let found = 0;
          for (const zombie of zombies) {
            const attrs = AttributeAPI.getEntityAttributes(zombie);
            if (attrs.length > 0) {
              found++;
              player.sendMessage(`§eZombie has ${attrs.length} attributes:`);
              for (const attr of attrs) {
                player.sendMessage(`§7- ${attr.id}: ${JSON.stringify(attr.config)}`);
              }
            }
          }
          
          if (found === 0) {
            player.sendMessage('§7No zombies with attributes found');
          }
        } catch (error) {
          player.sendMessage(`§cError: ${error}`);
        }
      }
    });
    
    console.warn('[TestEntityAttributeTransfer] Test commands registered');
  }
}
