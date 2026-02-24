import { Command } from 'commander';
import { DEFAULT_PROJECT_ROOT } from './constants.js';
import chalk from 'chalk';
import { OreCommand } from '../commands/OreCommand.js';

export function registerOreCommands(program: Command): void {
  program
    .command('ore')
    .description('Tạo ore mới (với world generation)')
    .requiredOption('-i, --id <id>', 'Ore ID')
    .requiredOption('-n, --name <name>', 'Display name')
    .requiredOption('-t, --texture <path>', 'Ore texture PNG')
    .requiredOption('--raw-item <id>', 'Raw item ID (drops from ore)')
    .option('--deepslate-texture <path>', 'Deepslate ore texture PNG')
    .option('--min-y <y>', 'Min Y level', '0')
    .option('--max-y <y>', 'Max Y level', '64')
    .option('--vein-size <size>', 'Vein size', '9')
    .option('--veins-per-chunk <count>', 'Veins per chunk', '20')
    .option('--tool-tier <tier>', 'Minimum tool tier', 'stone')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .option('--dry-run', 'Preview changes without creating files')
    .action((options) => {
      try {
        const command = new OreCommand();
        command.execute(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
