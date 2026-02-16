import chalk from 'chalk';
import { spawn } from 'child_process';
import { configManager } from '../config';
import { runTool } from './run';
import { checkCommand } from './check';
import * as path from 'path';

/**
 * Shows a notification (non-blocking, cross-platform)
 */
function showNotification(agentName: string) {
    try {
        // Use node-notifier CLI which is cross-platform and non-blocking
        // Execute via node directly to avoid shell window
        const notifierScript = path.join(__dirname, '..', '..', 'node_modules', 'node-notifier-cli', 'bin.js');
        
        const child = spawn('node', [
            notifierScript,
            '-t', agentName.toUpperCase(),
            '-m', 'Agent is done!',
            '-s'  // silent mode (no sound)
        ], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });
        
        child.unref();
    } catch (e) {
        // Ignore errors silently
    }
}

/**
 * Default command - runs the best tool with a prompt
 */
export async function defaultCommand(prompt: string, options?: { autocheck?: boolean; notify?: boolean }): Promise<void> {
    const autocheck = options?.autocheck ?? true;
    const notify = options?.notify ?? true;
    let bestToolName = configManager.getBest();
    const startTime = performance.now();

    if (!bestToolName) {
        // Check if we have recent successful tool data
        const allTools = configManager.getTools();
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const recentTools = allTools.filter(t =>
            t.okay &&
            t.last_ran &&
            new Date(t.last_ran) > oneHourAgo &&
            t.time_taken !== undefined
        );

        if (recentTools.length > 0) {
            // Use cached data to select best
            recentTools.sort((a, b) => a.time_taken! - b.time_taken!);
            bestToolName = recentTools[0].name;
            configManager.setBest(bestToolName);
            console.log(chalk.green(`Using cached best tool: ${bestToolName}`));
        } else {
            console.log(chalk.yellow('No best tool configured. Running benchmark...'));
            await checkCommand();
            // After check, get the new best
            bestToolName = configManager.getBest();
            if (!bestToolName) {
                console.log(chalk.red('No tools passed the benchmark.'));
                process.exit(1);
            }
        }
    }

    // Try best tool
    const result = await runTool(bestToolName, prompt, false, true); // silent check

    if (result.success) {
        // Render the captured output
        if (result.output) {
            console.log(result.output);
        }
        const endTime = performance.now();
        const timeTaken = (endTime - startTime) / 1000;
        console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(bestToolName.toUpperCase())} (BEST) in ${timeTaken.toFixed(1)}s`)}`);
        if (notify) showNotification(bestToolName);
        return;
    }

    // Update failed tool
    configManager.updateTool(bestToolName, {
        last_error: result.error,
        okay: false,
        last_ran: new Date().toISOString()
    });

    if (!autocheck) {
        process.exit(1);
    }

    // Try other tools
    const allTools = configManager.getTools();
    const successfulTools = allTools.filter(t => t.okay !== null && !t.disabled && t.name !== bestToolName);
    successfulTools.sort((a, b) => (a.time_taken ?? Infinity) - (b.time_taken ?? Infinity));

    for (const tool of successfulTools) {
        const res = await runTool(tool.name, prompt, false, true);
        if (res.success) {
            // Render the captured output
            if (res.output) {
                console.log(res.output);
            }
            configManager.setBest(tool.name);
            const endTime = performance.now();
            const timeTaken = (endTime - startTime) / 1000;
            console.log(`\n${chalk.dim.italic(`Answered via ${chalk.bold.cyan(tool.name.toUpperCase())} in ${timeTaken.toFixed(1)}s`)}`);
            if (notify) showNotification(tool.name);
            return;
        } else {
            configManager.updateTool(tool.name, {
                last_error: res.error,
                okay: false,
                last_ran: new Date().toISOString()
            });
        }
    }

    // All failed
    console.log(chalk.red('All tools failed to provide a response.'));
    process.exit(1);
}
