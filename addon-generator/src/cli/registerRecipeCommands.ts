import { Command } from 'commander';
import chalk from 'chalk';
import { RecipeCommand } from '../commands/RecipeCommand.js';
import { DEFAULT_PROJECT_ROOT } from './constants.js';

export function registerRecipeCommands(program: Command): void {
  // Shaped recipe
  program
    .command('recipe:shaped')
    .description('Tạo shaped recipe (có pattern)')
    .requiredOption('--id <id>', 'Recipe ID')
    .requiredOption('--pattern <pattern>', 'Pattern (JSON array: ["###","# #","###"])')
    .requiredOption('--key <key>', 'Key mapping (JSON: {"#":"item_id"})')
    .requiredOption('--result <item>', 'Result item ID')
    .option('--result-count <count>', 'Result count', '1')
    .option('--unlock <items>', 'Unlock items (comma separated)')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .action((options) => {
      try {
        const command = new RecipeCommand();
        command.executeShaped(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });

  // Shapeless recipe
  program
    .command('recipe:shapeless')
    .description('Tạo shapeless recipe')
    .requiredOption('--id <id>', 'Recipe ID')
    .requiredOption('--ingredients <items>', 'Ingredients (comma separated)')
    .requiredOption('--result <item>', 'Result item ID')
    .option('--result-count <count>', 'Result count', '1')
    .option('--unlock <items>', 'Unlock items (comma separated)')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .action((options) => {
      try {
        const command = new RecipeCommand();
        command.executeShapeless(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });

  // Smelting recipe
  program
    .command('recipe:smelting')
    .description('Tạo smelting recipe')
    .requiredOption('--id <id>', 'Recipe ID')
    .requiredOption('--input <item>', 'Input item ID')
    .requiredOption('--output <item>', 'Output item ID')
    .option('--tags <tags>', 'Tags (comma separated)', 'furnace,blast_furnace')
    .option('-p, --project <path>', 'Project root', DEFAULT_PROJECT_ROOT)
    .action((options) => {
      try {
        const command = new RecipeCommand();
        command.executeSmelting(options);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`\n❌ ${msg}\n`));
        process.exit(1);
      }
    });
}
