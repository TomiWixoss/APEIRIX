#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ItemGenerator } from './commands/item.js';
import { Validator } from './utils/validator.js';

const program = new Command();

program
  .name('apeirix')
  .description('CLI tool để tự động sinh file JSON cho APEIRIX addon')
  .version('1.0.0');

// Command: item
program
  .command('item')
  .description('Tạo empty item mới')
  .requiredOption('-i, --id <id>', 'Item ID (lowercase, underscore)')
  .requiredOption('-n, --name <name>', 'Display name (tiếng Việt)')
  .requiredOption('-t, --texture <path>', 'Đường dẫn đến texture PNG')
  .option('-c, --category <category>', 'Menu category', 'items')
  .option('-s, --stack-size <size>', 'Max stack size', '64')
  .option('-p, --project <path>', 'Project root path', process.cwd())
  .action((options) => {
    try {
      // Validate ngay lập tức
      const itemId = Validator.sanitizeItemId(options.id);
      
      if (!Validator.validateItemId(itemId)) {
        throw new Error(`Item ID không hợp lệ: "${options.id}". Chỉ được dùng a-z, 0-9, underscore`);
      }

      if (!Validator.validateDisplayName(options.name)) {
        throw new Error('Display name không được rỗng');
      }

      if (!Validator.validateTexturePath(options.texture)) {
        throw new Error(`Texture file không tồn tại hoặc không phải PNG: "${options.texture}"`);
      }

      // Generate item
      const generator = new ItemGenerator(options.project);
      generator.generate({
        id: itemId,
        name: options.name,
        texturePath: options.texture,
        category: options.category,
        stackSize: parseInt(options.stackSize)
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`\n❌ Lỗi: ${errorMessage}\n`));
      console.log(chalk.yellow('Sử dụng: apeirix item -i <id> -n <name> -t <texture> [options]\n'));
      process.exit(1);
    }
  });

program.parse();

// Show help if no command
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan('\n📚 APEIRIX Addon Generator\n'));
  console.log('Tạo empty item:');
  console.log(chalk.yellow('  apeirix item -i <id> -n <name> -t <texture> [options]\n'));
  console.log('Ví dụ:');
  console.log(chalk.gray('  apeirix item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png'));
  console.log(chalk.gray('  apeirix item -i rare_gem -n "Ngọc Quý" -t ./gem.png -c equipment -s 16\n'));
  console.log('Options:');
  console.log('  -i, --id <id>              Item ID (BẮT BUỘC)');
  console.log('  -n, --name <name>          Display name (BẮT BUỘC)');
  console.log('  -t, --texture <path>       Texture PNG path (BẮT BUỘC)');
  console.log('  -c, --category <category>  Menu category (default: items)');
  console.log('  -s, --stack-size <size>    Max stack size (default: 64)');
  console.log('  -p, --project <path>       Project root path (default: current dir)\n');
  console.log('Để xem chi tiết: apeirix item --help\n');
}
