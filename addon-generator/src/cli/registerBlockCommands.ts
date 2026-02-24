import { Command } from 'commander';
import chalk from 'chalk';
import { BlockCommand } from '../commands/BlockCommand.js';

export function registerBlockCommands(program: Command): void {
  program
    .command('block')
    .description('Tạo block mới')
    .requiredOption('-i, --id <id>', 'Block ID')
    .requiredOption('-n, --name <name>', 'Display name')
    .requiredOption('-t, --texture <path>', 'Texture PNG')
    .option('-c, --category <category>', 'Menu category', 'construction')
    .option('--destroy-time <time>', 'Destroy time', '16.65')
    .option('--explosion-resistance <value>', 'Explosion resistance', '6.0')
    .option('--requires-tool', 'Requires tool to mine')
    .option('--tool-tier <tier>', 'Minimum tool tier (stone/copper/iron/diamond/netherite)', 'stone')
    .option('-p, --project <path>', 'Project root', process.cwd())
    .option('--dry-run', 'Preview changes without creating files')
    .action((options) => {
      try {
        const command = new BlockCommand();
        command.execute(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
