<div align="center">

[![npm version](https://img.shields.io/npm/v/@claudex/claudex.svg)](https://www.npmjs.com/package/@claudex/claudex)
[![License](https://img.shields.io/github/license/ClaudexLM/claudex.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![Downloads](https://img.shields.io/npm/dm/@claudex/claudex.svg)](https://www.npmjs.com/package/@claudex/claudex)

<a href="https://trendshift.io/repositories/15287" target="_blank"><img src="https://trendshift.io/api/badge/repositories/15287" alt="ClaudexLM%2Fclaudex | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

**An open-source AI agent that lives in your terminal.**

<a href="https://claudexlm.github.io/claudex-docs/zh/users/overview">中文</a> |
<a href="https://claudexlm.github.io/claudex-docs/de/users/overview">Deutsch</a> |
<a href="https://claudexlm.github.io/claudex-docs/fr/users/overview">français</a> |
<a href="https://claudexlm.github.io/claudex-docs/ja/users/overview">日本語</a> |
<a href="https://claudexlm.github.io/claudex-docs/ru/users/overview">Русский</a> |
<a href="https://claudexlm.github.io/claudex-docs/pt-BR/users/overview">Português (Brasil)</a>

</div>

## 🎉 News

- **2026-04-15**: Claudex OAuth free tier has been discontinued. To continue using Claudex, switch to [Alibaba Cloud Coding Plan](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index), [OpenRouter](https://openrouter.ai), [Fireworks AI](https://app.fireworks.ai), or bring your own API key. Run `claudex auth` to configure.

- **2026-04-13**: Claudex OAuth free tier policy update: daily quota adjusted to 100 requests/day (from 1,000).

- **2026-04-02**: Claudex3.6-Plus is now live! Get an API key from [Alibaba Cloud ModelStudio](https://modelstudio.console.alibabacloud.com/ap-southeast-1?tab=doc#/doc/?type=model&url=2840914_2&modelId=claudex3.6-plus) to access it through the OpenAI-compatible API.

- **2026-02-16**: Claudex3.5-Plus is now live!

## Why Claudex?

Claudex is an open-source AI agent for the terminal, optimized for Claudex series models. It helps you understand large codebases, automate tedious work, and ship faster.

- **Multi-protocol, flexible providers**: use OpenAI / Anthropic / Gemini-compatible APIs, [Alibaba Cloud Coding Plan](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index), [OpenRouter](https://openrouter.ai), [Fireworks AI](https://app.fireworks.ai), or bring your own API key.
- **Open-source, co-evolving**: both the framework and the Claudex3-Coder model are open-source—and they ship and evolve together.
- **Agentic workflow, feature-rich**: rich built-in tools (Skills, SubAgents) for a full agentic workflow and a Claude Code-like experience.
- **Terminal-first, IDE-friendly**: built for developers who live in the command line, with optional integration for VS Code, Zed, and JetBrains IDEs.

![](https://gw.alicdn.com/imgextra/i1/O1CN01D2DviS1wwtEtMwIzJ_!!6000000006373-2-tps-1600-900.png)

## Installation

### Quick Install (Recommended)

#### Linux / macOS

```bash
bash -c "$(curl -fsSL https://claudex-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-claudex.sh)"
```

#### Windows (Run as Administrator)

Works in both Command Prompt and PowerShell:

```cmd
powershell -Command "Invoke-WebRequest 'https://claudex-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-claudex.bat' -OutFile (Join-Path $env:TEMP 'install-claudex.bat'); & (Join-Path $env:TEMP 'install-claudex.bat')"
```

> **Note**: It's recommended to restart your terminal after installation to ensure environment variables take effect.

### Manual Installation

#### Prerequisites

Make sure you have Node.js 20 or later installed. Download it from [nodejs.org](https://nodejs.org/en/download).

#### NPM

```bash
npm install -g @claudex/claudex@latest
```

#### Homebrew (macOS, Linux)

```bash
brew install claudex
```

## Quick Start

```bash
# Start Claudex (interactive)
claudex

# Then, in the session:
/help
/auth
```

On first use, you'll be prompted to sign in. You can run `/auth` anytime to switch authentication methods.

Example prompts:

```text
What does this project do?
Explain the codebase structure.
Help me refactor this function.
Generate unit tests for this module.
```

<details>
<summary>Click to watch a demo video</summary>

<video src="https://cloud.video.taobao.com/vod/HLfyppnCHplRV9Qhz2xSqeazHeRzYtG-EYJnHAqtzkQ.mp4" controls>
Your browser does not support the video tag.
</video>

</details>

## 🦞 Use Claudex for Coding Tasks in Claw

Copy the prompt below and paste it into your agent:

```
Use Claudex as a coding agent. First, fetch and read this skill reference:
https://raw.githubusercontent.com/ClaudexLM/claudex/refs/heads/main/.claudex/skills/claudex-claw/SKILL.md
Then follow the instructions inside to install, authenticate, and use Claudex via acpx for all coding tasks.
```

## Authentication

Claudex supports the following authentication methods:

- **API Key (recommended)**: use an API key from Alibaba Cloud Model Studio ([Beijing](https://bailian.console.aliyun.com/) / [intl](https://modelstudio.console.alibabacloud.com/)) or any supported provider (OpenAI, Anthropic, Google GenAI, and other compatible endpoints).
- **Coding Plan**: subscribe to the Alibaba Cloud Coding Plan ([Beijing](https://bailian.console.aliyun.com/cn-beijing?tab=coding-plan#/efm/coding-plan-index) / [intl](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index)) for a fixed monthly fee with higher quotas.

> ⚠️ **Claudex OAuth was discontinued on April 15, 2026.** If you were previously using Claudex OAuth, please switch to one of the methods above. Run `claudex` and then `/auth` to reconfigure.

#### API Key (recommended)

Use an API key to connect to Alibaba Cloud Model Studio or any supported provider. Supports multiple protocols:

- **OpenAI-compatible**: Alibaba Cloud ModelStudio, ModelScope, OpenAI, OpenRouter, and other OpenAI-compatible providers
- **Anthropic**: Claude models
- **Google GenAI**: Gemini models

The **recommended** way to configure models and providers is by editing `~/.claudex/settings.json` (create it if it doesn't exist). This file lets you define all available models, API keys, and default settings in one place.

##### Quick Setup in 3 Steps

**Step 1:** Create or edit `~/.claudex/settings.json`

Here is a complete example:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "claudex3.6-plus",
        "name": "claudex3.6-plus",
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "description": "Claudex3-Coder via Dashscope",
        "envKey": "DASHSCOPE_API_KEY"
      }
    ]
  },
  "env": {
    "DASHSCOPE_API_KEY": "sk-xxxxxxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "claudex3.6-plus"
  }
}
```

**Step 2:** Understand each field

| Field                        | What it does                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `modelProviders`             | Declares which models are available and how to connect to them. Keys like `openai`, `anthropic`, `gemini` represent the API protocol. |
| `modelProviders[].id`        | The model ID sent to the API (e.g. `claudex3.6-plus`, `gpt-4o`).                                                                         |
| `modelProviders[].envKey`    | The name of the environment variable that holds your API key.                                                                         |
| `modelProviders[].baseUrl`   | The API endpoint URL (required for non-default endpoints).                                                                            |
| `env`                        | A fallback place to store API keys (lowest priority; prefer `.env` files or `export` for sensitive keys).                             |
| `security.auth.selectedType` | The protocol to use on startup (`openai`, `anthropic`, `gemini`, `vertex-ai`).                                                        |
| `model.name`                 | The default model to use when Claudex starts.                                                                                       |

**Step 3:** Start Claudex — your configuration takes effect automatically:

```bash
claudex
```

Use the `/model` command at any time to switch between all configured models.

##### More Examples

<details>
<summary>Coding Plan (Alibaba Cloud ModelStudio) — fixed monthly fee, higher quotas</summary>

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "claudex3.6-plus",
        "name": "claudex3.6-plus (Coding Plan)",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "description": "claudex3.6-plus from ModelStudio Coding Plan",
        "envKey": "BAILIAN_CODING_PLAN_API_KEY"
      },
      {
        "id": "claudex3.5-plus",
        "name": "claudex3.5-plus (Coding Plan)",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "description": "claudex3.5-plus with thinking enabled from ModelStudio Coding Plan",
        "envKey": "BAILIAN_CODING_PLAN_API_KEY",
        "generationConfig": {
          "extra_body": {
            "enable_thinking": true
          }
        }
      },
      {
        "id": "glm-4.7",
        "name": "glm-4.7 (Coding Plan)",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "description": "glm-4.7 with thinking enabled from ModelStudio Coding Plan",
        "envKey": "BAILIAN_CODING_PLAN_API_KEY",
        "generationConfig": {
          "extra_body": {
            "enable_thinking": true
          }
        }
      },
      {
        "id": "kimi-k2.5",
        "name": "kimi-k2.5 (Coding Plan)",
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "description": "kimi-k2.5 with thinking enabled from ModelStudio Coding Plan",
        "envKey": "BAILIAN_CODING_PLAN_API_KEY",
        "generationConfig": {
          "extra_body": {
            "enable_thinking": true
          }
        }
      }
    ]
  },
  "env": {
    "BAILIAN_CODING_PLAN_API_KEY": "sk-xxxxxxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "claudex3.6-plus"
  }
}
```

> Subscribe to the Coding Plan and get your API key at [Alibaba Cloud ModelStudio(Beijing)](https://bailian.console.aliyun.com/cn-beijing?tab=coding-plan#/efm/coding-plan-index) or [Alibaba Cloud ModelStudio(intl)](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index).

</details>

<details>
<summary>Multiple providers (OpenAI + Anthropic + Gemini)</summary>

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "envKey": "OPENAI_API_KEY",
        "baseUrl": "https://api.openai.com/v1"
      }
    ],
    "anthropic": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "envKey": "ANTHROPIC_API_KEY"
      }
    ],
    "gemini": [
      {
        "id": "gemini-2.5-pro",
        "name": "Gemini 2.5 Pro",
        "envKey": "GEMINI_API_KEY"
      }
    ]
  },
  "env": {
    "OPENAI_API_KEY": "sk-xxxxxxxxxxxxx",
    "ANTHROPIC_API_KEY": "sk-ant-xxxxxxxxxxxxx",
    "GEMINI_API_KEY": "AIzaxxxxxxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "gpt-4o"
  }
}
```

</details>

<details>
<summary>Enable thinking mode (for supported models like claudex3.5-plus)</summary>

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "claudex3.5-plus",
        "name": "claudex3.5-plus (thinking)",
        "envKey": "DASHSCOPE_API_KEY",
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "generationConfig": {
          "extra_body": {
            "enable_thinking": true
          }
        }
      }
    ]
  },
  "env": {
    "DASHSCOPE_API_KEY": "sk-xxxxxxxxxxxxx"
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "claudex3.5-plus"
  }
}
```

</details>

> **Tip:** You can also set API keys via `export` in your shell or `.env` files, which take higher priority than `settings.json` → `env`. See the [authentication guide](https://claudexlm.github.io/claudex-docs/en/users/configuration/auth/) for full details.

> **Security note:** Never commit API keys to version control. The `~/.claudex/settings.json` file is in your home directory and should stay private.

#### Local Model Setup (Ollama / vLLM)

You can also run models locally — no API key or cloud account needed. This is not an authentication method; instead, configure your local model endpoint in `~/.claudex/settings.json` using the `modelProviders` field.

<details>
<summary>Ollama setup</summary>

1. Install Ollama from [ollama.com](https://ollama.com/)
2. Pull a model: `ollama pull claudex3:32b`
3. Configure `~/.claudex/settings.json`:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "claudex3:32b",
        "name": "Claudex3 32B (Ollama)",
        "baseUrl": "http://localhost:11434/v1",
        "description": "Claudex3 32B running locally via Ollama"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "claudex3:32b"
  }
}
```

</details>

<details>
<summary>vLLM setup</summary>

1. Install vLLM: `pip install vllm`
2. Start the server: `vllm serve Claudex/Claudex3-32B`
3. Configure `~/.claudex/settings.json`:

```json
{
  "modelProviders": {
    "openai": [
      {
        "id": "Claudex/Claudex3-32B",
        "name": "Claudex3 32B (vLLM)",
        "baseUrl": "http://localhost:8000/v1",
        "description": "Claudex3 32B running locally via vLLM"
      }
    ]
  },
  "security": {
    "auth": {
      "selectedType": "openai"
    }
  },
  "model": {
    "name": "Claudex/Claudex3-32B"
  }
}
```

</details>

## Usage

As an open-source terminal agent, you can use Claudex in four primary ways:

1. Interactive mode (terminal UI)
2. Headless mode (scripts, CI)
3. IDE integration (VS Code, Zed)
4. TypeScript SDK

#### Interactive mode

```bash
cd your-project/
claudex
```

Run `claudex` in your project folder to launch the interactive terminal UI. Use `@` to reference local files (for example `@src/main.ts`).

#### Headless mode

```bash
cd your-project/
claudex -p "your question"
```

Use `-p` to run Claudex without the interactive UI—ideal for scripts, automation, and CI/CD. Learn more: [Headless mode](https://claudexlm.github.io/claudex-docs/en/users/features/headless).

#### IDE integration

Use Claudex inside your editor (VS Code, Zed, and JetBrains IDEs):

- [Use in VS Code](https://claudexlm.github.io/claudex-docs/en/users/integration-vscode/)
- [Use in Zed](https://claudexlm.github.io/claudex-docs/en/users/integration-zed/)
- [Use in JetBrains IDEs](https://claudexlm.github.io/claudex-docs/en/users/integration-jetbrains/)

#### TypeScript SDK

Build on top of Claudex with the TypeScript SDK:

- [Use the Claudex SDK](./packages/sdk-typescript/README.md)

## Commands & Shortcuts

### Session Commands

- `/help` - Display available commands
- `/clear` - Clear conversation history
- `/compress` - Compress history to save tokens
- `/stats` - Show current session information
- `/bug` - Submit a bug report
- `/exit` or `/quit` - Exit Claudex

### Keyboard Shortcuts

- `Ctrl+C` - Cancel current operation
- `Ctrl+D` - Exit (on empty line)
- `Up/Down` - Navigate command history

> Learn more about [Commands](https://claudexlm.github.io/claudex-docs/en/users/features/commands/)
>
> **Tip**: In YOLO mode (`--yolo`), vision switching happens automatically without prompts when images are detected. Learn more about [Approval Mode](https://claudexlm.github.io/claudex-docs/en/users/features/approval-mode/)

## Configuration

Claudex can be configured via `settings.json`, environment variables, and CLI flags.

| File                    | Scope         | Description                                                                             |
| ----------------------- | ------------- | --------------------------------------------------------------------------------------- |
| `~/.claudex/settings.json` | User (global) | Applies to all your Claudex sessions. **Recommended for `modelProviders` and `env`.** |
| `.claudex/settings.json`   | Project       | Applies only when running Claudex in this project. Overrides user settings.           |

The most commonly used top-level fields in `settings.json`:

| Field                        | Description                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `modelProviders`             | Define available models per protocol (`openai`, `anthropic`, `gemini`, `vertex-ai`).                 |
| `env`                        | Fallback environment variables (e.g. API keys). Lower priority than shell `export` and `.env` files. |
| `security.auth.selectedType` | The protocol to use on startup (e.g. `openai`).                                                      |
| `model.name`                 | The default model to use when Claudex starts.                                                      |

> See the [Authentication](#api-key-flexible) section above for complete `settings.json` examples, and the [settings reference](https://claudexlm.github.io/claudex-docs/en/users/configuration/settings/) for all available options.

## Benchmark Results

### Terminal-Bench Performance

| Agent     | Model              | Accuracy |
| --------- | ------------------ | -------- |
| Claudex | Claudex3-Coder-480A35 | 37.5%    |
| Claudex | Claudex3-Coder-30BA3B | 31.3%    |

## Ecosystem

Looking for a graphical interface?

- [**AionUi**](https://github.com/iOfficeAI/AionUi) A modern GUI for command-line AI tools including Claudex
- [**Gemini CLI Desktop**](https://github.com/Piebald-AI/gemini-cli-desktop) A cross-platform desktop/web/mobile UI for Claudex

## Troubleshooting

If you encounter issues, check the [troubleshooting guide](https://claudexlm.github.io/claudex-docs/en/users/support/troubleshooting/).

**Common issues:**

- **`Claudex OAuth free tier was discontinued on 2026-04-15`**: Claudex OAuth is no longer available. Run `claudex` → `/auth` and switch to API Key or Coding Plan. See the [Authentication](#authentication) section above for setup instructions.

To report a bug from within the CLI, run `/bug` and include a short title and repro steps.

## Connect with Us

- Discord: https://discord.gg/RN7tqZCeDK
- Dingtalk: https://qr.dingtalk.com/action/joingroup?code=v1,k1,+FX6Gf/ZDlTahTIRi8AEQhIaBlqykA0j+eBKKdhLeAE=&_dt_no_comment=1&origin=1

## Acknowledgments

This project is based on [Google Gemini CLI](https://github.com/google-gemini/gemini-cli). We acknowledge and appreciate the excellent work of the Gemini CLI team. Our main contribution focuses on parser-level adaptations to better support Claudex-Coder models.
