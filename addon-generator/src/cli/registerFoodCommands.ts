import { Command } from 'commander';
import { DEFAULT_PROJECT_ROOT } from './constants.js';
import { FoodCommand } from '../commands/FoodCommand.js';

export function registerFoodCommands(program: Command): void {
  program
    .command('food')
    .description('Tạo food item')
    .requiredOption('-i, --id <id>', 'Food ID (vd: apple_pie)')
    .requiredOption('-n, --name <name>', 'Display name (vd: "Bánh Táo")')
    .requiredOption('-t, --texture <path>', 'Đường dẫn texture')
    .option('--nutrition <number>', 'Nutrition value (default: 4)')
    .option('--saturation <number>', 'Saturation modifier (default: 1)')
    .option('--use-duration <number>', 'Use duration in seconds (default: 1.6)')
    .option('--can-always-eat', 'Có thể ăn khi đã no')
    .option('-c, --category <category>', 'Menu category (nature/equipment/items/construction)')
    .option('-p, --project <path>', 'Đường dẫn project root', DEFAULT_PROJECT_ROOT)
    .option('--dry-run', 'Preview changes without writing files')
    .action((options) => {
      try {
        new FoodCommand().execute(options);
      } catch (error: any) {
        console.error(`\n❌ Lỗi: ${error.message}\n`);
        process.exit(1);
      }
    });
}
