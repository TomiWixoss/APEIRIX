// scripts/main.ts
import { world, system } from "@minecraft/server";
system.runInterval(() => {
}, 20);
world.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  if (event.initialSpawn) {
    player.sendMessage("\xA7aWelcome to APEIRIX!");
    player.sendMessage("\xA7eCh\xE0o m\u1EEBng \u0111\u1EBFn v\u1EDBi APEIRIX!");
  }
});
console.warn("APEIRIX addon loaded successfully!");

//# sourceMappingURL=../debug/main.js.map
