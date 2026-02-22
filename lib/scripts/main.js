/**
 * APEIRIX - Main Script
 * Adds everything to the game
 */
import { world, system } from "@minecraft/server";
// Initialize addon
system.runInterval(() => {
    // Main game loop
}, 20);
// Welcome message when player joins
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;
    if (event.initialSpawn) {
        player.sendMessage("§aWelcome to APEIRIX!");
        player.sendMessage("§eChào mừng đến với APEIRIX!");
    }
});
console.warn("APEIRIX addon loaded successfully!");
//# sourceMappingURL=main.js.map