/**
 * Wiki UI - Encyclopedia for APEIRIX items
 */

import { Player, Container } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { LangManager } from "../../lang/LangManager";
import { GENERATED_TOOLS, GENERATED_FOODS } from "../../data/GeneratedGameData";

interface WikiItem {
    id: string;
    fullId: string;
    name: string;
    category: string;
}

export class WikiUI {
    static async show(player: Player): Promise<void> {
        const items = this.scanInventory(player);

        if (items.length === 0) {
            player.sendMessage(LangManager.get("wiki.noItemsFound"));
            return;
        }

        await this.showCategoryMenu(player, items);
    }

    private static scanInventory(player: Player): WikiItem[] {
        const items: WikiItem[] = [];
        const container = player.getComponent("inventory")?.container as Container;
        if (!container) return items;

        const seenIds = new Set<string>();

        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (!item) continue;

            const fullId = item.typeId;
            if (!fullId.startsWith("apeirix:")) continue;
            if (seenIds.has(fullId)) continue;

            seenIds.add(fullId);
            const shortId = fullId.replace("apeirix:", "");

            const wikiItem = this.getItemInfo(shortId, fullId);
            if (wikiItem) {
                items.push(wikiItem);
            }
        }

        return items;
    }

    private static getItemInfo(shortId: string, fullId: string): WikiItem | null {
        // Check if item exists in game by trying to get its display name
        // Items are registered in pack lang files as item.apeirix.{id}.name
        
        // For now, we'll categorize based on known patterns
        // This is a simplified approach - items exist if they're in inventory
        
        let category = "special";
        
        // Categorize by ID patterns
        if (shortId.includes("_ingot") || shortId.includes("_nugget") || 
            shortId.includes("_ore") || shortId.includes("_block") || 
            shortId.startsWith("raw_")) {
            category = "materials";
        } else if (shortId.includes("pickaxe") || shortId.includes("axe") || 
                   shortId.includes("shovel") || shortId.includes("hoe") || 
                   shortId.includes("sword") || shortId.includes("spear")) {
            category = "tools";
        } else if (shortId.includes("helmet") || shortId.includes("chestplate") || 
                   shortId.includes("leggings") || shortId.includes("boots")) {
            category = "armor";
        } else if (shortId.includes("canned") || shortId.includes("food")) {
            category = "foods";
        }

        // Use item's typeId as name for now (will show as apeirix:item_id)
        // In-game, the actual translated name will be shown from pack lang
        return {
            id: shortId,
            fullId: fullId,
            name: fullId, // Will be translated by game
            category: category,
        };
    }

    private static async showCategoryMenu(player: Player, allItems: WikiItem[]): Promise<void> {
        const form = new ActionFormData()
            .title(LangManager.get("wiki.title"))
            .body(
                LangManager.get("wiki.subtitle") +
                    "\n" +
                    LangManager.get("wiki.itemCount").replace("{count}", allItems.length.toString())
            );

        const categories = [
            { key: "all", items: allItems },
            { key: "materials", items: allItems.filter((i) => i.category === "materials") },
            { key: "tools", items: allItems.filter((i) => i.category === "tools") },
            { key: "armor", items: allItems.filter((i) => i.category === "armor") },
            { key: "foods", items: allItems.filter((i) => i.category === "foods") },
            { key: "special", items: allItems.filter((i) => i.category === "special") },
        ];

        categories.forEach((cat) => {
            const label = `${LangManager.get(`wiki.categories.${cat.key}`)} §7(${cat.items.length})`;
            form.button(label);
        });

        form.button(LangManager.get("ui.close"));

        try {
            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return;

            const selectedIndex = response.selection;
            if (selectedIndex === categories.length) return; // Close

            const selectedCategory = categories[selectedIndex];
            await this.showItemList(player, selectedCategory.items, selectedCategory.key, allItems);
        } catch (error) {
            console.error("Error showing wiki category menu:", error);
        }
    }

    private static async showItemList(
        player: Player,
        items: WikiItem[],
        categoryKey: string,
        allItems: WikiItem[]
    ): Promise<void> {
        if (items.length === 0) {
            const form = new ActionFormData()
                .title(LangManager.get("wiki.title"))
                .body(LangManager.get("wiki.noItemsInCategory"))
                .button(LangManager.get("ui.backToMenu"));

            await form.show(player);
            await this.showCategoryMenu(player, allItems);
            return;
        }

        const form = new ActionFormData()
            .title(LangManager.get(`wiki.categories.${categoryKey}`))
            .body(LangManager.get("wiki.selectItem"));

        items.sort((a, b) => a.name.localeCompare(b.name));

        items.forEach((item) => {
            form.button(item.name);
        });

        form.button(LangManager.get("ui.backToMenu"));

        try {
            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return;

            const selectedIndex = response.selection;
            if (selectedIndex === items.length) {
                await this.showCategoryMenu(player, allItems);
                return;
            }

            const selectedItem = items[selectedIndex];
            await this.showItemDetail(player, selectedItem, items, categoryKey, allItems);
        } catch (error) {
            console.error("Error showing wiki item list:", error);
        }
    }

    private static async showItemDetail(
        player: Player,
        item: WikiItem,
        categoryItems: WikiItem[],
        categoryKey: string,
        allItems: WikiItem[]
    ): Promise<void> {
        let body = `§r${item.name}\n\n`;

        body += `${LangManager.get("wiki.type")} §e${LangManager.get(`wiki.types.${item.category}`)}\n`;

        // Add category-specific info
        if (item.category === "tools") {
            const toolData = GENERATED_TOOLS.find((t) => t.id === item.fullId);
            if (toolData) {
                body += `${LangManager.get("wiki.durability")} §e${toolData.durability}\n`;
                body += `${LangManager.get("wiki.toolTypes." + toolData.type)}\n`;
            }
        } else if (item.category === "foods") {
            const foodData = GENERATED_FOODS.find((f) => f.itemId === item.fullId);
            if (foodData) {
                if (foodData.effects && foodData.effects.length > 0) {
                    body += `\n§l§eEffects:\n`;
                    foodData.effects.forEach((effect: any) => {
                        const duration = Math.floor(effect.duration / 20);
                        body += `§7- ${effect.name} (${duration}s)\n`;
                    });
                }
                if (foodData.removeEffects) {
                    body += `\n§a✓ Removes all effects\n`;
                }
            }
        }

        const form = new ActionFormData()
            .title(LangManager.get("wiki.detailTitle"))
            .body(body)
            .button(LangManager.get("ui.backToList"))
            .button(LangManager.get("ui.backToMenu"));

        try {
            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return;

            if (response.selection === 0) {
                await this.showItemList(player, categoryItems, categoryKey, allItems);
            } else if (response.selection === 1) {
                await this.showCategoryMenu(player, allItems);
            }
        } catch (error) {
            console.error("Error showing wiki item detail:", error);
        }
    }
}
