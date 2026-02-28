import { WikiItemData } from '../../generators/GameDataGenerator.js';
import { Logger } from '../../utils/Logger.js';
import { langLoader } from '../../core/loaders/LangLoader.js';

/**
 * Generate Wiki Data from entity configs - FULLY AUTOMATIC
 * 
 * Auto-generates:
 * - Names from lang files
 * - Descriptions from wikiDescription field (supports lang: prefix)
 * - Icons from texture paths
 * - Info from entity properties (durability, damage, nutrition, etc.)
 */
export class WikiDataBPGenerator {
  static async generate(
    config: any, 
    configDir: string, 
    buildDir: string,
    language: string = 'vi_VN'
  ): Promise<WikiItemData[]> {
    langLoader.setLanguage(language);
    
    const items: WikiItemData[] = [];
    const seen = new Set<string>();
    
    // Helper to add item with deduplication
    const addItem = (item: WikiItemData | null) => {
      if (item && !seen.has(item.id)) {
        items.push(item);
        seen.add(item.id);
      }
    };
    
    // Build sets of IDs that are in tools/armor/foods for fast lookup
    const toolIds = new Set((config.tools || []).map((e: any) => e.id));
    const armorIds = new Set((config.armor || []).map((e: any) => e.id));
    const foodIds = new Set((config.foods || []).map((e: any) => e.id));
    
    // Process each category
    if (config.items) {
      for (const entity of config.items) {
        // Skip if entity is in tools/armor/foods arrays
        if (toolIds.has(entity.id) || armorIds.has(entity.id) || foodIds.has(entity.id)) {
          continue;
        }
        addItem(this.createWikiItem(entity, 'materials', configDir));
      }
    }
    
    if (config.tools) {
      for (const entity of config.tools) {
        addItem(this.createWikiItem(entity, 'tools', configDir));
      }
    }
    
    if (config.armor) {
      for (const entity of config.armor) {
        addItem(this.createWikiItem(entity, 'armor', configDir));
      }
    }
    
    if (config.foods) {
      for (const entity of config.foods) {
        addItem(this.createWikiItem(entity, 'foods', configDir));
      }
    }
    
    // Process blocks (ores and blocks)
    if (config.blocks) {
      for (const entity of config.blocks) {
        addItem(this.createWikiItem(entity, 'materials', configDir));
      }
    }
    
    if (config.ores) {
      for (const entity of config.ores) {
        addItem(this.createWikiItem(entity, 'materials', configDir));
        
        // If ore has deepslate variant, create wiki item for it too
        if (entity.deepslateTexturePath) {
          const deepslateEntity = {
            ...entity,
            id: `deepslate_${entity.id}`,
            name: undefined, // Don't copy name - let resolveName() resolve from lang files
            texture: entity.deepslateTexturePath,
            // Remove deepslate-specific fields to avoid confusion
            deepslateTexturePath: undefined,
            deepslateDestroyTime: undefined
          };
          addItem(this.createWikiItem(deepslateEntity, 'materials', configDir));
        }
      }
    }
    
    // Process entities (mobs)
    if (config.entities) {
      for (const entity of config.entities) {
        addItem(this.createWikiItem(entity, 'materials', configDir));
      }
    }
    
    // Log summary
    Logger.warn(`✅ Generated ${items.length} wiki items (fully automatic)`);
    Logger.warn(`   - Materials: ${items.filter(i => i.category === 'materials').length}`);
    Logger.warn(`   - Tools: ${items.filter(i => i.category === 'tools').length}`);
    Logger.warn(`   - Armor: ${items.filter(i => i.category === 'armor').length}`);
    Logger.warn(`   - Foods: ${items.filter(i => i.category === 'foods').length}`);
    Logger.warn(`   - Blocks: ${(config.blocks || []).length}`);
    Logger.warn(`   - Ores: ${(config.ores || []).length}`);
    Logger.warn(`   - Entities: ${(config.entities || []).length}`);
    
    return items;
  }
  
  /**
   * Create wiki item from any entity type
   */
  private static createWikiItem(
    entity: any,
    category: 'materials' | 'tools' | 'armor' | 'foods',
    configDir: string
  ): WikiItemData | null {
    if (!entity?.id) return null;
    
    const id = `apeirix:${entity.id}`;
    const name = this.resolveName(entity, category, configDir);
    
    // Resolve description from wikiDescription field (supports lang: prefix)
    let description: string | undefined;
    if (entity.wikiDescription) {
      if (entity.wikiDescription.startsWith('lang:')) {
        // Extract lang key from "lang:wiki.category.item_id" format
        const langKey = entity.wikiDescription.replace('lang:', '');
        description = langLoader.get(langKey, configDir, undefined);
      } else {
        // Direct text (backward compatibility)
        description = entity.wikiDescription;
      }
    }
    
    const icon = this.extractIcon(entity);
    const info = this.buildInfo(entity, category, configDir);
    
    // Warn if missing data
    if (!icon) {
      Logger.warn(`⚠️  ${category} ${entity.id} missing icon`);
    }
    if (!description) {
      Logger.warn(`⚠️  ${category} ${entity.id} missing wiki description`);
    }
    
    return {
      id,
      category,
      name,
      description,
      icon,
      info: Object.keys(info).length > 0 ? info : undefined
    };
  }
  
  /**
   * Resolve name from lang files
   */
  private static resolveName(entity: any, category: string, configDir: string): string {
    if (!entity.name && !entity.id) return 'Unknown';
    
    // If entity has explicit name field, use it
    if (entity.name) {
      // Extract lang key from "lang:category.item_id" format
      const langKey = entity.name.startsWith('lang:') 
        ? entity.name.replace('lang:', '')
        : `${category}.${entity.id}`;
      
      return langLoader.get(langKey, configDir, entity.id);
    }
    
    // No explicit name - try to resolve from lang using entity ID
    // Format: category.entity_id (e.g., "materials.deepslate_tin_ore")
    const langKey = `${category}.${entity.id}`;
    return langLoader.get(langKey, configDir, entity.id);
  }
  
  /**
   * Extract icon path from texture
   * Handles: texture, texturePath, textures (object)
   */
  private static extractIcon(entity: any): string | undefined {
    let texturePath: string | undefined;
    
    // Get texture path from various fields
    if (entity.texture) {
      texturePath = entity.texture;
    } else if (entity.texturePath) {
      texturePath = entity.texturePath;
    } else if (entity.textures && typeof entity.textures === 'object') {
      // For blocks with multiple faces, use north or up face
      texturePath = entity.textures.north || entity.textures.up;
    }
    
    if (!texturePath) return undefined;
    
    // Normalize path: remove ../ and extract after "assets/"
    // Example: "../../../assets/silver/raw_silver.png" → "silver/raw_silver"
    // Example: "assets/blocks/tin_block.png" → "blocks/tin_block"
    const normalizedPath = texturePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes
    const assetsIndex = normalizedPath.lastIndexOf('assets/');
    if (assetsIndex === -1) return undefined;
    
    const afterAssets = normalizedPath.substring(assetsIndex + 7); // Skip "assets/"
    const assetPath = afterAssets.replace(/\.(png|jpg|jpeg)$/i, ''); // Remove extension
    
    if (!assetPath) return undefined;
    
    // For blocks, keep the blocks/ folder
    if (assetPath.startsWith('blocks/')) {
      return `textures/${assetPath}`;
    }
    
    // For items/tools/armor/foods, extract just filename
    // "silver/raw_silver" → "raw_silver"
    // "items/bronze_ingot" → "bronze_ingot"
    const filename = assetPath.split('/').pop();
    return `textures/items/${filename}`;
  }
  
  /**
   * Build info object from entity properties
   */
  private static buildInfo(
    entity: any,
    category: string,
    configDir: string
  ): Record<string, string | number | boolean> {
    const info: Record<string, string | number | boolean> = {};
    
    // Common: Recipe info
    if (entity.recipes && entity.recipes.length > 0) {
      const recipe = entity.recipes[0];
      if (recipe.type === 'shaped' || recipe.type === 'shapeless') {
        const count = recipe.ingredients ? Object.keys(recipe.ingredients).length : 0;
        info['Chế tạo'] = `${count} nguyên liệu`;
      }
    }
    
    // Tools: durability, damage, enchantability, tier
    if (category === 'tools') {
      if (entity.durability) info['Độ bền'] = entity.durability;
      if (entity.damage) info['Sát thương'] = entity.damage;
      if (entity.enchantability) info['Độ phù phép'] = entity.enchantability;
      if (entity.tier) info['Cấp độ'] = entity.tier;
    }
    
    // Armor: durability, protection, enchantability, type
    if (category === 'armor') {
      if (entity.durability) info['Độ bền'] = entity.durability;
      if (entity.protection) info['Giáp'] = entity.protection;
      if (entity.enchantability) info['Độ phù phép'] = entity.enchantability;
      if (entity.type) {
        const typeNames: Record<string, string> = {
          helmet: 'Mũ',
          chestplate: 'Áo giáp',
          leggings: 'Quần',
          boots: 'Giày'
        };
        info['Loại'] = typeNames[entity.type] || entity.type;
      }
    }
    
    // Foods: nutrition, saturation, effects
    if (category === 'foods') {
      if (entity.nutrition) info['Dinh dưỡng'] = entity.nutrition;
      if (entity.saturation) info['Độ no'] = entity.saturation;
      if (entity.effects && entity.effects.length > 0) {
        const effectNames = entity.effects.map((e: any) => {
          const langKey = `effects.${e.name}`;
          return langLoader.get(langKey, configDir, e.name);
        });
        info['Hiệu ứng'] = effectNames.join(', ');
      }
    }
    
    return info;
  }
}
