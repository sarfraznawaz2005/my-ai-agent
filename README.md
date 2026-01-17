# My AI Agent

A CLI-based app for non-interactive (direct) inference from popular AI CLI tools such as Claude Code, Gemini CLI, Codex, OpenCode, etc. Simply run `agent "your prompt here"` and the app will figure out the best AI CLI agent tool automatically to return answers to your queries.

## Features

- **AI Tool Management**: Add, edit, delete, view, list, and search tools
- **Benchmarking**: Test all tools to find the fastest one with performance tracking
- **Unified Interface**: Run any tool with a simple command
- **Smart Selection**: Automatically use the best-performing tool with intelligent fallback
- **Configuration Management**: Export/import tool configurations
- **Tool State Control**: Enable/disable tools for maintenance
- **Markdown Rendering**: Format AI responses with proper terminal display
- **Interactive & Non-Interactive**: Supports both modes for automation

## Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `add` | Add a new AI tool | `agent add` (interactive) or `agent add --name tool --command "cmd" --description "desc"` |
| `edit` | Edit an existing tool | `agent edit <tool-name>` or `agent edit --tool-name <name> --command "new cmd"` |
| `delete` | Remove tools with confirmation | `agent delete <tool-name>` or `agent delete <tool-name> --yes` |
| `view` | Show detailed tool information | `agent view <tool-name>` |
| `list` | Display all tools with status | `agent list` |
| `find` | Search tools by name/description | `agent find <query>` |
| `check` | Benchmark all tools | `agent check` or `agent check --debug --include-disabled` |
| `run` | Execute a specific tool | `agent run <tool-name> "prompt"` or `agent run <tool-name> "prompt" --debug` |
| `export` | Export configuration to JSON | `agent export` or `agent export /path/to/config.json` |
| `import` | Import configuration from JSON | `agent import /path/to/config.json` |
| `enable` | Enable a disabled tool | `agent enable <tool-name>` |
| `disable` | Disable a tool | `agent disable <tool-name>` |
| `onboard` | Display comprehensive guide | `agent onboard` |
| `[query]` | Run query with best tool | `agent "your prompt"` or `agent "prompt" --no-autocheck` |

## Installation

```bash
npm install -g my-ai-agent
```

Or use locally:

```bash
npm install
npm link
```

## Add CLI Tools

Add one or more of these or your own custom tools with `add` command:

### OpenAI Codex

- Name: `codex`
- Command: `codex --yolo --model gpt-5.2 exec`
- Description: `OpenAI Codex`

### Claude Code

- Name: `claude`
- Command: `claude --dangerously-skip-permissions --no-chrome --model claude-sonnet-4-5 --output-format text -p`
- Description: `Claude Code`

### OpenCode

- Name: `opencode`
- Command: `opencode --model opencode/grok-code --format default run`
- Description: `OpenCode`

### Gemini CLI

- Name: `gemini`
- Command: `gemini -e none --model gemini-2.5-flash --yolo --output-format text`
- Description: `Gemini CLI`

Tip: Replace `gemini` with `qwen` if you want that too.

## Usage

### Add a Tool

Interactive mode:
```bash
agent add
```

Non-interactive mode:
```bash
agent add --name mytool --command "mytool run" --description "My AI tool"
```

### List All Tools

```bash
agent list
```

### View Tool Details

```bash
agent view <tool-name>
```

### Find Tools

Fuzzy search across tool names and descriptions:
```bash
agent find openai
```

### Edit a Tool

Interactive mode:
```bash
agent edit <tool-name>
```

Non-interactive mode:
```bash
agent edit <tool-name> --name "newname" --command "new command" --description "new desc"
agent edit --tool-name <tool-name> --description "updated description"
```

### Delete a Tool

Interactive mode (with confirmation):
```bash
agent delete <tool-name>
```

Non-interactive mode:
```bash
agent delete <tool-name> --yes
agent delete --tool-name <tool-name> --yes
```

### Enable/Disable Tools

```bash
agent enable <tool-name>
agent disable <tool-name>
```

### Check All Tools

Benchmark all tools and determine the best one:
```bash
agent check
```

With debug output to see each command being executed:
```bash
agent check --debug
```

Include disabled tools in benchmarking:
```bash
agent check --include-disabled
```

### Run a Specific Tool

```bash
agent run <tool-name> "your prompt here"
```

With debug output:
```bash
agent run <tool-name> "your prompt here" --debug
# Shows: Debug: Executing command: <actual-command>
# Then streams the tool output in real-time
```

### Run Best Tool

Use the best tool automatically:
```bash
agent "tell me a joke"
```

or without quotes:

```bash
agent tell me a joke
```

Skip automatic fallback if best tool fails:
```bash
agent "tell me a joke" --no-autocheck
```

### Configuration Management

Export configuration to a file:
```bash
agent export
agent export /path/to/config.json
```

Import configuration from a file:
```bash
agent import /path/to/config.json
```

### Onboarding Guide

Display comprehensive onboarding information, useful for AI agents:
```bash
agent onboard
```

## Configuration

Configuration is stored in a platform-specific location:
- **Windows**: `%APPDATA%\my-ai-agent\config.json`
- **macOS/Linux**: `~/.config/my-ai-agent/config.json`

## Development

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run type-check
```

### Development Mode

```bash
npm run dev
```

## Requirements

- Node.js >= 14.0.0

## License

MIT
