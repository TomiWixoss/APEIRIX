import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { FoodConfig } from './FoodGenerator.js';

/**
 * Helper để tự động thêm food vào scripts/data/GameData.ts
 * Giống như ToolRegistryHelper
 */
export class FoodRegistryHelper {
  /**
   * Thêm food registration vào GameData.ts
   */
  static addToGameData(projectRoot: string, config: FoodConfig): void {
    const gameDataPath = join(projectRoot, 'scripts/data/GameData.ts');
    
    try {
      let content = readFileSync(gameDataPath, 'utf-8');
      
      // Generate registration code
      const registrationCode = this.generateRegistrationCode(config);
      
      // Find registerFoods() method
      const registerFoodsRegex = /private static registerFoods\(\): void \{[\s\S]*?\/\/ Thêm food mới ở đây\.\.\./;
      
      if (!registerFoodsRegex.test(content)) {
        console.warn('⚠️  Không tìm thấy registerFoods() method trong GameData.ts');
        return;
      }
      
      // Check if food already exists
      const foodId = `apeirix:${config.id}`;
      if (content.includes(`itemId: "${foodId}"`)) {
        console.log(`ℹ️  Food ${foodId} đã tồn tại trong GameData.ts`);
        return;
      }
      
      // Insert before "// Thêm food mới ở đây..."
      content = content.replace(
        /(\/\/ Thêm food mới ở đây\.\.\.)/,
        `${registrationCode}\n    $1`
      );
      
      writeFileSync(gameDataPath, content, 'utf-8');
      console.log(`✅ Đã thêm ${foodId} vào GameData.ts`);
      
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật GameData.ts:', error);
    }
  }

  /**
   * Generate registration code cho food
   */
  private static generateRegistrationCode(config: FoodConfig): string {
    const lines: string[] = [];
    
    // Start registration
    lines.push(`FoodRegistry.register({`);
    lines.push(`  itemId: "apeirix:${config.id}",`);
    
    // Add effects if present
    if (config.effects && config.effects.length > 0) {
      lines.push(`  effects: [`);
      config.effects.forEach((effect, index) => {
        const isLast = index === config.effects!.length - 1;
        const chance = effect.chance !== undefined ? `, chance: ${effect.chance}` : '';
        lines.push(`    { name: "${effect.name}", duration: ${effect.duration} * 20, amplifier: ${effect.amplifier ?? 0}${chance} }${isLast ? '' : ','}`);
      });
      lines.push(`  ]`);
    }
    
    // Add removeEffects if present
    if (config.removeEffects) {
      lines.push(`  removeEffects: true`);
    }
    
    lines.push(`});`);
    lines.push(``); // Empty line
    
    // Indent all lines with 4 spaces (not 8)
    return lines.map(line => line ? `    ${line}` : '').join('\n');
  }

  /**
   * Xóa food registration khỏi GameData.ts
   */
  static removeFromGameData(projectRoot: string, foodId: string): void {
    const gameDataPath = join(projectRoot, 'scripts/data/GameData.ts');
    
    try {
      let content = readFileSync(gameDataPath, 'utf-8');
      
      const fullId = foodId.includes(':') ? foodId : `apeirix:${foodId}`;
      
      // Remove the entire FoodRegistry.register() block for this food
      const registrationRegex = new RegExp(
        `\\s*FoodRegistry\\.register\\(\\{[\\s\\S]*?itemId: "${fullId}"[\\s\\S]*?\\}\\);\\s*\\n`,
        'g'
      );
      
      content = content.replace(registrationRegex, '');
      
      writeFileSync(gameDataPath, content, 'utf-8');
      console.log(`✅ Đã xóa ${fullId} khỏi GameData.ts`);
      
    } catch (error) {
      console.error('❌ Lỗi khi xóa khỏi GameData.ts:', error);
    }
  }
}
