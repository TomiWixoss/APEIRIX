import { WikiItemData } from '../../generators/GameDataGenerator.js';
import { Logger } from '../../utils/Logger.js';
import { langLoader } from '../../core/loaders/LangLoader.js';

/**
 * Generate Wiki Data from entity configs
 * 
 * FULLY AUTOMATIC:
 * - Info (name, properties) auto-generated from entity YAML configs
 * - Description from wikiDescription field in entity YAML
 * - Icon extracted from entity texture path
 * - NO separate wiki YAML files needed
 */
export class WikiDataBPGenerator {
  static async generate(
    config: any, 
    configDir: string, 
    buildDir: string,
    language: string = 'vi_VN'
  ): Promise<WikiItemData[]> {
    const wikiItems: WikiItemData[] = [];
    
    // Set language for lang resolution
    langLoader.setLanguage(language);
    
    // Process materials (items)
    if (config.items) {
      for (const item of config.items) {
        const wikiItem = this.createWikiItemFromMaterial(item, configDir);
        if (wikiItem) wikiItems.push(wikiItem);
      }
    }
    
    // Process tools
    if (config.tools) {
      for (const tool of config.tools) {
        const wikiItem = this.createWikiItemFromTool(tool, configDir);
        if (wikiItem) wikiItems.push(wikiItem);
      }
    }
    
    // Process armor
    if (config.armor) {
      for (const armor of config.armor) {
        const wikiItem = this.createWikiItemFromArmor(armor, configDir);
        if (wikiItem) wikiItems.push(wikiItem);
      }
    }
    
    // Process foods
    if (config.foods) {
      for (const food of config.foods) {
        const wikiItem = this.createWikiItemFromFood(food, configDir);
        if (wikiItem) wikiItems.push(wikiItem);
      }
    }
    
    Logger.log(`✅ Generated ${wikiItems.length} wiki items from entity configs (fully automatic)`);
    return wikiItems;
  }
  
  /**
   * Create wiki item from material (item) config
   */
  private static createWikiItemFromMaterial(
    item: any, 
    configDir: string
  ): WikiItemData | null {
    const itemId = item.id;
    const fullId = `apeirix:${itemId}`;
    
    // Resolve name from lang
    const langKey = item.name?.replace('lang:', '') || `materials.${itemId}`;
    const name = langLoader.get(langKey, configDir, itemId);
    
    // Get description from entity config (wikiDescription field)
    const description = item.wikiDescription;
    
    // Extract icon from texture path
    const icon = this.extractIconPath(item.texture);
    
    // Build info from entity properties
    const info: Record<string, string | number | boolean> = {};
    
    // Add recipe info if available
    if (item.recipes && item.recipes.length > 0) {
      const recipe = item.recipes[0]; // Use first recipe
      if (recipe.type === 'shaped' || recipe.type === 'shapeless') {
        info['Chế tạo'] = this.formatRecipeInfo(recipe);
      }
    }
    
    return {
      id: fullId,
      category: 'materials',
      name,
      description,
      icon,
      info: Object.keys(info).length > 0 ? info : undefined
    };
  }
  
  /**
   * Create wiki item from tool config
   */
  private static createWikiItemFromTool(
    tool: any,
    configDir: string
  ): WikiItemData | null {
    const toolId = tool.id;
    const fullId = `apeirix:${toolId}`;
    
    // Resolve name from lang
    const langKey = tool.name?.replace('lang:', '') || `tools.${toolId}`;
    const name = langLoader.get(langKey, configDir, toolId);
    
    // Get description from entity config (wikiDescription field)
    const description = tool.wikiDescription;
    
    // Extract icon from texture path
    const icon = this.extractIconPath(tool.texture);
    
    // Build info from tool properties
    const info: Record<string, string | number | boolean> = {};
    
    if (tool.durability) {
      info['Độ bền'] = tool.durability;
    }
    
    if (tool.enchantability) {
      info['Độ phù phép'] = tool.enchantability;
    }
    
    if (tool.damage) {
      info['Sát thương'] = tool.damage;
    }
    
    if (tool.tier) {
      info['Cấp độ'] = tool.tier;
    }
    
    return {
      id: fullId,
      category: 'tools',
      name,
      description,
      icon,
      info: Object.keys(info).length > 0 ? info : undefined
    };
  }
  
  /**
   * Create wiki item from armor config
   */
  private static createWikiItemFromArmor(
    armor: any,
    configDir: string
  ): WikiItemData | null {
    const armorId = armor.id;
    const fullId = `apeirix:${armorId}`;
    
    // Resolve name from lang
    const langKey = armor.name?.replace('lang:', '') || `armor.${armorId}`;
    const name = langLoader.get(langKey, configDir, armorId);
    
    // Get description from entity config (wikiDescription field)
    const description = armor.wikiDescription;
    
    // Extract icon from texture path
    const icon = this.extractIconPath(armor.texture);
    
    // Build info from armor properties
    const info: Record<string, string | number | boolean> = {};
    
    if (armor.durability) {
      info['Độ bền'] = armor.durability;
    }
    
    if (armor.protection) {
      info['Giáp'] = armor.protection;
    }
    
    if (armor.enchantability) {
      info['Độ phù phép'] = armor.enchantability;
    }
    
    if (armor.type) {
      const typeNames: Record<string, string> = {
        helmet: 'Mũ',
        chestplate: 'Áo giáp',
        leggings: 'Quần',
        boots: 'Giày'
      };
      info['Loại'] = typeNames[armor.type] || armor.type;
    }
    
    return {
      id: fullId,
      category: 'armor',
      name,
      description,
      icon,
      info: Object.keys(info).length > 0 ? info : undefined
    };
  }
  
  /**
   * Create wiki item from food config
   */
  private static createWikiItemFromFood(
    food: any,
    configDir: string
  ): WikiItemData | null {
    const foodId = food.id;
    const fullId = `apeirix:${foodId}`;
    
    // Resolve name from lang
    const langKey = food.name?.replace('lang:', '') || `foods.${foodId}`;
    const name = langLoader.get(langKey, configDir, foodId);
    
    // Get description from entity config (wikiDescription field)
    const description = food.wikiDescription;
    
    // Extract icon from texture path
    const icon = this.extractIconPath(food.texture);
    
    // Build info from food properties
    const info: Record<string, string | number | boolean> = {};
    
    if (food.nutrition) {
      info['Dinh dưỡng'] = food.nutrition;
    }
    
    if (food.saturation) {
      info['Độ no'] = food.saturation;
    }
    
    if (food.effects && food.effects.length > 0) {
      const effectNames = food.effects.map((e: any) => {
        // Get effect name from lang file (effects.{effect_name})
        const effectLangKey = `effects.${e.name}`;
        return langLoader.get(effectLangKey, configDir, e.name);
      });
      info['Hiệu ứng'] = effectNames.join(', ');
    }
    
    return {
      id: fullId,
      category: 'foods',
      name,
      description,
      icon,
      info: Object.keys(info).length > 0 ? info : undefined
    };
  }
  
  /**
   * Extract icon path from texture path
   * Example: "../../../assets/items/bronze_ingot.png" -> "textures/items/bronze_ingot"
   */
  private static extractIconPath(texturePath: string | undefined): string | undefined {
    if (!texturePath) return undefined;
    
    // Remove file extension
    const withoutExt = texturePath.replace(/\.(png|jpg)$/i, '');
    
    // Extract path after "assets/"
    const match = withoutExt.match(/assets\/(.+)$/);
    if (match) {
      return `textures/${match[1]}`;
    }
    
    return undefined;
  }
  
  /**
   * Format recipe info for display
   */
  private static formatRecipeInfo(recipe: any): string {
    if (!recipe.ingredients) return 'Có công thức chế tạo';
    
    // Simple format for now
    const ingredientCount = Object.keys(recipe.ingredients).length;
    return `${ingredientCount} nguyên liệu`;
  }
}
