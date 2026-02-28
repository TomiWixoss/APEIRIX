import { FileManager } from '../core/FileManager.js';
import { join } from 'path';
import { Logger } from '../utils/Logger.js';

export interface FlipbookTextureConfig {
  flipbook_texture: string;
  atlas_tile: string;
  frames?: number[];
  ticks_per_frame?: number;
  blend_frames?: boolean;
}

/**
 * Generator cho Flipbook Textures - tạo animated block textures
 */
export class FlipbookGenerator {
  private flipbookTextures: FlipbookTextureConfig[] = [];

  /**
   * Thêm flipbook texture config
   */
  addFlipbookTexture(config: FlipbookTextureConfig): void {
    this.flipbookTextures.push(config);
  }

  /**
   * Generate flipbook_textures.json file
   */
  generate(outputPath: string): void {
    if (this.flipbookTextures.length === 0) {
      Logger.log('⚠️  No flipbook textures to generate');
      return;
    }

    const filePath = join(outputPath, 'RP/textures/flipbook_textures.json');
    FileManager.writeJSON(filePath, this.flipbookTextures);
    Logger.log(`✅ Đã tạo flipbook_textures.json với ${this.flipbookTextures.length} animations`);
  }

  /**
   * Get all flipbook textures
   */
  getFlipbookTextures(): FlipbookTextureConfig[] {
    return this.flipbookTextures;
  }
}
