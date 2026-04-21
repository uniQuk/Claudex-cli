Qwen → Claudex: Full Rename Plan                                                                                 
                                                        
 Context

 The codebase is a fork of qwen-code rebranded to Claudex. Surface-level renames (binary name, package name,
 config file CLAUDEX.md) were done in earlier phases, but deep references to "Qwen", "qwen", and "QWEN" remain
 throughout: environment variable names, storage directory (.qwen), internal symbol names, user-visible strings,
 copyright headers, and documentation. This plan completes the rebrand and then runs a simplify pass to clean up
 residual dead code.

 ---
 Phase 1 — Storage directory: .qwen → .claudex

 File: packages/core/src/config/storage.ts

 Rename the exported constant and all derived methods:
 - QWEN_DIR = '.qwen' → CLAUDEX_DIR = '.claudex'
 - SKILL_PROVIDER_CONFIG_DIRS = ['.qwen', '.agents'] → ['.claudex', '.agents']
 - getGlobalQwenDir() → getGlobalClaudexDir() (update callers: getMcpOAuthTokensPath, getGlobalSettingsPath,
 getInstallationIdPath, etc.)
 - Method comments: ~/.qwen → ~/.claudex
 - QWEN_RUNTIME_DIR env var → CLAUDEX_RUNTIME_DIR (with backward-compat: check CLAUDEX_RUNTIME_DIR first, then
 fall back to QWEN_RUNTIME_DIR)

 Add startup migration shim (in packages/core/src/config/storage.ts or called from
 packages/cli/src/core/initializer.ts):
 // On first run: if ~/.claudex doesn't exist but ~/.qwen does, rename it
 const oldDir = path.join(os.homedir(), '.qwen');
 const newDir = Storage.getGlobalClaudexDir();
 if (!fs.existsSync(newDir) && fs.existsSync(oldDir)) {
   fs.renameSync(oldDir, newDir);
 }

 Update all callers of getGlobalQwenDir() — find with grep -r getGlobalQwenDir packages/ and update each call
 site.

 File: packages/core/src/memory/const.ts — QWEN_CONFIG_DIR constant name is already set to '.claudex' value but
 the name is stale:
 - Rename QWEN_CONFIG_DIR → CLAUDEX_CONFIG_DIR (update import sites)
 - Rename internal currentGeminiMdFilename → currentContextFilename
 - Rename setGeminiMdFilename → setContextFilename (update all callers across core + cli)
 - Rename getCurrentGeminiMdFilename → getCurrentContextFilename
 - Rename getAllGeminiMdFilenames → getAllContextFilenames

 ---
 Phase 2 — Environment variables: QWEN_* → CLAUDEX_*

 For each env var, add backward-compat: read new name first, fall back to old name.

 ┌───────────────────────────────┬─────────────────────────────┬─────────────────────────────────────────────┐
 │           Old name            │          New name           │                    File                     │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_RUNTIME_DIR              │ CLAUDEX_RUNTIME_DIR         │ packages/core/src/config/storage.ts         │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_SANDBOX                  │ CLAUDEX_SANDBOX             │ packages/cli/src/config/sandboxConfig.ts    │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_SANDBOX_IMAGE            │ CLAUDEX_SANDBOX_IMAGE       │ packages/cli/src/config/sandboxConfig.ts    │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_SANDBOX_PROXY_COMMAND    │ CLAUDEX_SANDBOX_PROXY_COMMA │ packages/cli/src/utils/sandbox.ts           │
 │                               │ ND                          │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_LANG                │ CLAUDEX_LANG                │ packages/cli/src/i18n/index.ts,             │
 │                               │                             │ packages/cli/src/core/initializer.ts        │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_SYSTEM_SETTINGS_PAT │ CLAUDEX_SYSTEM_SETTINGS_PAT │ packages/cli/src/config/settings.ts         │
 │ H                             │ H                           │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_SYSTEM_DEFAULTS_PAT │ CLAUDEX_SYSTEM_DEFAULTS_PAT │ packages/cli/src/config/settings.ts         │
 │ H                             │ H                           │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_TRUSTED_FOLDERS_PAT │ CLAUDEX_TRUSTED_FOLDERS_PAT │ packages/cli/src/config/trustedFolders.ts   │
 │ H                             │ H                           │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_DISABLED_SLASH_COMMANDS  │ CLAUDEX_DISABLED_SLASH_COMM │ packages/cli/src/config/config.ts           │
 │                               │ ANDS                        │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_ENABLE_CRON         │ CLAUDEX_ENABLE_CRON         │ packages/cli/src/config/settingsSchema.ts   │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_IDE_SERVER_PORT     │ CLAUDEX_IDE_SERVER_PORT     │ packages/cli/src/utils/sandbox.ts,          │
 │                               │                             │ packages/core/src/ide/ide-client.ts         │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_IDE_WORKSPACE_PATH  │ CLAUDEX_IDE_WORKSPACE_PATH  │ packages/cli/src/utils/sandbox.ts,          │
 │                               │                             │ packages/core/src/ide/ide-client.ts         │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_IDE_SERVER_STDIO_CO │ CLAUDEX_IDE_SERVER_STDIO_CO │ packages/core/src/ide/ide-client.ts         │
 │ MMAND                         │ MMAND                       │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_IDE_SERVER_STDIO_AR │ CLAUDEX_IDE_SERVER_STDIO_AR │ packages/core/src/ide/ide-client.ts         │
 │ GS                            │ GS                          │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_NO_RELAUNCH         │ CLAUDEX_NO_RELAUNCH         │ packages/cli/src/utils/relaunch.ts          │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_DISABLE_EARLY_CAPTU │ CLAUDEX_DISABLE_EARLY_CAPTU │ packages/cli/src/utils/earlyInputCapture.ts │
 │ RE                            │ RE                          │                                             │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_INTEGRATION_TEST    │ CLAUDEX_INTEGRATION_TEST    │ packages/cli/src/utils/sandbox.ts           │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE_TEST_VAR            │ CLAUDEX_TEST_VAR            │ packages/cli/src/utils/sandbox.ts           │
 ├───────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────┤
 │ QWEN_CODE (set in shell env)  │ CLAUDEX                     │ packages/core/src/services/shellExecutionSe │
 │                               │                             │ rvice.ts                                    │
 └───────────────────────────────┴─────────────────────────────┴─────────────────────────────────────────────┘

 Backward-compat pattern:
 // Before:
 process.env['QWEN_SANDBOX']
 // After:
 process.env['CLAUDEX_SANDBOX'] ?? process.env['QWEN_SANDBOX']

 Update all tests that reference old env var names (sed-scriptable once source is done):
 - packages/cli/src/config/config.test.ts (QWEN_SANDBOX_IMAGE, QWEN_RUNTIME_DIR)
 - packages/cli/src/config/trustedFolders.test.ts
 - packages/cli/src/config/settings.test.ts
 - packages/cli/src/utils/earlyInputCapture.test.ts
 - packages/cli/src/acp-integration/runtimeOutputDirContext.test.ts
 - packages/core/src/ide/ide-client.test.ts

 ---
 Phase 3 — Internal symbol renames

 packages/cli/src/nonInteractiveCli.ts
 - const geminiClient → const llmClient (3 occurrences at lines ~187, ~353, ~518)

 packages/cli/src/ui/themes/ — rename files and update their references:
 - qwen-dark.ts → claudex-dark.ts
 - qwen-light.ts → claudex-light.ts
 - Update any file that imports or references these theme names (theme registry/index)

 packages/core/src/index.ts — rename exported no-op stubs:
 - QwenOAuth2Event → keep as-is (it's a dead-letter stub; renaming may break callers — low priority)
 - qwenOAuth2Events → keep as-is for same reason

 .vscode/launch.json
 - "QWEN_SANDBOX": "false" → "CLAUDEX_SANDBOX": "false" (2 occurrences)
 - "remoteRoot": "/usr/local/share/npm-global/lib/node_modules/@qwen-code" → update to @claudex

 ---
 Phase 4 — User-visible strings

 packages/cli/src/ui/FeedbackDialog.tsx
 - "How is Qwen doing this session?" → "How is Claudex doing this session?"

 packages/cli/src/config/settingsSchema.ts
 - Description strings referencing QWEN_SANDBOX_IMAGE, ~/.qwen, QWEN_RUNTIME_DIR → update to new names

 packages/cli/src/config/config.ts
 - Comment mentioning QWEN_DISABLED_SLASH_COMMANDS → update to CLAUDEX_DISABLED_SLASH_COMMANDS

 packages/cli/src/config/sandboxConfig.ts
 - Error strings: "Missing sandbox command '${sandbox}' (from QWEN_SANDBOX)" → CLAUDEX_SANDBOX
 - Error strings: "QWEN_SANDBOX is true but failed..." → CLAUDEX_SANDBOX

 packages/cli/src/i18n/locales/en.js
 - Any "Qwen Code" → "Claudex" occurrences

 packages/cli/src/i18n/locales/zh.js
 - References to "Qwen Code" → "Claudex" (keep Chinese translations but update the product name)

 ---
 Phase 5 — Copyright headers (script)

 Run a targeted sed over all .ts, .tsx, .js source files under packages/ and integration-tests/ and scripts/:

 find packages integration-tests scripts -name '*.ts' -o -name '*.tsx' -o -name '*.js' \
   | xargs sed -i '' 's/Copyright 2025 Qwen Team/Copyright 2025 Claudex CLI contributors/g'

 Do NOT change Copyright 2025 Google LLC lines — those retain the original upstream attribution.

 ---
 Phase 6 — Documentation

 Update these files for Qwen → Claudex references, ~/.qwen → ~/.claudex, QWEN_* → CLAUDEX_*, and URLs:

 - README.md — main project README
 - GETSTARTED.md — installation guide
 - AGENTS.md — context file for agents
 - docs/users/configuration/settings.md
 - docs/users/configuration/auth.md
 - docs/users/configuration/model-providers.md
 - docs/users/features/sandbox.md
 - docs/users/features/memory.md
 - docs/users/overview.md, docs/users/quickstart.md, docs/users/common-workflow.md
 - docs/developers/architecture.md, docs/developers/contributing.md
 - docs/developers/development/ (all files)
 - packages/zed-extension/README.md
 - scripts/installation/install-qwen-with-source.sh — update binary name, alias, install path
 - scripts/create_alias.sh — alias qwen= → alias claudex=

 ---
 Phase 7 — Config/fixture files

 - integration-tests/fixtures/settings-migration/workspaces.json — model names with "gemini" prefix (update to
 valid model names or keep as test data)
 - integration-tests/test-helper.ts:210 — "bundled gemini.js" comment → "bundled claudex.js"
 - integration-tests/concurrent-runner/config.example.json — any qwen-specific values
 - scripts/unused-keys-only-in-locales.json — OAuth auth message keys

 ---
 Phase 8 — Simplify pass

 After all renames compile cleanly, invoke the simplify skill to review recently changed code for dead code,
 redundancy, and quality issues.

 ---
 Critical files to modify

 ┌─────────────────────────────────────────────────────┬──────────────────────────────────────────────────────┐
 │                        File                         │                       Changes                        │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/core/src/config/storage.ts                 │ CLAUDEX_DIR, getGlobalClaudexDir(), migration shim,  │
 │                                                     │ CLAUDEX_RUNTIME_DIR                                  │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/core/src/memory/const.ts                   │ CLAUDEX_CONFIG_DIR, rename Gemini functions          │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/config/sandboxConfig.ts            │ CLAUDEX_SANDBOX, CLAUDEX_SANDBOX_IMAGE               │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/utils/sandbox.ts                   │ CLAUDEX_SANDBOX_PROXY_COMMAND, CLAUDEX env vars      │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/config/config.ts                   │ CLAUDEX_DISABLED_SLASH_COMMANDS                      │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/config/settings.ts                 │ CLAUDEX_SYSTEM_SETTINGS_PATH,                        │
 │                                                     │ CLAUDEX_SYSTEM_DEFAULTS_PATH                         │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/config/trustedFolders.ts           │ CLAUDEX_TRUSTED_FOLDERS_PATH                         │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/i18n/index.ts                      │ CLAUDEX_LANG                                         │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/core/initializer.ts                │ CLAUDEX_LANG, migration shim call                    │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/utils/relaunch.ts                  │ CLAUDEX_NO_RELAUNCH                                  │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/utils/earlyInputCapture.ts         │ CLAUDEX_DISABLE_EARLY_CAPTURE                        │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/core/src/services/shellExecutionService.ts │ CLAUDEX (was QWEN_CODE)                              │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/core/src/ide/ide-client.ts                 │ CLAUDEX_IDE_* env vars                               │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/nonInteractiveCli.ts               │ geminiClient → llmClient                             │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/ui/themes/qwen-*.ts                │ rename files → claudex-*.ts                          │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/ui/FeedbackDialog.tsx              │ UI string                                            │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ packages/cli/src/config/settingsSchema.ts           │ description strings                                  │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ All test files (see Phase 2)                        │ env var names                                        │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ Copyright headers (508 files)                       │ sed script                                           │
 ├─────────────────────────────────────────────────────┼──────────────────────────────────────────────────────┤
 │ Documentation files                                 │ targeted updates                                     │
 └─────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┘

 ---
 Verification

 After each phase:
 npm run build   # must stay clean
 After Phase 2 (env vars):
 cd packages/core && npx vitest run
 cd packages/cli  && npx vitest run
 Spot check the storage migration by running the binary and verifying ~/.claudex/settings.json is created (or
 migrated from ~/.qwen).