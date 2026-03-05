/**
 * Better SB - Main Entry Point
 * "Don't play Skyblock, play this!"
 */

import { system } from "@minecraft/server";
import { GameManager } from "./core/GameManager";

// Initialize game on world load
system.runTimeout(() => {
  GameManager.initialize();
}, 1);

// Script event for manual initialization
system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "bettersb:init") {
    GameManager.initialize();
  }
});
