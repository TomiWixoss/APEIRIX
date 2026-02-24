import { system } from '@minecraft/server';

/**
 * Food Custom Components (Version 2)
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
 * Type definition cho effect parameters
 */
type FoodEffectParams = {
  effects: Array<{
    name: string;
    duration: number;
    amplifier: number;
    chance?: number;
  }>;
};

/**
 * Custom Component: apeirix:food_effects
 * Apply effects khi ăn food (Custom Components Version 2)
 * 
 * Component value trong JSON là OBJECT (không phải array):
 * "apeirix:food_effects": {
 *   "effects": [
 *     { "name": "night_vision", "duration": 300, "amplifier": 0 }
 *   ]
 * }
 */
const FoodEffectsComponent = {
  onConsume(event: any, componentData: any) {
    console.warn('[FoodEffects] ===== onConsume CALLED =====');
    console.warn('[FoodEffects] event:', event);
    console.warn('[FoodEffects] componentData:', componentData);
    console.warn('[FoodEffects] componentData.params:', componentData?.params);
    
    const { source } = event;
    
    // Try to access params
    const params = componentData?.params;
    
    console.warn('[FoodEffects] params type:', typeof params);
    console.warn('[FoodEffects] params:', JSON.stringify(params));
    
    if (!params) {
      console.warn('[FoodEffects] ERROR: params is null/undefined');
      return;
    }
    
    // Try direct access to effects
    const effects = params.effects;
    console.warn('[FoodEffects] effects:', effects);
    
    if (!effects || !Array.isArray(effects)) {
      console.warn('[FoodEffects] ERROR: effects is not an array:', effects);
      // Try to apply a test effect anyway
      try {
        console.warn('[FoodEffects] Trying to apply test effect: speed');
        source.addEffect('speed', 200, { amplifier: 1, showParticles: true });
        console.warn('[FoodEffects] Test effect applied successfully!');
      } catch (error) {
        console.warn('[FoodEffects] Test effect failed:', error);
      }
      return;
    }
    
    console.warn(`[FoodEffects] Found ${effects.length} effects to apply`);
    
    // Apply each effect
    for (const effect of effects) {
      const { name, duration, amplifier, chance } = effect;
      
      console.warn(`[FoodEffects] Applying: ${name}, duration: ${duration}, amplifier: ${amplifier}`);
      
      // Check chance
      if (chance !== undefined && chance < 1.0 && Math.random() > chance) {
        console.warn(`[FoodEffects] Skipped ${name} due to chance`);
        continue;
      }
      
      // Add effect
      try {
        source.addEffect(name, duration, {
          amplifier: amplifier ?? 0,
          showParticles: true
        });
        console.warn(`[FoodEffects] SUCCESS: Applied ${name}`);
      } catch (error) {
        console.warn(`[FoodEffects] FAILED: ${name}:`, error);
      }
    }
    
    console.warn('[FoodEffects] ===== onConsume FINISHED =====');
  }
};

/**
 * Custom Component: apeirix:remove_effects
 * Remove tất cả effects khi ăn (như milk)
 */
const RemoveEffectsComponent = {
  onConsume({ source }: any) {
    console.warn('[RemoveEffects] onConsume triggered!');
    
    // Get all active effects
    const effects = source.getEffects();
    
    console.warn(`[RemoveEffects] Removing ${effects.length} effects`);
    
    // Remove each effect
    for (const effect of effects) {
      try {
        source.removeEffect(effect.typeId);
        console.warn(`[RemoveEffects] Removed ${effect.typeId}`);
      } catch (error) {
        console.warn(`[RemoveEffects] Failed to remove effect ${effect.typeId}:`, error);
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
  
  console.warn('[FoodComponents] Custom components registered successfully (Version 2)');
});
