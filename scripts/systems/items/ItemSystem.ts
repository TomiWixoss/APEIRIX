/**
 * Item System - Manages custom items
 */

import { world, system } from "@minecraft/server";
import { AchievementBookHandler } from "./handlers/AchievementBookHandler";
import { WikiBookHandler } from "./handlers/WikiBookHandler";

export class ItemSystem {
    static initialize(): void {
        this.registerItemHandlers();
    }

    private static registerItemHandlers(): void {
        // Register item use handlers (normal use, no block)
        world.afterEvents.itemUse.subscribe((event) => {
            const item = event.itemStack;

            if (item.typeId === "apeirix:achievement_book") {
                system.run(() => {
                    AchievementBookHandler.handle(event.source);
                });
            } else if (item.typeId === "apeirix:wiki_book") {
                system.run(() => {
                    WikiBookHandler.handle(event.source);
                });
            }
        });

        // Register player interact with block (wiki book on block)
        world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
            const player = event.player;
            const item = player.getComponent("inventory")?.container?.getItem(player.selectedSlotIndex);

            if (item && item.typeId === "apeirix:wiki_book") {
                // Cancel default block interaction
                event.cancel = true;
                
                system.run(() => {
                    WikiBookHandler.handle(player, event.block);
                });
            }
        });
    }
}
