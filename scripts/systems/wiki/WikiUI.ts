/**
 * Wiki UI - Encyclopedia for APEIRIX items
 * Uses JSON UI (book-style) for custom display
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
    /**
     * Show wiki for items in inventory (excludes blocks)
     */
    static async show(player: Player): Promise<void> {
        const items = this.scanInventory(player, true); // true = exclude blocks

        if (items.length === 0) {
            await this.showEmptyWiki(player);
            return;
        }

        await this.showItemList(player, items);
    }

    /**
     * Show wiki for a specific block (when player interacts with block while holding wiki book)
     */
    static async showBlock(player: Player, blockId: string): Promise<void> {
        // Find block in wiki data
        const wikiData = GENERATED_WIKI_ITEMS.find((w) => w.id === blockId);
        
        if (!wikiData) {
            player.sendMessage("§cKhông tìm thấy thông tin về khối này trong wiki.");
            return;
        }

        const shortId = blockId.replace("apeirix:", "");
        const name = wikiData.name || shortId;
        const description = wikiData.description || "";
        const info = (wikiData.info || {}) as unknown as Record<string, string | number | boolean>;

        const blockItem: WikiItem = {
            id: blockId,
            name: name,
            category: wikiData.category,
            icon: "", // Blocks don't need icon in detail view
            description: description,
            info: info
        };

        await this.showBlockDetail(player, blockItem);
    }

    /**
     * Show wiki for a specific entity (when player interacts with entity while holding wiki book)
     */
    static async showEntity(player: Player, entityId: string): Promise<void> {
        // Find entity in wiki data
        const wikiData = GENERATED_WIKI_ITEMS.find((w) => w.id === entityId);
        
        if (!wikiData) {
            player.sendMessage("§cKhông tìm thấy thông tin về sinh vật này trong wiki.");
            return;
        }

        const shortId = entityId.replace("apeirix:", "");
        const name = wikiData.name || shortId;
        const description = wikiData.description || "";
        const info = (wikiData.info || {}) as unknown as Record<string, string | number | boolean>;

        const entityItem: WikiItem = {
            id: entityId,
            name: name,
            category: wikiData.category,
            icon: "", // Entities don't need icon in detail view
            description: description,
            info: info
        };

        await this.showEntityDetail(player, entityItem);
    }

    /**
     * Show wiki UI when inventory is empty
     */
    private static async showEmptyWiki(player: Player): Promise<void> {
        const form = new ActionFormData()
            .title(LangManager.get("wiki.emptyTitle"))
            .body(LangManager.get("wiki.emptyMessage"))
            .button(LangManager.get("wiki.emptyButton"));

        try {
            await form.show(player);
        } catch (error) {
            console.error("Error showing empty wiki:", error);
        }
    }

    /**
     * Scan player inventory for APEIRIX items
     * @param excludeBlocks - If true, exclude blocks from results
     */
    private static scanInventory(player: Player, excludeBlocks: boolean = false): WikiItem[] {
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
                // Skip blocks if excludeBlocks is true
                if (excludeBlocks && this.isBlock(fullId)) {
                    continue;
                }

                const shortId = fullId.replace("apeirix:", "");
                
                // Get name from wiki data (already translated in YAML)
                const name = wikiData.name || shortId;
                
                // Get description from wiki data
                const description = wikiData.description;
                
                // Info already in generated data (no need to look up in lang)
                const info = wikiData.info as Record<string, string | number | boolean> | undefined;

                // Use icon from wiki data or default to full texture path
                const hasIcon = "icon" in wikiData;
                const iconPath: string = hasIcon && typeof wikiData.icon === "string"
                    ? wikiData.icon 
                    : `textures/items/${shortId}`; // Full texture path (without .png)

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
     * Check if an item ID is a block
     */
    private static isBlock(itemId: string): boolean {
        const blockKeywords = ['_ore', '_block', 'crusher', 'compressor', 'sieve', 'washer', 'sifter', 'table'];
        return blockKeywords.some(keyword => itemId.includes(keyword));
    }

    /**
     * Show item list WITHOUT icon title (plain text)
     * Title format: apeirix:list:<title> (no texture path)
     */
    private static async showItemList(player: Player, items: WikiItem[]): Promise<void> {
        // Sort items by name
        items.sort((a, b) => a.name.localeCompare(b.name));

        // Build body text with item count
        const bodyText = LangManager.get("wiki.selectItem") + "\n" + 
                        LangManager.get("wiki.itemCount").replace("{count}", items.length.toString());

        // Build title WITHOUT ICON for list view (plain text only)
        // Format: apeirix:list:<title_text>
        const titleText = LangManager.get("wiki.title");
        const plainTitle = `apeirix:list:${titleText}`;
        
        const form = new ActionFormData()
            .title(plainTitle) // Plain text format (no icon)
            .body(bodyText);

        // Add buttons with icon path and name
        items.forEach((item) => {
            // Button format: icon path, display name
            form.button(item.name, item.icon);
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
     * Format info for display - handles special recipe formatting
     */
    private static formatInfo(info: Record<string, string | number | boolean>): string {
        let result = "";
        const processedKeys = new Set<string>();
        
        // Check if there are crafting recipes
        const recipeCount = typeof info['recipe_count'] === 'number' ? info['recipe_count'] : 0;
        
        if (recipeCount > 0) {
            result += `§l§0Công thức chế tạo:§r\n`;
            
            for (let i = 1; i <= recipeCount; i++) {
                const type = info[`recipe_${i}_type`];
                const label = info[`recipe_${i}_label`];
                
                if (type === 'shaped') {
                    // Shaped recipe - show pattern as grid
                    result += `\n§0${label}§r\n`;
                    
                    const pattern = info[`recipe_${i}_pattern`];
                    if (pattern && typeof pattern === 'string') {
                        const lines = pattern.split('|');
                        lines.forEach(line => {
                            result += `§8${line}§r\n`;
                        });
                    }
                    
                    const ingredients = info[`recipe_${i}_ingredients`];
                    if (ingredients && typeof ingredients === 'string') {
                        result += `§0Nguyên liệu:§r\n`;
                        // Split by comma and show each ingredient on new line
                        const items = ingredients.split(', ');
                        items.forEach(item => {
                            result += `§8${item}§r\n`;
                        });
                    }
                    
                    const resultCount = info[`recipe_${i}_result`];
                    if (resultCount) {
                        result += `§0Kết quả: §r§8${resultCount}§r\n`;
                    }
                    
                    // Mark keys as processed
                    processedKeys.add(`recipe_${i}_type`);
                    processedKeys.add(`recipe_${i}_label`);
                    processedKeys.add(`recipe_${i}_pattern`);
                    processedKeys.add(`recipe_${i}_ingredients`);
                    processedKeys.add(`recipe_${i}_result`);
                } else if (type === 'shapeless') {
                    // Shapeless recipe
                    result += `\n§0${label}§r\n`;
                    
                    const ingredients = info[`recipe_${i}_ingredients`];
                    if (ingredients && typeof ingredients === 'string') {
                        result += `§0Nguyên liệu:§r\n`;
                        // Split by comma and show each ingredient on new line
                        const items = ingredients.split(', ');
                        items.forEach(item => {
                            result += `§8${item}§r\n`;
                        });
                    }
                    
                    const resultCount = info[`recipe_${i}_result`];
                    if (resultCount) {
                        result += `§0Kết quả: §r§8${resultCount}§r\n`;
                    }
                    
                    processedKeys.add(`recipe_${i}_type`);
                    processedKeys.add(`recipe_${i}_label`);
                    processedKeys.add(`recipe_${i}_ingredients`);
                    processedKeys.add(`recipe_${i}_result`);
                } else if (type === 'smelting' || type === 'blasting') {
                    // Smelting/blasting recipe
                    const text = info[`recipe_${i}_text`];
                    if (text) {
                        result += `§8${text}§r\n`;
                    }
                    
                    processedKeys.add(`recipe_${i}_type`);
                    processedKeys.add(`recipe_${i}_text`);
                }
            }
            
            processedKeys.add('recipe_count');
            result += "\n";
        }
        
        // Check if there are processing recipes
        const processingCount = typeof info['processing_recipe_count'] === 'number' ? info['processing_recipe_count'] : 0;
        
        if (processingCount > 0) {
            result += `§l§0Công thức xử lý (${processingCount}):§r\n`;
            
            for (let i = 1; i <= processingCount; i++) {
                const recipe = info[`processing_${i}`];
                if (recipe) {
                    result += `§8${i}. ${recipe}§r\n`;
                    processedKeys.add(`processing_${i}`);
                }
            }
            
            processedKeys.add('processing_recipe_count');
            result += "\n";
        }
        
        // Show remaining info (non-recipe data)
        for (const [key, value] of Object.entries(info)) {
            if (!processedKeys.has(key)) {
                result += `§r§0${key}:§r §8${value}\n`;
            }
        }
        
        return result;
    }

    /**
     * Show detailed information about an item with JSON UI book-style
     * Title format: apeirix:wiki:<icon_padded_200>$<title>
     */
    private static async showItemDetail(
        player: Player,
        item: WikiItem,
        allItems: WikiItem[]
    ): Promise<void> {
        // Build title with item icon (padded to 200 chars)
        // Format: apeirix:wiki:<icon_texture_padded_200>$<item_name>
        // Use icon from wiki data (already has correct path)
        const iconTexturePath = item.icon || `textures/items/${item.id.replace("apeirix:", "")}`;
        const paddedIcon = iconTexturePath.padEnd(200, "$");
        const jsonUITitle = `apeirix:wiki:${paddedIcon}${item.name}`;

        // Build body text with category and info
        let body = "";

        // Description (if exists) - Label in hoa, content in thường
        if (item.description) {
            body += `${LangManager.get("wiki.description")}\n§r§8${item.description}\n\n`;
        }

        // Additional info - use formatInfo for better display
        if (item.info && Object.keys(item.info).length > 0) {
            body += `${LangManager.get("wiki.information")}:\n`;
            body += this.formatInfo(item.info);
            body += "\n";
        }

        // Category - xuống dưới cùng
        const categoryKey = `wiki.categories.${item.category}`;
        body += `${LangManager.get("wiki.category")} ${LangManager.get(categoryKey)}`;

        const form = new ActionFormData()
            .title(jsonUITitle)
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

    /**
     * Show block detail (no icon, plain text title)
     */
    private static async showBlockDetail(player: Player, block: WikiItem): Promise<void> {
        // Plain text title for blocks (no icon)
        const plainTitle = `apeirix:list:${block.name}`;

        // Build body text - ALWAYS show at least category
        let body = "";

        // Description (if exists)
        if (block.description) {
            body += `${LangManager.get("wiki.description")}\n§r§8${block.description}\n\n`;
        }

        // Additional info - use formatInfo
        if (block.info && Object.keys(block.info).length > 0) {
            body += `${LangManager.get("wiki.information")}:\n`;
            body += this.formatInfo(block.info);
            body += "\n";
        }

        // Category - ALWAYS show this
        const categoryKey = `wiki.categories.${block.category}`;
        const categoryName = LangManager.get(categoryKey);
        body += `${LangManager.get("wiki.category")} ${categoryName}`;
        
        // If no description and no info, add a helpful message
        if (!block.description && (!block.info || Object.keys(block.info).length === 0)) {
            body = `${LangManager.get("wiki.category")} ${categoryName}\n\n§8Thông tin chi tiết sẽ được cập nhật sau.`;
        }

        const form = new ActionFormData()
            .title(plainTitle)
            .body(body)
            .button(LangManager.get("wiki.back"));

        try {
            await form.show(player);
        } catch (error) {
            console.error("Error showing block detail:", error);
        }
    }

    /**
     * Show entity detail (no icon, plain text title)
     */
    private static async showEntityDetail(player: Player, entity: WikiItem): Promise<void> {
        // Plain text title for entities (no icon)
        const plainTitle = `apeirix:list:${entity.name}`;

        // Build body text - ALWAYS show at least category
        let body = "";

        // Description (if exists)
        if (entity.description) {
            body += `${LangManager.get("wiki.description")}\n§r§8${entity.description}\n\n`;
        }

        // Additional info - use formatInfo
        if (entity.info && Object.keys(entity.info).length > 0) {
            body += `${LangManager.get("wiki.information")}:\n`;
            body += this.formatInfo(entity.info);
            body += "\n";
        }

        // Category - ALWAYS show this
        const categoryKey = `wiki.categories.${entity.category}`;
        const categoryName = LangManager.get(categoryKey);
        body += `${LangManager.get("wiki.category")} ${categoryName}`;
        
        // If no description and no info, add a helpful message
        if (!entity.description && (!entity.info || Object.keys(entity.info).length === 0)) {
            body = `${LangManager.get("wiki.category")} ${categoryName}\n\n§8Thông tin chi tiết sẽ được cập nhật sau.`;
        }

        const form = new ActionFormData()
            .title(plainTitle)
            .body(body)
            .button(LangManager.get("wiki.back"));

        try {
            await form.show(player);
        } catch (error) {
            console.error("Error showing entity detail:", error);
        }
    }
}
