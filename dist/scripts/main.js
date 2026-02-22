var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// scripts/achievements/AchievementData.ts
var ACHIEVEMENTS;
var init_AchievementData = __esm({
  "scripts/achievements/AchievementData.ts"() {
    "use strict";
    ACHIEVEMENTS = [
      {
        id: "welcome",
        name: "Ch\xE0o m\u1EEBng \u0111\u1EBFn APEIRIX",
        desc: "Tham gia th\u1EBF gi\u1EDBi l\u1EA7n \u0111\u1EA7u ti\xEAn",
        requirement: 1
      },
      {
        id: "first_steps",
        name: "B\u01B0\u1EDBc \u0110\u1EA7u Ti\xEAn",
        desc: "\u0110i b\u1ED9 100 blocks",
        requirement: 100
      },
      {
        id: "breaker",
        name: "Ng\u01B0\u1EDDi Ph\xE1 H\u1EE7y",
        desc: "Ph\xE1 10 blocks",
        requirement: 10
      }
    ];
  }
});

// scripts/achievements/AchievementUI.ts
var AchievementUI_exports = {};
__export(AchievementUI_exports, {
  AchievementUI: () => AchievementUI
});
import { ActionFormData } from "@minecraft/server-ui";
var AchievementUI;
var init_AchievementUI = __esm({
  "scripts/achievements/AchievementUI.ts"() {
    "use strict";
    init_AchievementManager();
    init_AchievementData();
    AchievementUI = class {
      /**
       * Hiển thị menu thành tựu chính
       */
      static async showMainMenu(player) {
        const achievements = AchievementManager.getAllAchievements(player);
        const totalAchievements = ACHIEVEMENTS.length;
        const unlockedCount = achievements.filter((a) => a.unlocked).length;
        const progressPercent = Math.floor(unlockedCount / totalAchievements * 100);
        const form = new ActionFormData().title("\xA7l\xA76\u2550\u2550\u2550 TH\xC0NH T\u1EF0U APEIRIX \u2550\u2550\u2550").body(
          `\xA78\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\xA77Ti\u1EBFn \u0111\u1ED9 ho\xE0n th\xE0nh: \xA7e${unlockedCount}\xA77/\xA7e${totalAchievements}
${this.createProgressBar(progressPercent)}
\xA78\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\xA77Ch\u1ECDn th\xE0nh t\u1EF1u \u0111\u1EC3 xem chi ti\u1EBFt:`
        );
        achievements.forEach(({ achievement, unlocked, progress }) => {
          const status = unlocked ? "\xA7a[\u2713]" : "\xA77[\u2717]";
          const progressPercent2 = Math.floor(progress / achievement.requirement * 100);
          const progressColor = progressPercent2 >= 100 ? "\xA7a" : progressPercent2 >= 50 ? "\xA7e" : "\xA7c";
          const buttonText = `${status} \xA7r\xA7l${achievement.name}
\xA7r\xA78${progressColor}${progressPercent2}% \xA78ho\xE0n th\xE0nh`;
          form.button(buttonText);
        });
        form.button("\xA7l\xA7c\u2716 \u0110\xF3ng");
        try {
          const response = await form.show(player);
          if (response.canceled || response.selection === void 0) return;
          if (response.selection < achievements.length) {
            const selected = achievements[response.selection];
            await this.showAchievementDetail(player, selected.achievement, selected.unlocked, selected.progress);
          }
        } catch (error) {
          console.error("L\u1ED7i khi hi\u1EC3n th\u1ECB menu th\xE0nh t\u1EF1u:", error);
        }
      }
      /**
       * Hiển thị chi tiết thành tựu
       */
      static async showAchievementDetail(player, achievement, unlocked, progress) {
        const progressPercent = Math.floor(progress / achievement.requirement * 100);
        const progressBar = this.createProgressBar(progressPercent);
        const statusIcon = unlocked ? "\xA7a\u2713" : "\xA77\u2717";
        const statusText = unlocked ? "\xA7a\xA7l\u0110\xC3 HO\xC0N TH\xC0NH" : "\xA77\xA7lCH\u01AFA M\u1EDE KH\xD3A";
        const progressText = `\xA7e${Math.floor(progress)}\xA77/\xA7e${achievement.requirement}`;
        const body = `\xA78\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\xA77${achievement.desc}
\xA78\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501

\xA77Tr\u1EA1ng th\xE1i: ${statusIcon} ${statusText}

\xA77Ti\u1EBFn \u0111\u1ED9: ${progressText}
${progressBar}

` + (unlocked ? "\xA7a\xA7l\u2605 CH\xDAC M\u1EEANG! \u2605\n\xA77B\u1EA1n \u0111\xE3 ho\xE0n th\xE0nh th\xE0nh t\u1EF1u n\xE0y!" : "\xA7e\xA7l\u26A1 C\u1ED0 G\u1EAENG L\xCAN! \u26A1\n\xA77B\u1EA1n s\u1EAFp ho\xE0n th\xE0nh r\u1ED3i!");
        const form = new ActionFormData().title(`\xA7l\xA76${achievement.name}`).body(body).button("\xA7l\xA7a\u2190 Quay l\u1EA1i Menu").button("\xA7l\xA7c\u2716 \u0110\xF3ng");
        try {
          const response = await form.show(player);
          if (!response.canceled && response.selection === 0) {
            await this.showMainMenu(player);
          }
        } catch (error) {
          console.error("L\u1ED7i khi hi\u1EC3n th\u1ECB chi ti\u1EBFt th\xE0nh t\u1EF1u:", error);
        }
      }
      /**
       * Tạo thanh tiến độ
       */
      static createProgressBar(percent) {
        const barLength = 20;
        const filled = Math.floor(percent / 100 * barLength);
        const empty = barLength - filled;
        let barColor = "\xA7c";
        if (percent >= 75) barColor = "\xA7a";
        else if (percent >= 50) barColor = "\xA7e";
        else if (percent >= 25) barColor = "\xA76";
        const filledBar = barColor + "\u2588".repeat(filled);
        const emptyBar = "\xA78\u2588".repeat(empty);
        return `\xA78[${filledBar}${emptyBar}\xA78] \xA7e${percent}%`;
      }
      /**
       * Hiển thị thông báo mở khóa thành tựu
       */
      static showUnlockNotification(player, achievementId) {
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return;
        player.onScreenDisplay.setTitle(`\xA76\xA7l\u2605 M\u1EDE KH\xD3A TH\xC0NH T\u1EF0U! \u2605`);
        player.onScreenDisplay.updateSubtitle(`\xA7e\xA7l${achievement.name}`);
      }
    };
  }
});

// scripts/achievements/AchievementManager.ts
var AchievementManager;
var init_AchievementManager = __esm({
  "scripts/achievements/AchievementManager.ts"() {
    "use strict";
    init_AchievementData();
    AchievementManager = class {
      static {
        this.PROPERTY_PREFIX = "apeirix:achievement_";
      }
      static {
        this.PROGRESS_PREFIX = "apeirix:progress_";
      }
      /**
       * Check if player has unlocked an achievement
       */
      static hasAchievement(player, achievementId) {
        try {
          return player.getDynamicProperty(this.PROPERTY_PREFIX + achievementId) === true;
        } catch {
          return false;
        }
      }
      /**
       * Get progress for an achievement
       */
      static getProgress(player, achievementId) {
        try {
          const progress = player.getDynamicProperty(this.PROGRESS_PREFIX + achievementId);
          return typeof progress === "number" ? progress : 0;
        } catch {
          return 0;
        }
      }
      /**
       * Set progress for an achievement
       */
      static setProgress(player, achievementId, value) {
        try {
          player.setDynamicProperty(this.PROGRESS_PREFIX + achievementId, value);
          const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
          if (achievement && value >= achievement.requirement && !this.hasAchievement(player, achievementId)) {
            this.unlockAchievement(player, achievementId);
          }
        } catch (error) {
          console.warn(`Failed to set progress for ${achievementId}:`, error);
        }
      }
      /**
       * Increment progress for an achievement
       */
      static incrementProgress(player, achievementId, amount = 1) {
        const current = this.getProgress(player, achievementId);
        this.setProgress(player, achievementId, current + amount);
      }
      /**
       * Unlock an achievement
       */
      static unlockAchievement(player, achievementId) {
        try {
          if (this.hasAchievement(player, achievementId)) return;
          player.setDynamicProperty(this.PROPERTY_PREFIX + achievementId, true);
          const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
          if (achievement) {
            Promise.resolve().then(() => (init_AchievementUI(), AchievementUI_exports)).then(({ AchievementUI: AchievementUI2 }) => {
              AchievementUI2.showUnlockNotification(player, achievementId);
            });
            player.playSound("random.levelup");
          }
        } catch (error) {
          console.warn(`Failed to unlock achievement ${achievementId}:`, error);
        }
      }
      /**
       * Get all achievements with their status for a player
       */
      static getAllAchievements(player) {
        return ACHIEVEMENTS.map((achievement) => ({
          achievement,
          unlocked: this.hasAchievement(player, achievement.id),
          progress: this.getProgress(player, achievement.id)
        }));
      }
    };
  }
});

// scripts/main.ts
import { world as world2, system as system2 } from "@minecraft/server";

// scripts/achievements/AchievementTracker.ts
init_AchievementManager();
import { world, system } from "@minecraft/server";
var AchievementTracker = class {
  static {
    this.playerPositions = /* @__PURE__ */ new Map();
  }
  /**
   * Initialize all achievement trackers
   */
  static initialize() {
    this.trackWelcome();
    this.trackMovement();
    this.trackBlockBreaking();
  }
  /**
   * Track "Welcome to APEIRIX" achievement
   */
  static trackWelcome() {
    world.afterEvents.playerSpawn.subscribe((event) => {
      if (event.initialSpawn) {
        AchievementManager.setProgress(event.player, "welcome", 1);
      }
    });
  }
  /**
   * Track "First Steps" achievement - Walk 100 blocks
   */
  static trackMovement() {
    system.runInterval(() => {
      for (const player of world.getAllPlayers()) {
        const currentPos = player.location;
        const lastPos = this.playerPositions.get(player.id);
        if (lastPos) {
          const distance = Math.sqrt(
            Math.pow(currentPos.x - lastPos.x, 2) + Math.pow(currentPos.z - lastPos.z, 2)
          );
          if (distance > 0.1 && distance < 10) {
            AchievementManager.incrementProgress(player, "first_steps", distance);
          }
        }
        this.playerPositions.set(player.id, currentPos);
      }
    }, 20);
  }
  /**
   * Track "Breaker" achievement - Break 10 blocks
   */
  static trackBlockBreaking() {
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      AchievementManager.incrementProgress(event.player, "breaker", 1);
    });
  }
};

// scripts/main.ts
init_AchievementUI();
system2.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "apeirix:init") {
    AchievementTracker.initialize();
    console.warn("H\u1EC7 th\u1ED1ng th\xE0nh t\u1EF1u APEIRIX \u0111\xE3 kh\u1EDFi t\u1EA1o!");
  }
});
system2.runTimeout(() => {
  AchievementTracker.initialize();
  console.warn("Addon APEIRIX \u0111\xE3 t\u1EA3i th\xE0nh c\xF4ng!");
}, 1);
world2.afterEvents.playerSpawn.subscribe((event) => {
  const player = event.player;
  if (event.initialSpawn) {
    player.sendMessage("\xA7a\xA7lCh\xE0o m\u1EEBng \u0111\u1EBFn v\u1EDBi APEIRIX!");
    player.sendMessage("\xA77S\u1EED d\u1EE5ng l\u1EC7nh: \xA7b/scriptevent apeirix:achievements \xA77\u0111\u1EC3 xem th\xE0nh t\u1EF1u");
    system2.runTimeout(() => {
      try {
        player.runCommand("give @s apeirix:achievement_book 1");
        player.sendMessage("\xA7e\xA7lB\u1EA1n \u0111\xE3 nh\u1EADn \u0111\u01B0\u1EE3c S\xE1ch Th\xE0nh T\u1EF1u APEIRIX!");
      } catch (error) {
        console.warn("Kh\xF4ng th\u1EC3 t\u1EB7ng s\xE1ch th\xE0nh t\u1EF1u:", error);
      }
    }, 20);
  }
});
world2.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;
  if (item.typeId === "apeirix:achievement_book") {
    system2.run(() => {
      AchievementUI.showMainMenu(player);
    });
  }
});
system2.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "apeirix:achievements") {
    const entity = event.sourceEntity;
    if (!entity) {
      console.warn("Kh\xF4ng t\xECm th\u1EA5y entity cho l\u1EC7nh th\xE0nh t\u1EF1u");
      return;
    }
    const players = world2.getAllPlayers();
    const player = players.find((p) => p.id === entity.id) || players[0];
    if (!player) {
      console.warn("Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i");
      return;
    }
    system2.run(() => {
      AchievementUI.showMainMenu(player);
    });
  }
});

//# sourceMappingURL=../debug/main.js.map
