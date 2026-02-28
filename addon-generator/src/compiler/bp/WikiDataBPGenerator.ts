import { WikiItemData } from '../../generators/GameDataGenerator.js';
import { Logger } from '../../utils/Logger.js';
import { langLoader } from '../../core/loaders/LangLoader.js';
import * as fs from 'fs';
import * as path from 'path';

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
  private static vanillaLangCache: Map<string, string> | null = null;
  
  /**
   * Load vanilla lang file (en_US.lang) and cache it
   */
  private static loadVanillaLang(configDir: string): Map<string, string> {
    if (this.vanillaLangCache) {
      return this.vanillaLangCache;
    }
    
    this.vanillaLangCache = new Map();
    const langPath = path.join(configDir, '..', 'en_US.lang');
    
    if (!fs.existsSync(langPath)) {
      Logger.warn(`Vanilla lang file not found at ${langPath}`);
      return this.vanillaLangCache;
    }
    
    const content = fs.readFileSync(langPath, 'utf-8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const match = trimmed.match(/^(tile|item)\.([^=]+)\.name=(.+)$/);
      if (match) {
        const itemId = match[2];
        const itemName = match[3];
        this.vanillaLangCache.set(itemId, itemName);
      }
    }
    
    return this.vanillaLangCache;
  }
  
  /**
   * Resolve item name from ID (supports both vanilla and apeirix items)
   * @param itemId Full item ID like "minecraft:stone" or "apeirix:tin_ingot"
   * @param configDir Config directory for lang files
   * @returns Resolved item name or original ID if not found
   */
  private static resolveItemName(itemId: string, configDir: string): string {
    // Remove namespace prefix
    const [namespace, id] = itemId.includes(':') ? itemId.split(':') : ['minecraft', itemId];
    
    if (namespace === 'minecraft') {
      // Vanilla item - lookup in en_US.lang
      const vanillaLang = this.loadVanillaLang(configDir);
      const name = vanillaLang.get(id);
      if (name) return name;
    } else if (namespace === 'apeirix') {
      // Apeirix item - lookup in lang YAML files
      // Try all categories in order
      const categories = ['materials', 'tools', 'armor', 'foods', 'special', 'blocks'];
      for (const category of categories) {
        const langKey = `${category}.${id}`;
        const name = langLoader.get(langKey, configDir, undefined);
        // Check if we got a real translation (not just the key back)
        if (name && name !== langKey && name !== id) return name;
      }
    }
    
    // Fallback: return ID without namespace
    return id;
  }
  
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
    
    // Build sets of IDs that are in tools/armor/foods/special for fast lookup
    const toolIds = new Set((config.tools || []).map((e: any) => e.id));
    const armorIds = new Set((config.armor || []).map((e: any) => e.id));
    const foodIds = new Set((config.foods || []).map((e: any) => e.id));
    
    // Special items are those with group: itemGroup.name.book or maxStackSize: 1 and specific names
    const specialIds = new Set<string>();
    if (config.items) {
      for (const entity of config.items) {
        // Identify special items by their characteristics
        if (entity.group === 'itemGroup.name.book' || 
            (entity.maxStackSize === 1 && (entity.id.includes('book') || entity.id.includes('achievement')))) {
          specialIds.add(entity.id);
        }
      }
    }
    
    // Process each category
    if (config.items) {
      for (const entity of config.items) {
        // Skip if entity is in tools/armor/foods arrays
        if (toolIds.has(entity.id) || armorIds.has(entity.id) || foodIds.has(entity.id)) {
          continue;
        }
        
        // Check if it's a special item
        const category = specialIds.has(entity.id) ? 'special' : 'materials';
        addItem(this.createWikiItem(entity, category, configDir));
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
    
    // Process blocks
    if (config.blocks) {
      for (const entity of config.blocks) {
        addItem(this.createWikiItem(entity, 'blocks', configDir));
      }
    }
    
    // Process machines (they are also blocks but with processing recipes)
    if (config.machines) {
      for (const entity of config.machines) {
        addItem(this.createWikiItem(entity, 'blocks', configDir));
      }
    }
    
    // Process ores
    if (config.ores) {
      for (const entity of config.ores) {
        addItem(this.createWikiItem(entity, 'ores', configDir));
        
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
          addItem(this.createWikiItem(deepslateEntity, 'ores', configDir));
        }
      }
    }
    
    // Process entities (mobs)
    if (config.entities) {
      for (const entity of config.entities) {
        addItem(this.createWikiItem(entity, 'entities', configDir));
      }
    }
    
    // Log summary (silent - only show count)
    Logger.log(`✅ Generated ${items.length} wiki items`);
    
    return items;
  }
  
  /**
   * Create wiki item from any entity type
   */
  private static createWikiItem(
    entity: any,
    category: 'materials' | 'tools' | 'armor' | 'foods' | 'special' | 'blocks' | 'ores' | 'entities',
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
    
    // Silent - don't warn about missing data (optional fields)
    
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
    // Map wiki category to lang category (blocks/ores/entities use materials lang files)
    const langCategory = this.getLangCategory(category);
    const langKey = `${langCategory}.${entity.id}`;
    return langLoader.get(langKey, configDir, entity.id);
  }
  
  /**
   * Map wiki category to lang file category
   * blocks, ores, entities all use materials lang files
   */
  private static getLangCategory(category: string): string {
    switch (category) {
      case 'blocks':
      case 'ores':
      case 'entities':
        return 'materials';
      default:
        return category;
    }
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
    
    // Common: Crafting recipe info (detailed) - SHOW ALL RECIPES
    if (entity.recipes && entity.recipes.length > 0) {
      let recipeIndex = 1;
      
      for (const recipe of entity.recipes) {
        if (recipe.type === 'shaped') {
          // Shaped crafting recipe - store as structured data
          const pattern = recipe.pattern || [];
          info[`recipe_${recipeIndex}_type`] = 'shaped';
          info[`recipe_${recipeIndex}_label`] = 'Bàn chế tạo (có hình)';
          
          if (pattern.length > 0) {
            // Store pattern as array joined with | separator
            const gridLines = pattern.map((line: string) => 
              line.split('').map(char => `[${char}]`).join('')
            );
            info[`recipe_${recipeIndex}_pattern`] = gridLines.join('|');
          }
          
          if (recipe.ingredients) {
            const ingredientPairs: string[] = [];
            for (const [key, value] of Object.entries(recipe.ingredients)) {
              const itemName = this.resolveItemName(value as string, configDir);
              ingredientPairs.push(`${key}=${itemName}`);
            }
            info[`recipe_${recipeIndex}_ingredients`] = ingredientPairs.join(', ');
          }
          
          if (recipe.count && recipe.count > 1) {
            info[`recipe_${recipeIndex}_result`] = `${recipe.count}x`;
          }
          recipeIndex++;
        } else if (recipe.type === 'shapeless') {
          // Shapeless crafting recipe
          info[`recipe_${recipeIndex}_type`] = 'shapeless';
          info[`recipe_${recipeIndex}_label`] = 'Bàn chế tạo (tự do)';
          
          if (recipe.ingredients) {
            const items = Object.values(recipe.ingredients).map((v: any) => 
              this.resolveItemName(v, configDir)
            );
            info[`recipe_${recipeIndex}_ingredients`] = items.join(', ');
          }
          
          if (recipe.count && recipe.count > 1) {
            info[`recipe_${recipeIndex}_result`] = `${recipe.count}x`;
          }
          recipeIndex++;
        } else if (recipe.type === 'smelting') {
          // Smelting recipe (furnace)
          const inputName = this.resolveItemName(recipe.input, configDir);
          const outputName = this.resolveItemName(recipe.output, configDir);
          const count = recipe.count || 1;
          info[`recipe_${recipeIndex}_type`] = 'smelting';
          info[`recipe_${recipeIndex}_text`] = `Lò nung: ${inputName} → ${count}x ${outputName}`;
          recipeIndex++;
        } else if (recipe.type === 'blasting') {
          // Blasting recipe (blast furnace)
          const inputName = this.resolveItemName(recipe.input, configDir);
          const outputName = this.resolveItemName(recipe.output, configDir);
          const count = recipe.count || 1;
          info[`recipe_${recipeIndex}_type`] = 'blasting';
          info[`recipe_${recipeIndex}_text`] = `Lò cao: ${inputName} → ${count}x ${outputName}`;
          recipeIndex++;
        }
      }
      
      // Store total recipe count
      if (recipeIndex > 1) {
        info['recipe_count'] = recipeIndex - 1;
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
    
    // Blocks/Machines: processing recipes, destroy time, tool tier
    if (category === 'blocks') {
      // Add basic block info
      if (entity.destroyTime) info['Độ cứng'] = entity.destroyTime;
      if (entity.toolTier) {
        const tierNames: Record<string, string> = {
          wooden: 'Gỗ',
          stone: 'Đá',
          iron: 'Sắt',
          diamond: 'Kim cương',
          netherite: 'Netherite',
          gold: 'Vàng'
        };
        info['Công cụ yêu cầu'] = tierNames[entity.toolTier] || entity.toolTier;
      }
      
      // Add fuel info for machines that use fuel
      if (entity.fuel) {
        const fuelName = this.resolveItemName(entity.fuel.blockId, configDir);
        info['Nhiên liệu'] = `${fuelName} (${entity.fuel.usesPerBlock} lần)`;
      }
      
      // Add ALL processing recipes for machines
      if (entity.processingRecipes && entity.processingRecipes.length > 0) {
        info['processing_recipe_count'] = entity.processingRecipes.length;
        
        // Show ALL recipes (no limit)
        entity.processingRecipes.forEach((recipe: any, index: number) => {
          const inputName = this.resolveItemName(recipe.input, configDir);
          
          // Different recipe types have different output formats
          if (recipe.output) {
            // Type 1: Simple input → output (crusher, compressor)
            const outputName = this.resolveItemName(recipe.output, configDir);
            const count = recipe.outputCount || 1;
            const time = recipe.processingTime ? ` (${recipe.processingTime / 20}s)` : '';
            info[`processing_${index + 1}`] = `${inputName} → ${count}x ${outputName}${time}`;
          } else if (recipe.pureDust && recipe.stoneDust) {
            // Type 2: Ore washer (input → pureDust + stoneDust)
            const pureD = this.resolveItemName(recipe.pureDust, configDir);
            const stoneD = this.resolveItemName(recipe.stoneDust, configDir);
            info[`processing_${index + 1}`] = `${inputName} → ${pureD} + ${stoneD}`;
          } else if (recipe.stoneDust) {
            // Type 3: Ore crusher (input → stoneDust + oreDust)
            const stoneD = this.resolveItemName(recipe.stoneDust, configDir);
            const stoneCount = recipe.stoneDustCount || 1;
            if (recipe.oreDust) {
              const oreD = this.resolveItemName(recipe.oreDust, configDir);
              const oreCount = recipe.oreDustCount || 1;
              info[`processing_${index + 1}`] = `${inputName} → ${stoneCount}x ${stoneD} + ${oreCount}x ${oreD}`;
            } else {
              info[`processing_${index + 1}`] = `${inputName} → ${stoneCount}x ${stoneD}`;
            }
          }
        });
      }
    }
    
    return info;
  }
}
