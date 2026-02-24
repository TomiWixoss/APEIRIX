import path from 'path';
import { PickaxeGenerator } from '../../generators/tools/PickaxeGenerator.js';
import { AxeGenerator } from '../../generators/tools/AxeGenerator.js';
import { ShovelGenerator } from '../../generators/tools/ShovelGenerator.js';
import { HoeGenerator } from '../../generators/tools/HoeGenerator.js';
import { SwordGenerator } from '../../generators/tools/SwordGenerator.js';
import { SpearGenerator } from '../../generators/tools/SpearGenerator.js';

/**
 * Generate BP tools
 */
export class ToolBPGenerator {
  static async generate(tools: any[], bpPath: string): Promise<number> {
    const projectRoot = path.dirname(bpPath);
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
          enchantability: tool.enchantability || 14
        };

        switch (tool.type) {
          case 'pickaxe':
            new PickaxeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'axe':
            new AxeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'shovel':
            new ShovelGenerator(projectRoot).generate(toolConfig);
            break;
          case 'hoe':
            new HoeGenerator(projectRoot).generate(toolConfig);
            break;
          case 'sword':
            new SwordGenerator(projectRoot).generate(toolConfig);
            break;
          case 'spear':
            new SpearGenerator(projectRoot).generate(toolConfig);
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
