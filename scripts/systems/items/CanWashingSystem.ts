/**
 * Can Washing System - Rửa vỏ đồ hộp bẩn thành sạch
 * Khi candirty chạm nước (water block hoặc cauldron) thì tự động chuyển thành canempty
 */

import { world, system, ItemStack } from "@minecraft/server";

export class CanWashingSystem {
    private static readonly CHECK_INTERVAL = 20; // Tăng lên 20 ticks (1 giây) để tối ưu performance

    static initialize(): void {
        this.registerWashingHandler();
    }

    private static registerWashingHandler(): void {
        // Check định kỳ - chỉ lấy candirty items (tối ưu)
        system.runInterval(() => {
            for (const dimension of [world.getDimension("overworld"), world.getDimension("nether"), world.getDimension("the_end")]) {
                // Lấy ONLY candirty items (filter ngay từ đầu để tối ưu)
                const items = dimension.getEntities({ 
                    type: "minecraft:item",
                    // Note: Không thể filter theo itemStack.typeId trong getEntities
                    // Phải check manual, nhưng vẫn tối ưu hơn vì ít items hơn
                });
                
                for (const itemEntity of items) {
                    try {
                        // Lấy ItemStack từ entity
                        const inventory = itemEntity.getComponent("item") as any;
                        if (!inventory || !inventory.itemStack) continue;
                        
                        const itemStack = inventory.itemStack as ItemStack;
                        
                        // Early return nếu không phải candirty (tối ưu)
                        if (itemStack.typeId !== "apeirix:candirty") continue;
                        
                        // Kiểm tra block dưới chân item
                        const location = itemEntity.location;
                        const blockBelow = dimension.getBlock({
                            x: Math.floor(location.x),
                            y: Math.floor(location.y),
                            z: Math.floor(location.z)
                        });
                        
                        if (!blockBelow) continue;
                        
                        const blockTypeId = blockBelow.typeId;
                        
                        // Check water blocks
                        const isWater = blockTypeId === "minecraft:water" || 
                                       blockTypeId === "minecraft:flowing_water";
                        
                        // Check cauldron - cần check cả typeId và permutation
                        let isCauldronWithWater = false;
                        if (blockTypeId === "minecraft:water_cauldron") {
                            isCauldronWithWater = true;
                        } else if (blockTypeId === "minecraft:cauldron") {
                            // Check permutation states
                            const permutation = blockBelow.permutation;
                            const fillLevel = permutation.getState("fill_level");
                            const cauldronLiquid = permutation.getState("cauldron_liquid");
                            
                            // Cauldron có nước nếu fill_level > 0 và liquid là water
                            if (fillLevel && fillLevel > 0 && cauldronLiquid === "water") {
                                isCauldronWithWater = true;
                            }
                        }
                        
                        if (isWater || isCauldronWithWater) {
                            // Chuyển candirty thành canempty
                            const amount = itemStack.amount;
                            
                            // Xóa item cũ
                            itemEntity.remove();
                            
                            // Spawn item mới (canempty)
                            const cleanCan = new ItemStack("apeirix:canempty", amount);
                            dimension.spawnItem(cleanCan, location);
                            
                            // Play sound
                            dimension.playSound("cauldron.takewater", location, { volume: 0.5 });
                            
                            // Spawn particle - dùng bubble thay vì water_splash
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
                    } catch (error) {
                        // Ignore errors (item might have been picked up)
                    }
                }
            }
        }, this.CHECK_INTERVAL);
    }
}
