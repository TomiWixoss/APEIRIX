import { system, ItemComponentConsumeEvent } from '@minecraft/server';

/**
 * Food Custom Components
 * 
 * File này chứa các custom components cho food items.
 * Được import trực tiếp trong main.ts vì custom components
 * PHẢI register trong system.beforeEvents.startup (trước khi game initialize).
 * 
 * Components:
 * - apeirix:food_effects - Apply effects khi ăn food
 * - apeirix:remove_effects - Remove tất cả effects (như milk)
 */

/**
 * Custom Component: apeirix:food_effects
 * Apply effects khi ăn food (format 1.20+)
 */
const FoodEffectsComponent = {
  onConsume(event: ItemComponentConsumeEvent) {
    const { source, itemStack } = event;
    
    // Get custom component value directly from itemStack
    const components = itemStack.getComponents();
    let effectsData: any[] | undefined;
    
    // Find the custom component
    for (const component of components) {
      if (component.typeId === 'apeirix:food_effects') {
        effectsData = (component as any).value;
        break;
      }
    }
    
    if (!effectsData || !Array.isArray(effectsData)) return;
    
    // Apply each effect
    for (const effect of effectsData) {
      const { name, duration, amplifier, chance } = effect;
      
      // Check chance
      if (chance < 1.0 && Math.random() > chance) {
        continue;
      }
      
      // Add effect to player
      try {
        source.addEffect(name, duration, {
          amplifier: amplifier ?? 0,
          showParticles: true
        });
      } catch (error) {
        console.warn(`Failed to apply effect ${name}:`, error);
      }
    }
  }
};

/**
 * Custom Component: apeirix:remove_effects
 * Remove tất cả effects khi ăn (như milk)
 */
const RemoveEffectsComponent = {
  onConsume(event: ItemComponentConsumeEvent) {
    const { source } = event;
    
    // Get all active effects
    const effects = source.getEffects();
    
    // Remove each effect
    for (const effect of effects) {
      try {
        source.removeEffect(effect.typeId);
      } catch (error) {
        console.warn(`Failed to remove effect ${effect.typeId}:`, error);
      }
    }
  }
};

/**
 * Auto-register custom components on import
 */
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
  // Register food effects component
  itemComponentRegistry.registerCustomComponent(
    'apeirix:food_effects',
    FoodEffectsComponent
  );
  
  // Register remove effects component
  itemComponentRegistry.registerCustomComponent(
    'apeirix:remove_effects',
    RemoveEffectsComponent
  );
  
  console.warn('[FoodEffects] Custom components registered');
});
