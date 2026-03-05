import { FileManager } from '../core/FileManager.js';
import { join, dirname } from 'path';
import { langLoader } from '../core/loaders/LangLoader.js';
import { Logger } from '../utils/Logger.js';

/**
 * Generator cho Language files - supports vi_VN and en_US
 */
export class LangGenerator {
  private language: string;

  constructor(private projectRoot: string, private configDir: string = '', language: string = 'en_US') {
    this.language = language;
  }

  /**
   * Resolve display name from lang key or return as-is
   * @param nameOrKey - Either "lang:materials.tin_ingot" or "Thỏi Thiếc"
   */
  resolveName(nameOrKey: string): string {
    if (nameOrKey.startsWith('lang:')) {
      const langKey = nameOrKey.substring(5); // Remove "lang:" prefix
      return langLoader.get(langKey, this.configDir, nameOrKey);
    }
    return nameOrKey;
  }

  updateLangFile(itemId: string, displayName: string, packType: 'BP' | 'RP', prefix: 'item' | 'tile' = 'item'): void {
    const filePath = join(this.projectRoot, `texts/${this.language}.lang`);
    const lines = FileManager.readLines(filePath);
    
    const langKey = `${prefix}.apeirix.${itemId}.name=${displayName}`;
    
    if (!lines.some(line => line.startsWith(`${prefix}.apeirix.${itemId}.name=`))) {
      // Tìm vị trí insert sau ## Items hoặc ## Blocks
      const sectionName = prefix === 'item' ? '## Items' : '## Blocks';
      let insertIndex = lines.length;
      const sectionIndex = lines.findIndex(line => line.includes(sectionName));
      
      if (sectionIndex !== -1) {
        for (let i = sectionIndex + 1; i < lines.length; i++) {
          if (lines[i].trim() === '' || lines[i].startsWith('##')) {
            insertIndex = i;
            break;
          }
        }
      }
      
      lines.splice(insertIndex, 0, langKey);
      FileManager.writeLines(filePath, lines);
      Logger.log(`✅ Đã thêm "${displayName}" vào ${packType}/texts/${this.language}.lang`);
    } else {
      Logger.log(`⚠️  ${prefix === 'item' ? 'Item' : 'Block'} "${itemId}" đã tồn tại trong ${packType}/texts/${this.language}.lang`);
    }
  }

  /**
   * Generate complete lang file from entries
   */
  generate(entries: Record<string, string>, packType: 'BP' | 'RP', packName?: string, packDescription?: string, version?: [number, number, number]): void {
    const filePath = join(this.projectRoot, `texts/${this.language}.lang`);
    const lines: string[] = [];

    // Header
    lines.push(`## APEIRIX Addon - Language File (${packType})`);
    lines.push('');

    // Pack metadata section (if provided)
    if (packName || packDescription) {
      lines.push('## Pack Metadata');
      if (packName) {
        // Add version and pack type suffix
        let fullPackName = packName;
        if (version) {
          const versionString = version.join('.');
          fullPackName = `${packName} v${versionString}`;
        }
        fullPackName = `${fullPackName} [${packType}]`;
        lines.push(`pack.name=${fullPackName}`);
      }
      if (packDescription) {
        lines.push(`pack.description=${packDescription}`);
      }
      lines.push('');
    }

    // Separate items and blocks
    const itemEntries: string[] = [];
    const blockEntries: string[] = [];

    for (const [key, value] of Object.entries(entries)) {
      if (key.startsWith('item.')) {
        itemEntries.push(`${key}=${value}`);
      } else if (key.startsWith('tile.')) {
        blockEntries.push(`${key}=${value}`);
      }
    }

    // Items section
    if (itemEntries.length > 0) {
      lines.push('## Items');
      lines.push(...itemEntries);
      lines.push('');
    }

    // Blocks section
    if (blockEntries.length > 0) {
      lines.push('## Blocks');
      lines.push(...blockEntries);
      lines.push('');
    }

    FileManager.writeLines(filePath, lines);
    Logger.log(`✅ Đã tạo ${packType}/texts/${this.language}.lang với ${Object.keys(entries).length} entries`);
  }

  /**
   * Generate languages.json
   */
  generateLanguagesJson(packType: 'BP' | 'RP'): void {
    const filePath = join(this.projectRoot, `texts/languages.json`);
    const languages = [this.language];
    FileManager.writeJSON(filePath, languages);
  }
}
