#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ItemCommand } from './commands/ItemCommand.js';
import { RecipeCommand } from './commands/RecipeCommand.js';

const program = new Command();

program
  .name('apeirix')
  .description('CLI tool tự động sinh file JSON cho APEIRIX addon')
  .version('1.0.0');

// Command: item
program
  .command('item')
  .description('Tạo item mới (có thể kèm recipes)')
  .requiredOption('-i, --id <id>', 'Item ID')
  .requiredOption('-n, --name <name>', 'Display name')
  .requiredOption('-t, --texture <path>', 'Texture PNG')
  .option('-c, --category <category>', 'Menu category', 'items')
  .option('-s, --stack-size <size>', 'Max stack size', '64')
  .option('-p, --project <path>', 'Project root', process.cwd())
  // Recipe options
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

// Command: recipe shaped
program
  .command('recipe:shaped')
  .description('Tạo shaped recipe (có pattern)')
  .requiredOption('--id <id>', 'Recipe ID')
  .requiredOption('--pattern <pattern>', 'Pattern (JSON array: ["###","# #","###"])')
  .requiredOption('--key <key>', 'Key mapping (JSON: {"#":"item_id"})')
  .requiredOption('--result <item>', 'Result item ID')
  .option('--result-count <count>', 'Result count', '1')
  .option('--unlock <items>', 'Unlock items (comma separated)')
  .option('-p, --project <path>', 'Project root', process.cwd())
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

// Command: recipe shapeless
program
  .command('recipe:shapeless')
  .description('Tạo shapeless recipe')
  .requiredOption('--id <id>', 'Recipe ID')
  .requiredOption('--ingredients <items>', 'Ingredients (comma separated)')
  .requiredOption('--result <item>', 'Result item ID')
  .option('--result-count <count>', 'Result count', '1')
  .option('--unlock <items>', 'Unlock items (comma separated)')
  .option('-p, --project <path>', 'Project root', process.cwd())
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

// Command: recipe smelting
program
  .command('recipe:smelting')
  .description('Tạo smelting recipe')
  .requiredOption('--id <id>', 'Recipe ID')
  .requiredOption('--input <item>', 'Input item ID')
  .requiredOption('--output <item>', 'Output item ID')
  .option('--tags <tags>', 'Tags (comma separated)', 'furnace,blast_furnace')
  .option('-p, --project <path>', 'Project root', process.cwd())
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

program.parse();

if (!process.argv.slice(2).length) {
  console.log(chalk.cyan('\n📚 APEIRIX Addon Generator\n'));
  console.log('Commands:');
  console.log(chalk.yellow('  apeirix item -i <id> -n <name> -t <texture>'));
  console.log(chalk.yellow('  apeirix recipe:shaped --id <id> --pattern <json> --key <json> --result <item>'));
  console.log(chalk.yellow('  apeirix recipe:shapeless --id <id> --ingredients <items> --result <item>'));
  console.log(chalk.yellow('  apeirix recipe:smelting --id <id> --input <item> --output <item>\n'));
  console.log('Ví dụ:');
  console.log(chalk.gray('  apeirix item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png'));
  console.log(chalk.gray('  apeirix recipe:shaped --id ingot_from_nuggets --pattern \'["###","###","###"]\' --key \'{"#":"nugget"}\' --result ingot --unlock nugget'));
  console.log(chalk.gray('  apeirix recipe:shapeless --id nugget_from_ingot --ingredients ingot --result nugget --result-count 9 --unlock ingot'));
  console.log(chalk.gray('  apeirix recipe:smelting --id ingot_from_ore --input raw_ore --output ingot\n'));
}
