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
        const form = new ActionFormData().title("\xA7l\xA76Th\xE0nh T\u1EF1u APEIRIX").body(
          `\xA77Ti\u1EBFn \u0111\u1ED9: \xA7e${unlockedCount}\xA77/\xA7e${totalAchievements} \xA77(\xA7a${Math.floor(unlockedCount / totalAchievements * 100)}%\xA77)

\xA77Nh\u1EA5n v\xE0o th\xE0nh t\u1EF1u \u0111\u1EC3 xem chi ti\u1EBFt:`
        );
        achievements.forEach(({ achievement, unlocked, progress }) => {
          const status = unlocked ? "\xA7a\u2713" : "\xA77\u2717";
          const progressPercent = Math.floor(progress / achievement.requirement * 100);
          const buttonText = `${status} ${achievement.name}
\xA7r\xA77${progressPercent}%`;
          form.button(buttonText);
        });
        form.button("\xA7c\u0110\xF3ng");
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
        const statusText = unlocked ? "\xA7a\u2713 Ho\xE0n th\xE0nh" : "\xA77\u2717 Ch\u01B0a m\u1EDF kh\xF3a";
        const progressText = `\xA7e${Math.floor(progress)}\xA77/\xA7e${achievement.requirement}`;
        const body = `\xA77${achievement.desc}

\xA77Tr\u1EA1ng th\xE1i: ${statusText}
\xA77Ti\u1EBFn \u0111\u1ED9: ${progressText}
${progressBar}

` + (unlocked ? "\xA7a\xA7l\u0110\xC3 HO\xC0N TH\xC0NH!" : "\xA77C\u1ED1 g\u1EAFng l\xEAn!");
        const form = new ActionFormData().title(`\xA76${achievement.name}`).body(body).button("\xA7aQuay l\u1EA1i").button("\xA7c\u0110\xF3ng");
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
        const filledBar = "\xA7a|".repeat(filled);
        const emptyBar = "\xA77|".repeat(empty);
        return `[${filledBar}${emptyBar}] \xA7e${percent}%`;
      }
      /**
       * Hiển thị thông báo mở khóa thành tựu
       */
      static showUnlockNotification(player, achievementId) {
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return;
        player.onScreenDisplay.setTitle(`\xA76\xA7lM\u1EDF Kh\xF3a Th\xE0nh T\u1EF1u!`);
        player.onScreenDisplay.updateSubtitle(`\xA7e${achievement.name}`);
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
