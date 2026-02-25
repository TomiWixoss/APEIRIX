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
        // Register item use handlers
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
    }
}
