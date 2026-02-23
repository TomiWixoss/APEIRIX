import { world, ItemStack, Player, EquipmentSlot, PlayerBreakBlockAfterEvent, system } from "@minecraft/server";
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

    // Hoe tillage - use beforeEvents to intercept
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      this.handlePlayerInteract(event);
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

  private handlePlayerInteract(event: any): void {
    const player = event.player;
    const block = event.block;
    const itemStack = event.itemStack;

    if (!itemStack) return;

    // Check if it's a CUSTOM hoe
    const toolDef = ToolRegistry.getTool(itemStack.typeId);
    if (!toolDef || toolDef.type !== "hoe") return;

    const blockId = block.typeId;

    // Check if block is tillable (only dirt, grass, dirt_path, coarse_dirt)
    if (!TillableRegistry.isTillable(blockId)) return;

    const blockLocation = { ...block.location };
    const playerId = player.id;
    const hoeTypeId = itemStack.typeId;
    
    // Schedule effects in unrestricted context
    system.run(() => {
      const currentPlayer = world.getAllPlayers().find(p => p.id === playerId);
      if (!currentPlayer) return;

      // Verify block was actually tilled (check if it's now farmland)
      const currentBlock = currentPlayer.dimension.getBlock(blockLocation);
      if (!currentBlock || currentBlock.typeId !== "minecraft:farmland") {
        // Block wasn't tilled, don't apply effects
        return;
      }

      console.warn(`[CustomToolSystem] Farmland created, applying effects`);
      
      // Play tillage sound
      try {
        currentPlayer.dimension.playSound("use.grass", blockLocation);
        console.warn(`[CustomToolSystem] Sound played`);
      } catch (error) {
        console.error(`[CustomToolSystem] Failed to play sound: ${error}`);
      }

      // Damage hoe
      const equipment = currentPlayer.getComponent("minecraft:equippable");
      if (equipment) {
        const hoe = equipment.getEquipment(EquipmentSlot.Mainhand);
        if (hoe && hoe.typeId === hoeTypeId) {
          this.damageTool(currentPlayer, hoe, 1);
          console.warn(`[CustomToolSystem] Hoe damaged`);
        }
      }
    });
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
