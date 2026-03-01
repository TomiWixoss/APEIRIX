/**
 * ArmorToughnessSystem - Custom armor toughness for armors with >20 protection
 * 
 * Minecraft Bedrock hard-caps armor at 20 points. This system provides additional
 * damage reduction for armor sets that exceed this limit.
 * 
 * How it works:
 * 1. Listen to entityHurt events (before damage is applied)
 * 2. Check if player has armor with total protection > 20
 * 3. Calculate toughness bonus from excess protection
 * 4. Apply additional damage reduction
 * 
 * Formula:
 * - Base protection: capped at 20 (80% reduction)
 * - Toughness: (totalProtection - 20) * 0.04 per point
 * - Example: 25 protection = 20 base + 5 toughness = 80% + 20% = 100% reduction cap at 95%
 */

import { world, EntityHurtAfterEvent, Player, EquipmentSlot } from '@minecraft/server';
import { GENERATED_ARMORS } from '../../data/GeneratedGameData';

interface ArmorPieceConfig {
  id: string;
  protection: number;
  slot: EquipmentSlot;
}

export class ArmorToughnessSystem {
  private static readonly MAX_BASE_PROTECTION = 20;
  private static readonly TOUGHNESS_MULTIPLIER = 0.04; // 4% reduction per excess point
  private static readonly MAX_TOTAL_REDUCTION = 0.95; // Cap at 95% damage reduction
  
  // Armor configs loaded from GeneratedGameData
  private static armorConfigs = new Map<string, ArmorPieceConfig>();

  static initialize(): void {
    console.warn('[ArmorToughnessSystem] Initializing...');
    
    // Load armor configs
    this.loadArmorConfigs();
    
    // Listen to entity hurt events
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    console.warn('[ArmorToughnessSystem] Initialized');
  }

  private static loadArmorConfigs(): void {
    // Map slot names to EquipmentSlot enum
    const slotMap: Record<string, EquipmentSlot> = {
      'head': EquipmentSlot.Head,
      'chest': EquipmentSlot.Chest,
      'legs': EquipmentSlot.Legs,
      'feet': EquipmentSlot.Feet
    };
    
    // Load from generated data
    for (const armor of GENERATED_ARMORS) {
      this.armorConfigs.set(armor.id, {
        id: armor.id,
        protection: armor.protection,
        slot: slotMap[armor.slot] || EquipmentSlot.Head
      });
    }
    
    console.warn(`[ArmorToughnessSystem] Loaded ${this.armorConfigs.size} armor configs`);
  }

  private static handleEntityHurt(event: EntityHurtAfterEvent): void {
    try {
      const { hurtEntity, damage } = event;
      
      // Only process players
      if (hurtEntity.typeId !== 'minecraft:player') {
        return;
      }
      
      const player = hurtEntity as Player;
      
      // Calculate total protection from equipped armor
      const totalProtection = this.calculateTotalProtection(player);
      
      // If protection <= 20, vanilla handles it correctly
      if (totalProtection <= this.MAX_BASE_PROTECTION) {
        return;
      }
      
      // Calculate toughness bonus
      const excessProtection = totalProtection - this.MAX_BASE_PROTECTION;
      const toughnessReduction = excessProtection * this.TOUGHNESS_MULTIPLIER;
      
      // Cap total reduction
      const totalReduction = Math.min(
        0.80 + toughnessReduction, // 80% from base + toughness
        this.MAX_TOTAL_REDUCTION
      );
      
      // Calculate damage that should have been reduced by toughness
      // Vanilla already applied 80% reduction, we need to apply the extra
      const additionalReduction = totalReduction - 0.80;
      const damageToReduce = damage * additionalReduction / (1 - 0.80); // Reverse vanilla reduction
      
      if (damageToReduce > 0.1) {
        // Heal the player to compensate for excess damage
        const healthComp = player.getComponent('health');
        if (healthComp && healthComp.currentValue < healthComp.effectiveMax) {
          const newHealth = Math.min(
            healthComp.currentValue + damageToReduce,
            healthComp.effectiveMax
          );
          healthComp.setCurrentValue(newHealth);
          
          console.warn(
            `[ArmorToughnessSystem] ${player.name}: ` +
            `Protection=${totalProtection} (${excessProtection} excess), ` +
            `Toughness=${(toughnessReduction * 100).toFixed(1)}%, ` +
            `Reduced=${damageToReduce.toFixed(1)} damage`
          );
        }
      }
      
    } catch (error) {
      console.warn('[ArmorToughnessSystem] Error handling entity hurt:', error);
    }
  }

  private static calculateTotalProtection(player: Player): number {
    let total = 0;
    
    try {
      const equipment = player.getComponent('equippable');
      if (!equipment) return 0;
      
      // Check each armor slot
      const slots = [
        EquipmentSlot.Head,
        EquipmentSlot.Chest,
        EquipmentSlot.Legs,
        EquipmentSlot.Feet
      ];
      
      for (const slot of slots) {
        const item = equipment.getEquipment(slot);
        if (!item) continue;
        
        const config = this.armorConfigs.get(item.typeId);
        if (config) {
          total += config.protection;
        }
      }
      
    } catch (error) {
      console.warn('[ArmorToughnessSystem] Error calculating protection:', error);
    }
    
    return total;
  }
}
