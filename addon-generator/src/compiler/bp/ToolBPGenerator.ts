import path from 'path';
import { PickaxeGenerator } from '../../generators/tools/PickaxeGenerator.js';
import { AxeGenerator } from '../../generators/tools/AxeGenerator.js';
import { ShovelGenerator } from '../../generators/tools/ShovelGenerator.js';
import { HoeGenerator } from '../../generators/tools/HoeGenerator.js';
import { SwordGenerator } from '../../generators/tools/SwordGenerator.js';
import { SpearGenerator } from '../../generators/tools/SpearGenerator.js';
import { HammerGenerator } from '../../generators/tools/HammerGenerator.js';

/**
 * Generate BP tools
 */
export class ToolBPGenerator {
  static async generate(tools: any[], bpPath: string): Promise<number> {
    let count = 0;
    
    for (const tool of tools) {
      try {
        const toolConfig = {
          id: tool.id,
          name: tool.name,
          texturePath: tool.texture || `./textures/${tool.id}.png`,
          materialId: tool.materialId || tool.repairItem,
          durability: tool.durability || 250,
          speed: tool.speed || 4,
          damage: tool.damage || 1,
          enchantability: tool.enchantability || 14,
          tier: tool.tier
        };

        switch (tool.type) {
          case 'pickaxe':
            new PickaxeGenerator(bpPath).generate(toolConfig);
            break;
          case 'axe':
            new AxeGenerator(bpPath).generate(toolConfig);
            break;
          case 'shovel':
            new ShovelGenerator(bpPath).generate(toolConfig);
            break;
          case 'hoe':
            new HoeGenerator(bpPath).generate(toolConfig);
            break;
          case 'sword':
            new SwordGenerator(bpPath).generate(toolConfig);
            break;
          case 'spear':
            new SpearGenerator(bpPath).generate(toolConfig);
            break;
          case 'hammer':
            new HammerGenerator(bpPath).generate(toolConfig);
            break;
          default:
            console.warn(`  ⚠ Unknown tool type: ${tool.type}`);
            continue;
        }
        count++;
      } catch (error) {
        console.error(`  ✗ Failed to generate tool ${tool.id}: ${error}`);
      }
    }
    
    return count;
  }
}
