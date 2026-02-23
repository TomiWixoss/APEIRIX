/**
 * Item System - Manages custom items
 */

import { world, system } from "@minecraft/server";
import { AchievementBookHandler } from "./handlers/AchievementBookHandler";

export class ItemSystem {
    static initialize(): void {
        this.registerItemHandlers();
    }

    private static registerItemHandlers(): void {
        // Register achievement book handler
        world.afterEvents.itemUse.subscribe((event) => {
            const item = event.itemStack;

            if (item.typeId === "apeirix:achievement_book") {
                system.run(() => {
                    AchievementBookHandler.handle(event.source);
                });
            }
        });
    }
}
