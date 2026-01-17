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
    .version(version);

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

if (args.includes('--version') || args.includes('-V')) {
    console.log(version);
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
    program.outputHelp();
    process.exit(0);
}

if (args.length > 0 && commands.includes(args[0])) {
    // Known command
    program.parse(process.argv);
} else {
    // Default command
    let autocheck = true;
    let promptArgs = [...args];
    const noAutocheckIndex = promptArgs.indexOf('--no-autocheck');
    if (noAutocheckIndex !== -1) {
        autocheck = false;
        promptArgs.splice(noAutocheckIndex, 1);
    }

    if (promptArgs.length === 0) {
        program.outputHelp();
        process.exit(0);
    }

    const prompt = promptArgs.join(' ');
    defaultCommand(prompt, { autocheck }).catch(error => {
        console.error(error);
        process.exit(1);
    });
}
