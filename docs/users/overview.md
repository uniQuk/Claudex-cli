# Claudex overview

[![@claudex/claudex downloads](https://img.shields.io/npm/dw/@claudex/claudex.svg)](https://npm-compare.com/@claudex/claudex)
[![@claudex/claudex version](https://img.shields.io/npm/v/@claudex/claudex.svg)](https://www.npmjs.com/package/@claudex/claudex)

> Learn about Claudex, Claudex's agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.

## Get started in 30 seconds

### Install Claudex:

**Linux / macOS**

```sh
curl -fsSL https://claudex-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-claudex.sh | bash
```

**Windows (Run as Administrator)**

```cmd
powershell -Command "Invoke-WebRequest 'https://claudex-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-claudex.bat' -OutFile (Join-Path $env:TEMP 'install-claudex.bat'); & (Join-Path $env:TEMP 'install-claudex.bat')"
```

> [!note]
>
> It's recommended to restart your terminal after installation to ensure environment variables take effect. If the installation fails, please refer to [Manual Installation](./quickstart#manual-installation) in the Quickstart guide.

### Start using Claudex:

```bash
cd your-project
claudex
```

Choose your authentication method — **API Key** or **[Alibaba Cloud Coding Plan](https://bailian.console.aliyun.com/cn-beijing/?tab=coding-plan#/efm/coding-plan-index)** ([intl](https://modelstudio.console.alibabacloud.com/?tab=coding-plan#/efm/coding-plan-index)) — and follow the prompts to configure. See the API setup guide ([Beijing](https://bailian.console.aliyun.com/cn-beijing/?tab=doc#/doc/?type=model&url=3023091) / [intl](https://modelstudio.console.alibabacloud.com/ap-southeast-1?tab=doc#/doc/?type=model&url=2974721)) for step-by-step instructions. Then let's start with understanding your codebase. Try one of these commands:

```
what does this project do?
```

![](https://cloud.video.taobao.com/vod/j7-QtQScn8UEAaEdiv619fSkk5p-t17orpDbSqKVL5A.mp4)

You'll be prompted to log in on first use. That's it! [Continue with Quickstart (5 mins) →](./quickstart)

> [!tip]
>
> See [troubleshooting](./support/troubleshooting) if you hit issues.

> [!note]
>
> **New VS Code Extension (Beta)**: Prefer a graphical interface? Our new **VS Code extension** provides an easy-to-use native IDE experience without requiring terminal familiarity. Simply install from the marketplace and start coding with Claudex directly in your sidebar. Download and install the [Claudex Companion](https://marketplace.visualstudio.com/items?itemName=claudexlm.claudex-vscode-ide-companion) now.

## What Claudex does for you

- **Build features from descriptions**: Tell Claudex what you want to build in plain language. It will make a plan, write the code, and ensure it works.
- **Debug and fix issues**: Describe a bug or paste an error message. Claudex will analyze your codebase, identify the problem, and implement a fix.
- **Navigate any codebase**: Ask anything about your team's codebase, and get a thoughtful answer back. Claudex maintains awareness of your entire project structure, can find up-to-date information from the web, and with [MCP](./features/mcp) can pull from external datasources like Google Drive, Figma, and Slack.
- **Automate tedious tasks**: Fix fiddly lint issues, resolve merge conflicts, and write release notes. Do all this in a single command from your developer machines, or automatically in CI.
- **[Followup suggestions](./features/followup-suggestions)**: Claudex predicts what you want to type next and shows it as ghost text. Press Tab to accept, or just keep typing to dismiss.

## Why developers love Claudex

- **Works in your terminal**: Not another chat window. Not another IDE. Claudex meets you where you already work, with the tools you already love.
- **Takes action**: Claudex can directly edit files, run commands, and create commits. Need more? [MCP](./features/mcp) lets Claudex read your design docs in Google Drive, update your tickets in Jira, or use _your_ custom developer tooling.
- **Unix philosophy**: Claudex is composable and scriptable. `tail -f app.log | claudex -p "Slack me if you see any anomalies appear in this log stream"` _works_. Your CI can run `claudex -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"`.
