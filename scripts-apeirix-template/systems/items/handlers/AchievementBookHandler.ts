/**
 * Achievement Book Handler
 */

import { Player } from "@minecraft/server";
import { MainMenuUI } from "../../achievements/ui/MainMenuUI";

export class AchievementBookHandler {
    static handle(player: Player): void {
        MainMenuUI.show(player);
    }
}
