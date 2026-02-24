import { FileManager } from '../core/FileManager.js';
import { join } from 'path';

/**
 * Generator cho Texture - copy texture và update registry
 */
export class TextureGenerator {
  constructor(private projectRoot: string) {}

  copyTexture(itemId: string, sourcePath: string): void {
    const destPath = join(this.projectRoot, `packs/RP/textures/items/${itemId}.png`);
    FileManager.copyFile(sourcePath, destPath);
    console.log(`✅ Đã copy texture: packs/RP/textures/items/${itemId}.png`);
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
