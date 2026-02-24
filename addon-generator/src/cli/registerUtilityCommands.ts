import { Command } from 'commander';
import chalk from 'chalk';
import { BatchCommand } from '../commands/BatchCommand.js';
import { HistoryManager } from '../core/HistoryManager.js';
import { DEFAULT_PROJECT_ROOT } from './constants.js';

export function registerUtilityCommands(program: Command): void {
  // Batch command
  program
    .command('batch')
    .description('Tạo nhiều content từ config file (YAML/JSON)')
    .requiredOption('-f, --file <path>', 'Config file path')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .option('--dry-run', 'Preview changes without creating files')
    .action((options) => {
      try {
        const command = new BatchCommand();
        command.execute(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });

  // Undo command
  program
    .command('undo')
    .description('Hoàn tác operation cuối cùng')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .action((options) => {
      try {
        const history = new HistoryManager(options.project);
        history.undo();
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });

  // History command
  program
    .command('history')
    .description('Xem lịch sử operations')
    .option('-l, --limit <number>', 'Số lượng entries hiển thị', '10')
    .option('--clear', 'Xóa toàn bộ lịch sử')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .action((options) => {
      try {
        const history = new HistoryManager(options.project);
        if (options.clear) {
          history.clearHistory();
        } else {
          history.showHistory(parseInt(options.limit));
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
