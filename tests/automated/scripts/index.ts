/**
 * APEIRIX Automated Tests
 * 
 * Export tất cả test modules để chúng được register với GameTest Framework
 * 
 * Usage:
 * - Import file này trong main.ts hoặc
 * - Compile riêng và load vào behavior pack
 * 
 * Run tests in-game:
 * - /gametest runall
 * - /gametest runset <tag>
 * - /gametest run apeirix:<test_name>
 */

// Import tất cả test modules
import "./BlockTests";
import "./SystemTests";

// TODO: Thêm các test modules khác khi implement
// import "./ItemTests";
// import "./ToolTests";
// import "./RecipeTests";

console.log("[APEIRIX] Automated tests loaded");
