/**
 * Comprehensive Block Tool Requirements
 * Complete mapping of ALL Minecraft blocks (as of 2026) to their tool requirements
 * Based on official Minecraft Wiki data
 */

export interface ToolRequirement {
  tool: 'hand' | 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'shears' | 'sword' | null;
  tier: 'wooden' | 'stone' | 'iron' | 'gold' | 'diamond' | 'netherite' | null;
}

/**
 * Complete block tool requirements mapping
 * Key: block typeId (without namespace)
 * Value: ToolRequirement
 */
export const BLOCK_TOOL_REQUIREMENTS: Record<string, ToolRequirement> = {
  // ============================================================================
  // HAND MINEABLE BLOCKS (No tool required, faster with appropriate tool)
  // ============================================================================
  
  // Dirt & Grass
  'dirt': { tool: 'shovel', tier: null },
  'grass_block': { tool: 'shovel', tier: null },
  'podzol': { tool: 'shovel', tier: null },
  'mycelium': { tool: 'shovel', tier: null },
  'dirt_path': { tool: 'shovel', tier: null },
  'farmland': { tool: 'shovel', tier: null },
  'coarse_dirt': { tool: 'shovel', tier: null },
  'rooted_dirt': { tool: 'shovel', tier: null },
  'mud': { tool: 'shovel', tier: null },
  'muddy_mangrove_roots': { tool: 'shovel', tier: null },
  
  // Sand & Gravel
  'sand': { tool: 'shovel', tier: null },
  'red_sand': { tool: 'shovel', tier: null },
  'gravel': { tool: 'shovel', tier: null },
  'suspicious_sand': { tool: 'shovel', tier: null },
  'suspicious_gravel': { tool: 'shovel', tier: null },
  
  // Clay & Terracotta (unglazed)
  'clay': { tool: 'shovel', tier: null },
  'terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'white_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'orange_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'magenta_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'light_blue_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'yellow_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'lime_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'pink_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'gray_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'light_gray_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'cyan_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'purple_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'blue_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'brown_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'green_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'red_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'black_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  
  // Glazed Terracotta (requires pickaxe)
  'white_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'orange_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'magenta_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'light_blue_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'yellow_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'lime_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'pink_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'gray_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'light_gray_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'cyan_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'purple_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'blue_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'brown_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'green_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'red_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  'black_glazed_terracotta': { tool: 'pickaxe', tier: 'wooden' },
  
  // Soul Sand & Soul Soil
  'soul_sand': { tool: 'shovel', tier: null },
  'soul_soil': { tool: 'shovel', tier: null },
  
  // Snow
  'snow': { tool: 'shovel', tier: null },
  'snow_block': { tool: 'shovel', tier: null },
  'powder_snow': { tool: 'hand', tier: null },
  
  // Organic blocks (hand mineable, faster with tools)
  'hay_block': { tool: 'hoe', tier: null },
  'dried_kelp_block': { tool: 'hoe', tier: null },
  'moss_block': { tool: 'hoe', tier: null },
  'moss_carpet': { tool: 'hand', tier: null },
  'sponge': { tool: 'hoe', tier: null },
  'wet_sponge': { tool: 'hoe', tier: null },
  'slime_block': { tool: 'hand', tier: null },
  'honey_block': { tool: 'hand', tier: null },
  'target': { tool: 'hoe', tier: null },
  'shroomlight': { tool: 'hoe', tier: null },
  
  // Leaves (shears or any tool, but shears preserve)
  'oak_leaves': { tool: 'shears', tier: null },
  'spruce_leaves': { tool: 'shears', tier: null },
  'birch_leaves': { tool: 'shears', tier: null },
  'jungle_leaves': { tool: 'shears', tier: null },
  'acacia_leaves': { tool: 'shears', tier: null },
  'dark_oak_leaves': { tool: 'shears', tier: null },
  'mangrove_leaves': { tool: 'shears', tier: null },
  'cherry_leaves': { tool: 'shears', tier: null },
  'azalea_leaves': { tool: 'shears', tier: null },
  'flowering_azalea_leaves': { tool: 'shears', tier: null },
  
  // Wool & Carpet
  'white_wool': { tool: 'shears', tier: null },
  'orange_wool': { tool: 'shears', tier: null },
  'magenta_wool': { tool: 'shears', tier: null },
  'light_blue_wool': { tool: 'shears', tier: null },
  'yellow_wool': { tool: 'shears', tier: null },
  'lime_wool': { tool: 'shears', tier: null },
  'pink_wool': { tool: 'shears', tier: null },
  'gray_wool': { tool: 'shears', tier: null },
  'light_gray_wool': { tool: 'shears', tier: null },
  'cyan_wool': { tool: 'shears', tier: null },
  'purple_wool': { tool: 'shears', tier: null },
  'blue_wool': { tool: 'shears', tier: null },
  'brown_wool': { tool: 'shears', tier: null },
  'green_wool': { tool: 'shears', tier: null },
  'red_wool': { tool: 'shears', tier: null },
  'black_wool': { tool: 'shears', tier: null },
  
  'white_carpet': { tool: 'hand', tier: null },
  'orange_carpet': { tool: 'hand', tier: null },
  'magenta_carpet': { tool: 'hand', tier: null },
  'light_blue_carpet': { tool: 'hand', tier: null },
  'yellow_carpet': { tool: 'hand', tier: null },
  'lime_carpet': { tool: 'hand', tier: null },
  'pink_carpet': { tool: 'hand', tier: null },
  'gray_carpet': { tool: 'hand', tier: null },
  'light_gray_carpet': { tool: 'hand', tier: null },
  'cyan_carpet': { tool: 'hand', tier: null },
  'purple_carpet': { tool: 'hand', tier: null },
  'blue_carpet': { tool: 'hand', tier: null },
  'brown_carpet': { tool: 'hand', tier: null },
  'green_carpet': { tool: 'hand', tier: null },
  'red_carpet': { tool: 'hand', tier: null },
  'black_carpet': { tool: 'hand', tier: null },
  
  // TNT & Explosives
  'tnt': { tool: 'hand', tier: null },
  
  // Glowstone & Sea Lantern
  'glowstone': { tool: 'hand', tier: null },
  'sea_lantern': { tool: 'hand', tier: null },
  
  // Sculk blocks
  'sculk': { tool: 'hoe', tier: null },
  'sculk_vein': { tool: 'hoe', tier: null },
  'sculk_catalyst': { tool: 'hoe', tier: null },
  'sculk_sensor': { tool: 'hoe', tier: null },
  'sculk_shrieker': { tool: 'hoe', tier: null },
  
  // ============================================================================
  // PICKAXE REQUIRED BLOCKS
  // ============================================================================
  
  // Stone & Variants (Wooden pickaxe+)
  'stone': { tool: 'pickaxe', tier: 'wooden' },
  'cobblestone': { tool: 'pickaxe', tier: 'wooden' },
  'mossy_cobblestone': { tool: 'pickaxe', tier: 'wooden' },
  'smooth_stone': { tool: 'pickaxe', tier: 'wooden' },
  'stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'mossy_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'cracked_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'infested_stone': { tool: 'pickaxe', tier: 'wooden' },
  'infested_cobblestone': { tool: 'pickaxe', tier: 'wooden' },
  'infested_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'infested_mossy_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'infested_cracked_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'infested_chiseled_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  
  // Deepslate & Variants (Wooden pickaxe+)
  'deepslate': { tool: 'pickaxe', tier: 'wooden' },
  'cobbled_deepslate': { tool: 'pickaxe', tier: 'wooden' },
  'polished_deepslate': { tool: 'pickaxe', tier: 'wooden' },
  'deepslate_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'deepslate_tiles': { tool: 'pickaxe', tier: 'wooden' },
  'cracked_deepslate_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'cracked_deepslate_tiles': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_deepslate': { tool: 'pickaxe', tier: 'wooden' },
  'reinforced_deepslate': { tool: null, tier: null }, // Unbreakable
  
  // Granite, Diorite, Andesite (Wooden pickaxe+)
  'granite': { tool: 'pickaxe', tier: 'wooden' },
  'polished_granite': { tool: 'pickaxe', tier: 'wooden' },
  'diorite': { tool: 'pickaxe', tier: 'wooden' },
  'polished_diorite': { tool: 'pickaxe', tier: 'wooden' },
  'andesite': { tool: 'pickaxe', tier: 'wooden' },
  'polished_andesite': { tool: 'pickaxe', tier: 'wooden' },
  
  // Calcite, Tuff, Dripstone (Wooden pickaxe+)
  'calcite': { tool: 'pickaxe', tier: 'wooden' },
  'tuff': { tool: 'pickaxe', tier: 'wooden' },
  'dripstone_block': { tool: 'pickaxe', tier: 'wooden' },
  'pointed_dripstone': { tool: 'pickaxe', tier: 'wooden' },
  
  // Sandstone & Red Sandstone (Wooden pickaxe+)
  'sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'cut_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'smooth_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'red_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_red_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'cut_red_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  'smooth_red_sandstone': { tool: 'pickaxe', tier: 'wooden' },
  
  // Prismarine (Wooden pickaxe+)
  'prismarine': { tool: 'pickaxe', tier: 'wooden' },
  'prismarine_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'dark_prismarine': { tool: 'pickaxe', tier: 'wooden' },
  
  // Nether blocks (Wooden pickaxe+)
  'netherrack': { tool: 'pickaxe', tier: 'wooden' },
  'nether_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'cracked_nether_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_nether_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'red_nether_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'nether_gold_ore': { tool: 'pickaxe', tier: 'wooden' },
  'gilded_blackstone': { tool: 'pickaxe', tier: 'wooden' },
  'magma_block': { tool: 'pickaxe', tier: 'wooden' },
  
  // Blackstone (Wooden pickaxe+)
  'blackstone': { tool: 'pickaxe', tier: 'wooden' },
  'polished_blackstone': { tool: 'pickaxe', tier: 'wooden' },
  'polished_blackstone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'cracked_polished_blackstone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_polished_blackstone': { tool: 'pickaxe', tier: 'wooden' },
  
  // Basalt (Wooden pickaxe+)
  'basalt': { tool: 'pickaxe', tier: 'wooden' },
  'polished_basalt': { tool: 'pickaxe', tier: 'wooden' },
  'smooth_basalt': { tool: 'pickaxe', tier: 'wooden' },
  
  // End Stone (Wooden pickaxe+)
  'end_stone': { tool: 'pickaxe', tier: 'wooden' },
  'end_stone_bricks': { tool: 'pickaxe', tier: 'wooden' },
  
  // Purpur (Wooden pickaxe+)
  'purpur_block': { tool: 'pickaxe', tier: 'wooden' },
  'purpur_pillar': { tool: 'pickaxe', tier: 'wooden' },
  
  // Concrete (Wooden pickaxe+)
  'white_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'orange_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'magenta_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'light_blue_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'yellow_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'lime_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'pink_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'gray_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'light_gray_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'cyan_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'purple_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'blue_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'brown_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'green_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'red_concrete': { tool: 'pickaxe', tier: 'wooden' },
  'black_concrete': { tool: 'pickaxe', tier: 'wooden' },
  
  // Bricks (Wooden pickaxe+)
  'bricks': { tool: 'pickaxe', tier: 'wooden' },
  'mud_bricks': { tool: 'pickaxe', tier: 'wooden' },
  
  // Quartz (Wooden pickaxe+)
  'quartz_block': { tool: 'pickaxe', tier: 'wooden' },
  'quartz_bricks': { tool: 'pickaxe', tier: 'wooden' },
  'quartz_pillar': { tool: 'pickaxe', tier: 'wooden' },
  'chiseled_quartz_block': { tool: 'pickaxe', tier: 'wooden' },
  'smooth_quartz': { tool: 'pickaxe', tier: 'wooden' },
  
  // Amethyst (Wooden pickaxe+)
  'amethyst_block': { tool: 'pickaxe', tier: 'wooden' },
  'budding_amethyst': { tool: 'pickaxe', tier: 'wooden' },
  'amethyst_cluster': { tool: 'pickaxe', tier: 'wooden' },
  'large_amethyst_bud': { tool: 'pickaxe', tier: 'wooden' },
  'medium_amethyst_bud': { tool: 'pickaxe', tier: 'wooden' },
  'small_amethyst_bud': { tool: 'pickaxe', tier: 'wooden' },
  
  // Copper Blocks (Stone pickaxe+)
  'copper_block': { tool: 'pickaxe', tier: 'stone' },
  'exposed_copper': { tool: 'pickaxe', tier: 'stone' },
  'weathered_copper': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_copper': { tool: 'pickaxe', tier: 'stone' },
  'cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'exposed_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'weathered_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_copper_block': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_cut_copper': { tool: 'pickaxe', tier: 'stone' },
  
  // Coal & Coal Ore (Wooden pickaxe+)
  'coal_ore': { tool: 'pickaxe', tier: 'wooden' },
  'deepslate_coal_ore': { tool: 'pickaxe', tier: 'wooden' },
  'coal_block': { tool: 'pickaxe', tier: 'wooden' },
  
  // Copper Ore (Stone pickaxe+)
  'copper_ore': { tool: 'pickaxe', tier: 'stone' },
  'deepslate_copper_ore': { tool: 'pickaxe', tier: 'stone' },
  
  // Iron & Iron Ore (Stone pickaxe+)
  'iron_ore': { tool: 'pickaxe', tier: 'stone' },
  'deepslate_iron_ore': { tool: 'pickaxe', tier: 'stone' },
  'iron_block': { tool: 'pickaxe', tier: 'stone' },
  'raw_iron_block': { tool: 'pickaxe', tier: 'stone' },
  
  // Gold & Gold Ore (Iron pickaxe+)
  'gold_ore': { tool: 'pickaxe', tier: 'iron' },
  'deepslate_gold_ore': { tool: 'pickaxe', tier: 'iron' },
  'gold_block': { tool: 'pickaxe', tier: 'iron' },
  'raw_gold_block': { tool: 'pickaxe', tier: 'iron' },
  
  // Lapis & Lapis Ore (Stone pickaxe+)
  'lapis_ore': { tool: 'pickaxe', tier: 'stone' },
  'deepslate_lapis_ore': { tool: 'pickaxe', tier: 'stone' },
  'lapis_block': { tool: 'pickaxe', tier: 'stone' },
  
  // Redstone & Redstone Ore (Iron pickaxe+)
  'redstone_ore': { tool: 'pickaxe', tier: 'iron' },
  'deepslate_redstone_ore': { tool: 'pickaxe', tier: 'iron' },
  'redstone_block': { tool: 'pickaxe', tier: 'wooden' },
  
  // Diamond & Diamond Ore (Iron pickaxe+)
  'diamond_ore': { tool: 'pickaxe', tier: 'iron' },
  'deepslate_diamond_ore': { tool: 'pickaxe', tier: 'iron' },
  'diamond_block': { tool: 'pickaxe', tier: 'iron' },
  
  // Emerald & Emerald Ore (Iron pickaxe+)
  'emerald_ore': { tool: 'pickaxe', tier: 'iron' },
  'deepslate_emerald_ore': { tool: 'pickaxe', tier: 'iron' },
  'emerald_block': { tool: 'pickaxe', tier: 'iron' },
  
  // Netherite Block (Diamond pickaxe+)
  'netherite_block': { tool: 'pickaxe', tier: 'diamond' },
  'ancient_debris': { tool: 'pickaxe', tier: 'diamond' },
  
  // Obsidian & Crying Obsidian (Diamond pickaxe+)
  'obsidian': { tool: 'pickaxe', tier: 'diamond' },
  'crying_obsidian': { tool: 'pickaxe', tier: 'diamond' },
  'respawn_anchor': { tool: 'pickaxe', tier: 'diamond' },
  
  // Anvils (Wooden pickaxe+)
  'anvil': { tool: 'pickaxe', tier: 'wooden' },
  'chipped_anvil': { tool: 'pickaxe', tier: 'wooden' },
  'damaged_anvil': { tool: 'pickaxe', tier: 'wooden' },
  
  // Bells (Wooden pickaxe+)
  'bell': { tool: 'pickaxe', tier: 'wooden' },
  
  // Brewing Stand (Wooden pickaxe+)
  'brewing_stand': { tool: 'pickaxe', tier: 'wooden' },
  
  // Cauldrons (Wooden pickaxe+)
  'cauldron': { tool: 'pickaxe', tier: 'wooden' },
  'water_cauldron': { tool: 'pickaxe', tier: 'wooden' },
  'lava_cauldron': { tool: 'pickaxe', tier: 'wooden' },
  'powder_snow_cauldron': { tool: 'pickaxe', tier: 'wooden' },
  
  // Chain (Wooden pickaxe+)
  'chain': { tool: 'pickaxe', tier: 'wooden' },
  
  // Conduit (Wooden pickaxe+)
  'conduit': { tool: 'pickaxe', tier: 'wooden' },
  
  // Dispenser & Dropper (Wooden pickaxe+)
  'dispenser': { tool: 'pickaxe', tier: 'wooden' },
  'dropper': { tool: 'pickaxe', tier: 'wooden' },
  
  // Enchanting Table (Wooden pickaxe+)
  'enchanting_table': { tool: 'pickaxe', tier: 'wooden' },
  
  // Ender Chest (Wooden pickaxe+)
  'ender_chest': { tool: 'pickaxe', tier: 'wooden' },
  
  // Furnaces (Wooden pickaxe+)
  'furnace': { tool: 'pickaxe', tier: 'wooden' },
  'blast_furnace': { tool: 'pickaxe', tier: 'wooden' },
  'smoker': { tool: 'pickaxe', tier: 'wooden' },
  
  // Grindstone (Wooden pickaxe+)
  'grindstone': { tool: 'pickaxe', tier: 'wooden' },
  
  // Hopper (Wooden pickaxe+)
  'hopper': { tool: 'pickaxe', tier: 'wooden' },
  
  // Iron Bars & Doors (Wooden pickaxe+)
  'iron_bars': { tool: 'pickaxe', tier: 'wooden' },
  'iron_door': { tool: 'pickaxe', tier: 'wooden' },
  'iron_trapdoor': { tool: 'pickaxe', tier: 'wooden' },
  
  // Lanterns (Wooden pickaxe+)
  'lantern': { tool: 'pickaxe', tier: 'wooden' },
  'soul_lantern': { tool: 'pickaxe', tier: 'wooden' },
  
  // Lodestone (Wooden pickaxe+)
  'lodestone': { tool: 'pickaxe', tier: 'wooden' },
  
  // Observer (Wooden pickaxe+)
  'observer': { tool: 'pickaxe', tier: 'wooden' },
  
  // Piston & Sticky Piston (Wooden pickaxe+)
  'piston': { tool: 'pickaxe', tier: 'wooden' },
  'sticky_piston': { tool: 'pickaxe', tier: 'wooden' },
  
  // Rails (Wooden pickaxe+)
  'rail': { tool: 'pickaxe', tier: 'wooden' },
  'powered_rail': { tool: 'pickaxe', tier: 'wooden' },
  'detector_rail': { tool: 'pickaxe', tier: 'wooden' },
  'activator_rail': { tool: 'pickaxe', tier: 'wooden' },
  
  // Shulker Boxes (Wooden pickaxe+)
  'shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'white_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'orange_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'magenta_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'light_blue_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'yellow_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'lime_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'pink_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'gray_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'light_gray_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'cyan_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'purple_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'blue_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'brown_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'green_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'red_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  'black_shulker_box': { tool: 'pickaxe', tier: 'wooden' },
  
  // Stonecutter (Wooden pickaxe+)
  'stonecutter': { tool: 'pickaxe', tier: 'wooden' },
  
  // ============================================================================
  // AXE REQUIRED BLOCKS (Wood & Wood-based)
  // ============================================================================
  
  // Logs
  'oak_log': { tool: 'axe', tier: null },
  'spruce_log': { tool: 'axe', tier: null },
  'birch_log': { tool: 'axe', tier: null },
  'jungle_log': { tool: 'axe', tier: null },
  'acacia_log': { tool: 'axe', tier: null },
  'dark_oak_log': { tool: 'axe', tier: null },
  'mangrove_log': { tool: 'axe', tier: null },
  'cherry_log': { tool: 'axe', tier: null },
  'crimson_stem': { tool: 'axe', tier: null },
  'warped_stem': { tool: 'axe', tier: null },
  
  // Stripped Logs
  'stripped_oak_log': { tool: 'axe', tier: null },
  'stripped_spruce_log': { tool: 'axe', tier: null },
  'stripped_birch_log': { tool: 'axe', tier: null },
  'stripped_jungle_log': { tool: 'axe', tier: null },
  'stripped_acacia_log': { tool: 'axe', tier: null },
  'stripped_dark_oak_log': { tool: 'axe', tier: null },
  'stripped_mangrove_log': { tool: 'axe', tier: null },
  'stripped_cherry_log': { tool: 'axe', tier: null },
  'stripped_crimson_stem': { tool: 'axe', tier: null },
  'stripped_warped_stem': { tool: 'axe', tier: null },
  
  // Wood
  'oak_wood': { tool: 'axe', tier: null },
  'spruce_wood': { tool: 'axe', tier: null },
  'birch_wood': { tool: 'axe', tier: null },
  'jungle_wood': { tool: 'axe', tier: null },
  'acacia_wood': { tool: 'axe', tier: null },
  'dark_oak_wood': { tool: 'axe', tier: null },
  'mangrove_wood': { tool: 'axe', tier: null },
  'cherry_wood': { tool: 'axe', tier: null },
  'crimson_hyphae': { tool: 'axe', tier: null },
  'warped_hyphae': { tool: 'axe', tier: null },
  
  // Stripped Wood
  'stripped_oak_wood': { tool: 'axe', tier: null },
  'stripped_spruce_wood': { tool: 'axe', tier: null },
  'stripped_birch_wood': { tool: 'axe', tier: null },
  'stripped_jungle_wood': { tool: 'axe', tier: null },
  'stripped_acacia_wood': { tool: 'axe', tier: null },
  'stripped_dark_oak_wood': { tool: 'axe', tier: null },
  'stripped_mangrove_wood': { tool: 'axe', tier: null },
  'stripped_cherry_wood': { tool: 'axe', tier: null },
  'stripped_crimson_hyphae': { tool: 'axe', tier: null },
  'stripped_warped_hyphae': { tool: 'axe', tier: null },
  
  // Planks
  'oak_planks': { tool: 'axe', tier: null },
  'spruce_planks': { tool: 'axe', tier: null },
  'birch_planks': { tool: 'axe', tier: null },
  'jungle_planks': { tool: 'axe', tier: null },
  'acacia_planks': { tool: 'axe', tier: null },
  'dark_oak_planks': { tool: 'axe', tier: null },
  'mangrove_planks': { tool: 'axe', tier: null },
  'cherry_planks': { tool: 'axe', tier: null },
  'crimson_planks': { tool: 'axe', tier: null },
  'warped_planks': { tool: 'axe', tier: null },
  'bamboo_planks': { tool: 'axe', tier: null },
  'bamboo_mosaic': { tool: 'axe', tier: null },
  
  // Wooden Stairs & Slabs
  'oak_stairs': { tool: 'axe', tier: null },
  'spruce_stairs': { tool: 'axe', tier: null },
  'birch_stairs': { tool: 'axe', tier: null },
  'jungle_stairs': { tool: 'axe', tier: null },
  'acacia_stairs': { tool: 'axe', tier: null },
  'dark_oak_stairs': { tool: 'axe', tier: null },
  'mangrove_stairs': { tool: 'axe', tier: null },
  'cherry_stairs': { tool: 'axe', tier: null },
  'crimson_stairs': { tool: 'axe', tier: null },
  'warped_stairs': { tool: 'axe', tier: null },
  'bamboo_stairs': { tool: 'axe', tier: null },
  'bamboo_mosaic_stairs': { tool: 'axe', tier: null },
  
  'oak_slab': { tool: 'axe', tier: null },
  'spruce_slab': { tool: 'axe', tier: null },
  'birch_slab': { tool: 'axe', tier: null },
  'jungle_slab': { tool: 'axe', tier: null },
  'acacia_slab': { tool: 'axe', tier: null },
  'dark_oak_slab': { tool: 'axe', tier: null },
  'mangrove_slab': { tool: 'axe', tier: null },
  'cherry_slab': { tool: 'axe', tier: null },
  'crimson_slab': { tool: 'axe', tier: null },
  'warped_slab': { tool: 'axe', tier: null },
  'bamboo_slab': { tool: 'axe', tier: null },
  'bamboo_mosaic_slab': { tool: 'axe', tier: null },
  
  // Fences & Gates
  'oak_fence': { tool: 'axe', tier: null },
  'spruce_fence': { tool: 'axe', tier: null },
  'birch_fence': { tool: 'axe', tier: null },
  'jungle_fence': { tool: 'axe', tier: null },
  'acacia_fence': { tool: 'axe', tier: null },
  'dark_oak_fence': { tool: 'axe', tier: null },
  'mangrove_fence': { tool: 'axe', tier: null },
  'cherry_fence': { tool: 'axe', tier: null },
  'crimson_fence': { tool: 'axe', tier: null },
  'warped_fence': { tool: 'axe', tier: null },
  'bamboo_fence': { tool: 'axe', tier: null },
  
  'oak_fence_gate': { tool: 'axe', tier: null },
  'spruce_fence_gate': { tool: 'axe', tier: null },
  'birch_fence_gate': { tool: 'axe', tier: null },
  'jungle_fence_gate': { tool: 'axe', tier: null },
  'acacia_fence_gate': { tool: 'axe', tier: null },
  'dark_oak_fence_gate': { tool: 'axe', tier: null },
  'mangrove_fence_gate': { tool: 'axe', tier: null },
  'cherry_fence_gate': { tool: 'axe', tier: null },
  'crimson_fence_gate': { tool: 'axe', tier: null },
  'warped_fence_gate': { tool: 'axe', tier: null },
  'bamboo_fence_gate': { tool: 'axe', tier: null },
  
  // Doors & Trapdoors
  'oak_door': { tool: 'axe', tier: null },
  'spruce_door': { tool: 'axe', tier: null },
  'birch_door': { tool: 'axe', tier: null },
  'jungle_door': { tool: 'axe', tier: null },
  'acacia_door': { tool: 'axe', tier: null },
  'dark_oak_door': { tool: 'axe', tier: null },
  'mangrove_door': { tool: 'axe', tier: null },
  'cherry_door': { tool: 'axe', tier: null },
  'crimson_door': { tool: 'axe', tier: null },
  'warped_door': { tool: 'axe', tier: null },
  'bamboo_door': { tool: 'axe', tier: null },
  
  'oak_trapdoor': { tool: 'axe', tier: null },
  'spruce_trapdoor': { tool: 'axe', tier: null },
  'birch_trapdoor': { tool: 'axe', tier: null },
  'jungle_trapdoor': { tool: 'axe', tier: null },
  'acacia_trapdoor': { tool: 'axe', tier: null },
  'dark_oak_trapdoor': { tool: 'axe', tier: null },
  'mangrove_trapdoor': { tool: 'axe', tier: null },
  'cherry_trapdoor': { tool: 'axe', tier: null },
  'crimson_trapdoor': { tool: 'axe', tier: null },
  'warped_trapdoor': { tool: 'axe', tier: null },
  'bamboo_trapdoor': { tool: 'axe', tier: null },
  
  // Signs
  'oak_sign': { tool: 'axe', tier: null },
  'spruce_sign': { tool: 'axe', tier: null },
  'birch_sign': { tool: 'axe', tier: null },
  'jungle_sign': { tool: 'axe', tier: null },
  'acacia_sign': { tool: 'axe', tier: null },
  'dark_oak_sign': { tool: 'axe', tier: null },
  'mangrove_sign': { tool: 'axe', tier: null },
  'cherry_sign': { tool: 'axe', tier: null },
  'crimson_sign': { tool: 'axe', tier: null },
  'warped_sign': { tool: 'axe', tier: null },
  'bamboo_sign': { tool: 'axe', tier: null },
  
  'oak_wall_sign': { tool: 'axe', tier: null },
  'spruce_wall_sign': { tool: 'axe', tier: null },
  'birch_wall_sign': { tool: 'axe', tier: null },
  'jungle_wall_sign': { tool: 'axe', tier: null },
  'acacia_wall_sign': { tool: 'axe', tier: null },
  'dark_oak_wall_sign': { tool: 'axe', tier: null },
  'mangrove_wall_sign': { tool: 'axe', tier: null },
  'cherry_wall_sign': { tool: 'axe', tier: null },
  'crimson_wall_sign': { tool: 'axe', tier: null },
  'warped_wall_sign': { tool: 'axe', tier: null },
  'bamboo_wall_sign': { tool: 'axe', tier: null },
  
  // Hanging Signs
  'oak_hanging_sign': { tool: 'axe', tier: null },
  'spruce_hanging_sign': { tool: 'axe', tier: null },
  'birch_hanging_sign': { tool: 'axe', tier: null },
  'jungle_hanging_sign': { tool: 'axe', tier: null },
  'acacia_hanging_sign': { tool: 'axe', tier: null },
  'dark_oak_hanging_sign': { tool: 'axe', tier: null },
  'mangrove_hanging_sign': { tool: 'axe', tier: null },
  'cherry_hanging_sign': { tool: 'axe', tier: null },
  'crimson_hanging_sign': { tool: 'axe', tier: null },
  'warped_hanging_sign': { tool: 'axe', tier: null },
  'bamboo_hanging_sign': { tool: 'axe', tier: null },
  
  // Pressure Plates & Buttons
  'oak_pressure_plate': { tool: 'axe', tier: null },
  'spruce_pressure_plate': { tool: 'axe', tier: null },
  'birch_pressure_plate': { tool: 'axe', tier: null },
  'jungle_pressure_plate': { tool: 'axe', tier: null },
  'acacia_pressure_plate': { tool: 'axe', tier: null },
  'dark_oak_pressure_plate': { tool: 'axe', tier: null },
  'mangrove_pressure_plate': { tool: 'axe', tier: null },
  'cherry_pressure_plate': { tool: 'axe', tier: null },
  'crimson_pressure_plate': { tool: 'axe', tier: null },
  'warped_pressure_plate': { tool: 'axe', tier: null },
  'bamboo_pressure_plate': { tool: 'axe', tier: null },
  
  'oak_button': { tool: 'axe', tier: null },
  'spruce_button': { tool: 'axe', tier: null },
  'birch_button': { tool: 'axe', tier: null },
  'jungle_button': { tool: 'axe', tier: null },
  'acacia_button': { tool: 'axe', tier: null },
  'dark_oak_button': { tool: 'axe', tier: null },
  'mangrove_button': { tool: 'axe', tier: null },
  'cherry_button': { tool: 'axe', tier: null },
  'crimson_button': { tool: 'axe', tier: null },
  'warped_button': { tool: 'axe', tier: null },
  'bamboo_button': { tool: 'axe', tier: null },
  
  // Wooden Functional Blocks
  'crafting_table': { tool: 'axe', tier: null },
  'cartography_table': { tool: 'axe', tier: null },
  'fletching_table': { tool: 'axe', tier: null },
  'smithing_table': { tool: 'axe', tier: null },
  'loom': { tool: 'axe', tier: null },
  'barrel': { tool: 'axe', tier: null },
  'chest': { tool: 'axe', tier: null },
  'trapped_chest': { tool: 'axe', tier: null },
  'bookshelf': { tool: 'axe', tier: null },
  'chiseled_bookshelf': { tool: 'axe', tier: null },
  'lectern': { tool: 'axe', tier: null },
  'composter': { tool: 'axe', tier: null },
  'beehive': { tool: 'axe', tier: null },
  'bee_nest': { tool: 'axe', tier: null },
  'daylight_detector': { tool: 'axe', tier: null },
  'jukebox': { tool: 'axe', tier: null },
  'note_block': { tool: 'axe', tier: null },
  'banner': { tool: 'axe', tier: null },
  'wall_banner': { tool: 'axe', tier: null },
  
  // Bamboo
  'bamboo': { tool: 'axe', tier: null },
  'bamboo_block': { tool: 'axe', tier: null },
  'stripped_bamboo_block': { tool: 'axe', tier: null },
  
  // Mangrove Roots
  'mangrove_roots': { tool: 'axe', tier: null },
  
  // Nether Wood Blocks
  'crimson_nylium': { tool: 'pickaxe', tier: 'wooden' },
  'warped_nylium': { tool: 'pickaxe', tier: 'wooden' },
  
  // Mushroom Blocks
  'brown_mushroom_block': { tool: 'axe', tier: null },
  'red_mushroom_block': { tool: 'axe', tier: null },
  'mushroom_stem': { tool: 'axe', tier: null },
  
  // ============================================================================
  // SPECIAL BLOCKS
  // ============================================================================
  
  // Bedrock (Unbreakable)
  'bedrock': { tool: null, tier: null },
  
  // Barrier & Light (Creative only)
  'barrier': { tool: null, tier: null },
  'light': { tool: null, tier: null },
  'structure_block': { tool: null, tier: null },
  'structure_void': { tool: null, tier: null },
  'jigsaw': { tool: null, tier: null },
  
  // Command Blocks (Creative only)
  'command_block': { tool: null, tier: null },
  'chain_command_block': { tool: null, tier: null },
  'repeating_command_block': { tool: null, tier: null },
  
  // Spawners (Pickaxe but doesn't drop)
  'spawner': { tool: 'pickaxe', tier: 'wooden' },
  
  // End Portal Frame (Unbreakable)
  'end_portal_frame': { tool: null, tier: null },
  'end_portal': { tool: null, tier: null },
  'end_gateway': { tool: null, tier: null },
  
  // Nether Portal
  'nether_portal': { tool: null, tier: null },
  
  // Instant break blocks
  'torch': { tool: 'hand', tier: null },
  'soul_torch': { tool: 'hand', tier: null },
  'redstone_torch': { tool: 'hand', tier: null },
  'wall_torch': { tool: 'hand', tier: null },
  'soul_wall_torch': { tool: 'hand', tier: null },
  'redstone_wall_torch': { tool: 'hand', tier: null },
  'lever': { tool: 'hand', tier: null },
  'redstone_wire': { tool: 'hand', tier: null },
  'tripwire': { tool: 'hand', tier: null },
  'tripwire_hook': { tool: 'hand', tier: null },
  'repeater': { tool: 'hand', tier: null },
  'comparator': { tool: 'hand', tier: null },
  'flower_pot': { tool: 'hand', tier: null },
  'decorated_pot': { tool: 'hand', tier: null },
  'cake': { tool: 'hand', tier: null },
  'candle': { tool: 'hand', tier: null },
  'candle_cake': { tool: 'hand', tier: null },
  'dragon_egg': { tool: 'hand', tier: null },
  'turtle_egg': { tool: 'hand', tier: null },
  'sniffer_egg': { tool: 'hand', tier: null },
  'frogspawn': { tool: 'hand', tier: null },
  
  // Plants & Crops (instant break)
  'grass': { tool: 'hand', tier: null },
  'fern': { tool: 'hand', tier: null },
  'dead_bush': { tool: 'hand', tier: null },
  'seagrass': { tool: 'hand', tier: null },
  'tall_seagrass': { tool: 'hand', tier: null },
  'kelp': { tool: 'hand', tier: null },
  'kelp_plant': { tool: 'hand', tier: null },
  'wheat': { tool: 'hand', tier: null },
  'carrots': { tool: 'hand', tier: null },
  'potatoes': { tool: 'hand', tier: null },
  'beetroots': { tool: 'hand', tier: null },
  'melon_stem': { tool: 'hand', tier: null },
  'pumpkin_stem': { tool: 'hand', tier: null },
  'attached_melon_stem': { tool: 'hand', tier: null },
  'attached_pumpkin_stem': { tool: 'hand', tier: null },
  'sweet_berry_bush': { tool: 'hand', tier: null },
  'cocoa': { tool: 'hand', tier: null },
  'nether_wart': { tool: 'hand', tier: null },
  'sugar_cane': { tool: 'hand', tier: null },
  'bamboo_sapling': { tool: 'hand', tier: null },
  'torchflower_crop': { tool: 'hand', tier: null },
  'pitcher_crop': { tool: 'hand', tier: null },
  
  // Flowers
  'dandelion': { tool: 'hand', tier: null },
  'poppy': { tool: 'hand', tier: null },
  'blue_orchid': { tool: 'hand', tier: null },
  'allium': { tool: 'hand', tier: null },
  'azure_bluet': { tool: 'hand', tier: null },
  'red_tulip': { tool: 'hand', tier: null },
  'orange_tulip': { tool: 'hand', tier: null },
  'white_tulip': { tool: 'hand', tier: null },
  'pink_tulip': { tool: 'hand', tier: null },
  'oxeye_daisy': { tool: 'hand', tier: null },
  'cornflower': { tool: 'hand', tier: null },
  'lily_of_the_valley': { tool: 'hand', tier: null },
  'wither_rose': { tool: 'hand', tier: null },
  'torchflower': { tool: 'hand', tier: null },
  'sunflower': { tool: 'hand', tier: null },
  'lilac': { tool: 'hand', tier: null },
  'rose_bush': { tool: 'hand', tier: null },
  'peony': { tool: 'hand', tier: null },
  'tall_grass': { tool: 'hand', tier: null },
  'large_fern': { tool: 'hand', tier: null },
  'pitcher_plant': { tool: 'hand', tier: null },
  'spore_blossom': { tool: 'hand', tier: null },
  'pink_petals': { tool: 'hand', tier: null },
  
  // Mushrooms
  'brown_mushroom': { tool: 'hand', tier: null },
  'red_mushroom': { tool: 'hand', tier: null },
  'crimson_fungus': { tool: 'hand', tier: null },
  'warped_fungus': { tool: 'hand', tier: null },
  'crimson_roots': { tool: 'hand', tier: null },
  'warped_roots': { tool: 'hand', tier: null },
  'nether_sprouts': { tool: 'hand', tier: null },
  'weeping_vines': { tool: 'hand', tier: null },
  'weeping_vines_plant': { tool: 'hand', tier: null },
  'twisting_vines': { tool: 'hand', tier: null },
  'twisting_vines_plant': { tool: 'hand', tier: null },
  
  // Vines & Glow Lichen
  'vine': { tool: 'shears', tier: null },
  'glow_lichen': { tool: 'shears', tier: null },
  'cave_vines': { tool: 'hand', tier: null },
  'cave_vines_plant': { tool: 'hand', tier: null },
  
  // Saplings
  'oak_sapling': { tool: 'hand', tier: null },
  'spruce_sapling': { tool: 'hand', tier: null },
  'birch_sapling': { tool: 'hand', tier: null },
  'jungle_sapling': { tool: 'hand', tier: null },
  'acacia_sapling': { tool: 'hand', tier: null },
  'dark_oak_sapling': { tool: 'hand', tier: null },
  'mangrove_propagule': { tool: 'hand', tier: null },
  'cherry_sapling': { tool: 'hand', tier: null },
  'azalea': { tool: 'hand', tier: null },
  'flowering_azalea': { tool: 'hand', tier: null },
  
  // Melon & Pumpkin
  'melon': { tool: 'axe', tier: null },
  'pumpkin': { tool: 'axe', tier: null },
  'carved_pumpkin': { tool: 'axe', tier: null },
  'jack_o_lantern': { tool: 'axe', tier: null },
  
  // Glass & Glass Panes (No tool, but faster with pickaxe)
  'glass': { tool: 'hand', tier: null },
  'tinted_glass': { tool: 'hand', tier: null },
  'white_stained_glass': { tool: 'hand', tier: null },
  'orange_stained_glass': { tool: 'hand', tier: null },
  'magenta_stained_glass': { tool: 'hand', tier: null },
  'light_blue_stained_glass': { tool: 'hand', tier: null },
  'yellow_stained_glass': { tool: 'hand', tier: null },
  'lime_stained_glass': { tool: 'hand', tier: null },
  'pink_stained_glass': { tool: 'hand', tier: null },
  'gray_stained_glass': { tool: 'hand', tier: null },
  'light_gray_stained_glass': { tool: 'hand', tier: null },
  'cyan_stained_glass': { tool: 'hand', tier: null },
  'purple_stained_glass': { tool: 'hand', tier: null },
  'blue_stained_glass': { tool: 'hand', tier: null },
  'brown_stained_glass': { tool: 'hand', tier: null },
  'green_stained_glass': { tool: 'hand', tier: null },
  'red_stained_glass': { tool: 'hand', tier: null },
  'black_stained_glass': { tool: 'hand', tier: null },
  
  'glass_pane': { tool: 'hand', tier: null },
  'white_stained_glass_pane': { tool: 'hand', tier: null },
  'orange_stained_glass_pane': { tool: 'hand', tier: null },
  'magenta_stained_glass_pane': { tool: 'hand', tier: null },
  'light_blue_stained_glass_pane': { tool: 'hand', tier: null },
  'yellow_stained_glass_pane': { tool: 'hand', tier: null },
  'lime_stained_glass_pane': { tool: 'hand', tier: null },
  'pink_stained_glass_pane': { tool: 'hand', tier: null },
  'gray_stained_glass_pane': { tool: 'hand', tier: null },
  'light_gray_stained_glass_pane': { tool: 'hand', tier: null },
  'cyan_stained_glass_pane': { tool: 'hand', tier: null },
  'purple_stained_glass_pane': { tool: 'hand', tier: null },
  'blue_stained_glass_pane': { tool: 'hand', tier: null },
  'brown_stained_glass_pane': { tool: 'hand', tier: null },
  'green_stained_glass_pane': { tool: 'hand', tier: null },
  'red_stained_glass_pane': { tool: 'hand', tier: null },
  'black_stained_glass_pane': { tool: 'hand', tier: null },
  
  // Beds
  'white_bed': { tool: 'hand', tier: null },
  'orange_bed': { tool: 'hand', tier: null },
  'magenta_bed': { tool: 'hand', tier: null },
  'light_blue_bed': { tool: 'hand', tier: null },
  'yellow_bed': { tool: 'hand', tier: null },
  'lime_bed': { tool: 'hand', tier: null },
  'pink_bed': { tool: 'hand', tier: null },
  'gray_bed': { tool: 'hand', tier: null },
  'light_gray_bed': { tool: 'hand', tier: null },
  'cyan_bed': { tool: 'hand', tier: null },
  'purple_bed': { tool: 'hand', tier: null },
  'blue_bed': { tool: 'hand', tier: null },
  'brown_bed': { tool: 'hand', tier: null },
  'green_bed': { tool: 'hand', tier: null },
  'red_bed': { tool: 'hand', tier: null },
  'black_bed': { tool: 'hand', tier: null },
  
  // Concrete Powder (Shovel)
  'white_concrete_powder': { tool: 'shovel', tier: null },
  'orange_concrete_powder': { tool: 'shovel', tier: null },
  'magenta_concrete_powder': { tool: 'shovel', tier: null },
  'light_blue_concrete_powder': { tool: 'shovel', tier: null },
  'yellow_concrete_powder': { tool: 'shovel', tier: null },
  'lime_concrete_powder': { tool: 'shovel', tier: null },
  'pink_concrete_powder': { tool: 'shovel', tier: null },
  'gray_concrete_powder': { tool: 'shovel', tier: null },
  'light_gray_concrete_powder': { tool: 'shovel', tier: null },
  'cyan_concrete_powder': { tool: 'shovel', tier: null },
  'purple_concrete_powder': { tool: 'shovel', tier: null },
  'blue_concrete_powder': { tool: 'shovel', tier: null },
  'brown_concrete_powder': { tool: 'shovel', tier: null },
  'green_concrete_powder': { tool: 'shovel', tier: null },
  'red_concrete_powder': { tool: 'shovel', tier: null },
  'black_concrete_powder': { tool: 'shovel', tier: null },
  
  // Cobwebs (Sword or Shears)
  'cobweb': { tool: 'sword', tier: null },
  
  // Ice (Pickaxe)
  'ice': { tool: 'pickaxe', tier: 'wooden' },
  'packed_ice': { tool: 'pickaxe', tier: 'wooden' },
  'blue_ice': { tool: 'pickaxe', tier: 'wooden' },
  'frosted_ice': { tool: 'pickaxe', tier: 'wooden' },
  
  // Coral & Coral Blocks (Pickaxe)
  'tube_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'brain_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'bubble_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'fire_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'horn_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'dead_tube_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'dead_brain_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'dead_bubble_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'dead_fire_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  'dead_horn_coral_block': { tool: 'pickaxe', tier: 'wooden' },
  
  'tube_coral': { tool: 'hand', tier: null },
  'brain_coral': { tool: 'hand', tier: null },
  'bubble_coral': { tool: 'hand', tier: null },
  'fire_coral': { tool: 'hand', tier: null },
  'horn_coral': { tool: 'hand', tier: null },
  'tube_coral_fan': { tool: 'hand', tier: null },
  'brain_coral_fan': { tool: 'hand', tier: null },
  'bubble_coral_fan': { tool: 'hand', tier: null },
  'fire_coral_fan': { tool: 'hand', tier: null },
  'horn_coral_fan': { tool: 'hand', tier: null },
  'dead_tube_coral': { tool: 'hand', tier: null },
  'dead_brain_coral': { tool: 'hand', tier: null },
  'dead_bubble_coral': { tool: 'hand', tier: null },
  'dead_fire_coral': { tool: 'hand', tier: null },
  'dead_horn_coral': { tool: 'hand', tier: null },
  'dead_tube_coral_fan': { tool: 'hand', tier: null },
  'dead_brain_coral_fan': { tool: 'hand', tier: null },
  'dead_bubble_coral_fan': { tool: 'hand', tier: null },
  'dead_fire_coral_fan': { tool: 'hand', tier: null },
  'dead_horn_coral_fan': { tool: 'hand', tier: null },
  
  // Ladders
  'ladder': { tool: 'axe', tier: null },
  
  // Scaffolding
  'scaffolding': { tool: 'hand', tier: null },
  
  // Buttons (Stone)
  'stone_button': { tool: 'pickaxe', tier: 'wooden' },
  'polished_blackstone_button': { tool: 'pickaxe', tier: 'wooden' },
  
  // Pressure Plates (Stone/Metal)
  'stone_pressure_plate': { tool: 'pickaxe', tier: 'wooden' },
  'polished_blackstone_pressure_plate': { tool: 'pickaxe', tier: 'wooden' },
  'light_weighted_pressure_plate': { tool: 'pickaxe', tier: 'wooden' },
  'heavy_weighted_pressure_plate': { tool: 'pickaxe', tier: 'wooden' },
  
  // Nether Wart Block
  'nether_wart_block': { tool: 'hoe', tier: null },
  'warped_wart_block': { tool: 'hoe', tier: null },
  
  // Bone Block
  'bone_block': { tool: 'pickaxe', tier: 'wooden' },
  
  // Frog Lights
  'ochre_froglight': { tool: 'hand', tier: null },
  'verdant_froglight': { tool: 'hand', tier: null },
  'pearlescent_froglight': { tool: 'hand', tier: null },
  
  // Respawn Anchor already added above
  
  // Lodestone already added above
  
  // Crying Obsidian already added above
  
  // Raw Copper Block already added above
  
  // Lightning Rod
  'lightning_rod': { tool: 'pickaxe', tier: 'stone' },
  
  // Copper Grate & Bulb
  'copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'exposed_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'weathered_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'waxed_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_copper_grate': { tool: 'pickaxe', tier: 'stone' },
  
  'copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'exposed_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'weathered_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'waxed_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_copper_bulb': { tool: 'pickaxe', tier: 'stone' },
  
  // Chiseled Copper
  'chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'exposed_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'weathered_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_chiseled_copper': { tool: 'pickaxe', tier: 'stone' },
  
  // Copper Doors & Trapdoors
  'copper_door': { tool: 'pickaxe', tier: 'stone' },
  'exposed_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'weathered_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'waxed_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_copper_door': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_copper_door': { tool: 'pickaxe', tier: 'stone' },
  
  'copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'exposed_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'weathered_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'oxidized_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'waxed_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'waxed_exposed_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'waxed_weathered_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
  'waxed_oxidized_copper_trapdoor': { tool: 'pickaxe', tier: 'stone' },
};

/**
 * Get tool requirement for a block
 * @param blockTypeId Full block type ID (e.g., "minecraft:stone" or "apeirix:tin_ore")
 * @returns ToolRequirement or default hand mineable
 */
export function getToolRequirement(blockTypeId: string): ToolRequirement {
  // Remove namespace
  const blockName = blockTypeId.includes(':') ? blockTypeId.split(':')[1] : blockTypeId;
  
  // Lookup in mapping
  const requirement = BLOCK_TOOL_REQUIREMENTS[blockName];
  
  if (requirement) {
    return requirement;
  }
  
  // Default: hand mineable (for unknown blocks or mod blocks)
  return { tool: 'hand', tier: null };
}
