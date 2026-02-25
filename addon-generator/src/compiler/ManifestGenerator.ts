import path from 'path';
import { readFileSync } from 'fs';
import { FileManager } from '../core/FileManager.js';
import { UUIDGenerator } from '../utils/UUIDGenerator.js';

export interface AddonMetadata {
  name: string;
  description: string;
  version: [number, number, number];
  minEngineVersion: [number, number, number];
  author?: string;
  uuids: {
    bp?: string;
    rp?: string;
  };
  icons?: {
    bp?: string;
    rp?: string;
  };
}

/**
 * Generate manifest.json files for BP and RP
 */
export class ManifestGenerator {
  /**
   * Generate BP manifest
   */
  static generateBP(metadata: AddonMetadata, uuids: { bp: string; rp: string; bpModule: string; bpScript: string; rpModule: string }, outputDir: string): void {
    const templatePath = path.join(__dirname, '../templates/bp-manifest.json');
    const template = readFileSync(templatePath, 'utf-8');

    // Thêm version vào tên pack
    const versionString = metadata.version.join('.');
    const packName = `${metadata.name} v${versionString}`;

    const manifest = template
      .replace('{{name}}', packName)
      .replace('{{description}}', metadata.description)
      .replace('{{uuid}}', uuids.bp)
      .replace('{{moduleUuid}}', uuids.bpModule)
      .replace('{{scriptUuid}}', uuids.bpScript)
      .replace('{{rpUuid}}', uuids.rp)
      .replace('{{author}}', metadata.author || 'APEIRIX Team');

    // Parse and update version
    const manifestObj = JSON.parse(manifest);
    manifestObj.header.version = metadata.version;
    manifestObj.header.min_engine_version = metadata.minEngineVersion;
    manifestObj.modules[0].version = metadata.version;
    manifestObj.modules[1].version = metadata.version;
    manifestObj.dependencies[2].version = metadata.version;

    const manifestPath = path.join(outputDir, 'BP', 'manifest.json');
    FileManager.writeJSON(manifestPath, manifestObj);

    console.log(`✓ Generated BP manifest: ${manifestPath}`);
  }

  /**
   * Generate RP manifest
   */
  static generateRP(metadata: AddonMetadata, uuids: { bp: string; rp: string; bpModule: string; bpScript: string; rpModule: string }, outputDir: string): void {
    const templatePath = path.join(__dirname, '../templates/rp-manifest.json');
    const template = readFileSync(templatePath, 'utf-8');

    // Thêm version vào tên pack
    const versionString = metadata.version.join('.');
    const packName = `${metadata.name} v${versionString}`;

    const manifest = template
      .replace('{{name}}', packName)
      .replace('{{description}}', metadata.description)
      .replace('{{uuid}}', uuids.rp)
      .replace('{{moduleUuid}}', uuids.rpModule)
      .replace('{{bpUuid}}', uuids.bp)
      .replace('{{author}}', metadata.author || 'APEIRIX Team');

    // Parse and update version
    const manifestObj = JSON.parse(manifest);
    manifestObj.header.version = metadata.version;
    manifestObj.header.min_engine_version = metadata.minEngineVersion;
    manifestObj.modules[0].version = metadata.version;
    manifestObj.dependencies[0].version = metadata.version;

    const manifestPath = path.join(outputDir, 'RP', 'manifest.json');
    FileManager.writeJSON(manifestPath, manifestObj);

    console.log(`✓ Generated RP manifest: ${manifestPath}`);
  }
}
