/**
 * Levitator System - Attribute extraction/infusion machine
 * 
 * MECHANICS:
 * 1. Player holds item + interact → Store item in machine
 * 2. Player empty hand + interact (machine has item):
 *    - Item has attributes → Extract to potions + return item without attributes
 *    - Item is potion with attributes → Do nothing (wait for item to infuse)
 * 3. Player holds item + interact (machine has potion):
 *    - Infuse potion attributes into item + return empty potion
 *    - If attribute already exists → Return both unchanged
 * 4. Player sneak + interact → Retrieve stored item
 * 5. Player holds item + interact (machine has different item) → Swap items
 */

import { world, system, ItemStack, Player } from '@minecraft/server';
import { BaseMachineSystem } from '../shared/processing/BaseMachineSystem';
import { MachineStateManager } from '../shared/processing/MachineState';
import { StorageDisplayRegistry } from '../shared/processing/StorageDisplayRegistry';
import { AttributeResolver } from '../attributes/AttributeResolver';
import { AttributeAPI } from '../attributes/AttributeAPI';
import { LangManager } from '../../lang/LangManager';

interface LevitatorState {
  storedItem: ItemStack | null;
  storedItemName: string; // For display
  lastRetrieveTime: number; // Cooldown tracking
}

/**
 * Get display name for an item (supports vanilla + custom items)
 */
function getItemDisplayName(item: ItemStack): string {
  // Priority 1: Custom nameTag
  if (item.nameTag) {
    return item.nameTag;
  }
  
  // Priority 2: Try to get from item's display name (vanilla localization)
  // Note: Bedrock doesn't expose localized names directly, so we use typeId
  const typeId = item.typeId;
  
  // Remove namespace prefix for cleaner display
  let displayName = typeId.replace('minecraft:', '').replace('apeirix:', '');
  
  // Convert snake_case to Title Case
  displayName = displayName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return displayName;
}

export class LevitatorSystem extends BaseMachineSystem {
  protected readonly MACHINE_TYPE = 'levitator';
  protected readonly MACHINE_OFF = 'apeirix:levitator';
  protected readonly MACHINE_ON = 'apeirix:levitator_on';
  
  // Levitator-specific state storage (extends MachineState)
  private static levitatorStates: Map<string, LevitatorState> = new Map();
  
  static initialize(): void {
    const instance = new LevitatorSystem();
    instance.initialize();
    
    // Register custom display handlers for levitator blocks
    this.registerDisplayHandlers();
  }
  
  /**
   * Register display handlers for levitator blocks
   */
  private static registerDisplayHandlers(): void {
    const displayHandler = (block: any, machineName: string): string => {
      const levState = this.getLevitatorState(block.dimension.id, block.location);
      
      if (levState && levState.storedItem) {
        // Format: [Máy Tách Thuộc Tính] - Chứa: [Item Name]
        return `§6${machineName} §f- §eChứa: §f${levState.storedItemName}`;
      }
      
      // Empty
      return `§6${machineName} §7- §aTrống`;
    };
    
    StorageDisplayRegistry.register('apeirix:levitator', displayHandler);
    StorageDisplayRegistry.register('apeirix:levitator_on', displayHandler);
  }
  
  /**
   * Get levitator state for display (public API for DisplayHandler)
   */
  static getLevitatorState(dimensionId: string, location: any): LevitatorState | undefined {
    const key = MachineStateManager.getLocationKey(dimensionId, location);
    return this.levitatorStates.get(key);
  }
  
  /**
   * Override interact event for custom levitator logic
   * 
   * NEW LOGIC:
   * - Only items WITH attributes can be stored
   * - Player must hold empty potions (amount = number of attributes)
   * - Extract: Consume potions, create attribute potions, return item without attributes
   */
  protected registerInteractEvent(): void {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (event.block.typeId !== this.MACHINE_OFF) return;
      
      const player = event.player;
      const block = event.block;
      const key = MachineStateManager.getLocationKey(block.dimension.id, block.location);
      
      // Get or create levitator state
      let levState = LevitatorSystem.levitatorStates.get(key);
      if (!levState) {
        levState = { storedItem: null, storedItemName: '', lastRetrieveTime: 0 };
        LevitatorSystem.levitatorStates.set(key, levState);
      }
      
      const heldItem = player.getComponent('minecraft:inventory')?.container?.getItem(player.selectedSlotIndex);
      const isSneaking = player.isSneaking;
      
      // Case 1: Sneak + interact → Retrieve stored item (without processing)
      if (isSneaking && levState.storedItem) {
        this.retrieveItem(player, levState, key);
        event.cancel = true;
        return;
      }
      
      // Case 2: Holding empty potion + machine has NON-POTION item → Extract attributes
      if (heldItem && heldItem.typeId === 'minecraft:potion' && levState.storedItem && levState.storedItem.typeId !== 'minecraft:potion') {
        this.extractAttributes(player, heldItem, levState, key);
        event.cancel = true;
        return;
      }
      
      // Case 3: Holding item with attributes + machine empty → Store item
      if (heldItem && !levState.storedItem) {
        this.storeItemWithAttributes(player, heldItem, levState, key);
        event.cancel = true;
        return;
      }
      
      // Case 4: Holding item + machine has potion with attributes → Infuse attributes
      if (heldItem && levState.storedItem && levState.storedItem.typeId === 'minecraft:potion') {
        this.infuseAttributes(player, heldItem, levState, key);
        event.cancel = true;
        return;
      }
      
      // Case 5: Holding item + machine has item → Swap
      if (heldItem && levState.storedItem) {
        this.swapItems(player, heldItem, levState, key);
        event.cancel = true;
        return;
      }
    });
  }
  
  /**
   * Store item WITH attributes (reject items without attributes)
   */
  private storeItemWithAttributes(player: Player, item: ItemStack, levState: LevitatorState, key: string): void {
    // Check if item has attributes
    const attributes = AttributeResolver.resolve(item);
    
    if (attributes.length === 0) {
      player.sendMessage(`§cItem này không có thuộc tính nào. Không thể đưa vào máy.`);
      return;
    }
    
    // Capture values for deferred operation
    const itemTypeId = item.typeId;
    const currentAmount = item.amount;
    const slotIndex = player.selectedSlotIndex;
    
    // Clone item for storage (will be done in system.run to avoid restricted execution)
    const itemClone = item.clone();
    
    // Defer ALL ItemStack modifications
    system.run(() => {
      // Set amount INSIDE system.run
      itemClone.amount = 1;
      
      levState.storedItem = itemClone;
      levState.storedItemName = getItemDisplayName(itemClone);
      levState.lastRetrieveTime = 0; // Reset cooldown
      
      // Update player inventory
      const container = player.getComponent('minecraft:inventory')?.container;
      if (container) {
        const currentItem = container.getItem(slotIndex);
        if (currentItem && currentItem.typeId === itemTypeId) {
          if (currentAmount > 1) {
            const newItem = currentItem.clone();
            newItem.amount = currentAmount - 1;
            container.setItem(slotIndex, newItem);
          } else {
            container.setItem(slotIndex, undefined);
          }
        }
      }
    });
  }
  
  /**
   * Extract attributes from stored item
   * Requires player to hold empty potions (amount = number of attributes)
   * 
   * NOTE: Only works if stored item is NOT a potion
   * If stored item is potion with attributes → use infuse instead
   */
  private extractAttributes(player: Player, heldPotion: ItemStack, levState: LevitatorState, key: string): void {
    if (!levState.storedItem) return;
    
    // Prevent extracting from potion (potion should be used for infusion only)
    if (levState.storedItem.typeId === 'minecraft:potion') {
      player.sendMessage(`§cKhông thể trích xuất từ bình thuộc tính. Hãy dùng item để ép thuộc tính vào.`);
      return;
    }
    
    // Check if held potion has attributes (must be empty potion)
    const heldPotionAttrs = AttributeResolver.resolve(heldPotion);
    if (heldPotionAttrs.length > 0) {
      player.sendMessage(`§cCần bình trống để trích xuất thuộc tính. Bình này đã có thuộc tính rồi.`);
      return;
    }
    
    const item = levState.storedItem;
    const attributes = AttributeResolver.resolve(item);
    
    if (attributes.length === 0) {
      player.sendMessage(`§eItem không có thuộc tính nào`);
      return;
    }
    
    // Count total empty potions in inventory
    const container = player.getComponent('minecraft:inventory')?.container;
    if (!container) return;
    
    let totalPotions = 0;
    for (let i = 0; i < container.size; i++) {
      const slotItem = container.getItem(i);
      if (slotItem && slotItem.typeId === 'minecraft:potion') {
        totalPotions += slotItem.amount;
      }
    }
    
    // Check if player has enough empty potions
    if (totalPotions < attributes.length) {
      player.sendMessage(`§cCần §f${attributes.length} §clọ nước trống (hiện có §f${totalPotions}§c)`);
      return;
    }
    
    // Remove attributes from original item (before system.run)
    for (const attr of attributes) {
      AttributeAPI.removeAttribute(item, attr.id);
    }
    
    // Capture attribute data for deferred potion creation
    const attrData = attributes.map(attr => ({ id: attr.id, config: attr.config }));
    
    // Defer spawning and inventory modification
    system.run(() => {
      // Create attribute potions INSIDE system.run
      const potions: ItemStack[] = [];
      for (const attr of attrData) {
        const potion = new ItemStack('minecraft:potion', 1);
        
        // Get localized attribute name from lang system
        const attrName = LangManager.get(`attributes.${attr.id}`) || attr.id;
        potion.nameTag = `§dThuộc tính: ${attrName}`;
        
        AttributeAPI.addAttribute(potion, attr.id, attr.config);
        potions.push(potion);
      }
      
      // Spawn attribute potions
      for (const potion of potions) {
        player.dimension.spawnItem(potion, player.location);
      }
      
      // Return item without attributes
      player.dimension.spawnItem(item, player.location);
      
      // Consume empty potions from inventory
      let remaining = attrData.length;
      for (let i = 0; i < container.size && remaining > 0; i++) {
        const slotItem = container.getItem(i);
        if (slotItem && slotItem.typeId === 'minecraft:potion') {
          if (slotItem.amount <= remaining) {
            remaining -= slotItem.amount;
            container.setItem(i, undefined);
          } else {
            const newPotion = slotItem.clone();
            newPotion.amount = slotItem.amount - remaining;
            container.setItem(i, newPotion);
            remaining = 0;
          }
        }
      }
    });
    
    // Clear storage
    levState.storedItem = null;
    levState.storedItemName = '';
  }
  
  /**
   * Infuse attributes from stored potion into held item
   * Machine has potion with attributes → Transfer attributes to held item
   */
  private infuseAttributes(player: Player, heldItem: ItemStack, levState: LevitatorState, key: string): void {
    if (!levState.storedItem || levState.storedItem.typeId !== 'minecraft:potion') return;
    
    // Cooldown check (500ms)
    const currentTime = Date.now();
    const COOLDOWN_MS = 500;
    
    if (currentTime - levState.lastRetrieveTime < COOLDOWN_MS) {
      player.sendMessage(`§cVui lòng đợi một chút...`);
      return;
    }
    
    const potion = levState.storedItem;
    const potionAttributes = AttributeResolver.resolve(potion);
    
    if (potionAttributes.length === 0) {
      player.sendMessage(`§cBình này không có thuộc tính nào`);
      return;
    }
    
    // Check if held item already has any of these attributes
    const heldAttributes = AttributeResolver.resolve(heldItem);
    const conflictingAttrs = potionAttributes.filter(potionAttr => 
      heldAttributes.some(heldAttr => heldAttr.id === potionAttr.id)
    );
    
    if (conflictingAttrs.length > 0) {
      const attrNames = conflictingAttrs.map(a => a.id).join(', ');
      player.sendMessage(`§cItem đã có thuộc tính: §f${attrNames}`);
      return;
    }
    
    // Capture values for deferred operation
    const heldAmount = heldItem.amount;
    const slotIndex = player.selectedSlotIndex;
    const heldTypeId = heldItem.typeId;
    const heldItemClone = heldItem.clone();
    
    // Transfer attributes from potion to item (before system.run)
    for (const attr of potionAttributes) {
      AttributeAPI.addAttribute(heldItemClone, attr.id, attr.config);
    }
    
    // Update cooldown timestamp
    levState.lastRetrieveTime = currentTime;
    
    // Defer to avoid restricted execution error
    system.run(() => {
      // Set amount INSIDE system.run
      heldItemClone.amount = 1;
      
      // Spawn infused item
      player.dimension.spawnItem(heldItemClone, player.location);
      
      // Return empty potion
      const emptyPotion = new ItemStack('minecraft:potion', 1);
      player.dimension.spawnItem(emptyPotion, player.location);
      
      // Clear storage
      levState.storedItem = null;
      levState.storedItemName = '';
      
      // Decrease held stack by 1
      const container = player.getComponent('minecraft:inventory')?.container;
      if (container) {
        const currentItem = container.getItem(slotIndex);
        if (currentItem && currentItem.typeId === heldTypeId) {
          if (heldAmount > 1) {
            const newItem = currentItem.clone();
            newItem.amount = heldAmount - 1;
            container.setItem(slotIndex, newItem);
          } else {
            container.setItem(slotIndex, undefined);
          }
        }
      }
      
      player.sendMessage(`§aĐã ép thuộc tính vào item!`);
    });
  }
  
  /**
   * Swap stored item with held item (with cooldown to prevent spam)
   */
  private swapItems(player: Player, heldItem: ItemStack, levState: LevitatorState, key: string): void {
    if (!levState.storedItem) return;
    
    // Cooldown check (500ms)
    const currentTime = Date.now();
    const COOLDOWN_MS = 500;
    
    if (currentTime - levState.lastRetrieveTime < COOLDOWN_MS) {
      player.sendMessage(`§cVui lòng đợi một chút...`);
      return;
    }
    
    // Check if held item has attributes
    const heldAttributes = AttributeResolver.resolve(heldItem);
    if (heldAttributes.length === 0) {
      player.sendMessage(`§cItem này không có thuộc tính. Không thể đưa vào máy.`);
      return;
    }
    
    const storedItem = levState.storedItem.clone();
    
    // Capture values for deferred operation
    const heldAmount = heldItem.amount;
    const slotIndex = player.selectedSlotIndex;
    const heldTypeId = heldItem.typeId;
    const heldItemClone = heldItem.clone();
    
    // Update cooldown timestamp
    levState.lastRetrieveTime = currentTime;
    
    // Defer to avoid restricted execution error
    system.run(() => {
      // Ensure stored item amount is exactly 1 before spawning
      storedItem.amount = 1;
      
      // Set amount for new stored item INSIDE system.run
      heldItemClone.amount = 1;
      
      // Update state
      levState.storedItem = heldItemClone;
      levState.storedItemName = getItemDisplayName(heldItemClone);
      
      // Give stored item to player (exactly 1)
      player.dimension.spawnItem(storedItem, player.location);
      
      // Decrease held stack by 1
      const container = player.getComponent('minecraft:inventory')?.container;
      if (container) {
        const currentItem = container.getItem(slotIndex);
        if (currentItem && currentItem.typeId === heldTypeId) {
          if (heldAmount > 1) {
            const newItem = currentItem.clone();
            newItem.amount = heldAmount - 1;
            container.setItem(slotIndex, newItem);
          } else {
            container.setItem(slotIndex, undefined);
          }
        }
      }
    });
  }
  
  /**
   * Retrieve stored item (with cooldown to prevent spam)
   */
  private retrieveItem(player: Player, levState: LevitatorState, key: string): void {
    if (!levState.storedItem) return;
    
    // Cooldown check (500ms = 10 ticks)
    const currentTime = Date.now();
    const COOLDOWN_MS = 500;
    
    if (currentTime - levState.lastRetrieveTime < COOLDOWN_MS) {
      player.sendMessage(`§cVui lòng đợi một chút...`);
      return;
    }
    
    // Clone to ensure we spawn exactly what's stored
    const storedItem = levState.storedItem.clone();
    
    // Update cooldown timestamp
    levState.lastRetrieveTime = currentTime;
    
    // Defer to avoid restricted execution error
    system.run(() => {
      // Ensure amount is exactly 1
      storedItem.amount = 1;
      
      player.dimension.spawnItem(storedItem, player.location);
      levState.storedItem = null;
      levState.storedItemName = '';
    });
  }
  
  /**
   * Override hopper check (levitator doesn't use hoppers)
   */
  protected startHopperCheckLoop(): void {
    // Levitator doesn't use hoppers - skip
  }
  
  /**
   * Override processing loop (levitator doesn't auto-process)
   */
  protected startProcessingLoop(): void {
    // Levitator processes instantly on interaction - skip
  }
}
