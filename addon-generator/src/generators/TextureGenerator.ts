import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

/**
 * Generator cho Texture - copy texture và update registry
 */
export class TextureGenerator {
  constructor(private projectRoot: string) {}

  copyTexture(itemId: string, sourcePath: string, type: 'items' | 'blocks' | 'textures' = 'items'): void {
    // Nếu itemId có path (e.g., "models/armor/bronze_layer_1"), giữ nguyên
    const destPath = itemId.includes('/') 
      ? join(this.projectRoot, `packs/RP/${type}/${itemId}.png`)
      : join(this.projectRoot, `packs/RP/textures/${type}/${itemId}.png`);
    
    FileManager.copyFile(sourcePath, destPath);
    
    const displayPath = itemId.includes('/')
      ? `packs/RP/${type}/${itemId}.png`
      : `packs/RP/textures/${type}/${itemId}.png`;
    console.log(`✅ Đã copy texture: ${displayPath}`);
  }

  updateItemTextureRegistry(itemId: string): void {
    const filePath = join(this.projectRoot, 'packs/RP/textures/item_texture.json');
    const data = FileManager.readJSON(filePath) || {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.items',
      texture_data: {}
    };

    if (!data.texture_data[itemId]) {
      data.texture_data[itemId] = {
        textures: `textures/items/${itemId}`
      };
      FileManager.writeJSON(filePath, data);
      console.log(`✅ Đã thêm "${itemId}" vào item_texture.json`);
    } else {
      console.log(`⚠️  Texture "${itemId}" đã tồn tại trong item_texture.json`);
    }
  }
}
