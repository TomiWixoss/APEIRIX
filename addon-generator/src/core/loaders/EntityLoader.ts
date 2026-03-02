import { join } from 'path';
import { readdirSync, statSync } from 'fs';
import { FileManager } from '../FileManager.js';
import { Logger } from '../../utils/Logger.js';
import * as yaml from 'js-yaml';

export interface EntityConfig {
  id: string;
  attributes?: Array<{
    id: string;
    config?: any;
    probability?: number; // 0-100, default 100
  }>;
}

export interface EntityAttributeData {
  entityId: string;
  attributes: Array<{
    id: string;
    config: any;
    probability: number; // 0-100
  }>;
}

/**
 * EntityLoader - Load entity configs with attributes
 * Scans configs/entities/ and configs/entities/vanilla_overrides/
 */
export class EntityLoader {
  private configDir: string;

  /**
   * @param configDir Path to configs directory (e.g., "addon-generator/configs")
   */
  constructor(configDir: string) {
    this.configDir = configDir;
  }

  /**
   * Load entity attributes from configs
   * Returns array of entities that have attributes defined
   */
  loadEntityAttributes(): EntityAttributeData[] {
    const result: EntityAttributeData[] = [];
    
    const entitiesPath = join(this.configDir, 'entities');
    Logger.log(`[EntityLoader] Scanning: ${entitiesPath}`);
    
    // Load from entities/ folder (if exists)
    if (FileManager.exists(entitiesPath)) {
      const entities = this.loadFromDirectory(entitiesPath);
      result.push(...entities);
    } else {
      Logger.warn(`[EntityLoader] Path not found: ${entitiesPath}`);
    }
    
    // Load from entities/vanilla_overrides/ folder (if exists)
    const vanillaOverridesPath = join(entitiesPath, 'vanilla_overrides');
    Logger.log(`[EntityLoader] Scanning: ${vanillaOverridesPath}`);
    if (FileManager.exists(vanillaOverridesPath)) {
      const vanillaEntities = this.loadFromDirectory(vanillaOverridesPath);
      result.push(...vanillaEntities);
    } else {
      Logger.warn(`[EntityLoader] Path not found: ${vanillaOverridesPath}`);
    }
    
    if (result.length > 0) {
      Logger.log(`📦 Loaded ${result.length} entities with attributes`);
    }
    
    return result;
  }

  /**
   * Load entity configs from a directory
   */
  private loadFromDirectory(dirPath: string): EntityAttributeData[] {
    const result: EntityAttributeData[] = [];
    
    try {
      const files = readdirSync(dirPath);
      
      for (const file of files) {
        // Skip non-YAML files
        if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
        
        const filePath = join(dirPath, file);
        
        // Skip directories
        const stat = statSync(filePath);
        if (stat.isDirectory()) continue;
        
        // Read and parse YAML
        const content = FileManager.readText(filePath);
        if (!content) continue;
        
        try {
          const config = yaml.load(content) as EntityConfig;
          
          // Only include entities with attributes
          if (config.attributes && config.attributes.length > 0) {
            result.push({
              entityId: config.id,
              attributes: config.attributes.map(attr => ({
                id: attr.id,
                config: attr.config || {},
                probability: attr.probability ?? 100 // Default 100%
              }))
            });
            
            Logger.log(`  ✓ ${config.id}: ${config.attributes.length} attribute(s)`);
          }
        } catch (parseError) {
          Logger.warn(`⚠️  Failed to parse ${file}: ${parseError}`);
        }
      }
    } catch (error) {
      Logger.warn(`⚠️  Failed to load entities from ${dirPath}: ${error}`);
    }
    
    return result;
  }
}
