/**
 * APEIRIX - Entry Point
 * Thêm mọi thứ vào game
 */

import { system } from "@minecraft/server";
import { GameManager } from "./core/GameManager";

// ============================================
// CUSTOM COMPONENTS (Auto-register on import)
// Custom components PHẢI import ở đây vì chúng cần
// register trong system.beforeEvents.startup
// ============================================
import "./components/FoodComponents";

// ============================================
// AUTOMATED TESTS (Comment out khi không cần)
// ============================================
// Uncomment dòng dưới để enable automated tests
// import "../tests/index.test";
// ============================================

// Initialize game on world load
system.runTimeout(() => {
    GameManager.initialize();
}, 1);

// Script event for manual initialization
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "apeirix:init") {
        GameManager.initialize();
    }
});
