import { world, ItemStack, Player, EquipmentSlot, PlayerBreakBlockAfterEvent, ItemUseBeforeEvent } from "@minecraft/server";

/**
 * System xử lý Bronze tools durability và hoe tillage
 */
export class BronzeToolSystem {
  private static instance: BronzeToolSystem;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): BronzeToolSystem {
    if (!BronzeToolSystem.instance) {
      BronzeToolSystem.instance = new BronzeToolSystem();
    }
    return BronzeToolSystem.instance;
  }

  private initialize(): void {
    // Durability on block break
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });

    // Hoe tillage
    world.beforeEvents.itemUse.subscribe((event) => {
      this.handleItemUse(event);
    });
  }

  private handleBlockBreak(event: PlayerBreakBlockAfterEvent): void {
    const player = event.player;
    const equipment = player.getComponent("minecraft:equippable");
    if (!equipment) return;

    const tool = equipment.getEquipment(EquipmentSlot.Mainhand);
    if (!tool) return;

    const toolId = tool.typeId;
    
    // Check if bronze tool
    if (this.isBronzeTool(toolId)) {
      this.damageTool(player, tool, 1);
    }
  }

  private handleItemUse(event: ItemUseBeforeEvent): void {
    const player = event.source as Player;
    const item = event.itemStack;

    if (!item || item.typeId !== "apeirix:bronze_hoe") return;

    // Get block player is looking at
    const blockRaycast = player.getBlockFromViewDirection({ maxDistance: 5 });
    if (!blockRaycast) return;

    const block = blockRaycast.block;
    const blockId = block.typeId;

    // Check if block can be tilled
    const tillableBlocks = [
      "minecraft:dirt",
      "minecraft:grass_block",
      "minecraft:dirt_path",
      "minecraft:coarse_dirt"
    ];

    if (tillableBlocks.includes(blockId)) {
      // Convert to farmland
      block.dimension.runCommand(
        `setblock ${block.location.x} ${block.location.y} ${block.location.z} farmland`
      );

      // Play sound
      block.dimension.playSound("use.grass", block.location);

      // Damage hoe
      const equipment = player.getComponent("minecraft:equippable");
      if (equipment) {
        const hoe = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (hoe) {
          this.damageTool(player, hoe, 1);
        }
      }
    }
  }

  private isBronzeTool(toolId: string): boolean {
    return [
      "apeirix:bronze_pickaxe",
      "apeirix:bronze_axe",
      "apeirix:bronze_shovel",
      "apeirix:bronze_hoe"
    ].includes(toolId);
  }

  private damageTool(player: Player, tool: ItemStack, amount: number): void {
    const durability = tool.getComponent("minecraft:durability");
    if (!durability) return;

    // Apply unbreaking if present
    const enchantable = tool.getComponent("minecraft:enchantable");
    if (enchantable) {
      const unbreaking = enchantable.getEnchantment("unbreaking");
      if (unbreaking) {
        // Unbreaking has chance to not consume durability
        const chance = 1 / (unbreaking.level + 1);
        if (Math.random() > chance) {
          return; // Don't damage this time
        }
      }
    }

    // Damage the tool
    const newDamage = durability.damage + amount;
    
    if (newDamage >= durability.maxDurability) {
      // Tool breaks
      player.dimension.playSound("random.break", player.location);
      
      const equipment = player.getComponent("minecraft:equippable");
      if (equipment) {
        equipment.setEquipment(EquipmentSlot.Mainhand, undefined);
      }
    } else {
      durability.damage = newDamage;
      
      const equipment = player.getComponent("minecraft:equippable");
      if (equipment) {
        equipment.setEquipment(EquipmentSlot.Mainhand, tool);
      }
    }
  }
}
