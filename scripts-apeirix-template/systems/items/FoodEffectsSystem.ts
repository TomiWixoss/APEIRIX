import { world, ItemCompleteUseAfterEvent } from "@minecraft/server";
import { FoodRegistry } from "../../data/foods/FoodRegistry";

/**
 * System xử lý food effects
 * Giống như CustomToolSystem - sử dụng events thay vì custom components
 */
export class FoodEffectsSystem {
  private static instance: FoodEffectsSystem;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): FoodEffectsSystem {
    if (!FoodEffectsSystem.instance) {
      FoodEffectsSystem.instance = new FoodEffectsSystem();
    }
    return FoodEffectsSystem.instance;
  }

  private initialize(): void {
    // Listen to item complete use event
    world.afterEvents.itemCompleteUse.subscribe((event) => {
      this.handleItemCompleteUse(event);
    });

    console.warn("[FoodEffectsSystem] Initialized");
  }

  private handleItemCompleteUse(event: ItemCompleteUseAfterEvent): void {
    const { source, itemStack } = event;
    
    if (!itemStack) return;
    
    const itemId = itemStack.typeId;
    
    // Check if this item is registered food
    const foodDef = FoodRegistry.getFood(itemId);
    if (!foodDef) return;

    // Handle remove effects (như milk)
    if (foodDef.removeEffects) {
      console.warn(`[FoodEffectsSystem] Removing all effects from ${source.name}`);
      const effects = source.getEffects();
      for (const effect of effects) {
        try {
          source.removeEffect(effect.typeId);
        } catch (error) {
          console.warn(`[FoodEffectsSystem] Failed to remove ${effect.typeId}:`, error);
        }
      }
      return;
    }

    // Apply effects
    if (!foodDef.effects || foodDef.effects.length === 0) return;

    console.warn(`[FoodEffectsSystem] ${source.name} ate ${itemId}, applying ${foodDef.effects.length} effects`);
    
    for (const effect of foodDef.effects) {
      const { name, duration, amplifier, chance } = effect;
      
      // Check chance
      if (chance !== undefined && chance < 1.0 && Math.random() > chance) {
        console.warn(`[FoodEffectsSystem] Skipped ${name} due to chance`);
        continue;
      }
      
      // Apply effect
      try {
        source.addEffect(name, duration, {
          amplifier: amplifier ?? 0,
          showParticles: true
        });
        console.warn(`[FoodEffectsSystem] Applied ${name} (${duration} ticks, amp ${amplifier}) to ${source.name}`);
      } catch (error) {
        console.warn(`[FoodEffectsSystem] Failed to apply ${name}:`, error);
      }
    }
  }
}
