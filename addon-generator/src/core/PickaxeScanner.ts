import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { FileManager } from './FileManager.js';

/**
 * PickaxeScanner - Quét custom pickaxes từ BP/items
 */
export class PickaxeScanner {
  constructor(private projectRoot: string) {}

  /**
   * Scan all pickaxes from BP/items folder
   */
  scanPickaxes(): Array<{ id: string; tier: string }> {
    const itemsPath = join(this.projectRoot, 'items');
    
    if (!existsSync(itemsPath)) {
      return [];
    }

    const pickaxes: Array<{ id: string; tier: string }> = [];
    const files = readdirSync(itemsPath);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = join(itemsPath, file);
      try {
        const data = FileManager.readJSON(filePath);
        const item = data['minecraft:item'];
        
        if (!item) continue;
        
        const identifier = item.description?.identifier;
        const tags = item.components?.['minecraft:tags']?.tags || [];
        
        // Check if it's a pickaxe
        if (tags.includes('minecraft:is_pickaxe') || identifier?.includes('pickaxe')) {
          // Extract tier from tags or identifier
          let tier = 'stone';
          for (const tag of tags) {
            if (tag.includes('_tier')) {
              tier = tag.replace('minecraft:', '').replace('_tier', '');
              break;
            }
          }
          
          pickaxes.push({
            id: identifier,
            tier: tier
          });
        }
      } catch (error) {
        // Skip invalid files
        continue;
      }
    }

    return pickaxes;
  }

  /**
   * Generate pickaxe entries for destructible_by_mining
   */
  generatePickaxeEntries(destroySpeed: number): any[] {
    const pickaxes = this.scanPickaxes();
    
    return pickaxes.map(pickaxe => ({
      item: pickaxe.id,
      destroy_speed: destroySpeed
    }));
  }
}
