import { Command } from 'commander';
import chalk from 'chalk';
import { ItemCommand } from '../commands/ItemCommand.js';

export function registerItemCommands(program: Command): void {
  program
    .command('item')
    .description('Tạo item mới (có thể kèm recipes)')
    .requiredOption('-i, --id <id>', 'Item ID')
    .requiredOption('-n, --name <name>', 'Display name')
    .requiredOption('-t, --texture <path>', 'Texture PNG')
    .option('-c, --category <category>', 'Menu category', 'items')
    .option('-s, --stack-size <size>', 'Max stack size', '64')
    .option('-p, --project <path>', 'Project root', process.cwd())
    .option('--dry-run', 'Preview changes without creating files')
    .option('--recipe-shaped <json>', 'Tạo shaped recipe (JSON: {id,pattern,key,result,resultCount?,unlock?})')
    .option('--recipe-shapeless <json>', 'Tạo shapeless recipe (JSON: {id,ingredients,result,resultCount?,unlock?})')
    .option('--recipe-smelting <json>', 'Tạo smelting recipe (JSON: {id,input,output,tags?})')
    .action((options) => {
      try {
        const command = new ItemCommand();
        command.execute(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
