import { world, ItemStack, Player, EquipmentSlot, PlayerBreakBlockAfterEvent } from "@minecraft/server";
import { ToolRegistry } from "../../data/tools/ToolRegistry";
import { TillableRegistry } from "../../data/blocks/TillableRegistry";

/**
 * System xử lý custom tools durability và hoe tillage
 */
export class CustomToolSystem {
  private static instance: CustomToolSystem;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CustomToolSystem {
    if (!CustomToolSystem.instance) {
      CustomToolSystem.instance = new CustomToolSystem();
    }
    return CustomToolSystem.instance;
  }

  private initialize(): void {
    // Durability on block break
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      this.handleBlockBreak(event);
    });

    // Hoe tillage
    world.afterEvents.itemUse.subscribe((event) => {
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
    
    // Check if custom tool
    if (ToolRegistry.isTool(toolId)) {
      this.damageTool(player, tool, 1);
    }
  }

  private handleItemUse(event: { source: Player; itemStack?: ItemStack }): void {
    const player = event.source;
    const item = event.itemStack;

    if (!item) return;

    // Check if it's a hoe
    const toolDef = ToolRegistry.getTool(item.typeId);
    if (!toolDef || toolDef.type !== "hoe") return;

    // Get block player is looking at
    const blockRaycast = player.getBlockFromViewDirection({ maxDistance: 5 });
    if (!blockRaycast) return;

    const block = blockRaycast.block;
    const blockId = block.typeId;

    // Check if block can be tilled
    if (TillableRegistry.isTillable(blockId)) {
      const tillable = TillableRegistry.getTillable(blockId);
      if (!tillable) return;

      // Convert to farmland using setType
      const farmland = block.dimension.getBlock(block.location);
      if (!farmland) return;

      farmland.setType(tillable.resultBlock);

      // Play sound
      if (tillable.sound) {
        block.dimension.playSound(tillable.sound, block.location);
      }

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
