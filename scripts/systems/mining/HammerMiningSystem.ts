import { world, Block, ItemStack, system } from '@minecraft/server';
import { GENERATED_HAMMER_IDS } from '../../data/GeneratedGameData';
import { GENERATED_ORE_CRUSHER_RECIPES, OreCrusherRecipe } from '../../data/GeneratedProcessingRecipes';

/**
 * HammerMiningSystem - Override vanilla block drops when using hammer
 * 
 * Since Bedrock doesn't allow overriding vanilla block loot tables,
 * we use script API to intercept mining and provide custom drops.
 * 
 * YAML-DRIVEN:
 * - Hammer tool IDs từ GENERATED_HAMMER_IDS
 * - Recipes từ ore_crusher_mk1 trong GENERATED_ORE_CRUSHER_RECIPES
 */
export class HammerMiningSystem {
  // Danh sách hammer tool IDs từ generated data
  private static readonly HAMMER_TOOL_IDS = new Set<string>(GENERATED_HAMMER_IDS);

  // Recipe map cache (load từ ore_crusher_mk1)
  private static recipeMap: Map<string, OreCrusherRecipe> = new Map();

  static initialize(): void {
    console.warn('[HammerMiningSystem] Initializing...');
    
    // Load recipes từ ore_crusher_mk1
    this.loadRecipes();
    
    // Listen to block break events AFTER they happen
    // We can't cancel vanilla block drops, so we need to remove them and spawn custom drops
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });
    
    console.warn('[HammerMiningSystem] Initialized - YAML-driven');
  }

  /**
   * Load recipes từ ore_crusher_mk1 (MK1 recipes = hammer mining recipes)
   */
  private static loadRecipes(): void {
    const mk1Recipes = GENERATED_ORE_CRUSHER_RECIPES['ore_crusher_mk1'];
    if (mk1Recipes) {
      for (const recipe of mk1Recipes) {
        this.recipeMap.set(recipe.inputId, recipe);
      }
      console.warn(`[HammerMiningSystem] Loaded ${this.recipeMap.size} recipes from ore_crusher_mk1`);
    }
  }

  /**
   * Check if item is a hammer
   */
  private static isHammer(itemId: string): boolean {
    return this.HAMMER_TOOL_IDS.has(itemId);
  }

  /**
   * Get recipe for block ID
   */
  private static getRecipe(blockId: string): OreCrusherRecipe | undefined {
    return this.recipeMap.get(blockId);
  }

  private static handleBlockBreak(event: any): void {
    const { block, brokenBlockPermutation, itemStackBeforeBreak } = event;
    
    // Check if player was using a hammer
    if (!itemStackBeforeBreak || !this.isHammer(itemStackBeforeBreak.typeId)) {
      return;
    }
    
    // Check if block has custom dust drops
    const blockId = brokenBlockPermutation.type.id;
    const recipe = this.getRecipe(blockId);
    
    if (!recipe) {
      return;
    }
    
    // Get Fortune level from hammer
    const fortuneLevel = this.getFortuneLevel(itemStackBeforeBreak);
    
    // Schedule cleanup and custom drops
    system.runTimeout(() => {
      // First: Remove vanilla drops
      this.removeVanillaDrops(block);
      
      // Then: Spawn custom drops after a small delay
      system.runTimeout(() => {
        this.spawnCustomDrops(block, recipe, fortuneLevel);
      }, 1);
    }, 1); // Wait 1 tick for vanilla drops to spawn
  }

  /**
   * Get Fortune enchantment level from item
   */
  private static getFortuneLevel(itemStack: any): number {
    try {
      const enchantable = itemStack.getComponent('enchantable');
      if (!enchantable) return 0;
      
      // Try to get fortune enchantment
      const fortuneEnchant = enchantable.getEnchantment('fortune');
      if (fortuneEnchant) {
        return fortuneEnchant.level;
      }
    } catch (error) {
      // Enchantment not found or component not available
    }
    
    return 0;
  }

  private static removeVanillaDrops(block: Block): void {
    // Get all entities near the broken block location
    const location = {
      x: block.location.x + 0.5,
      y: block.location.y + 0.5,
      z: block.location.z + 0.5
    };
    
    try {
      // Get only item entities within 2 blocks radius (safe filtering)
      const nearbyItems = block.dimension.getEntities({
        location: location,
        maxDistance: 2,
        type: 'minecraft:item'
      });
      
      // Build vanilla drop list dynamically from generated data
      // This includes all blocks that can be mined with hammer
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
      console.warn('[HammerMiningSystem] Failed to remove vanilla drops:', error);
    }
  }

  /**
   * Get all possible vanilla drop IDs from hammer-mineable blocks
   */
  private static getVanillaDropIds(): Set<string> {
    const dropIds = new Set<string>();
    
    // Add common vanilla drops that come from hammer-mineable blocks
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
    
    // Add custom ore drops from recipe map
    for (const blockId of this.recipeMap.keys()) {
      // Extract expected vanilla drop from block ID
      // e.g., "apeirix:tin_ore" -> "apeirix:raw_tin"
      if (blockId.includes('_ore')) {
        const oreName = blockId.replace('_ore', '').replace('deepslate_', '');
        const namespace = blockId.split(':')[0];
        
        // Add raw ore item (e.g., apeirix:raw_tin)
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
    
    // Calculate Fortune multiplier for ore dust
    // Fortune I: 1.33x, Fortune II: 1.66x, Fortune III: 2x
    const fortuneMultiplier = fortuneLevel > 0 ? 1 + (fortuneLevel * 0.33) : 1;
    
    // Spawn stone dust (không bị ảnh hưởng bởi Fortune)
    block.dimension.spawnItem(
      new ItemStack(recipe.stoneDust, recipe.stoneDustCount),
      location
    );
    
    // Spawn ore dust if exists (có Fortune bonus)
    if (recipe.oreDust && recipe.oreDustCount) {
      const bonusOreDustCount = Math.floor(recipe.oreDustCount * fortuneMultiplier);
      
      block.dimension.spawnItem(
        new ItemStack(recipe.oreDust, bonusOreDustCount),
        location
      );
      
      // Log fortune bonus for debugging
      if (fortuneLevel > 0) {
        console.warn(`[HammerMining] Fortune ${fortuneLevel}: ${recipe.oreDustCount} -> ${bonusOreDustCount} dust`);
      }
    }
  }
}
