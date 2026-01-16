# HeyAI

A CLI-based app for non-interactive (direct) inference from popular AI CLI tools such as Claude Code, Gemini CLI, Codex, OpenCode, etc. Simply run `ai "your prompt here"` and the app will figure out the best AI CLI agent tool automatically to return answers to your queries.

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
| `add` | Add a new AI tool | `ai add` (interactive) or `ai add --name tool --command "cmd" --description "desc"` |
| `edit` | Edit an existing tool | `ai edit <tool-name>` or `ai edit --tool-name <name> --command "new cmd"` |
| `delete` | Remove tools with confirmation | `ai delete <tool-name>` or `ai delete <tool-name> --yes` |
| `view` | Show detailed tool information | `ai view <tool-name>` |
| `list` | Display all tools with status | `ai list` |
| `find` | Search tools by name/description | `ai find <query>` |
| `check` | Benchmark all tools | `ai check` or `ai check --debug --include-disabled` |
| `run` | Execute a specific tool | `ai run <tool-name> "prompt"` or `ai run <tool-name> "prompt" --debug` |
| `export` | Export configuration to JSON | `ai export` or `ai export /path/to/config.json` |
| `import` | Import configuration from JSON | `ai import /path/to/config.json` |
| `enable` | Enable a disabled tool | `ai enable <tool-name>` |
| `disable` | Disable a tool | `ai disable <tool-name>` |
| `onboard` | Display comprehensive guide | `ai onboard` |
| `[query]` | Run query with best tool | `ai "your prompt"` or `ai "prompt" --no-autocheck` |

## Installation

```bash
npm install -g hey-ai-cli
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
ai add
```

Non-interactive mode:
```bash
ai add --name mytool --command "mytool run" --description "My AI tool"
```

### List All Tools

```bash
ai list
```

### View Tool Details

```bash
ai view <tool-name>
```

### Find Tools

Fuzzy search across tool names and descriptions:
```bash
ai find openai
```

### Edit a Tool

Interactive mode:
```bash
ai edit <tool-name>
```

Non-interactive mode:
```bash
ai edit <tool-name> --name "newname" --command "new command" --description "new desc"
ai edit --tool-name <tool-name> --description "updated description"
```

### Delete a Tool

Interactive mode (with confirmation):
```bash
ai delete <tool-name>
```

Non-interactive mode:
```bash
ai delete <tool-name> --yes
ai delete --tool-name <tool-name> --yes
```

### Enable/Disable Tools

```bash
ai enable <tool-name>
ai disable <tool-name>
```

### Check All Tools

Benchmark all tools and determine the best one:
```bash
ai check
```

With debug output to see each command being executed:
```bash
ai check --debug
```

Include disabled tools in benchmarking:
```bash
ai check --include-disabled
```

### Run a Specific Tool

```bash
ai run <tool-name> "your prompt here"
```

With debug output:
```bash
ai run <tool-name> "your prompt here" --debug
# Shows: Debug: Executing command: <actual-command>
# Then streams the tool output in real-time
```

### Run Best Tool

Use the best tool automatically:
```bash
ai "tell me a joke"
```

Skip automatic fallback if best tool fails:
```bash
ai "tell me a joke" --no-autocheck
```

### Configuration Management

Export configuration to a file:
```bash
ai export
ai export /path/to/config.json
```

Import configuration from a file:
```bash
ai import /path/to/config.json
```

### Onboarding Guide

Display comprehensive onboarding information, useful for AI agents:
```bash
ai onboard
```

## Configuration

Configuration is stored in a platform-specific location:
- **Windows**: `%APPDATA%\heyai\config.json`
- **macOS/Linux**: `~/.config/heyai/config.json`

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
