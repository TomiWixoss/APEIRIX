/**
 * Game Manager - Main game initialization and loop
 * Better SB - Sky Factory 4 inspired
 */

import { world, system } from "@minecraft/server";
import { EventBus } from "./EventBus";
import { GameData } from "../data/GameData";
import { LangManager } from "../lang/LangManager";
import { DisplayHandler } from "../systems/shared/processing/DisplayHandler";
import { VoidTeleportSystem } from "../systems/void/VoidTeleportSystem";

export class GameManager {
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    // 1. Initialize language system
    LangManager.init();

    // 2. Initialize game data (registries)
    GameData.initialize();

    // 3. Initialize systems
    this.initializeSystems();

    // 4. Setup global event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize all game systems
   * Order matters: some systems depend on others
   */
  private static initializeSystems(): void {
    // QoL: Display block names on look
    DisplayHandler.initialize();

    // Sky Factory 4: Void teleport
    VoidTeleportSystem.initialize();
  }

  /**
   * Setup global event listeners
   */
  private static setupEventListeners(): void {
    // Player spawn event - give starter items, etc.
    world.afterEvents.playerSpawn.subscribe((event) => {
      if (event.initialSpawn) {
        this.onPlayerFirstSpawn(event.player);
      }
    });

    // Script events for manual commands
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id === "bettersb:init") {
        this.initialize();
      }
    });
  }

  /**
   * Handle player first spawn
   */
  private static onPlayerFirstSpawn(player: any): void {
    // TODO: Give starter items, etc.
  }
}
