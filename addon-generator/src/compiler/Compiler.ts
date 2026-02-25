import path from 'path';
import { existsSync, rmSync } from 'fs';
import { ConfigLoader } from '../core/ConfigLoader.js';
import { Validator } from '../core/Validator.js';
import { ManifestGenerator, AddonMetadata } from './ManifestGenerator.js';
import { BPCompiler } from './BPCompiler.js';
import { RPCompiler } from './RPCompiler.js';
import { AssetCopier } from './AssetCopier.js';
import { UUIDGenerator } from '../utils/UUIDGenerator.js';

export interface CompileOptions {
  config?: string;
  output?: string;
  clean?: boolean;
  verbose?: boolean;
}

export interface AddonConfig {
  addon: AddonMetadata & {
    language?: string; // Language setting for lang system
  };
  items?: any[];
  blocks?: any[];
  ores?: any[];
  recipes?: any[];
  armor?: any[];
  tools?: any[];
  foods?: any[];
  icons?: {
    bp?: string;
    rp?: string;
  };
  generateBulkRecipeTest?: boolean | string;
}

/**
 * Main Compiler - Orchestrates entire compilation process
 */
export class Compiler {
  private configPath: string;
  private outputDir: string;
  private verbose: boolean;

  constructor(options: CompileOptions = {}) {
    this.configPath = options.config || 'configs/addon.yaml';
    this.outputDir = options.output || 'build';
    this.verbose = options.verbose || false;
  }

  /**
   * Main compile method
   */
  async compile(options: CompileOptions = {}): Promise<void> {
    const startTime = Date.now();

    try {
      console.log('🚀 APEIRIX Addon Compiler\n');
      console.log(`📄 Config: ${this.configPath}`);
      console.log(`📁 Output: ${this.outputDir}\n`);

      // 1. Load config
      const config = await this.loadConfig();

      // 2. Validate config
      this.validateConfig(config);

      // 3. Clean output (if requested)
      if (options.clean) {
        this.cleanOutput();
      }

      // 4. Generate manifests
      await this.generateManifests(config);

      // Get config directory for lang resolution
      const configDir = path.dirname(path.resolve(this.configPath));

      // 5. Compile BP (pass configDir)
      await BPCompiler.compile(config, this.outputDir, configDir);

      // 6. Compile RP (pass configDir)
      await RPCompiler.compile(config, this.outputDir, configDir);

      // 7. Copy assets
      await AssetCopier.copy({
        configPath: this.configPath,
        icons: config.addon?.icons,
        items: config.items,
        blocks: config.blocks,
        tools: config.tools,
        foods: config.foods,
        ores: config.ores,
        armor: config.armor
      }, this.outputDir);

      // 8. Print summary
      this.printSummary(startTime);

    } catch (error) {
      console.error('\n❌ Compilation failed:', error);
      throw error;
    }
  }

  /**
   * Load and merge config files
   */
  private async loadConfig(): Promise<AddonConfig> {
    console.log('📖 Loading configuration...');

    if (!existsSync(this.configPath)) {
      throw new Error(`Config file not found: ${this.configPath}`);
    }

    const config = ConfigLoader.load(this.configPath);
    console.log('✓ Configuration loaded\n');

    return config as AddonConfig;
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: AddonConfig): void {
    console.log('🔍 Validating configuration...');

    // Basic validation
    if (!config.addon) {
      throw new Error('Missing "addon" section in config');
    }

    if (!config.addon.name) {
      throw new Error('Missing addon name');
    }

    if (!config.addon.description) {
      throw new Error('Missing addon description');
    }

    // Validate item IDs
    if (config.items) {
      for (const item of config.items) {
        if (!item.id) {
          throw new Error('Item missing ID');
        }
        if (!Validator.validateItemId(item.id)) {
          throw new Error(`Invalid item ID: ${item.id}`);
        }
      }
    }

    // Validate block IDs
    if (config.blocks) {
      for (const block of config.blocks) {
        if (!block.id) {
          throw new Error('Block missing ID');
        }
        if (!Validator.validateItemId(block.id)) {
          throw new Error(`Invalid block ID: ${block.id}`);
        }
      }
    }

    console.log('✓ Configuration valid\n');
  }

  /**
   * Clean output directory
   */
  private cleanOutput(): void {
    console.log('🧹 Cleaning output directory...');

    if (existsSync(this.outputDir)) {
      rmSync(this.outputDir, { recursive: true, force: true });
      console.log('✓ Output directory cleaned\n');
    }
  }

  /**
   * Generate manifest files
   */
  private async generateManifests(config: AddonConfig): Promise<void> {
    console.log('📋 Generating manifests...');

    const metadata: AddonMetadata = {
      name: config.addon.name,
      description: config.addon.description,
      version: config.addon.version || [1, 0, 0],
      minEngineVersion: config.addon.minEngineVersion || [1, 21, 0],
      author: config.addon.author,
      uuids: config.addon.uuids || {}
    };

    // Get UUIDs dựa trên version (cache nếu version giống, generate mới nếu khác)
    const uuids = UUIDGenerator.getUUIDsForVersion(metadata.version);
    
    // Generate manifests với UUIDs đã cache
    ManifestGenerator.generateBP(metadata, uuids, this.outputDir);
    ManifestGenerator.generateRP(metadata, uuids, this.outputDir);

    console.log('✓ Manifests generated\n');
  }

  /**
   * Print build summary
   */
  private printSummary(startTime: number): void {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Compilation completed successfully!');
    console.log('='.repeat(50));
    console.log(`\n📦 Output: ${path.resolve(this.outputDir)}`);
    console.log(`⏱️  Build time: ${duration}s`);
    console.log('\n📋 Next steps:');
    console.log('   1. Run: regolith run');
    console.log('   2. Test in game with /reload\n');
  }
}
