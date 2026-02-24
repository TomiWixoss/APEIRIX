#!/usr/bin/env node

import { Command } from 'commander';
import { registerItemCommands } from './cli/registerItemCommands.js';
import { registerBlockCommands } from './cli/registerBlockCommands.js';
import { registerOreCommands } from './cli/registerOreCommands.js';
import { registerToolCommands } from './cli/registerToolCommands.js';
import { registerArmorCommands } from './cli/registerArmorCommands.js';
import { registerRecipeCommands } from './cli/registerRecipeCommands.js';
import { registerUtilityCommands } from './cli/registerUtilityCommands.js';
import { showHelp } from './cli/showHelp.js';

const program = new Command();

program
  .name('apeirix')
  .description('CLI tool tự động sinh file JSON cho APEIRIX addon')
  .version('2.0.0');

// Register all commands
registerItemCommands(program);
registerBlockCommands(program);
registerOreCommands(program);
registerToolCommands(program);
registerArmorCommands(program);
registerRecipeCommands(program);
registerUtilityCommands(program);

// Parse arguments
program.parse();

// Show help if no arguments
if (!process.argv.slice(2).length) {
  showHelp();
}
