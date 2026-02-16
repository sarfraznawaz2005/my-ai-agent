#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add';
import { editCommand } from './commands/edit';
import { deleteCommand } from './commands/delete';
import { viewCommand } from './commands/view';
import { listCommand } from './commands/list';
import { findCommand } from './commands/find';
import { checkCommand } from './commands/check';
import { runCommand } from './commands/run';
import { defaultCommand } from './commands/default';
import { exportCommand } from './commands/export';
import { importCommand } from './commands/import';
import { enableCommand } from './commands/enable';
import { disableCommand } from './commands/disable';
import { onboardCommand } from './commands/onboard';

const { version } = require('../package.json');

const program = new Command();

program
    .name('agent')
    .description('A CLI-based app for inference from popular AI CLI tools')
    .version(version)
    .option('-f, --file <file-path>', 'Read prompt from file')
    .option('--no-autocheck', 'Skip automatic fallback if best tool fails')
    .option('--no-notify', 'Disable desktop notification when done');

// Add examples to the help
program.addHelpText('after', `
Examples:
  $ agent "What is the weather today?"
  $ agent What is the weather today?
  $ agent --file ./path/to/prompt.txt
  $ agent --file ./my-prompt.md
  $ agent "Explain quantum computing" --no-autocheck
  $ agent "Explain this code" --no-notify
  $ agent --file ./prompt.txt --no-autocheck
`);

// Add command
program
    .command('add')
    .description('Add a new tool')
    .option('-n, --name <name>', 'Tool name')
    .option('-c, --command <command>', 'Tool command')
    .option('-d, --description <description>', 'Tool description')
    .action(addCommand);

// Edit command
program
    .command('edit [tool-name]')
    .description('Edit an existing tool')
    .option('-t, --tool-name <name>', 'Tool to edit (alternative to positional arg)')
    .option('-n, --name <name>', 'New tool name')
    .option('-c, --command <command>', 'New tool command')
    .option('-d, --description <description>', 'New tool description')
    .action(editCommand);

// Delete command
program
    .command('delete [tool-name]')
    .description('Delete tools (interactive selection if no tool specified)')
    .option('-t, --tool-name <name>', 'Tool to delete (alternative to positional arg)')
    .option('-y, --yes', 'Skip confirmation')
    .action(deleteCommand);

// View command
program
    .command('view <tool-name>')
    .description('View detailed information about a tool')
    .action(viewCommand);

// List command
program
    .command('list')
    .description('List all tools')
    .action(listCommand);

// Find command
program
    .command('find <query>')
    .description('Search for tools by name or description')
    .action(findCommand);

// Check command
program
    .command('check')
    .description('Run all tools to benchmark and verify functionality')
    .option('--debug', 'Show debug information including commands being executed')
    .option('--include-disabled', 'Include disabled tools in the benchmark')
    .action(checkCommand);

// Run command
program
    .command('run <tool-name> [prompt]')
    .description('Run a specific tool with an optional prompt')
    .option('--debug', 'Show debug information including the actual command being executed')
    .action(runCommand);

// Export command
program
    .command('export [path]')
    .description('Export configuration to a file')
    .action(exportCommand);

// Import command
program
    .command('import <path>')
    .description('Import configuration from a file')
    .action(importCommand);

// Enable command
program
    .command('enable <tool-name>')
    .description('Enable a tool')
    .action(enableCommand);

// Disable command
program
    .command('disable <tool-name>')
    .description('Disable a tool')
    .action(disableCommand);

// Onboard command
program
    .command('onboard')
    .description('Display comprehensive onboarding guide for AI agents')
    .action(onboardCommand);

// Handle commands and default prompt
const args = process.argv.slice(2);
const commands = ['add', 'edit', 'delete', 'view', 'list', 'find', 'check', 'run', 'export', 'import', 'enable', 'disable', 'onboard'];

// Check for global flags first
if (args.includes('--version') || args.includes('-V')) {
    console.log(version);
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
    program.outputHelp();
    process.exit(0);
}

// Check if first argument is a known command
if (args.length > 0 && commands.includes(args[0])) {
    // It's a known command, let Commander handle it normally
    program.parse(process.argv);
} else {
    // Parse with Commander to get options
    program.parseOptions(args);
    const opts = program.opts();

    // Manually extract remaining args after options are processed
    let remainingArgs = [...args];
    if (opts.file) {
        // Remove --file and its value
        const fileIndex = remainingArgs.indexOf('--file');
        if (fileIndex !== -1) {
            remainingArgs.splice(fileIndex, 2); // Remove --file and the next value
        } else {
            const fIndex = remainingArgs.indexOf('-f');
            if (fIndex !== -1) {
                remainingArgs.splice(fIndex, 2); // Remove -f and the next value
            }
        }
    }

    if (remainingArgs.includes('--no-autocheck')) {
        remainingArgs = remainingArgs.filter(arg => arg !== '--no-autocheck');
    }

    if (remainingArgs.includes('--no-notify')) {
        remainingArgs = remainingArgs.filter(arg => arg !== '--no-notify');
    }

    // Commander stores --no-<x> options as opts.<x> (boolean, false when flag is passed)
    let autocheck = opts.autocheck !== false;
    let notify = opts.notify !== false;
    let prompt = '';

    if (opts.file) {
        // Read prompt from file
        const fs = require('fs');
        const path = require('path');

        if (!fs.existsSync(opts.file)) {
            console.error(`Error: File does not exist: ${opts.file}`);
            process.exit(1);
        }

        if (!fs.statSync(opts.file).isFile()) {
            console.error(`Error: Path is not a file: ${opts.file}`);
            process.exit(1);
        }

        prompt = fs.readFileSync(opts.file, 'utf-8');
        console.log(require('chalk').gray(`Reading prompt from file: ${opts.file}`));

        // Convert multi-line content to single line with literal \n to preserve line breaks for AI
        const singleLinePrompt = prompt.replace(/\n/g, '\\n').trim();

        // Add context to help AI understand it's processing file content
        prompt = `Instructions: ${singleLinePrompt}. Please follow these instructions exactly.`;
    } else {
        // Use prompt from command line arguments
        if (remainingArgs.length === 0) {
            program.outputHelp();
            process.exit(0);
        }

        prompt = remainingArgs.join(' ');
    }

    defaultCommand(prompt, { autocheck, notify }).catch(error => {
        console.error(error);
        process.exit(1);
    });
}
