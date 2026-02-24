import { FileManager } from '../../core/FileManager.js';
import { join } from 'path';

/**
 * Helper để tự động đăng ký tools vào GameData.ts
 */
export class ToolRegistryHelper {
  /**
   * Thêm tool vào GameData.ts
   */
  static addToGameData(
    projectRoot: string,
    toolId: string,
    toolType: string,
    durability: number
  ): void {
    // Thử tìm GameData.ts ở nhiều vị trí
    const possiblePaths = [
      join(projectRoot, 'scripts/data/GameData.ts'),
      join(projectRoot, '../scripts/data/GameData.ts'),
      join(projectRoot, '../../scripts/data/GameData.ts')
    ];
    
    let registryPath = '';
    let content = '';
    
    for (const path of possiblePaths) {
      const testContent = FileManager.readText(path);
      if (testContent) {
        registryPath = path;
        content = testContent;
        break;
      }
    }
    
    if (!content) {
      console.log(`⚠️  Không tìm thấy GameData.ts`);
      return;
    }

    // Check xem tool đã tồn tại chưa
    const toolIdPattern = `id: "apeirix:${toolId}"`;
    if (content.includes(toolIdPattern)) {
      console.log(`ℹ️  Tool "${toolId}" đã tồn tại trong GameData.ts, bỏ qua`);
      return;
    }

    const registerCode = `    ToolRegistry.register({
      id: "apeirix:${toolId}",
      type: "${toolType}",
      durability: ${durability}
    });
`;

    const insertMarker = '// Thêm tool mới ở đây...';
    const insertIndex = content.indexOf(insertMarker);
    
    if (insertIndex === -1) {
      console.log(`⚠️  Không tìm thấy marker "// Thêm tool mới ở đây..." trong GameData.ts`);
      return;
    }

    const newContent = content.slice(0, insertIndex) + registerCode + '\n    ' + content.slice(insertIndex);
    
    FileManager.writeText(registryPath, newContent);
    console.log(`✅ Đã thêm "${toolId}" vào GameData.ts`);
  }
}
