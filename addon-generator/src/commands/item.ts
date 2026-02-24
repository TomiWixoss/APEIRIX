import { FileUtils } from '../utils/file.js';
import { RegistryUpdater } from '../utils/registry.js';
import { Validator } from '../utils/validator.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ItemOptions {
  id: string;
  name: string;
  texturePath: string;
  category?: string;
  stackSize?: number;
  projectRoot?: string;
}

export class ItemGenerator {
  private projectRoot: string;
  private registry: RegistryUpdater;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.registry = new RegistryUpdater(projectRoot);
  }

  generate(options: ItemOptions): void {
    // Validate
    if (!Validator.validateItemId(options.id)) {
      throw new Error(`❌ Item ID không hợp lệ: "${options.id}". Chỉ được dùng a-z, 0-9, underscore`);
    }

    if (!Validator.validateDisplayName(options.name)) {
      throw new Error(`❌ Display name không được rỗng`);
    }

    if (!Validator.validateTexturePath(options.texturePath)) {
      throw new Error(`❌ Texture file không tồn tại: "${options.texturePath}"`);
    }

    console.log(`\n🚀 Đang tạo empty item: ${options.id}...\n`);

    // 1. Tạo BP item JSON
    this.createBPItem(options);

    // 2. Copy texture vào RP
    this.copyTexture(options);

    // 3. Update item_texture.json
    this.registry.updateItemTexture(options.id, `textures/items/${options.id}`);

    // 4. Update en_US.lang (BP và RP)
    this.registry.updateLangFile(options.id, options.name, 'BP');
    this.registry.updateLangFile(options.id, options.name, 'RP');

    console.log(`\n✨ Hoàn thành! Item "${options.name}" đã được tạo đầy đủ.`);
    console.log(`\n📝 Các bước tiếp theo:`);
    console.log(`   1. Chạy: .\\build-and-deploy.ps1`);
    console.log(`   2. Test trong game với: /give @s apeirix:${options.id}\n`);
  }

  private createBPItem(options: ItemOptions): void {
    const templatePath = join(__dirname, '../templates/item/empty.json');
    const template = FileUtils.readJSON(templatePath);

    if (!template) {
      throw new Error('❌ Không tìm thấy template file');
    }

    // Replace template variables
    let jsonStr = JSON.stringify(template, null, 2);
    jsonStr = FileUtils.replaceTemplate(jsonStr, {
      id: options.id
    });

    const itemData = JSON.parse(jsonStr);

    // Apply options
    if (options.category) {
      itemData.minecraft_item.description.menu_category.category = options.category;
    }

    if (options.stackSize) {
      itemData.minecraft_item.components.minecraft_max_stack_size = options.stackSize;
    }

    // Write file
    const outputPath = join(this.projectRoot, `packs/BP/items/${options.id}.json`);
    FileUtils.writeJSON(outputPath, itemData);
    console.log(`✅ Đã tạo: packs/BP/items/${options.id}.json`);
  }

  private copyTexture(options: ItemOptions): void {
    const destPath = join(this.projectRoot, `packs/RP/textures/items/${options.id}.png`);
    FileUtils.copyFile(options.texturePath, destPath);
    console.log(`✅ Đã copy texture: packs/RP/textures/items/${options.id}.png`);
  }
}
