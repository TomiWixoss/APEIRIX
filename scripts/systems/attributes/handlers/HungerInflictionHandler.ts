/**
 * HungerInflictionHandler - Handle 'hunger_infliction' attribute for entities
 * 
 * SINGLE SOURCE OF TRUTH for 'hunger_infliction' attribute:
 * - Runtime behavior only (entities don't have lore)
 * - Lore template for when transferred to items
 * 
 * Entities với attribute 'hunger_infliction' sẽ gây hiệu ứng đói khi đánh entity khác
 * 
 * Config:
 * - duration: 100 (5 seconds, in ticks)
 * - amplifier: 0 (level 1)
 */

import { world, Entity } from '@minecraft/server';
import { EntityAttributeResolver } from '../EntityAttributeResolver';
import { PlaceholderRegistry } from '../../lore/placeholders/PlaceholderRegistry';

interface HungerInflictionConfig {
  duration?: number;
  amplifier?: number;
}

export class HungerInflictionHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'hunger_infliction';
  static readonly TEMPLATE_KEY = 'hunger_infliction_template';
  
  // ============================================
  // LORE GENERATION (for when transferred to items)
  // ============================================
  
  /**
   * Get lore template key for auto-generation
   */
  static getLoreTemplateKey(): string {
    return this.TEMPLATE_KEY;
  }
  
  /**
   * Get dynamic placeholders used by this handler
   */
  static getDynamicPlaceholders(): string[] {
    return ['{duration}', '{amplifier}'];
  }
  
  /**
   * Process lore placeholders for this attribute
   * Replaces: {duration}, {amplifier}
   */
  static processLorePlaceholders(entityId: string, line: string, config?: any): string {
    const duration = config?.duration || 100;
    const amplifier = config?.amplifier || 0;
    
    const durationSeconds = (duration / 20).toFixed(1);
    const level = amplifier + 1;
    
    return line
      .replace(/{duration}/g, durationSeconds)
      .replace(/{amplifier}/g, level.toString());
  }
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static readonly DEFAULT_DURATION = 100; // 5 seconds
  private static readonly DEFAULT_AMPLIFIER = 0; // Level 1
  
  static initialize(): void {
    console.warn('[HungerInflictionHandler] Initializing...');
    
    // Register lore placeholder processor
    PlaceholderRegistry.registerAttributeProcessor(
      this.ATTRIBUTE_ID,
      this.processLorePlaceholders.bind(this)
    );
    
    // Subscribe to entity hurt events (use afterEvents to avoid restricted execution)
    world.afterEvents.entityHurt.subscribe((event) => {
      this.handleEntityHurt(event);
    });
    
    console.warn('[HungerInflictionHandler] Initialized');
  }
  
  private static handleEntityHurt(event: any): void {
    try {
      const { damageSource, hurtEntity } = event;
      
      // Get attacker entity
      const attacker = damageSource.damagingEntity;
      if (!attacker) return;
      
      // Check if attacker has hunger_infliction attribute
      if (!EntityAttributeResolver.hasAttribute(attacker, this.ATTRIBUTE_ID)) {
        return;
      }
      
      // Get config
      const attr = EntityAttributeResolver.getAttribute(attacker, this.ATTRIBUTE_ID);
      const config: HungerInflictionConfig = attr?.config || {};
      
      const duration = config.duration || this.DEFAULT_DURATION;
      const amplifier = config.amplifier || this.DEFAULT_AMPLIFIER;
      
      // Apply hunger effect to hurt entity
      try {
        hurtEntity.addEffect('hunger', duration, {
          amplifier: amplifier,
          showParticles: true
        });
        
        console.warn(`[HungerInflictionHandler] ${attacker.typeId} inflicted hunger on ${hurtEntity.typeId} (duration: ${duration}, amplifier: ${amplifier})`);
      } catch (error) {
        console.warn(`[HungerInflictionHandler] Failed to apply hunger effect:`, error);
      }
    } catch (error) {
      console.warn(`[HungerInflictionHandler] Error in handleEntityHurt:`, error);
    }
  }
}
