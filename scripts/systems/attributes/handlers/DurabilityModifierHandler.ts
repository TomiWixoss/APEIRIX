/**
 * DurabilityModifierHandler - Modify durability consumption
 * 
 * SINGLE SOURCE OF TRUTH for 'durability_modifier' attribute:
 * - Lore template key
 * - Lore placeholder processing
 * - Runtime behavior
 * 
 * TWO SYSTEMS:
 * 1. DURABILITY SYSTEM (items with durability component):
 *    - Tính damage per use = max_durability / configured_durability
 *    - Mỗi lần sử dụng trừ damage_per_use từ durability hiện tại
 *    - Item tự động break khi durability về 0 (vanilla behavior)
 * 
 * 2. ITEM COUNT SYSTEM (items without durability component):
 *    - Store uses remaining in dynamicProperty ('apeirix:uses_remaining')
 *    - Mỗi lần sử dụng trừ 1 use
 *    - Khi uses = 0, giảm item amount (consume item)
 * 
 * Config:
 * - context: 'mining' (chỉ active khi đào block)
 * - durability: 4 (số lần sử dụng tối đa)
 * 
 * Example 1: Wooden pickaxe với durability: 4 (HAS durability component)
 * - Vanilla max durability: 59
 * - Damage per use: 59 / 4 = 14.75 → floor = 14
 * - Sau 4 lần sử dụng: 59 - (14 * 4) = 3 → item breaks
 * 
 * Example 2: Custom item với durability: 3 (NO durability component)
 * - Uses remaining: 3 (stored in dynamicProperty)
 * - Sau 3 lần sử dụng: uses = 0 → item amount -= 1, reset uses = 3
 */

import { world, ItemStack, Player, system, GameMode } from '@minecraft/server';
import { getAttributeItems, getAttributeConfig } from '../../../data/GeneratedAttributes';
import { BreakableHandler } from './BreakableHandler';
import { LoreRefreshSystem } from '../../lore/LoreRefreshSystem';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';
import { AttributeResolver } from '../AttributeResolver';

interface DurabilityConfig {
  context?: string;
  durability?: number; // Số lần sử dụng tối đa
  conditions?: any;
}

export class DurabilityModifierHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'durability_modifier';
  static readonly TEMPLATE_KEY = 'durability_modifier_template';
  
  // ============================================
  // LORE GENERATION (Compile-time)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Get dynamic placeholders used by this handler
   * Dynamic = changes at runtime (requires ItemStack to resolve)
   */
  static getDynamicPlaceholders(): string[] {
    return ['{current_durability}'];
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {durability}, {current_durability}, {max_durability}
   * 
   * DYNAMIC: Uses AttributeResolver to get resolved config (static + dynamic)
   * 
   * CRITICAL: If item doesn't have durability component, return empty string
   * This prevents "Has Custom Properties" error on items like potions
   * 
   * @param itemId Item ID
   * @param line Lore line with placeholders
   * @param itemStack Optional ItemStack for dynamic values (current durability)
   */
  static processLorePlaceholders(itemId: string, line: string, itemStack?: ItemStack): string {
    let config: any;
    
    // If itemStack provided, resolve dynamic attributes
    if (itemStack) {
      const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID, system.currentTick);
      config = resolved?.config;
      
      // Check if item has durability component
      // If not, use item count system (dynamicProperty)
      try {
        const durabilityComp = itemStack.getComponent('minecraft:durability');
        if (!durabilityComp && !config) {
          // No durability component AND no config - skip lore line
          console.warn(`[DurabilityModifierHandler] ${itemId} has no durability component and no config - skipping lore line`);
          return '';
        }
      } catch (error) {
        console.warn(`[DurabilityModifierHandler] ${itemId} failed durability check - skipping lore line`);
        return '';
      }
    } else {
      // Fallback to static config (for compile-time generation)
      config = getAttributeConfig(itemId, this.ATTRIBUTE_ID);
    }
    
    let processedLine = line;
    
    // Static placeholder: {durability} - configured max uses
    const maxUses = config?.durability || 1;
    processedLine = processedLine.replace(/{durability}/g, maxUses.toString());
    
    // Dynamic placeholders (require ItemStack)
    if (itemStack && config) {
      try {
        const durabilityComp = itemStack.getComponent('minecraft:durability');
        
        if (durabilityComp) {
          // HAS durability component - use durability system
          const maxDurability = durabilityComp.maxDurability;
          const currentDamage = durabilityComp.damage;
          const currentDurability = maxDurability - currentDamage;
          
          // Calculate damage per use from config
          const damagePerUse = Math.floor(maxDurability / maxUses);
          
          // Calculate uses remaining
          const usesRemaining = Math.floor(currentDurability / damagePerUse);
          
          // {current_durability} - uses remaining
          processedLine = processedLine.replace(/{current_durability}/g, usesRemaining.toString());
          
          // {max_durability} - max uses
          processedLine = processedLine.replace(/{max_durability}/g, maxUses.toString());
        } else {
          // NO durability component - use item count system
          // Store uses remaining in dynamicProperties
          const usesKey = 'apeirix:uses_remaining';
          let usesRemaining = itemStack.getDynamicProperty(usesKey) as number | undefined;
          
          // Initialize if not set
          if (usesRemaining === undefined) {
            usesRemaining = maxUses;
            itemStack.setDynamicProperty(usesKey, usesRemaining);
          }
          
          // {current_durability} - uses remaining from dynamic property
          processedLine = processedLine.replace(/{current_durability}/g, (usesRemaining ?? maxUses).toString());
          
          // {max_durability} - max uses
          processedLine = processedLine.replace(/{max_durability}/g, maxUses.toString());
        }
      } catch (error) {
        console.warn(`[DurabilityModifierHandler] Error processing placeholders for ${itemId}:`, error);
        // Fallback to max uses
        processedLine = processedLine.replace(/{current_durability}/g, maxUses.toString());
        processedLine = processedLine.replace(/{max_durability}/g, maxUses.toString());
      }
    }
    
    return processedLine;
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static durabilityItems = new Map<string, DurabilityConfig>();

  static initialize(): void {
    console.warn('[DurabilityModifierHandler] Initializing...');
    
    // Register with PlaceholderRegistry for lore processing
    PlaceholderRegistry.registerAttributeHandler(this);
    
    // Load durability modifier items from attributes
    this.loadDurabilityItems();
    
    console.warn(`[DurabilityModifierHandler] Loaded ${this.durabilityItems.size} durability modifier items`);
    
    // Listen to block break events (mining)
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleItemUse(event.player, event.itemStackBeforeBreak);
    });
    
    // Listen to entity hit events (combat)
    world.afterEvents.entityHitEntity.subscribe((event) => {
      if (event.damagingEntity?.typeId === 'minecraft:player') {
        const player = event.damagingEntity as any;
        const inventory = player.getComponent('minecraft:inventory');
        if (inventory?.container) {
          const heldItem = inventory.container.getItem(player.selectedSlotIndex);
          if (heldItem) {
            this.handleItemUse(player, heldItem);
          }
        }
      }
    });
    
    // Listen to player interact with block (hoe tillage, axe stripping)
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      this.handlePlayerInteract(event);
    });
    
    console.warn('[DurabilityModifierHandler] Initialized');
  }

  private static loadDurabilityItems(): void {
    const items = getAttributeItems(this.ATTRIBUTE_ID);
    
    for (const item of items) {
      this.durabilityItems.set(item.itemId, item.config || {});
      
      const durability = item.config?.durability ?? 'default';
      console.warn(`[DurabilityModifierHandler] ${item.itemId}: durability=${durability} uses`);
    }
  }

  private static handleItemUse(player: Player, itemStack: ItemStack | undefined): void {
    try {
      if (!itemStack) return;
      
      const itemId = itemStack.typeId;
      
      // Check if item was broken by BreakableHandler
      if (BreakableHandler.wasItemBroken(player.id, itemId)) {
        console.warn(`[DurabilityModifierHandler] ${itemId} was broken by BreakableHandler - skipping durability modification`);
        return;
      }
      
      // DYNAMIC: Resolve attributes from ItemStack
      const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID, system.currentTick);
      if (!resolved) return;
      
      const config = resolved.config;
      
      // Skip if player is in creative mode
      if (player.getGameMode() === GameMode.Creative) {
        return;
      }
      
      // Apply durability modification
      this.applyDurabilityModification(player, itemStack, config);
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error in item use handler:', error);
    }
  }

  private static applyDurabilityModification(player: Player, itemStack: ItemStack, config: DurabilityConfig): void {
    try {
      // Skip if player is in creative mode
      if (player.getGameMode() === GameMode.Creative) {
        return;
      }
      
      const configuredDurability = config.durability;
      
      // If durability is set, calculate damage and apply
      if (configuredDurability !== undefined && configuredDurability > 0) {
        // Get durability component
        const durabilityComp = itemStack.getComponent('minecraft:durability');
        
        if (durabilityComp) {
          // HAS durability component - use durability system
          this.applyDurabilitySystem(player, itemStack, durabilityComp, configuredDurability);
        } else {
          // NO durability component - use item count system
          this.applyItemCountSystem(player, itemStack, configuredDurability);
        }
      }
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error applying durability modification:', error);
    }
  }

  /**
   * Apply durability system (for items with durability component)
   */
  private static applyDurabilitySystem(player: Player, itemStack: ItemStack, durabilityComp: any, configuredDurability: number): void {
    const maxDurability = durabilityComp.maxDurability;
    const currentDamage = durabilityComp.damage;
    const currentDurability = maxDurability - currentDamage;
    
    // Calculate damage per use
    const damagePerUse = Math.floor(maxDurability / configuredDurability);
    
    // Vanilla already consumed 1 durability before this handler runs
    // So we only need to apply (damagePerUse - 1) additional damage
    const additionalDamage = Math.max(0, damagePerUse - 1);
    const newDamage = currentDamage + additionalDamage;
    
    console.warn(`[DurabilityModifierHandler] ${itemStack.typeId}: ${currentDurability}/${maxDurability} -> applying ${damagePerUse} damage (${configuredDurability} uses total)`);
    
    // Defer item update to avoid blocking event handler
    system.run(() => {
      try {
        // Apply damage to item in player's hand
        const inventory = player.getComponent('minecraft:inventory');
        if (!inventory) return;
        
        const container = inventory.container;
        if (!container) return;
        
        const selectedSlot = player.selectedSlotIndex;
        const heldItem = container.getItem(selectedSlot);
        
        if (heldItem && heldItem.typeId === itemStack.typeId) {
          const heldDurability = heldItem.getComponent('minecraft:durability');
          if (heldDurability) {
            // Check if item will break (damage >= maxDurability)
            if (newDamage >= maxDurability) {
              // Break item manually
              this.breakItem(player, selectedSlot, heldItem);
              console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} broke (damage: ${newDamage}/${maxDurability})`);
            } else {
              // Apply damage (safe - newDamage < maxDurability)
              heldDurability.damage = newDamage;
              
              // Calculate remaining uses
              const remainingDurability = maxDurability - newDamage;
              const usesRemaining = Math.floor(remainingDurability / damagePerUse);
              
              // If no uses remaining, break the item now
              if (usesRemaining <= 0) {
                this.breakItem(player, selectedSlot, heldItem);
                console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} broke (0 uses remaining, damage: ${newDamage}/${maxDurability})`);
              } else {
                // Refresh lore to update {current_durability} placeholder
                LoreRefreshSystem.refresh(heldItem);
                
                // Update item in container
                container.setItem(selectedSlot, heldItem);
                
                console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} damaged: ${newDamage}/${maxDurability} (${usesRemaining} uses remaining)`);
              }
            }
          }
        }
      } catch (error) {
        console.warn('[DurabilityModifierHandler] Error in deferred durability update:', error);
      }
    });
  }

  /**
   * Apply item count system (for items without durability component)
   * Uses dynamicProperty to track uses remaining
   */
  private static applyItemCountSystem(player: Player, itemStack: ItemStack, configuredDurability: number): void {
    const usesKey = 'apeirix:uses_remaining';
    let usesRemaining = itemStack.getDynamicProperty(usesKey) as number | undefined;
    
    // Initialize if not set
    if (usesRemaining === undefined) {
      usesRemaining = configuredDurability;
    }
    
    // Decrement uses
    usesRemaining -= 1;
    
    console.warn(`[DurabilityModifierHandler] ${itemStack.typeId}: ${usesRemaining}/${configuredDurability} uses remaining (count system)`);
    
    // Defer item update to avoid blocking event handler
    system.run(() => {
      try {
        const inventory = player.getComponent('minecraft:inventory');
        if (!inventory) return;
        
        const container = inventory.container;
        if (!container) return;
        
        const selectedSlot = player.selectedSlotIndex;
        const heldItem = container.getItem(selectedSlot);
        
        if (heldItem && heldItem.typeId === itemStack.typeId) {
          if (usesRemaining! <= 0) {
            // Break item (reduce amount by 1)
            this.breakItem(player, selectedSlot, heldItem);
            console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} consumed (0 uses remaining)`);
          } else {
            // Update uses remaining
            heldItem.setDynamicProperty(usesKey, usesRemaining);
            
            // Refresh lore to update {current_durability} placeholder
            LoreRefreshSystem.refresh(heldItem);
            
            // Update item in container
            container.setItem(selectedSlot, heldItem);
            
            console.warn(`[DurabilityModifierHandler] ${itemStack.typeId} used: ${usesRemaining}/${configuredDurability} uses remaining`);
          }
        }
      } catch (error) {
        console.warn('[DurabilityModifierHandler] Error in deferred count update:', error);
      }
    });
  }

  /**
   * Break item manually
   */
  private static breakItem(player: Player, slot: number, itemStack: ItemStack): void {
    try {
      const inventory = player.getComponent('minecraft:inventory');
      if (!inventory) return;
      
      const container = inventory.container;
      if (!container) return;
      
      // Remove or reduce item amount
      if (itemStack.amount > 1) {
        itemStack.amount -= 1;
        container.setItem(slot, itemStack);
      } else {
        container.setItem(slot, undefined);
      }
      
      // Play break sound and particle effect
      player.playSound('random.break');
      player.dimension.spawnParticle('minecraft:item_break_particle', player.location);
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error breaking item:', error);
    }
  }

  /**
   * Handle player interact with block (hoe tillage, axe stripping)
   */
  private static handlePlayerInteract(event: any): void {
    try {
      const player = event.player;
      const block = event.block;
      const itemStack = event.itemStack;
      
      if (!itemStack) return;
      
      const itemId = itemStack.typeId; // Store itemId for later use
      
      // DYNAMIC: Resolve attributes from ItemStack
      const resolved = AttributeResolver.getAttribute(itemStack, this.ATTRIBUTE_ID, system.currentTick);
      if (!resolved) return;
      
      const config = resolved.config;
      
      // Skip if player is in creative mode
      if (player.getGameMode() === GameMode.Creative) {
        return;
      }
      
      const blockId = block.typeId;
      
      // Check if it's hoe tillage (dirt/grass -> farmland)
      const tillableBlocks = [
        'minecraft:dirt',
        'minecraft:grass_block',
        'minecraft:dirt_path',
        'minecraft:coarse_dirt'
      ];
      
      // Check if it's axe stripping (log -> stripped_log)
      const strippableBlocks = [
        'minecraft:oak_log',
        'minecraft:birch_log',
        'minecraft:spruce_log',
        'minecraft:jungle_log',
        'minecraft:acacia_log',
        'minecraft:dark_oak_log',
        'minecraft:mangrove_log',
        'minecraft:cherry_log',
        'minecraft:pale_oak_log',
        'minecraft:crimson_stem',
        'minecraft:warped_stem'
      ];
      
      const isHoeTillage = tillableBlocks.includes(blockId);
      const isAxeStripping = strippableBlocks.includes(blockId);
      
      if (!isHoeTillage && !isAxeStripping) return;
      
      const blockLocation = { ...block.location };
      const playerId = player.id;
      
      // Schedule durability damage in unrestricted context
      system.run(() => {
        try {
          const currentPlayer = world.getAllPlayers().find(p => p.id === playerId);
          if (!currentPlayer) return;
          
          // Verify action was successful
          const currentBlock = currentPlayer.dimension.getBlock(blockLocation);
          if (!currentBlock) return;
          
          let actionSuccessful = false;
          
          if (isHoeTillage && currentBlock.typeId === 'minecraft:farmland') {
            actionSuccessful = true;
          } else if (isAxeStripping && currentBlock.typeId.includes('stripped')) {
            actionSuccessful = true;
          }
          
          if (!actionSuccessful) return;
          
          // Apply durability damage
          const inventory = currentPlayer.getComponent('minecraft:inventory');
          if (!inventory) return;
          
          const container = inventory.container;
          if (!container) return;
          
          const selectedSlot = currentPlayer.selectedSlotIndex;
          const heldItem = container.getItem(selectedSlot);
          
          if (heldItem && heldItem.typeId === itemId) {
            this.applyDurabilityModification(currentPlayer, heldItem, config);
          }
        } catch (error) {
          console.warn('[DurabilityModifierHandler] Error in deferred interact handler:', error);
        }
      });
      
    } catch (error) {
      console.warn('[DurabilityModifierHandler] Error in interact handler:', error);
    }
  }
}
