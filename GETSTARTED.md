# Getting Started with Claudex CLI

Claudex is an AI coding agent for the terminal. It supports any OpenAI-compatible API endpoint and the Anthropic API natively.

---

## Requirements

- **Node.js** ≥ 20 (developed on v22)
- An API key from an OpenAI-compatible provider or Anthropic

---

## Installation

### From source (current)

```bash
git clone <this-repo>
cd qwen-code
npm install
npm run build && npm run bundle
```

Then create a global alias:

```bash
# Add to your shell profile, or run once:
alias claudex="node /path/to/qwen-code/packages/cli/dist/cli.js"
```

Or link it:

```bash
npm link --workspace=packages/cli
```

---

## Where Config Lives

| Path | Purpose |
|---|---|
| `~/.qwen/settings.json` | Global user settings (auth type, model, preferences) |
| `~/.qwen/mcp-oauth-tokens.json` | MCP server OAuth tokens |
| `~/.qwen/installation_id` | Anonymous install identifier |
| `./.qwen/` | Project-level settings (when inside a project dir) |
| `./CLAUDEX.md` | Project context file — Claudex reads this automatically |
| `./AGENTS.md` | Alternative project context file (also read automatically) |

> **Note:** The global config directory is currently `~/.qwen/`. A future release will migrate this to `~/.claudex/`.

### settings.json structure

```jsonc
{
  "security": {
    "auth": {
      "selectedType": "openai"   // or "anthropic"
    }
  },
  "model": {
    "name": "gpt-4o"             // model ID to use
  },
  "modelProviders": {
    "openai": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "baseUrl": "https://api.openai.com/v1",
        "envKey": "OPENAI_API_KEY"
      }
    ]
  }
}
```

Settings cascade: project-level `.qwen/settings.json` overrides `~/.qwen/settings.json`.

---

## Authentication

### Option A — Environment variables (simplest)

**OpenAI or compatible endpoint:**

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_BASE_URL="https://api.openai.com/v1"   # optional, defaults to OpenAI
claudex
```

**Anthropic:**

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
claudex --auth-type anthropic
```

**Custom OpenAI-compatible endpoint (e.g. local Ollama, LM Studio, Together, etc.):**

```bash
export OPENAI_API_KEY="ollama"                        # can be any non-empty string for local
export OPENAI_BASE_URL="http://localhost:11434/v1"
claudex --model llama3.2
```

### Option B — CLI flags (one-off)

```bash
claudex --openai-api-key "sk-..." --model gpt-4o "explain this code"
```

### Option C — Persist in settings.json

```bash
# Interactively configure via the built-in auth command:
claudex auth
```

---

## Basic Usage

```bash
# Interactive mode (default)
claudex

# Non-interactive — pass a prompt directly
claudex "refactor this function to use async/await"

# Non-interactive with stdin
cat myfile.py | claudex "add type annotations"

# Specify model per-run
claudex --model claude-3-5-sonnet-20241022 --auth-type anthropic

# Non-interactive, show output as JSON
claudex --output-format json "list all functions in src/"
```

### In-session slash commands

Once inside interactive mode, type `/` to see available commands:

| Command | Description |
|---|---|
| `/help` | Show all commands |
| `/model` | Switch model |
| `/settings` | Open settings editor |
| `/memory` | Manage memory files |
| `/clear` | Clear the conversation |
| `/docs` | Open documentation in browser |
| `/quit` or `Ctrl-C` | Exit |

---

## Project Context (CLAUDEX.md)

Create a `CLAUDEX.md` file in your project root to give Claudex persistent context:

```markdown
# My Project

This is a TypeScript monorepo using npm workspaces.
Tests use vitest. Always use strict TypeScript.

## Conventions
- No `any` types
- 2-space indent, single quotes
- Commit messages follow Conventional Commits
```

Claudex reads this file at the start of every session. You can also add an `AGENTS.md` for agent-specific instructions (same format, both are read).

---

## MCP Servers

MCP (Model Context Protocol) servers extend Claudex with additional tools (databases, APIs, etc.).

```bash
# Add an MCP server
claudex mcp add

# List configured MCP servers
claudex mcp list
```

MCP server configs are stored in `~/.qwen/settings.json` under the `mcpServers` key.

---

## Environment Variable Reference

| Variable | Auth type | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | `openai` | API key |
| `OPENAI_BASE_URL` | `openai` | Base URL (default: `https://api.openai.com/v1`) |
| `OPENAI_MODEL` | `openai` | Default model override |
| `ANTHROPIC_API_KEY` | `anthropic` | API key |
| `ANTHROPIC_BASE_URL` | `anthropic` | Base URL (default: Anthropic's endpoint) |
| `ANTHROPIC_MODEL` | `anthropic` | Default model override |
| `TAVILY_API_KEY` | any | Enable web search via Tavily |
| `GOOGLE_API_KEY` | any | Enable web search via Google Custom Search |
| `QWEN_RUNTIME_DIR` | any | Override the runtime data directory |
| `SANDBOX` | any | Set to `sandbox-exec` to enable sandbox mode |
