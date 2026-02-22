/**
 * APEIRIX - Script Chính
 * Thêm mọi thứ vào game
 */
import { world, system } from "@minecraft/server";
import { AchievementTracker } from "./achievements/AchievementTracker";
import { AchievementManager } from "./achievements/AchievementManager";
import { AchievementUI } from "./achievements/AchievementUI";
// Khởi tạo hệ thống thành tựu
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "apeirix:init") {
        AchievementTracker.initialize();
        console.warn("Hệ thống thành tựu APEIRIX đã khởi tạo!");
    }
});
// Khởi tạo khi world load
system.runTimeout(() => {
    AchievementTracker.initialize();
    console.warn("Addon APEIRIX đã tải thành công!");
}, 1);
// Thông báo chào mừng khi người chơi tham gia
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;
    if (event.initialSpawn) {
        player.sendMessage("§a§lChào mừng đến với APEIRIX!");
        // Kiểm tra xem đã nhận sách chưa (dựa vào thành tựu welcome)
        const hasWelcomeAchievement = AchievementManager.hasAchievement(player, "welcome");
        if (!hasWelcomeAchievement) {
            // Tặng sách thành tựu cho người chơi mới (chỉ 1 lần)
            system.runTimeout(() => {
                try {
                    player.runCommand("give @s apeirix:achievement_book 1");
                    player.sendMessage("§e§lBạn đã nhận được Sách Thành Tựu APEIRIX!");
                    player.sendMessage("§7Sử dụng sách để xem tiến độ thành tựu của bạn");
                }
                catch (error) {
                    console.warn("Không thể tặng sách thành tựu:", error);
                }
            }, 20);
        }
    }
});
// Mở UI khi dùng sách thành tựu
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;
    if (item.typeId === "apeirix:achievement_book") {
        system.run(() => {
            AchievementUI.showMainMenu(player);
        });
    }
});
// Lệnh để lấy lại sách nếu mất
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "apeirix:getbook") {
        const entity = event.sourceEntity;
        if (!entity) {
            console.warn("Không tìm thấy entity cho lệnh getbook");
            return;
        }
        const players = world.getAllPlayers();
        const player = players.find(p => p.id === entity.id) || players[0];
        if (!player) {
            console.warn("Không tìm thấy người chơi");
            return;
        }
        system.run(() => {
            try {
                player.runCommand("give @s apeirix:achievement_book 1");
                player.sendMessage("§a§lĐã nhận lại Sách Thành Tựu APEIRIX!");
            }
            catch (error) {
                console.error("Lỗi khi tặng sách:", error);
                player.sendMessage("§cKhông thể tặng sách!");
            }
        });
    }
});
// Lắng nghe lệnh script event
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "apeirix:achievements") {
        const entity = event.sourceEntity;
        if (!entity) {
            console.warn("Không tìm thấy entity cho lệnh thành tựu");
            return;
        }
        // Tìm người chơi
        const players = world.getAllPlayers();
        const player = players.find(p => p.id === entity.id) || players[0];
        if (!player) {
            console.warn("Không tìm thấy người chơi");
            return;
        }
        // Hiển thị UI
        system.run(() => {
            AchievementUI.showMainMenu(player);
        });
    }
});
//# sourceMappingURL=main.js.map