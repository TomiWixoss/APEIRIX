/**
 * APEIRIX - Script Chính
 * Thêm mọi thứ vào game
 */
import { world, system } from "@minecraft/server";
import { AchievementTracker } from "./achievements/AchievementTracker";
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
        player.sendMessage("§7Sử dụng lệnh: §b/scriptevent apeirix:achievements §7để xem thành tựu");
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