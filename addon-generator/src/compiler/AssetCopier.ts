import path from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { PathResolver } from '../utils/PathResolver.js';

export interface AssetConfig {
  configPath: string;
  icons?: {
    bp?: string;
    rp?: string;
  };
  items?: Array<{ texture?: string }>;
  blocks?: Array<{ 
    texture?: string;
    textureTop?: string;
    textureSide?: string;
    textureFront?: string;
  }>;
  tools?: Array<{ texture?: string; texturePath?: string }>;
  foods?: Array<{ texture?: string }>;
  ores?: Array<{ texturePath?: string; deepslateTexturePath?: string }>;
  armor?: Array<{ texture?: string; textures?: any; armorLayerTexturePath?: string }>;
}

/**
 * Copy assets (textures, icons) to build directory
 */
export class AssetCopier {
  /**
   * Copy all assets from config
   */
  static async copy(config: AssetConfig, outputDir: string): Promise<void> {
    console.log('\n📦 Copying assets...');

    // Copy pack icons
    if (config.icons?.bp) {
      this.copyPackIcon(config.configPath, config.icons.bp, path.join(outputDir, 'BP'));
    }
    if (config.icons?.rp) {
      this.copyPackIcon(config.configPath, config.icons.rp, path.join(outputDir, 'RP'));
    }

    // Copy item textures
    if (config.items) {
      for (const item of config.items) {
        const itemConfigPath = (item as any)._sourcePath || config.configPath;
        if (item.texture) {
          this.copyTexture(itemConfigPath, item.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy tool textures
    if (config.tools) {
      for (const tool of config.tools) {
        const toolConfigPath = (tool as any)._sourcePath || config.configPath;
        const texturePath = tool.texturePath || tool.texture;
        if (texturePath) {
          this.copyTexture(toolConfigPath, texturePath, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy food textures
    if (config.foods) {
      for (const food of config.foods) {
        const foodConfigPath = (food as any)._sourcePath || config.configPath;
        if (food.texture) {
          this.copyTexture(foodConfigPath, food.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy block textures
    if (config.blocks) {
      for (const block of config.blocks) {
        const blockConfigPath = (block as any)._sourcePath || config.configPath;
        const blockId = (block as any).id;
        
        if (block.texture) {
          this.copyTexture(blockConfigPath, block.texture, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
        // Copy multi-face textures with renamed filenames
        if (block.textureTop) {
          this.copyTextureWithRename(blockConfigPath, block.textureTop, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_top.png`);
        }
        if (block.textureSide) {
          this.copyTextureWithRename(blockConfigPath, block.textureSide, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_side.png`);
        }
        if (block.textureFront) {
          this.copyTextureWithRename(blockConfigPath, block.textureFront, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_front.png`);
        }
      }
    }

    // Copy ore textures
    if (config.ores) {
      for (const ore of config.ores) {
        const oreConfigPath = (ore as any)._sourcePath || config.configPath;
        if (ore.texturePath) {
          this.copyTexture(oreConfigPath, ore.texturePath, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
        if (ore.deepslateTexturePath) {
          this.copyTexture(oreConfigPath, ore.deepslateTexturePath, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
      }
    }

    // Copy armor textures
    if (config.armor) {
      for (const armor of config.armor) {
        const armorConfigPath = (armor as any)._sourcePath || config.configPath;
        // Copy armor item texture
        if (armor.texture) {
          this.copyTexture(armorConfigPath, armor.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
        // Copy armor layer textures
        if (armor.armorLayerTexturePath) {
          this.copyArmorLayerTexture(armorConfigPath, armor.armorLayerTexturePath, outputDir);
        }
        if (armor.textures) {
          this.copyArmorTextures(armorConfigPath, armor.textures, outputDir);
        }
      }
    }

    console.log('✓ Assets copied successfully');
  }

  /**
   * Copy pack icon
   */
  private static copyPackIcon(configPath: string, iconPath: string, packDir: string): void {
    const sourcePath = PathResolver.resolveTexture(configPath, iconPath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Pack icon not found: ${sourcePath}`);
      return;
    }

    const destPath = path.join(packDir, 'pack_icon.png');
    this.ensureDir(path.dirname(destPath));
    
    try {
      copyFileSync(sourcePath, destPath);
      console.log(`  ✓ Copied pack icon: ${path.basename(iconPath)}`);
    } catch (error) {
      console.error(`  ✗ Failed to copy pack icon: ${error}`);
    }
  }

  /**
   * Copy texture file with custom destination filename
   */
  private static copyTextureWithRename(configPath: string, texturePath: string, destDir: string, destFilename: string): void {
    const sourcePath = PathResolver.resolveTexture(configPath, texturePath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Texture not found: ${sourcePath}`);
      console.warn(`  Config path: ${configPath}`);
      console.warn(`  Texture path: ${texturePath}`);
      return;
    }

    this.ensureDir(destDir);
    const destPath = path.join(destDir, destFilename);
    
    try {
      copyFileSync(sourcePath, destPath);
    } catch (error) {
      console.error(`  ✗ Failed to copy texture ${destFilename}: ${error}`);
    }
  }

  /**
   * Copy texture file
   */
  private static copyTexture(configPath: string, texturePath: string, destDir: string): void {
    const sourcePath = PathResolver.resolveTexture(configPath, texturePath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Texture not found: ${sourcePath}`);
      console.warn(`  Config path: ${configPath}`);
      console.warn(`  Texture path: ${texturePath}`);
      return;
    }

    this.ensureDir(destDir);
    const destPath = path.join(destDir, path.basename(texturePath));
    
    try {
      copyFileSync(sourcePath, destPath);
    } catch (error) {
      console.error(`  ✗ Failed to copy texture ${path.basename(texturePath)}: ${error}`);
    }
  }

  /**
   * Copy armor textures (layer_1, layer_2)
   */
  private static copyArmorTextures(configPath: string, textures: any, outputDir: string): void {
    const armorDir = path.join(outputDir, 'RP', 'textures', 'models', 'armor');
    
    if (textures.layer1) {
      this.copyTexture(configPath, textures.layer1, armorDir);
    }
    if (textures.layer2) {
      this.copyTexture(configPath, textures.layer2, armorDir);
    }
  }

  /**
   * Copy armor layer texture (auto-detect layer_1 and layer_2)
   */
  private static copyArmorLayerTexture(configPath: string, layerPath: string, outputDir: string): void {
    const armorDir = path.join(outputDir, 'RP', 'textures', 'models', 'armor');
    this.copyTexture(configPath, layerPath, armorDir);
  }

  /**
   * Ensure directory exists
   */
  private static ensureDir(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }
}
