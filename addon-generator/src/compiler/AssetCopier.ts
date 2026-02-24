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
  blocks?: Array<{ texture?: string }>;
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
        if (item.texture) {
          this.copyTexture(config.configPath, item.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy tool textures
    if (config.tools) {
      for (const tool of config.tools) {
        const texturePath = tool.texturePath || tool.texture;
        if (texturePath) {
          this.copyTexture(config.configPath, texturePath, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy food textures
    if (config.foods) {
      for (const food of config.foods) {
        if (food.texture) {
          this.copyTexture(config.configPath, food.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
      }
    }

    // Copy block textures
    if (config.blocks) {
      for (const block of config.blocks) {
        if (block.texture) {
          this.copyTexture(config.configPath, block.texture, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
      }
    }

    // Copy ore textures
    if (config.ores) {
      for (const ore of config.ores) {
        if (ore.texturePath) {
          this.copyTexture(config.configPath, ore.texturePath, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
        if (ore.deepslateTexturePath) {
          this.copyTexture(config.configPath, ore.deepslateTexturePath, path.join(outputDir, 'RP', 'textures', 'blocks'));
        }
      }
    }

    // Copy armor textures
    if (config.armor) {
      for (const armor of config.armor) {
        // Copy armor item texture
        if (armor.texture) {
          this.copyTexture(config.configPath, armor.texture, path.join(outputDir, 'RP', 'textures', 'items'));
        }
        // Copy armor layer textures
        if (armor.armorLayerTexturePath) {
          this.copyArmorLayerTexture(config.configPath, armor.armorLayerTexturePath, outputDir);
        }
        if (armor.textures) {
          this.copyArmorTextures(config.configPath, armor.textures, outputDir);
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
   * Copy texture file
   */
  private static copyTexture(configPath: string, texturePath: string, destDir: string): void {
    const sourcePath = PathResolver.resolveTexture(configPath, texturePath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Texture not found: ${sourcePath}`);
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
