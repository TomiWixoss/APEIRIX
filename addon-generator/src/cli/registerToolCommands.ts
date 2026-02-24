import { Command } from 'commander';
import chalk from 'chalk';
import { ToolCommand } from '../commands/ToolCommand.js';

export function registerToolCommands(program: Command): void {
  const toolTypes = ['pickaxe', 'axe', 'shovel', 'hoe', 'sword'];
  
  toolTypes.forEach(type => {
    program
      .command(`tool:${type}`)
      .description(`Tạo ${type} mới (KHÔNG tạo recipe)`)
      .requiredOption('-i, --id <id>', `${type} ID`)
      .requiredOption('-n, --name <name>', 'Display name')
      .requiredOption('-t, --texture <path>', 'Texture PNG')
      .requiredOption('--material <id>', 'Material ID (for repair)')
      .option('--durability <value>', 'Durability', '250')
      .option('--damage <value>', 'Damage')
      .option('--efficiency <value>', 'Efficiency', '6')
      .option('--enchantability <value>', 'Enchantability', '14')
      .option('-p, --project <path>', 'Project root', process.cwd())
      .option('--dry-run', 'Preview changes without creating files')
      .action((options) => {
        try {
          const command = new ToolCommand();
          command.execute({ ...options, type });
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error(chalk.red(`\n❌ ${msg}\n`));
          process.exit(1);
        }
      });
  });
}
