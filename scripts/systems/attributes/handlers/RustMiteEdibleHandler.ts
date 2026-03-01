/**
 * RustMiteEdibleHandler - Handle 'rust_mite_edible' attribute
 * 
 * SINGLE SOURCE OF TRUTH for 'rust_mite_edible' attribute:
 * - Runtime behavior only (no lore generation)
 * 
 * REUSES LOGIC FROM: RustMiteItemEatingSystem
 * 
 * Items với attribute 'rust_mite_edible' sẽ bị Rust Mite thu hút và "ăn"
 */

import { world, system, Entity, Vector3 } from "@minecraft/server";
import { getItemsWithAttribute } from "../../../data/GeneratedAttributes";

interface MarkerData {
  marker: Entity;
  item: Entity;
  spawnTime: number;
}

export class RustMiteEdibleHandler {
  // ============================================
  // METADATA - Single source of truth
  // ============================================
  static readonly ATTRIBUTE_ID = 'rust_mite_edible';
  // No TEMPLATE_KEY - this attribute has no lore
  
  // ============================================
  // RUNTIME BEHAVIOR
  // ============================================
  
  private static readonly CHECK_INTERVAL = 30; // 30 ticks (1.5 giây) - OPTIMIZED từ 15
  private static readonly DETECTION_RADIUS = 8; // 8 blocks
  private static readonly EAT_DISTANCE = 1.8; // 1.8 blocks để "ăn"
  private static readonly MARKER_LIFETIME = 200; // 10 giây
  
  // Items mà Rust Mite thích ăn - AUTO-GENERATED từ attributes
  private static edibleItems: Set<string>;
  
  // Track active markers
  private static activeMarkers = new Map<string, MarkerData>();

  static initialize(): void {
    console.warn('[RustMiteEdibleHandler] Initializing...');
    
    // Load edible items from attributes
    const items = getItemsWithAttribute('rust_mite_edible');
    this.edibleItems = new Set(items);
    
    console.warn(`[RustMiteEdibleHandler] Loaded ${this.edibleItems.size} edible items`);
    
    this.registerItemEatingBehavior();
    this.registerMarkerCleanup();
    
    console.warn('[RustMiteEdibleHandler] Initialized');
  }

  private static registerItemEatingBehavior(): void {
    system.runInterval(() => {
      try {
        for (const dimName of ["overworld", "nether", "the_end"]) {
          const dimension = world.getDimension(dimName);
          const rustMites = dimension.getEntities({ 
            type: "apeirix:rust_mite" 
          });

          for (const mite of rustMites) {
            if (!mite.isValid) continue;
            this.processRustMite(mite);
          }
        }
      } catch (error) {
        console.warn('[RustMiteEdibleHandler] Error in behavior loop:', error);
      }
    }, this.CHECK_INTERVAL);
  }

  private static registerMarkerCleanup(): void {
    system.runInterval(() => {
      const now = system.currentTick;
      const toRemove: string[] = [];

      for (const [id, data] of this.activeMarkers.entries()) {
        if (!data.marker.isValid || !data.item.isValid) {
          toRemove.push(id);
          try {
            if (data.marker.isValid) data.marker.remove();
          } catch {}
          continue;
        }

        if (now - data.spawnTime > this.MARKER_LIFETIME) {
          toRemove.push(id);
          try {
            data.marker.remove();
          } catch {}
        }
      }

      toRemove.forEach(id => this.activeMarkers.delete(id));
    }, 20);
  }

  private static processRustMite(mite: Entity): void {
    try {
      const miteLocation = mite.location;
      const dimension = mite.dimension;

      const nearbyItems = dimension.getEntities({
        location: miteLocation,
        maxDistance: this.DETECTION_RADIUS,
        type: 'minecraft:item'
      });

      if (nearbyItems.length === 0) return;

      const edibleItems = nearbyItems.filter(itemEntity => {
        try {
          const itemComponent = itemEntity.getComponent('item');
          if (!itemComponent?.itemStack) return false;
          return this.edibleItems.has(itemComponent.itemStack.typeId);
        } catch {
          return false;
        }
      });

      if (edibleItems.length === 0) return;

      let nearestItem: Entity | null = null;
      let nearestDistance = Infinity;

      for (const item of edibleItems) {
        const distance = this.getDistance(miteLocation, item.location);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestItem = item;
        }
      }

      if (!nearestItem) return;

      if (nearestDistance <= this.EAT_DISTANCE) {
        this.eatItem(mite, nearestItem);
      } else {
        this.ensureMarkerForItem(nearestItem);
      }
      
    } catch (error) {
      // Entity không còn valid
    }
  }

  private static ensureMarkerForItem(item: Entity): void {
    const itemId = item.id;
    
    if (this.activeMarkers.has(itemId)) {
      const data = this.activeMarkers.get(itemId)!;
      if (data.marker.isValid) {
        try {
          data.marker.teleport(item.location);
        } catch {}
      }
      return;
    }

    try {
      const itemLocation = item.location;
      let spawnY = itemLocation.y - 10;
      
      const minY = -60;
      const maxY = item.dimension.id === 'minecraft:the_nether' ? 120 : 310;
      
      if (spawnY < minY) {
        spawnY = itemLocation.y + 10;
      }
      if (spawnY > maxY) {
        spawnY = maxY;
      }
      
      const spawnLocation = {
        x: itemLocation.x,
        y: spawnY,
        z: itemLocation.z
      };
      
      const marker = item.dimension.spawnEntity('apeirix:item_bait_marker' as any, spawnLocation);
      
      marker.addEffect('invisibility', 999999, {
        amplifier: 0,
        showParticles: false
      });

      system.runTimeout(() => {
        if (marker.isValid) {
          try {
            marker.teleport(itemLocation);
          } catch {}
        }
      }, 1);

      this.activeMarkers.set(itemId, {
        marker,
        item,
        spawnTime: system.currentTick
      });

    } catch (error) {
      console.warn('[RustMiteEdibleHandler] Failed to spawn marker:', error);
    }
  }

  private static eatItem(mite: Entity, itemEntity: Entity): void {
    try {
      const itemComponent = itemEntity.getComponent('item');
      if (!itemComponent?.itemStack) return;

      const itemName = itemComponent.itemStack.typeId;
      const itemLocation = itemEntity.location;
      const itemId = itemEntity.id;

      const markerData = this.activeMarkers.get(itemId);
      if (markerData) {
        try {
          if (markerData.marker.isValid) {
            markerData.marker.remove();
          }
        } catch {}
        this.activeMarkers.delete(itemId);
      }

      itemEntity.remove();

      mite.dimension.playSound('random.eat', itemLocation, {
        volume: 0.5,
        pitch: 1.2
      });

      mite.dimension.spawnParticle('minecraft:crop_growth_emitter', itemLocation);

      const healthComponent = mite.getComponent('minecraft:health');
      if (healthComponent) {
        const currentHealth = healthComponent.currentValue;
        const maxHealth = healthComponent.effectiveMax;
        if (currentHealth < maxHealth) {
          healthComponent.setCurrentValue(Math.min(currentHealth + 1, maxHealth));
        }
      }

      console.warn(`[RustMiteEdibleHandler] Rust Mite ate ${itemName}`);
    } catch (error) {
      console.warn('[RustMiteEdibleHandler] Error eating item:', error);
    }
  }

  private static getDistance(pos1: Vector3, pos2: Vector3): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
