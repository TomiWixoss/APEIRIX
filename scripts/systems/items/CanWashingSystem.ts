/**
 * Can Washing System - Rửa vỏ đồ hộp bẩn thành sạch
 * Khi candirty chạm nước (water block hoặc cauldron) thì tự động chuyển thành canempty
 * 
 * OPTIMIZED: Event-based tracking thay vì scan toàn bộ thế giới
 */

import { world, system, ItemStack, Entity } from "@minecraft/server";

export class CanWashingSystem {
    private static readonly CHECK_INTERVAL = 20; // 20 ticks (1 giây)
    private static trackedDirtyCans: Set<string> = new Set(); // Track entity IDs

    static initialize(): void {
        this.registerSpawnTracking();
        this.registerWashingHandler();
    }

    /**
     * Track khi candirty được spawn (từ player vứt, hoặc từ ăn đồ hộp)
     */
    private static registerSpawnTracking(): void {
        world.afterEvents.entitySpawn.subscribe((event) => {
            if (event.entity.typeId !== "minecraft:item") return;
            
            try {
                const itemComponent = event.entity.getComponent("item");
                if (itemComponent?.itemStack?.typeId === "apeirix:candirty") {
                    this.trackedDirtyCans.add(event.entity.id);
                }
            } catch (error) {
                // Entity không còn valid
            }
        });
    }

    /**
     * Chỉ check các candirty đã track - KHÔNG scan toàn bộ thế giới
     */
    private static registerWashingHandler(): void {
        system.runInterval(() => {
            // Chỉ lặp qua các entity đã track (cực kỳ tối ưu)
            const toRemove: string[] = [];
            
            for (const entityId of this.trackedDirtyCans) {
                try {
                    // Tìm entity theo ID trong tất cả dimensions
                    let itemEntity: Entity | undefined;
                    
                    for (const dimName of ["overworld", "nether", "the_end"]) {
                        const dimension = world.getDimension(dimName);
                        const entities = dimension.getEntities({ type: "minecraft:item" });
                        itemEntity = entities.find(e => e.id === entityId);
                        if (itemEntity) break;
                    }
                    
                    if (!itemEntity || !itemEntity.isValid) {
                        // Entity đã bị nhặt hoặc despawn
                        toRemove.push(entityId);
                        continue;
                    }
                    
                    // Verify vẫn là candirty
                    const itemComponent = itemEntity.getComponent("item");
                    if (!itemComponent?.itemStack || itemComponent.itemStack.typeId !== "apeirix:candirty") {
                        toRemove.push(entityId);
                        continue;
                    }
                    
                    // Check nước
                    if (this.checkWater(itemEntity)) {
                        this.washCan(itemEntity, itemComponent.itemStack.amount);
                        toRemove.push(entityId);
                    }
                    
                } catch (error) {
                    // Entity không còn valid hoặc chunk unload
                    toRemove.push(entityId);
                }
            }
            
            // Cleanup tracked entities
            for (const id of toRemove) {
                this.trackedDirtyCans.delete(id);
            }
            
        }, this.CHECK_INTERVAL);
    }

    /**
     * Kiểm tra xem item có đang ở trong nước không
     */
    private static checkWater(itemEntity: Entity): boolean {
        const location = itemEntity.location;
        const dimension = itemEntity.dimension;
        
        const blockBelow = dimension.getBlock({
            x: Math.floor(location.x),
            y: Math.floor(location.y),
            z: Math.floor(location.z)
        });
        
        if (!blockBelow) return false;
        
        const blockTypeId = blockBelow.typeId;
        
        // Check water blocks
        if (blockTypeId === "minecraft:water" || blockTypeId === "minecraft:flowing_water") {
            return true;
        }
        
        // Check cauldron with water
        if (blockTypeId === "minecraft:water_cauldron") {
            return true;
        }
        
        if (blockTypeId === "minecraft:cauldron") {
            const permutation = blockBelow.permutation;
            const fillLevel = permutation.getState("fill_level");
            const cauldronLiquid = permutation.getState("cauldron_liquid");
            
            if (fillLevel && fillLevel > 0 && cauldronLiquid === "water") {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Rửa can - chuyển candirty thành canempty
     */
    private static washCan(itemEntity: Entity, amount: number): void {
        const location = itemEntity.location;
        const dimension = itemEntity.dimension;
        
        // Xóa item cũ
        itemEntity.remove();
        
        // Spawn item mới (canempty)
        const cleanCan = new ItemStack("apeirix:canempty", amount);
        dimension.spawnItem(cleanCan, location);
        
        // Play sound
        dimension.playSound("cauldron.takewater", location, { volume: 0.5 });
        
        // Spawn particle
        try {
            dimension.spawnParticle("minecraft:water_evaporation_bucket_emitter", {
                x: location.x,
                y: location.y + 0.2,
                z: location.z
            });
        } catch {
            // Fallback nếu particle không tồn tại
        }
    }
}
