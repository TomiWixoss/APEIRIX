/**
 * APEIRIX Test Suite
 * 
 * Import tất cả test files để register với GameTest framework
 * Chạy tests trong game với: /gametest run apeirix:[test_name]
 * Hoặc chạy tất cả: /gametest runall
 */

// Blocks
import "./blocks/tin-ore.test";
import "./blocks/deepslate-tin-ore.test";
import "./blocks/tin-block.test";
import "./blocks/bronze-block.test";

// Items - Materials
import "./items/materials/raw-tin.test";
import "./items/materials/tin-ingot.test";
import "./items/materials/tin-nugget.test";
import "./items/materials/bronze-ingot.test";
import "./items/materials/bronze-nugget.test";

// Items - Tools
import "./items/tools/bronze-pickaxe.test";
import "./items/tools/bronze-axe.test";
import "./items/tools/bronze-shovel.test";
import "./items/tools/bronze-hoe.test";
import "./items/tools/bronze-sword.test";

// Items - Armor
import "./items/armor/bronze-helmet.test";
import "./items/armor/bronze-chestplate.test";
import "./items/armor/bronze-leggings.test";
import "./items/armor/bronze-boots.test";

// Systems
import "./systems/fortune-enchantment.test";
import "./systems/custom-tool-durability.test";
