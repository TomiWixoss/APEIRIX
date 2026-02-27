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
    textures?: {
      up?: string;
      down?: string;
      north?: string;
      south?: string;
      east?: string;
      west?: string;
    };
  }>;
  tools?: Array<{ texture?: string; texturePath?: string }>;
  foods?: Array<{ texture?: string }>;
  ores?: Array<{ texturePath?: string; deepslateTexturePath?: string }>;
  armor?: Array<{ texture?: string; textures?: any; armorLayerTexturePath?: string }>;
  entities?: Array<{ 
    id?: string;
    texture?: string; 
    model?: string; 
    animation?: string;
    spawnEgg?: { texture?: string };
  }>;
  structures?: Array<{
    id?: string;
    file?: string;
  }>;
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
        
        // Copy multi-face textures
        if (block.textures) {
          if (block.textures.up) {
            this.copyTextureWithRename(blockConfigPath, block.textures.up, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_up.png`);
          }
          if (block.textures.down) {
            this.copyTextureWithRename(blockConfigPath, block.textures.down, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_down.png`);
          }
          if (block.textures.north) {
            this.copyTextureWithRename(blockConfigPath, block.textures.north, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_north.png`);
          }
          if (block.textures.south) {
            this.copyTextureWithRename(blockConfigPath, block.textures.south, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_south.png`);
          }
          if (block.textures.east) {
            this.copyTextureWithRename(blockConfigPath, block.textures.east, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_east.png`);
          }
          if (block.textures.west) {
            this.copyTextureWithRename(blockConfigPath, block.textures.west, path.join(outputDir, 'RP', 'textures', 'blocks'), `${blockId}_west.png`);
          }
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

    // Copy entity assets
    if (config.entities) {
      for (const entity of config.entities) {
        const entityConfigPath = (entity as any)._sourcePath || config.configPath;
        const entityId = entity.id || 'unknown';
        
        // Copy entity texture
        if (entity.texture) {
          this.copyTexture(entityConfigPath, entity.texture, path.join(outputDir, 'RP', 'textures', 'entity'));
        }
        
        // Copy entity model (.geo.json)
        if (entity.model) {
          this.copyEntityAsset(entityConfigPath, entity.model, path.join(outputDir, 'RP', 'models', 'entity'));
        }
        
        // Copy entity animation (.animation.json)
        if (entity.animation) {
          this.copyEntityAsset(entityConfigPath, entity.animation, path.join(outputDir, 'RP', 'animations'));
        }
        
        // Copy spawn egg texture
        if (entity.spawnEgg?.texture) {
          this.copyTexture(entityConfigPath, entity.spawnEgg.texture, path.join(outputDir, 'RP', 'textures', 'items'));
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
   * Automatically adds "_layer" to filename if not present
   * Example: steel_alloy_1.png -> steel_alloy_layer_1.png
   */
  private static copyArmorLayerTexture(configPath: string, layerPath: string, outputDir: string): void {
    const armorDir = path.join(outputDir, 'RP', 'textures', 'models', 'armor');
    const sourcePath = PathResolver.resolveTexture(configPath, layerPath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Armor layer texture not found: ${sourcePath}`);
      console.warn(`  Config path: ${configPath}`);
      console.warn(`  Texture path: ${layerPath}`);
      return;
    }

    this.ensureDir(armorDir);
    
    // Get original filename
    let filename = path.basename(layerPath);
    
    // Auto-add "_layer" if not present (e.g., steel_alloy_1.png -> steel_alloy_layer_1.png)
    if (!filename.includes('_layer_')) {
      filename = filename.replace(/(_\d+)(\.png|\.jpg)$/i, '_layer$1$2');
    }
    
    const destPath = path.join(armorDir, filename);
    
    try {
      copyFileSync(sourcePath, destPath);
    } catch (error) {
      console.error(`  ✗ Failed to copy armor layer texture ${filename}: ${error}`);
    }
  }

  /**
   * Copy entity asset (model, animation, etc.)
   */
  private static copyEntityAsset(configPath: string, assetPath: string, destDir: string): void {
    const sourcePath = PathResolver.resolveTexture(configPath, assetPath);
    
    if (!existsSync(sourcePath)) {
      console.warn(`⚠ Entity asset not found: ${sourcePath}`);
      console.warn(`  Config path: ${configPath}`);
      console.warn(`  Asset path: ${assetPath}`);
      return;
    }

    this.ensureDir(destDir);
    const destPath = path.join(destDir, path.basename(assetPath));
    
    try {
      copyFileSync(sourcePath, destPath);
    } catch (error) {
      console.error(`  ✗ Failed to copy entity asset ${path.basename(assetPath)}: ${error}`);
    }
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
