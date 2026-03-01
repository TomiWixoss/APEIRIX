/**
 * HammerMiningHandler - Handle 'hammer_mining' attribute
 * 
 * SINGLE SOURCE OF TRUTH for 'hammer_mining' attribute:
 * - Runtime behavior only (no lore generation)
 * 
 * REUSES LOGIC FROM: HammerMiningSystem
 * 
 * Tools với attribute 'hammer_mining' sẽ đập block ra dust thay vì vanilla drops
 */

import { world, Block, ItemStack, system } from '@minecraft/server';
import { getItemsWithAttribute } from '../../../data/GeneratedAttributes';
import { GENERATED_ORE_CRUSHER_RECIPES, OreCrusherRecipe } from '../../../data/GeneratedProcessingRecipes';

export class HammerMiningHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'hammer_mining';
  // No TEMPLATE_KEY - this attribute has no lore
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static hammerToolIds: Set<string>;
  private static recipeMap: Map<string, OreCrusherRecipe> = new Map();

  static initialize(): void {
    console.warn('[HammerMiningHandler] Initializing...');
    
    // Load hammer IDs from attributes
    const hammers = getItemsWithAttribute('hammer_mining');
    this.hammerToolIds = new Set(hammers);
    
    console.warn(`[HammerMiningHandler] Loaded ${this.hammerToolIds.size} hammers`);
    
    // Load recipes từ ore_crusher_mk1
    this.loadRecipes();
    
    // Listen to block break events
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
    
    console.warn('[HammerMiningHandler] Initialized');
  }

  private static loadRecipes(): void {
    const mk1Recipes = GENERATED_ORE_CRUSHER_RECIPES['ore_crusher_mk1'];
    if (mk1Recipes) {
      for (const recipe of mk1Recipes) {
        this.recipeMap.set(recipe.inputId, recipe);
      }
      console.warn(`[HammerMiningHandler] Loaded ${this.recipeMap.size} recipes from ore_crusher_mk1`);
    }
  }

  private static isHammer(itemId: string): boolean {
    return this.hammerToolIds.has(itemId);
  }

  private static getRecipe(blockId: string): OreCrusherRecipe | undefined {
    return this.recipeMap.get(blockId);
  }

  private static handleBlockBreak(event: any): void {
    const { block, brokenBlockPermutation, itemStackBeforeBreak } = event;
    
    if (!itemStackBeforeBreak || !this.isHammer(itemStackBeforeBreak.typeId)) {
      return;
    }
    
    const blockId = brokenBlockPermutation.type.id;
    const recipe = this.getRecipe(blockId);
    
    if (!recipe) {
      return;
    }
    
    const fortuneLevel = this.getFortuneLevel(itemStackBeforeBreak);
    
    system.runTimeout(() => {
      this.removeVanillaDrops(block);
      
      system.runTimeout(() => {
        this.spawnCustomDrops(block, recipe, fortuneLevel);
      }, 1);
    }, 1);
  }

  private static getFortuneLevel(itemStack: any): number {
    try {
      const enchantable = itemStack.getComponent('enchantable');
      if (!enchantable) return 0;
      
      const fortuneEnchant = enchantable.getEnchantment('fortune');
      if (fortuneEnchant) {
        return fortuneEnchant.level;
      }
    } catch (error) {
      // Enchantment not found
    }
    
    return 0;
  }

  private static removeVanillaDrops(block: Block): void {
    const location = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5
    };
    
    try {
      const nearbyItems = block.dimension.getEntities({
        location: location,
        maxDistance: 2,
        type: 'minecraft:item'
      });
      
      const vanillaDropIds = this.getVanillaDropIds();
      
      for (const itemEntity of nearbyItems) {
        const itemComponent = itemEntity.getComponent('item');
        if (itemComponent?.itemStack) {
          const itemId = itemComponent.itemStack.typeId;
          if (vanillaDropIds.has(itemId)) {
            itemEntity.remove();
          }
        }
      }
    } catch (error) {
      console.warn('[HammerMiningHandler] Failed to remove vanilla drops:', error);
    }
  }

  private static getVanillaDropIds(): Set<string> {
    const dropIds = new Set<string>();
    
    const commonDrops = [
      'minecraft:cobblestone',
      'minecraft:stone',
      'minecraft:deepslate',
      'minecraft:cobbled_deepslate',
      'minecraft:netherrack',
      'minecraft:coal',
      'minecraft:diamond',
      'minecraft:emerald',
      'minecraft:lapis_lazuli',
      'minecraft:redstone',
      'minecraft:raw_iron',
      'minecraft:raw_copper',
      'minecraft:raw_gold'
    ];
    
    commonDrops.forEach(id => dropIds.add(id));
    
    for (const blockId of this.recipeMap.keys()) {
      if (blockId.includes('_ore')) {
        const oreName = blockId.replace('_ore', '').replace('deepslate_', '');
        const namespace = blockId.split(':')[0];
        dropIds.add(`${namespace}:raw_${oreName.split(':')[1] || oreName}`);
      }
    }
    
    return dropIds;
  }

  private static spawnCustomDrops(block: Block, recipe: OreCrusherRecipe, fortuneLevel: number): void {
    const location = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5
    };
    
    const fortuneMultiplier = fortuneLevel > 0 ? 1 + (fortuneLevel * 0.33) : 1;
    
    block.dimension.spawnItem(
      new ItemStack(recipe.stoneDust, recipe.stoneDustCount),
      location
    );
    
    if (recipe.oreDust && recipe.oreDustCount) {
      const bonusOreDustCount = Math.floor(recipe.oreDustCount * fortuneMultiplier);
      
      block.dimension.spawnItem(
        new ItemStack(recipe.oreDust, bonusOreDustCount),
        location
      );
      
      if (fortuneLevel > 0) {
        console.warn(`[HammerMiningHandler] Fortune ${fortuneLevel}: ${recipe.oreDustCount} -> ${bonusOreDustCount} dust`);
      }
    }
  }
}
