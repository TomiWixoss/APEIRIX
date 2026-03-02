/**
 * English Language File for APEIRIX
 * AUTO-GENERATED from configs/script-lang/en_US/*.yaml
 * DO NOT EDIT - Changes will be overwritten
 */

export const LANG_EN = {
    "ui": {
        "close": "§l§c✖ Close",
        "back": "§l§0← Back",
        "backToList": "§l§0← Back to List",
        "backToMenu": "§l§0← Back to Menu"
    },
    "achievements": {
        "title": "§l§6═══ APEIRIX ACHIEVEMENTS ═══",
        "selectCategory": "§0Select achievement branch to view:",
        "progress": "§0Progress:",
        "completed": "§8completed",
        "status": "§0Status:",
        "statusCompleted": "§2§lCOMPLETED",
        "statusLocked": "§8§lLOCKED",
        "rewardClaim": "§eClaim",
        "rewardClaimed": "§a✓ Claimed",
        "rewardLocked": "§8✗ Locked",
        "congratulations": "§2§l★ CONGRATULATIONS! ★\n§0You have completed this achievement!",
        "keepGoing": "§6§l⚡ KEEP GOING! ⚡\n§0You're almost there!",
        "unlocked": "§6§l★ ACHIEVEMENT UNLOCKED! ★",
        "received": "§a§l+ Received:"
    },
    "categories": {
        "metallurgy": {
            "name": "§6⚒ METALLURGY",
            "desc": "§0Physical World - Ores → Alloys → Tools/Armor"
        },
        "starter": {
            "name": "§a✦ STARTER",
            "desc": "§0First steps in APEIRIX world"
        },
        "food": {
            "name": "§eFOOD & SURVIVAL",
            "desc": "§0Canning, preservation and nutrition"
        },
        "processing": {
            "name": "§b⚙ PROCESSING",
            "desc": "§0Machines, automation and efficiency"
        }
    },
    "phases": {
        "metallurgy": {
            "phase1": {
                "name": "§6Phase 1: §0Bronze Age",
                "desc": "§0Learn basic metallurgy and alloy mechanics"
            }
        }
    },
    "achievementNames": {
        "welcome": "Welcome",
        "first_mine": "First Mine",
        "first_craft": "First Craft",
        "first_ore": "First Ore",
        "tin_collector": "Tin Collector",
        "bronze_maker": "Bronze Maker",
        "alloy_master": "Alloy Master",
        "tool_crafter": "Tool Crafter",
        "armor_smith": "Armor Smith",
        "crusher_user": "Crusher Operator",
        "hammer_expert": "Hammer Expert",
        "bronze_age_complete": "Bronze Age Complete",
        "first_can": "First Can",
        "can_collector": "Can Collector",
        "recycler": "Recycler",
        "processing_master": "Processing Master",
        "dust_collector": "Dust Collector",
        "efficiency_expert": "Efficiency Expert"
    },
    "achievementDescs": {
        "welcome": "§0Join APEIRIX world for the first time",
        "first_mine": "§0Mine your first block",
        "first_craft": "§0Craft your first item",
        "first_ore": "§0Mine your first tin ore",
        "tin_collector": "§0Collect 64 tin ore",
        "bronze_maker": "§0Create your first bronze ingot",
        "alloy_master": "§0Create 32 bronze ingots",
        "tool_crafter": "§0Craft complete bronze tool set",
        "armor_smith": "§0Craft complete bronze armor set",
        "crusher_user": "§0Use ore crusher for the first time",
        "hammer_expert": "§0Use hammer to mine 100 blocks",
        "bronze_age_complete": "§0Complete all Phase 1 achievements",
        "first_can": "§0Craft your first empty can",
        "can_collector": "§0Collect 10 different canned foods",
        "recycler": "§0Wash 50 dirty cans",
        "processing_master": "§0Use all 7 processing machines",
        "dust_collector": "§0Collect 100 pure dusts",
        "efficiency_expert": "§0Process 1000 items through machines"
    },
    "welcome": {
        "title": "§a§lWelcome to APEIRIX!",
        "firstTime": "§e§lYou have received the APEIRIX Achievement Book!\n§0Use the book to view your achievement progress",
        "returning": "§0If you lose the book, type: §b/scriptevent apeirix:getbook",
        "bookReceived": "§a§lReceived APEIRIX Achievement Book!"
    },
    "items": {
        "achievementBook": "APEIRIX Achievement Book"
    },
    "tool_type": {
        "axe": "Axe",
        "pickaxe": "Pickaxe"
    },
    "tier": {
        "wooden": "Wooden",
        "stone": "Stone",
        "copper": "Copper",
        "iron": "Iron",
        "golden": "Golden",
        "diamond": "Diamond",
        "netherite": "Netherite"
    },
    "message": {
        "requires_tool": "§cYou need a {tool_type} to break this block!"
    },
    "wiki": {
        "title": "§l§0ENCYCLOPEDIA",
        "itemCount": "§0Discovered: §0{count}§0 items",
        "noItemsFound": "§cNo APEIRIX items found in inventory!",
        "selectItem": "§0Select an item to view details",
        "back": "§cBack",
        "emptyTitle": "§l§0ENCYCLOPEDIA",
        "emptyMessage": "§0You don't have any APEIRIX items in your inventory yet.\n\n§0Explore the world and collect items to unlock information in the encyclopedia!\n\n§0Available categories:\n§0• §0Materials\n§0• §0Tools\n§0• §0Armor\n§0• §0Foods\n§0• §0Special",
        "emptyButton": "§0Got it",
        "description": "§l§0DESCRIPTION:",
        "category": "§0Category:",
        "information": "§l§0Information",
        "attributes": "§l§0ATTRIBUTES",
        "categories": {
            "materials": "§0Materials",
            "tools": "§0Tools",
            "armor": "§0Armor",
            "foods": "§0Foods",
            "special": "§0Special",
            "blocks": "§0Blocks",
            "ores": "§0Ores",
            "entities": "§0Entities"
        }
    },
    "attributes": {
        "breakable": "§cBreakable",
        "durability": "§6Durability",
        "combat_damage": "§6Damage",
        "damage_multiplier": "§6Damage Bonus",
        "mining_speed": "§6Mining Speed",
        "hammer_mining": "§6Hammer Mining",
        "rust_mite_edible": "§cRust Mite Food",
        "requires_tool": "§eRequires",
        "hunger_infliction": "§cHunger Infliction",
        "requires_tool_template": "{attr:requires_tool}: §f{tool_type}",
        "hunger_infliction_template": "§cInflicts Hunger ({duration}s)",
        "vanilla_override_warning": "§e⚠ Stats have been modified§r",
        "breakable_template": "{attr:breakable}: §f{breakable_value}% §7({breakable_condition})",
        "durability_modifier_template": "{attr:durability}: §f{current_durability}/{max_durability} uses",
        "combat_damage_modifier_template": "{attr:combat_damage}: §f{combat_damage}",
        "undead_slayer_template": "{attr:damage_multiplier}: §f+{damageMultiplier}%",
        "hammer_mining_template": "{attr:hammer_mining}: §aBreaks blocks into dust",
        "rust_mite_edible_template": "{attr:rust_mite_edible}: §cAttracts Rust Mites"
    }
};
