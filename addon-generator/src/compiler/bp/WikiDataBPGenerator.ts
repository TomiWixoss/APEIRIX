import { GameDataGenerator, WikiItemData } from '../../generators/GameDataGenerator.js';
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import yaml from 'js-yaml';
import { FileManager } from '../../core/FileManager.js';
import { Logger } from '../../utils/Logger.js';

/**
 * Generate Wiki Data from script-lang YAML files
 */
export class WikiDataBPGenerator {
  static async generate(configDir: string, buildDir: string): Promise<WikiItemData[]> {
    const wikiItems: WikiItemData[] = [];
    
    // Scan script-lang/vi_VN/wiki/ directory structure
    const wikiDir = path.join(configDir, 'script-lang/vi_VN/wiki');
    
    if (!existsSync(wikiDir)) {
      Logger.log('⚠️  Wiki directory not found, skipping wiki data generation');
      return wikiItems;
    }

    // Scan all subdirectories matching config structure
    const categories = ['materials', 'tools', 'armor', 'foods', 'special'];
    
    for (const category of categories) {
      const categoryDir = path.join(wikiDir, category);
      if (!existsSync(categoryDir)) continue;

      // Read all YAML files in category
      const files = readdirSync(categoryDir).filter(f => f.endsWith('.yaml'));
      
      for (const file of files) {
        const filePath = path.join(categoryDir, file);
        const content = FileManager.readText(filePath);
        if (!content) continue;
        
        const data = yaml.load(content) as any;
        
        if (!data || !data.items) continue;
        
        // Process each item in the YAML file
        for (const [itemId, itemData] of Object.entries(data.items as Record<string, any>)) {
          wikiItems.push({
            id: `apeirix:${itemId}`,
            category: category,
            name: itemData.name,
            description: itemData.description,
            icon: itemData.icon,
            info: itemData.info
          });
        }
      }
    }

    return wikiItems;
  }
}
