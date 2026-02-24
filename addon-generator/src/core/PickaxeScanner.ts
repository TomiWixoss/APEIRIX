import { FileManager } from './FileManager.js';
import { join } from 'path';
import { readdirSync } from 'fs';

/**
 * Pickaxe Scanner - Quét tất cả custom pickaxes trong dự án
 */
export class PickaxeScanner {
  constructor(private projectRoot: string) {}

  /**
   * Quét tất cả custom pickaxes
   */
  scanPickaxes(): string[] {
    const itemsDir = join(this.projectRoot, 'packs/BP/items');
    const pickaxes: string[] = [];

    try {
      const files = readdirSync(itemsDir);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        const filePath = join(itemsDir, file);
        const content = FileManager.readJSON<any>(filePath);
        
        if (!content || !content['minecraft:item']) continue;
        
        const item = content['minecraft:item'];
        const identifier = item.description?.identifier;
        
        // Check if it's a pickaxe (has minecraft:digger with stone/metal tags)
        const hasDigger = item.components?.['minecraft:digger'];
        const destroySpeeds = hasDigger?.destroy_speeds || [];
        
        const isPickaxe = destroySpeeds.some((speed: any) => {
          const tags = speed.block?.tags || '';
          return typeof tags === 'string' && (
            tags.includes('stone') || 
            tags.includes('metal') ||
            tags.includes('rock')
          );
        });
        
        if (isPickaxe && identifier && identifier.startsWith('apeirix:')) {
          pickaxes.push(identifier);
        }
      }
    } catch (error) {
      console.log(`⚠️  Không thể quét pickaxes: ${error}`);
    }

    return pickaxes;
  }

  /**
   * Tạo item_specific_speeds entries cho custom pickaxes
   */
  generatePickaxeEntries(destroySpeed: number): Array<{ item: string; destroy_speed: number }> {
    const pickaxes = this.scanPickaxes();
    
    return pickaxes.map(pickaxe => ({
      item: pickaxe,
      destroy_speed: destroySpeed
    }));
  }
}
