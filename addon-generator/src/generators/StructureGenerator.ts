import { writeFileSync } from 'fs';
import type { StructureConfig } from '../core/types/ConfigTypes.js';

export class StructureGenerator {
  /**
   * Generate structure feature file (Updated for 1.21.50)
   */
  static generateFeature(structure: StructureConfig, outputPath: string): void {
    const feature = {
      format_version: '1.21.40',
      'minecraft:structure_template_feature': {
        description: {
          identifier: `apeirix:${structure.id}_feature`
        },
        structure_name: `mystructure:${structure.id}`,
        adjustment_radius: 4,
        facing_direction: 'random',
        constraints: {
          grounded: {},
          unburied: {},
          block_intersection: {
            block_allowlist: [
              'minecraft:air',
              'minecraft:water',
              'minecraft:grass',
              'minecraft:tall_grass',
              'minecraft:short_grass'
            ]
          }
        }
      }
    };

    writeFileSync(outputPath, JSON.stringify(feature, null, 2));
  }

  /**
   * Generate structure feature rule (Updated for 1.21.50)
   */
  static generateFeatureRule(structure: StructureConfig, outputPath: string): void {
    const rules = structure.spawnRules || {
      scatter: { iterations: 1, chance: 5 },
      yRange: { min: 60, max: 120 }
    };

    // Build biome filter - support both simple array and complex filter
    let biomeFilter;
    if (rules.biomes && Array.isArray(rules.biomes)) {
      biomeFilter = rules.biomes;
    } else {
      biomeFilter = [
        { 
          test: 'has_biome_tag', 
          operator: '==', 
          value: 'overworld' 
        }
      ];
    }

    const featureRule = {
      format_version: '1.21.40',
      'minecraft:feature_rules': {
        description: {
          identifier: `apeirix:${structure.id}_placement`,
          places_feature: `apeirix:${structure.id}_feature`
        },
        conditions: {
          placement_pass: 'first_pass',
          'minecraft:biome_filter': biomeFilter
        },
        distribution: {
          iterations: rules.scatter?.iterations || 1,
          scatter_chance: {
            numerator: rules.scatter?.chance || 5,
            denominator: 100
          },
          x: {
            distribution: 'uniform',
            extent: [0, 16]
          },
          y: 'q.heightmap(v.worldx, v.worldz)',
          z: {
            distribution: 'uniform',
            extent: [0, 16]
          }
        }
      }
    };

    writeFileSync(outputPath, JSON.stringify(featureRule, null, 2));
  }
}
