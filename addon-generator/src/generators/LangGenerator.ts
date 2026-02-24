import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

/**
 * Generator cho Language files - update en_US.lang
 */
export class LangGenerator {
  constructor(private projectRoot: string) {}

  updateLangFile(itemId: string, displayName: string, packType: 'BP' | 'RP', prefix: 'item' | 'tile' = 'item'): void {
    const filePath = join(this.projectRoot, `packs/${packType}/texts/en_US.lang`);
    const lines = FileManager.readLines(filePath);
    
    const langKey = `${prefix}.apeirix.${itemId}.name=${displayName}`;
    
    if (!lines.some(line => line.startsWith(`${prefix}.apeirix.${itemId}.name=`))) {
      // Tìm vị trí insert sau ## Items hoặc ## Blocks
      const sectionName = prefix === 'item' ? '## Items' : '## Blocks';
      let insertIndex = lines.length;
      const sectionIndex = lines.findIndex(line => line.includes(sectionName));
      
      if (sectionIndex !== -1) {
        for (let i = sectionIndex + 1; i < lines.length; i++) {
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
      console.log(`⚠️  ${prefix === 'item' ? 'Item' : 'Block'} "${itemId}" đã tồn tại trong ${packType}/texts/en_US.lang`);
    }
  }
}
