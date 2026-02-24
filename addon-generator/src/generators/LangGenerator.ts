import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

/**
 * Generator cho Language files - update en_US.lang
 */
export class LangGenerator {
  constructor(private projectRoot: string) {}

  updateLangFile(itemId: string, displayName: string, packType: 'BP' | 'RP'): void {
    const filePath = join(this.projectRoot, `packs/${packType}/texts/en_US.lang`);
    const lines = FileManager.readLines(filePath);
    
    const langKey = `item.apeirix.${itemId}.name=${displayName}`;
    
    if (!lines.some(line => line.startsWith(`item.apeirix.${itemId}.name=`))) {
      // Tìm vị trí insert sau ## Items
      let insertIndex = lines.length;
      const itemsIndex = lines.findIndex(line => line.includes('## Items'));
      
      if (itemsIndex !== -1) {
        for (let i = itemsIndex + 1; i < lines.length; i++) {
          if (lines[i].trim() === '' || lines[i].startsWith('##')) {
            insertIndex = i;
            break;
          }
        }
      }
      
      lines.splice(insertIndex, 0, langKey);
      FileManager.writeLines(filePath, lines);
      console.log(`✅ Đã thêm "${displayName}" vào ${packType}/texts/en_US.lang`);
    } else {
      console.log(`⚠️  Item "${itemId}" đã tồn tại trong ${packType}/texts/en_US.lang`);
    }
  }
}
