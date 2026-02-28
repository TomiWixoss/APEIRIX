/**
 * Wiki Book Handler
 * - Normal use: Show items (no blocks)
 * - Use on block: Show block info
 */

import { Player, Block } from "@minecraft/server";
import { WikiUI } from "../../wiki/WikiUI";

export class WikiBookHandler {
    /**
     * Handle wiki book usage
     * @param player - Player using the wiki
     * @param block - Block being interacted with (if any)
     */
    static handle(player: Player, block?: Block): void {
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
