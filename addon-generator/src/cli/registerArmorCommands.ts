import { Command } from 'commander';
import { DEFAULT_PROJECT_ROOT } from './constants.js';
import chalk from 'chalk';
import { ArmorCommand } from '../commands/ArmorCommand.js';

export function registerArmorCommands(program: Command): void {
  program
    .command('armor')
    .description('Tạo full armor set (4 pieces, KHÔNG tạo recipes)')
    .requiredOption('--base-name <name>', 'Base name (e.g., bronze)')
    .requiredOption('--display-name <name>', 'Display name prefix (e.g., "Giáp Đồng")')
    .requiredOption('--material <id>', 'Material ID (for repair)')
    .requiredOption('--icons <path>', 'Icon textures folder')
    .requiredOption('--layer1 <path>', 'Armor layer 1 texture PNG')
    .requiredOption('--layer2 <path>', 'Armor layer 2 texture PNG')
    .option('--durability-multiplier <value>', 'Durability multiplier', '1')
    .option('--protection-multiplier <value>', 'Protection multiplier', '1')
    .option('--enchantability <value>', 'Enchantability', '18')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .option('--dry-run', 'Preview changes without creating files')
    .action((options) => {
      try {
        const command = new ArmorCommand();
        command.execute(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
