/**
 * Wiki Book Handler
 * - Normal use: Show items (no blocks)
 * - Use on block: Show block info
 * - Use on entity: Show entity info (including vanilla entities with attributes)
 * - Sneak + Use (no target): Show self player attributes
 */

import { Player, Block, Entity } from "@minecraft/server";
import { WikiUI } from "../../wiki/WikiUI";
import { AttributeAPI } from "../../attributes/AttributeAPI";
import { GENERATED_ENTITIES } from "../../../data/GeneratedGameData";

export class WikiBookHandler {
    /**
     * Handle wiki book usage
     * @param player - Player using the wiki
     * @param block - Block being interacted with (if any)
     * @param entity - Entity being interacted with (if any)
     */
    static handle(player: Player, block?: Block, entity?: Entity): void {
        // Special case: Sneak + Use (no entity/block target) = Show self attributes
        // Check sneak BEFORE opening UI (UI will cancel sneak)
        const wasSneaking = player.isSneaking;
        
        if (!entity && !block && wasSneaking) {
            // Check if player has any attributes (static from GENERATED_ENTITIES or dynamic)
            const dynamicAttrs = AttributeAPI.getEntityAttributes(player);
            const staticEntity = GENERATED_ENTITIES.find(e => e.entityId === player.typeId);
            
            if (dynamicAttrs.length > 0 || staticEntity) {
                // Player has attributes, show wiki for self
                WikiUI.showEntity(player, player.typeId, player);
                return;
            }
            // No attributes, fall through to normal wiki
        }
        
        if (entity) {
            // Player is interacting with an entity while holding wiki
            const entityId = entity.typeId;
            
            // Check if entity should show wiki:
            // 1. Custom entities (apeirix:*)
            // 2. Entities with dynamic attributes
            // 3. Entities in GENERATED_ENTITIES (vanilla overrides with static attributes)
            const hasAttributes = AttributeAPI.getEntityAttributes(entity).length > 0;
            const isInGeneratedEntities = GENERATED_ENTITIES.some(e => e.entityId === entityId);
            
            if (entityId.startsWith("apeirix:") || hasAttributes || isInGeneratedEntities) {
                WikiUI.showEntity(player, entityId, entity);
                return;
            }
        }
        
        if (block) {
            // Player is interacting with a block while holding wiki
            const blockId = block.typeId;
            if (blockId.startsWith("apeirix:")) {
                WikiUI.showBlock(player, blockId);
                return;
            }
        }

        // Normal wiki usage (show items, no blocks)
        WikiUI.show(player);
    }
}
