/**
 * Can Washing System - Rửa vỏ đồ hộp bẩn thành sạch
 * Chuột phải vào water block hoặc cauldron với candirty
 */

import { world, system, ItemStack, Player } from "@minecraft/server";

export class CanWashingSystem {
    static initialize(): void {
        this.registerWashingHandler();
    }

    private static registerWashingHandler(): void {
        // Xử lý khi player chuột phải vào block với item
        world.afterEvents.playerInteractWithBlock.subscribe((event) => {
            const player = event.player;
            const item = event.itemStack;
            const block = event.block;

            // Chỉ xử lý lần đầu tiên (không xử lý khi giữ chuột)
            if (!event.isFirstEvent) {
                return;
            }

            // Kiểm tra nếu đang cầm candirty
            if (!item || item.typeId !== "apeirix:candirty") {
                return;
            }

            // Kiểm tra nếu block là water hoặc cauldron có nước
            const blockTypeId = block.typeId;
            const isWaterBlock = blockTypeId === "minecraft:water" || 
                                blockTypeId === "minecraft:flowing_water";
            const isCauldronWithWater = blockTypeId === "minecraft:water_cauldron";

            if (!isWaterBlock && !isCauldronWithWater) {
                return;
            }

            // Chạy sau 1 tick để tránh race condition
            system.run(() => {
                this.washCan(player, item);
            });
        });
    }

    private static washCan(player: Player, dirtyCanItem: ItemStack): void {
        const inventory = player.getComponent("inventory");
        if (!inventory) return;

        const container = inventory.container;
        if (!container) return;

        // Tìm slot đang cầm candirty
        const selectedSlot = player.selectedSlotIndex;
        const slotItem = container.getItem(selectedSlot);

        if (!slotItem || slotItem.typeId !== "apeirix:candirty") {
            return;
        }

        // Giảm 1 candirty
        const amount = slotItem.amount;
        if (amount > 1) {
            slotItem.amount = amount - 1;
            container.setItem(selectedSlot, slotItem);
        } else {
            container.setItem(selectedSlot, undefined);
        }

        // Thêm 1 canempty vào inventory
        const cleanCan = new ItemStack("apeirix:canempty", 1);
        
        // Thử thêm vào inventory
        const remainingItem = container.addItem(cleanCan);
        
        // Nếu inventory đầy, drop ra ngoài
        if (remainingItem) {
            player.dimension.spawnItem(remainingItem, player.location);
        }

        // Play sound effect
        player.playSound("cauldron.takewater", { volume: 1.0 });
        
        // Particle effect (water splash)
        player.dimension.spawnParticle(
            "minecraft:water_splash_particle",
            {
                x: player.location.x,
                y: player.location.y + 1,
                z: player.location.z
            }
        );
    }
}
