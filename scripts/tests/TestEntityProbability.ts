/**
 * Test Entity Attribute Probability System
 * 
 * Usage:
 * /scriptevent apeirix:test_entity_probability
 */

import { world, system } from '@minecraft/server';
import { EntityAttributeStorage } from '../systems/attributes/EntityAttributeStorage';

// Register test command
system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === 'apeirix:test_entity_probability') {
    testEntityProbability(event.sourceEntity);
  }
});

function testEntityProbability(player: any): void {
  if (!player) {
    console.warn('[TestEntityProbability] No player found');
    return;
  }

  player.sendMessage('§6=== Entity Probability Test ===');
  player.sendMessage('§7Spawning 20 zombies to test attribute probability...');

  const dimension = player.dimension;
  const location = player.location;
  
  // Stats tracking
  const stats = {
    total: 0,
    withHunger: 0,
    withDamage: 0,
    withBoth: 0,
    withNone: 0
  };

  // Spawn 20 zombies and check attributes after a delay
  system.runTimeout(() => {
    for (let i = 0; i < 20; i++) {
      const spawnLoc = {
        x: location.x + (Math.random() - 0.5) * 10,
        y: location.y,
        z: location.z + (Math.random() - 0.5) * 10
      };
      
      dimension.runCommand(`summon zombie ${spawnLoc.x} ${spawnLoc.y} ${spawnLoc.z}`);
    }

    // Wait for entities to spawn and attributes to be applied
    system.runTimeout(() => {
      const zombies = dimension.getEntities({ 
        type: 'minecraft:zombie',
        location: location,
        maxDistance: 15
      });

      player.sendMessage(`§7Found ${zombies.length} zombies`);

      for (const zombie of zombies) {
        stats.total++;
        
        const attrs = EntityAttributeStorage.load(zombie);
        const hasHunger = 'hunger_infliction' in attrs;
        const hasDamage = 'combat_damage_modifier' in attrs;

        if (hasHunger && hasDamage) {
          stats.withBoth++;
        } else if (hasHunger) {
          stats.withHunger++;
        } else if (hasDamage) {
          stats.withDamage++;
        } else {
          stats.withNone++;
        }
      }

      // Display results
      player.sendMessage('§6=== Results ===');
      player.sendMessage(`§7Total: §f${stats.total}`);
      player.sendMessage(`§7Hunger only: §f${stats.withHunger} §7(${(stats.withHunger/stats.total*100).toFixed(1)}%)`);
      player.sendMessage(`§7Damage only: §f${stats.withDamage} §7(${(stats.withDamage/stats.total*100).toFixed(1)}%)`);
      player.sendMessage(`§7Both: §f${stats.withBoth} §7(${(stats.withBoth/stats.total*100).toFixed(1)}%)`);
      player.sendMessage(`§7None: §f${stats.withNone} §7(${(stats.withNone/stats.total*100).toFixed(1)}%)`);
      
      player.sendMessage('§6=== Expected ===');
      player.sendMessage('§7Hunger only: ~24% (30% × 80%)');
      player.sendMessage('§7Damage only: ~16% (20% × 70%)');
      player.sendMessage('§7Both: ~6% (30% × 20%)');
      player.sendMessage('§7None: ~56% (70% × 80%)');

      // Cleanup
      player.sendMessage('§7Cleaning up zombies...');
      dimension.runCommand('kill @e[type=zombie,r=15]');
    }, 40); // 2 second delay for attribute application
  }, 20); // 1 second delay before spawning
}

console.warn('[TestEntityProbability] Registered test command: /scriptevent apeirix:test_entity_probability');
