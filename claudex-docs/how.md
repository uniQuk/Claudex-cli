✦ The explorer has provided a very thorough overview of the codebase. Now I should present this to the user in a
     clear, well-structured format. The explorer's output is already quite good and follows the structure from the
     skill. Let me present it with minimal editing for clarity.


  ✦
    Here's the architectural overview of the Claudex Code (claudex) codebase:

    ---

    Overview

    Claudex Code (internally named claudex) is an AI-powered CLI agent that acts as a coding assistant. It connects
     to LLM APIs (via Google's Gemini SDK, with adapters for Anthropic/OpenAI), executes tools (file edits,
    shell commands, git operations, etc.) on the user's behalf, and presents results through either an
    interactive React-based terminal UI or a non-interactive JSON/text mode. The project is structured as an npm
     monorepo with two main packages: @claudex/core (all intelligence, tools, services) and @claudex/cli
    (interface layer).

    ---

    Key Concepts


    Abstraction: `Config` (core/src/config/config.ts)
    What it does: Central hub — holds every subsystem: model config, tool registry, file system, shell
    execution, cron scheduler, permissions, memory, hooks, IDE client, LSP, MCP. Everything flows through it.
    ────────────────────────────────────────
    Abstraction: `GeminiClient` (core/src/core/client.ts)
    What it does: Main conversation loop manager. Sends messages via streaming, handles hooks, auto-memory, chat
     compression, token limits, and iterates through tool calls until the model signals finished. Max 100 turns
    per session.
    ────────────────────────────────────────
    Abstraction: `ContentGenerator` (core/src/core/contentGenerator.ts)
    What it does: Abstracts the LLM provider boundary. Wraps @google/genai SDK calls with a generic interface
    (generateContent, generateContentStream, countTokens). Supports multiple auth types.
    ────────────────────────────────────────
    Abstraction: `CoreToolScheduler` (core/src/core/coreToolScheduler.ts)
    What it does: Orchestrates tool execution: validates params, checks permissions, fires hooks, waits for
    approval (in plan mode), executes the tool, records results, feeds back to the model.
    ────────────────────────────────────────
    Abstraction: `ToolRegistry` (core/src/tools/tool-registry.ts)
    What it does: Manages all ~30 tools. Uses factory functions for lazy-loading so only used tools incur
    cold-start cost. Supports declarative tools, MCP-discovered tools, and external commands.
    ────────────────────────────────────────
    Abstraction: `MemoryManager` (core/src/memory/manager.ts)
    What it does: Auto-memory system: extracts new memories from conversation, dreams (consolidates), recalls
    relevant memories per turn, forgets old ones. Runs as background tasks triggered on every user query.
    ────────────────────────────────────────
    Abstraction: `PermissionManager` (core/src/permissions/permission-manager.ts)
    What it does: Controls tool execution modes: plan (user approves each tool), default, yolo (auto-approve
    all), auto-edit. Evaluates rules against tool kinds (read/write/execute).


    ---

    How It Works

    1. Startup (packages/cli/src/claudex.tsx → main())

     1. Argument parsing via yargs — handles flags like --bare, --prompt, --resume, --acp, --json-fd.
     2. Settings loading from user/project settings.json.
     3. Sandbox check — if sandbox is enabled, validates auth and relaunches into a containerized child process,
        then exits the current one (transparent to the user).
     4. Child process relaunch — without sandbox, relaunches itself as a child for memory management / internal
        restart capability.
     5. Config loading (loadCliConfig()) — creates the full Config instance with all subsystems initialized.
     6. App initialization — i18n setup, auth validation, theme check, IDE connection (if in IDE mode).
     7. Mode dispatch:
        - ACP mode (--experimental-zed-integration): runs the Agent Client Protocol agent for Zed editor
          integration.
        - Interactive mode: renders an Ink/React TUI with context providers for state management.
        - Non-interactive mode: reads stdin or --prompt, runs a single prompt through the model loop, outputs JSON
           or text.

    2. Interactive Mode (packages/cli/src/ui/AppContainer.tsx)

     1. User types input in the InputPrompt component.
     2. On submission, useGeminiStream hook calls config.getGeminiClient().sendMessageStream().
     3. `GeminiClient.sendMessageStream()` iterates:
        - Fires UserPromptSubmit hook (can block or modify the prompt).
        - Schedules auto-memory tasks (extract + dream).
        - Checks context size, calls tryCompressChat() if needed.
        - Sends request to LLM via ContentGenerator.generateContentStream().
        - Yields events: content chunks, thoughts, citations.
        - When the model requests a tool call → yields ToolCallRequest event.
        - `CoreToolScheduler` handles it: validates params, checks permissions, fires pre-tool-use hooks, waits
          for approval (plan mode), executes the tool, fires post-tool-use hooks, records the result.
        - Feeds tool result back to the model and repeats (up to 100 turns).
        - Loop detection service monitors for repetitive patterns mid-stream.
     4. When the model signals finished → yields Finished event, returns a Turn object.
     5. UI renders: user message, model response (with thoughts), tool calls with results.

    3. Tool Execution Flow (CoreToolScheduler)

     1. Model response contains a tool call request (name + args).
     2. Validating phase: looks up the tool in ToolRegistry, creates an invocation, validates params against JSON
        schema.
     3. Permission check: evaluates rules based on current permission mode and tool kind.
     4. Scheduling phase (if not yolo): waits for user approval via MessageBus or interactive prompt. Fires
        PreToolUse hooks.
     5. Executing phase: calls invocation.execute() — runs actual tool logic (shell command, file I/O). Streams
        live output if available.
     6. Post-processing: fires PostToolUse / PostToolUseFailure hooks, records result, feeds back to the model.

    ---

    Where Things Live


    ┌───────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
    │ Area              │ Key paths                                                                       │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Entry point       │ packages/cli/index.ts, packages/cli/src/claudex.tsx                             │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Core engine       │ packages/core/src/core/client.ts, contentGenerator.ts, coreToolScheduler.ts,    │
    │                   │ turn.ts                                                                         │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Config hub        │ packages/core/src/config/config.ts (2687 lines)                                 │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Tools (~30)       │ packages/core/src/tools/ — shell, edit, write-file, read-file, glob, grep, lsp, │
    │                   │  skill, cron, agent, mcp-tool                                                   │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Services          │ packages/core/src/services/ — file system, shell execution, chat recording,     │
    │                   │ compression, loop detection, cron, git                                          │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Memory            │ packages/core/src/memory/manager.ts, extract.ts, dream.ts, recall.ts, forget.ts │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Hooks             │ packages/core/src/hooks/ — hookSystem, hookRegistry, toolHookTriggers           │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Permissions       │ packages/core/src/permissions/permission-manager.ts, rule-parser.ts,            │
    │                   │ shell-semantics.ts                                                              │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ CLI UI            │ packages/cli/src/ui/AppContainer.tsx, components/, commands/                    │
    │ (React/TUI)       │                                                                                 │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Non-interactive   │ packages/cli/src/nonInteractiveCli.ts                                           │
    │ mode              │                                                                                 │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ ACP (Zed          │ packages/cli/src/acp-integration/acpAgent.ts                                    │
    │ integration)      │                                                                                 │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ IDE/LSP/MCP       │ packages/core/src/ide/, packages/core/src/lsp/, packages/core/src/mcp/          │
    ├───────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
    │ Build             │ scripts/build.js, esbuild.config.js                                             │
    └───────────────────┴─────────────────────────────────────────────────────────────────────────────────┘

    ---

    Gotchas

     - node-pty race conditions are silently suppressed — the entry point catches EIO, EAGAIN, EBADF errors from
       node-pty and ignores them. These are known timing races; a developer might think they'd crash the process.
     - Tools are lazy-loaded — ToolRegistry uses factory functions that dynamically import tool modules. Only
       tools actually used by the model get loaded at runtime. Type exports in index.ts use bare re-exports for
       TypeScript compatibility without eager loading.
     - GeminiChat is a forked dependency — geminiChat.ts copies Google's js-genai package with bug fixes for
       function response handling. The project maintains its own version rather than using the published one.
     - Sandbox relaunch is implicit — if sandboxing is enabled, main() launches a child process into the container
        and immediately exits. Transparent to the user.
     - Auto-memory runs on every query — each user message triggers both scheduleExtract() and scheduleDream() as
       background promises consumed later via consumePendingMemoryTaskPromises().
     - Dead-letter stubs exist for removed features — index.ts contains explicit stub implementations for OAuth
       (ClaudexOAuth2Event, claudexOAuth2Events) and telemetry (shutdownTelemetry) that were removed but whose exports
       are still referenced elsewhere.
     - IDE context is sent as deltas, not full snapshots — after the initial full IDE context (open files, cursor
       position), subsequent updates are computed as diffs to save tokens.
