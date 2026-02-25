/**
 * Wiki UI - Encyclopedia for APEIRIX items
 * Displays items from inventory with icon + name button format
 */

import { Player, Container } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { LangManager } from "../../lang/LangManager";
import { GENERATED_WIKI_ITEMS } from "../../data/GeneratedGameData";

interface WikiItem {
    id: string;
    name: string;
    category: string;
    icon: string;
    description?: string;
    info?: Record<string, string | number | boolean>;
}

export class WikiUI {
    static async show(player: Player): Promise<void> {
        const items = this.scanInventory(player);

        if (items.length === 0) {
            player.sendMessage(LangManager.get("wiki.noItemsFound"));
            return;
        }

        await this.showItemList(player, items);
    }

    /**
     * Scan player inventory for APEIRIX items
     */
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

            // Get wiki data from generated data
            const wikiData = GENERATED_WIKI_ITEMS.find((w) => w.id === fullId);
            if (wikiData) {
                const shortId = fullId.replace("apeirix:", "");
                
                // Get name from wiki data (already translated in YAML)
                const name = wikiData.name || shortId;
                
                // Description is not used in new UI (only info)
                const description = "";
                
                // Info already in generated data (no need to look up in lang)
                const info = (wikiData.info || {}) as unknown as Record<string, string | number | boolean>;

                // Use icon from wiki data or default to item texture path
                const hasIcon = "icon" in wikiData;
                const iconPath: string = hasIcon && typeof wikiData.icon === "string"
                    ? wikiData.icon 
                    : `textures/items/${shortId}`;

                items.push({
                    id: fullId,
                    name: name,
                    category: wikiData.category,
                    icon: iconPath,
                    description: description,
                    info: info
                });
            }
        }

        return items;
    }

    /**
     * Show item list with icon + name buttons
     */
    private static async showItemList(player: Player, items: WikiItem[]): Promise<void> {
        const form = new ActionFormData()
            .title(LangManager.get("wiki.title"))
            .body(
                LangManager.get("wiki.selectItem") +
                    "\n" +
                    LangManager.get("wiki.itemCount").replace("{count}", items.length.toString())
            );

        // Sort items by name
        items.sort((a, b) => a.name.localeCompare(b.name));

        // Add buttons with icon path and name
        items.forEach((item) => {
            // Button format: icon path, display name
            form.button(`§8${item.name}`, item.icon);
        });

        try {
            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return;

            const selectedItem = items[response.selection];
            await this.showItemDetail(player, selectedItem, items);
        } catch (error) {
            console.error("Error showing wiki item list:", error);
        }
    }

    /**
     * Show detailed information about an item
     */
    private static async showItemDetail(
        player: Player,
        item: WikiItem,
        allItems: WikiItem[]
    ): Promise<void> {
        let body = `§r§f${item.name}\n\n`;

        // Category
        const categoryKey = `wiki.categories.${item.category}`;
        body += `${LangManager.get("wiki.category")} §e${LangManager.get(categoryKey)}\n\n`;

        // Description
        if (item.description) {
            body += `${LangManager.get("wiki.description")}\n§f${item.description}\n\n`;
        }

        // Additional info
        if (item.info && Object.keys(item.info).length > 0) {
            body += `§l§e${LangManager.get("wiki.information")}:\n`;
            for (const [key, value] of Object.entries(item.info)) {
                body += `§r§7${key}: §f${value}\n`;
            }
        }

        const form = new ActionFormData()
            .title(LangManager.get("wiki.title"))
            .body(body)
            .button(LangManager.get("wiki.back"));

        try {
            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return;

            // Back to list
            await this.showItemList(player, allItems);
        } catch (error) {
            console.error("Error showing wiki item detail:", error);
        }
    }
}
