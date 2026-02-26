/**
 * Rust Mite Item Eating System
 * 
 * Rust Mites bị thu hút bởi và "ăn" các items rơi trên đất.
 * Danh sách items được tự động generate từ configs (GENERATED_RUST_MITE_EDIBLE_ITEMS).
 * 
 * Behavior:
 * 1. Detect dropped items trong bán kính 8 blocks
 * 2. Spawn invisible marker entity tại vị trí item
 * 3. Rust Mite tự nhiên đuổi theo marker (qua AI behavior)
 * 4. Khi đến gần item, "ăn" item và despawn marker
 */

import { world, system, Entity, Vector3 } from "@minecraft/server";
import { GENERATED_RUST_MITE_EDIBLE_ITEMS } from "../../data/GeneratedGameData";

// Track markers để cleanup
interface MarkerData {
  marker: Entity;
  item: Entity;
  spawnTime: number;
}

export class RustMiteItemEatingSystem {
  private static readonly CHECK_INTERVAL = 15; // 15 ticks (0.75 giây)
  private static readonly DETECTION_RADIUS = 8; // 8 blocks
  private static readonly EAT_DISTANCE = 1.8; // 1.8 blocks để "ăn"
  private static readonly MARKER_LIFETIME = 200; // 10 giây - despawn marker nếu không được ăn
  
  // Items mà Rust Mite thích ăn - AUTO-GENERATED từ configs
  private static readonly EDIBLE_ITEMS = new Set(GENERATED_RUST_MITE_EDIBLE_ITEMS);
  
  // Track active markers
  private static activeMarkers = new Map<string, MarkerData>();

  static initialize(): void {
    console.warn('[RustMiteItemEatingSystem] Initializing...');
    this.registerItemEatingBehavior();
    this.registerMarkerCleanup();
    console.warn('[RustMiteItemEatingSystem] Initialized');
  }

  /**
   * Main behavior loop - check all rust mites và spawn markers cho items
   */
  private static registerItemEatingBehavior(): void {
    system.runInterval(() => {
      try {
        // Tìm tất cả Rust Mites trong tất cả dimensions
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
        console.warn('[RustMiteItemEatingSystem] Error in behavior loop:', error);
      }
    }, this.CHECK_INTERVAL);
  }

  /**
   * Cleanup markers cũ
   */
  private static registerMarkerCleanup(): void {
    system.runInterval(() => {
      const now = system.currentTick;
      const toRemove: string[] = [];

      for (const [id, data] of this.activeMarkers.entries()) {
        // Remove nếu marker hoặc item không còn valid
        if (!data.marker.isValid || !data.item.isValid) {
          toRemove.push(id);
          try {
            if (data.marker.isValid) data.marker.remove();
          } catch {}
          continue;
        }

        // Remove nếu quá thời gian
        if (now - data.spawnTime > this.MARKER_LIFETIME) {
          toRemove.push(id);
          try {
            data.marker.remove();
          } catch {}
        }
      }

      toRemove.forEach(id => this.activeMarkers.delete(id));
    }, 20); // Check mỗi giây
  }

  /**
   * Process một Rust Mite - spawn markers cho items gần đó
   */
  private static processRustMite(mite: Entity): void {
    try {
      const miteLocation = mite.location;
      const dimension = mite.dimension;

      // Tìm tất cả item entities gần Rust Mite
      const nearbyItems = dimension.getEntities({
        location: miteLocation,
        maxDistance: this.DETECTION_RADIUS,
        type: 'minecraft:item'
      });

      if (nearbyItems.length === 0) return;

      // Filter chỉ lấy items mà Rust Mite thích ăn
      const edibleItems = nearbyItems.filter(itemEntity => {
        try {
          const itemComponent = itemEntity.getComponent('item');
          if (!itemComponent?.itemStack) return false;
          
          return this.EDIBLE_ITEMS.has(itemComponent.itemStack.typeId);
        } catch {
          return false;
        }
      });

      if (edibleItems.length === 0) return;

      // Tìm item gần nhất
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

      // Nếu đủ gần, "ăn" item
      if (nearestDistance <= this.EAT_DISTANCE) {
        this.eatItem(mite, nearestItem);
      } else {
        // Spawn marker tại vị trí item nếu chưa có
        this.ensureMarkerForItem(nearestItem);
      }
      
    } catch (error) {
      // Entity không còn valid hoặc chunk unload
    }
  }

  /**
   * Đảm bảo có marker cho item (spawn nếu chưa có)
   */
  private static ensureMarkerForItem(item: Entity): void {
    const itemId = item.id;
    
    // Nếu đã có marker cho item này, skip
    if (this.activeMarkers.has(itemId)) {
      const data = this.activeMarkers.get(itemId)!;
      // Update vị trí marker theo item (item có thể di chuyển)
      if (data.marker.isValid) {
        try {
          data.marker.teleport(item.location);
        } catch {}
      }
      return;
    }

    // Spawn marker mới ở vị trí offset để tránh flash texture
    try {
      const itemLocation = item.location;
      
      // Tính vị trí spawn an toàn (offset 10 blocks xuống hoặc lên)
      let spawnY = itemLocation.y - 10;
      
      // Đảm bảo trong world bounds
      // Overworld: -64 to 320, Nether: -64 to 128, End: 0 to 256
      const minY = -60; // An toàn hơn -64
      const maxY = item.dimension.id === 'minecraft:the_nether' ? 120 : 310;
      
      if (spawnY < minY) {
        spawnY = itemLocation.y + 10; // Spawn phía trên nếu quá thấp
      }
      if (spawnY > maxY) {
        spawnY = maxY;
      }
      
      const spawnLocation = {
        x: itemLocation.x,
        y: spawnY,
        z: itemLocation.z
      };
      
      const marker = item.dimension.spawnEntity('apeirix:item_bait_marker', spawnLocation);
      
      // Thêm effect invisible
      marker.addEffect('invisibility', 999999, {
        amplifier: 0,
        showParticles: false
      });

      // Teleport lên vị trí item sau khi đã invisible
      system.runTimeout(() => {
        if (marker.isValid) {
          try {
            marker.teleport(itemLocation);
          } catch {}
        }
      }, 1); // 1 tick delay

      // Track marker
      this.activeMarkers.set(itemId, {
        marker,
        item,
        spawnTime: system.currentTick
      });

    } catch (error) {
      console.warn('[RustMiteItemEatingSystem] Failed to spawn marker:', error);
    }
  }

  /**
   * "Ăn" item - despawn item, marker và play effect
   */
  private static eatItem(mite: Entity, itemEntity: Entity): void {
    try {
      const itemComponent = itemEntity.getComponent('item');
      if (!itemComponent?.itemStack) return;

      const itemName = itemComponent.itemStack.typeId;
      const itemLocation = itemEntity.location;
      const itemId = itemEntity.id;

      // Remove marker nếu có
      const markerData = this.activeMarkers.get(itemId);
      if (markerData) {
        try {
          if (markerData.marker.isValid) {
            markerData.marker.remove();
          }
        } catch {}
        this.activeMarkers.delete(itemId);
      }

      // Despawn item
      itemEntity.remove();

      // Play eating sound
      mite.dimension.playSound('random.eat', itemLocation, {
        volume: 0.5,
        pitch: 1.2
      });

      // Spawn particles
      mite.dimension.spawnParticle('minecraft:crop_growth_emitter', itemLocation);

      // Heal Rust Mite một chút (1 HP)
      const healthComponent = mite.getComponent('minecraft:health');
      if (healthComponent) {
        const currentHealth = healthComponent.currentValue;
        const maxHealth = healthComponent.effectiveMax;
        if (currentHealth < maxHealth) {
          healthComponent.setCurrentValue(Math.min(currentHealth + 1, maxHealth));
        }
      }

      console.warn(`[RustMiteItemEatingSystem] Rust Mite ate ${itemName}`);
    } catch (error) {
      console.warn('[RustMiteItemEatingSystem] Error eating item:', error);
    }
  }

  /**
   * Calculate distance giữa 2 vị trí
   */
  private static getDistance(pos1: Vector3, pos2: Vector3): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
