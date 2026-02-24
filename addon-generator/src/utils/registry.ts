import { FileUtils } from './file.js';
import { join } from 'path';

export class RegistryUpdater {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  updateItemTexture(itemId: string, texturePath: string): void {
    const filePath = join(this.projectRoot, 'packs/RP/textures/item_texture.json');
    const data = FileUtils.readJSON(filePath) || {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.items',
      texture_data: {}
    };

    if (!data.texture_data[itemId]) {
      data.texture_data[itemId] = {
        textures: texturePath
      };
      FileUtils.writeJSON(filePath, data);
      console.log(`✅ Đã thêm texture "${itemId}" vào item_texture.json`);
    } else {
      console.log(`⚠️  Texture "${itemId}" đã tồn tại trong item_texture.json`);
    }
  }

  updateLangFile(itemId: string, displayName: string, packType: 'BP' | 'RP'): void {
    const filePath = join(this.projectRoot, `packs/${packType}/texts/en_US.lang`);
    const lines = FileUtils.readLines(filePath);
    
    const langKey = `item.apeirix:${itemId}.name=${displayName}`;
    
    if (!lines.some(line => line.startsWith(`item.apeirix:${itemId}.name=`))) {
      // Tìm vị trí thích hợp để insert (sau ## Items nếu có)
      let insertIndex = lines.length;
      const itemsIndex = lines.findIndex(line => line.includes('## Items'));
      if (itemsIndex !== -1) {
        // Tìm dòng trống đầu tiên sau ## Items
        for (let i = itemsIndex + 1; i < lines.length; i++) {
          if (lines[i].trim() === '' || lines[i].startsWith('##')) {
            insertIndex = i;
            break;
          }
        }
      }
      
      lines.splice(insertIndex, 0, langKey);
      FileUtils.writeLines(filePath, lines);
      console.log(`✅ Đã thêm "${displayName}" vào ${packType}/texts/en_US.lang`);
    } else {
      console.log(`⚠️  Item "${itemId}" đã tồn tại trong ${packType}/texts/en_US.lang`);
    }
  }
}
