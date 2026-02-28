/**
 * Item System - Manages custom items
 */

import { world, system } from "@minecraft/server";
import { AchievementBookHandler } from "./handlers/AchievementBookHandler";
import { WikiBookHandler } from "./handlers/WikiBookHandler";

export class ItemSystem {
    private static lastWikiInteraction = new Map<string, number>();
    private static readonly WIKI_COOLDOWN = 500; // 500ms cooldown

    static initialize(): void {
        this.registerItemHandlers();
    }

    private static canUseWiki(playerId: string): boolean {
        const now = Date.now();
        const last = this.lastWikiInteraction.get(playerId) || 0;
        
        if (now - last < this.WIKI_COOLDOWN) {
            return false;
        }
        
        this.lastWikiInteraction.set(playerId, now);
        return true;
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
                const playerId = event.source.id;
                if (!this.canUseWiki(playerId)) return;
                
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
                const playerId = player.id;
                if (!this.canUseWiki(playerId)) {
                    event.cancel = true;
                    return;
                }
                
                // Cancel default block interaction
                event.cancel = true;
                
                system.run(() => {
                    WikiBookHandler.handle(player, event.block);
                });
            }
        });

        // Register player interact with entity (wiki book on entity)
        world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
            const player = event.player;
            const item = player.getComponent("inventory")?.container?.getItem(player.selectedSlotIndex);

            if (item && item.typeId === "apeirix:wiki_book") {
                const playerId = player.id;
                if (!this.canUseWiki(playerId)) {
                    event.cancel = true;
                    return;
                }
                
                // Cancel default entity interaction
                event.cancel = true;
                
                system.run(() => {
                    WikiBookHandler.handle(player, undefined, event.target);
                });
            }
        });
    }
}
