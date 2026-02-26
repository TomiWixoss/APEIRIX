import path from 'path';
import { FileManager } from '../../core/FileManager.js';

/**
 * Entity RP Generator
 * Generates entity client files (render definitions)
 */
export class EntityRPGenerator {
  /**
   * Generate all entity client files
   */
  static async generate(entities: any[], rpPath: string): Promise<number> {
    if (!entities || entities.length === 0) {
      return 0;
    }

    console.log(`  🎨 Generating ${entities.length} entity clients...`);
    
    let count = 0;

    for (const entity of entities) {
      try {
        this.generateEntityClient(entity, rpPath);
        count++;
      } catch (error) {
        console.error(`  ❌ Error generating entity client ${entity.id}:`, error);
      }
    }

    return count;
  }

  /**
   * Generate entity client definition
   */
  private static generateEntityClient(entity: any, rpPath: string): void {
    // Extract filename without extension from paths
    const getBaseName = (filePath: string): string => {
      if (!filePath) return '';
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
      return fileName.replace(/\.(geo\.json|animation\.json|png)$/, '');
    };

    const modelName = entity.model ? getBaseName(entity.model) : 'silverfish';
    const animationFileName = entity.animation ? getBaseName(entity.animation) : '';
    
    // Use animationName from config, fallback to "move"
    const animationAction = entity.animationName || 'move';

    const clientData: any = {
      format_version: "1.10.0",
      "minecraft:client_entity": {
        description: {
          identifier: `apeirix:${entity.id}`,
          materials: {
            default: "entity_alphatest"
          },
          textures: {
            default: `textures/entity/${entity.id}`
          },
          geometry: {
            default: `geometry.${modelName}`
          },
          render_controllers: ["controller.render.default"]
        }
      }
    };

    // Add animations if animation file is specified
    if (animationFileName) {
      clientData["minecraft:client_entity"].description.animations = {
        walk: `animation.${animationFileName}.${animationAction}`
      };
      clientData["minecraft:client_entity"].description.scripts = {
        animate: ["walk"]
      };
    }

    // Add spawn egg if specified
    if (entity.spawnEgg) {
      clientData["minecraft:client_entity"].description.spawn_egg = {
        texture: `spawn_egg_${entity.id}`,
        texture_index: 0
      };
      
      if (entity.spawnEgg.baseColor) {
        clientData["minecraft:client_entity"].description.spawn_egg.base_color = entity.spawnEgg.baseColor;
      }
      if (entity.spawnEgg.overlayColor) {
        clientData["minecraft:client_entity"].description.spawn_egg.overlay_color = entity.spawnEgg.overlayColor;
      }
    }

    const outputPath = path.join(rpPath, `entity/${entity.id}.json`);
    FileManager.writeJSON(outputPath, clientData);
    console.log(`  ✅ Đã tạo: RP/entity/${entity.id}.json`);
  }
}
