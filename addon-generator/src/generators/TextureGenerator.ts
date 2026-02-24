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
      ? join(this.projectRoot, `RP/${type}/${itemId}.png`)
      : join(this.projectRoot, `RP/textures/${type}/${itemId}.png`);
    
    FileManager.copyFile(sourcePath, destPath);
    
    const displayPath = itemId.includes('/')
      ? `RP/${type}/${itemId}.png`
      : `RP/textures/${type}/${itemId}.png`;
    console.log(`✅ Đã copy texture: ${displayPath}`);
  }

  updateItemTextureRegistry(itemId: string): void {
    const filePath = join(this.projectRoot, 'RP/textures/item_texture.json');
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

  /**
   * Register item texture in item_texture.json
   */
  registerItemTexture(itemId: string, texturePath: string): void {
    const filePath = join(this.projectRoot, 'RP/textures/item_texture.json');
    const data = FileManager.readJSON(filePath) || {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.items',
      texture_data: {}
    };

    if (!data.texture_data[itemId]) {
      data.texture_data[itemId] = {
        textures: texturePath
      };
      FileManager.writeJSON(filePath, data);
    }
  }

  /**
   * Register block texture in terrain_texture.json
   */
  registerBlockTexture(blockId: string, texturePath: string): void {
    const filePath = join(this.projectRoot, 'RP/textures/terrain_texture.json');
    const data = FileManager.readJSON(filePath) || {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.terrain',
      padding: 8,
      num_mip_levels: 4,
      texture_data: {}
    };

    if (!data.texture_data[blockId]) {
      data.texture_data[blockId] = {
        textures: texturePath
      };
      FileManager.writeJSON(filePath, data);
    }
  }

  /**
   * Generate complete item_texture.json from items array
   */
  generateItemTextureJson(items: Array<{ id: string; texturePath?: string }>): void {
    const filePath = join(this.projectRoot, 'RP/textures/item_texture.json');
    const data = {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.items',
      texture_data: {} as Record<string, any>
    };

    for (const item of items) {
      data.texture_data[item.id] = {
        textures: item.texturePath || `textures/items/${item.id}`
      };
    }

    FileManager.writeJSON(filePath, data);
    console.log(`✅ Đã tạo item_texture.json với ${items.length} textures`);
  }

  /**
   * Generate complete terrain_texture.json from blocks array
   */
  generateTerrainTextureJson(blocks: Array<{ id: string; texturePath?: string }>): void {
    const filePath = join(this.projectRoot, 'RP/textures/terrain_texture.json');
    const data = {
      resource_pack_name: 'apeirix',
      texture_name: 'atlas.terrain',
      padding: 8,
      num_mip_levels: 4,
      texture_data: {} as Record<string, any>
    };

    for (const block of blocks) {
      data.texture_data[block.id] = {
        textures: block.texturePath || `textures/blocks/${block.id}`
      };
    }

    FileManager.writeJSON(filePath, data);
    console.log(`✅ Đã tạo terrain_texture.json với ${blocks.length} textures`);
  }
}
