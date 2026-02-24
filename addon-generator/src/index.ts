#!/usr/bin/env node

import { Command } from 'commander';
import { Compiler } from './compiler/Compiler.js';

const program = new Command();

program
  .name('apeirix-compiler')
  .description('APEIRIX Addon Compiler - Compile YAML configs to Minecraft Bedrock addon')
  .version('2.0.0');

// Compile command
program
  .command('compile')
  .description('Compile YAML config to addon')
  .option('-c, --config <path>', 'Path to config file', 'configs/addon.yaml')
  .option('-o, --output <path>', 'Output directory', 'build')
  .option('--clean', 'Clean output directory before compile', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    try {
      const compiler = new Compiler(options);
      await compiler.compile(options);
    } catch (error) {
      console.error('Compilation failed:', error);
      process.exit(1);
    }
  });

// Parse arguments
program.parse();

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.help();
}
