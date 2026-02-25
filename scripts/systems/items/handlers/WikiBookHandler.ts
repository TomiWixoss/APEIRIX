/**
 * Wiki Book Handler
 */

import { Player } from "@minecraft/server";
import { WikiUI } from "../../wiki/WikiUI";

export class WikiBookHandler {
    static handle(player: Player): void {
        WikiUI.show(player);
    }
}
