import path from 'path';
import { copyFileSync, existsSync } from 'fs';
import type { StructureConfig } from '../../core/types/ConfigTypes.js';
import { StructureGenerator } from '../../generators/StructureGenerator.js';
import { Logger } from '../../utils/Logger.js';

/**
 * Generate structure files for BP
 */
export class StructureBPGenerator {
  /**
   * Generate structure files
   */
  static async generate(structures: StructureConfig[], bpPath: string, configDir: string): Promise<number> {
    Logger.log('\n🏗️  Generating structures...');
    Logger.log(`  📁 Config dir: ${configDir}`);
    Logger.log(`  📦 Structures count: ${structures?.length || 0}`);
    
    if (!structures || structures.length === 0) {
      Logger.log('  ⓘ No structures to generate');
      return 0;
    }
    
    let count = 0;
    
    for (const structure of structures) {
      try {
        // Structure file path is relative to the structure config file location
        // structure._sourcePath contains the absolute path to the directory containing the YAML file
        const structureConfigDir = (structure as any)._sourcePath || configDir;
        
        // Resolve the structure file path
        // If file starts with ./, remove it and resolve directly from config dir
        let filePath = structure.file;
        if (filePath.startsWith('./')) {
          filePath = filePath.substring(2);
        }
        
        const structureSourcePath = path.resolve(structureConfigDir, filePath);
        
        Logger.log(`  📁 Resolving: ${structure.file} from ${structureConfigDir}`);
        Logger.log(`  📄 Full path: ${structureSourcePath}`);
        
        if (!existsSync(structureSourcePath)) {
          Logger.warn(`  ⚠️  Structure file not found: ${structureSourcePath}`);
          continue;
        }
        
        // Copy structure file to BP/structures/
        const structureFileName = `${structure.id}.mcstructure`;
        const structureDestPath = path.join(bpPath, 'structures', structureFileName);
        
        copyFileSync(structureSourcePath, structureDestPath);
        
        // Generate feature file
        const featurePath = path.join(bpPath, 'features', `${structure.id}_feature.json`);
        StructureGenerator.generateFeature(structure, featurePath);
        
        // Generate feature rule
        const featureRulePath = path.join(bpPath, 'feature_rules', `${structure.id}_placement.json`);
        StructureGenerator.generateFeatureRule(structure, featureRulePath);
        
        Logger.log(`  ✓ ${structure.id}.mcstructure + feature + rule`);
        count++;
      } catch (error) {
        Logger.error(`  ✗ Failed to generate structure ${structure.id}: ${error}`);
      }
    }
    
    return count;
  }
}
