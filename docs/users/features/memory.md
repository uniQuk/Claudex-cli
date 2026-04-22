# Memory

Every Claudex session starts with a fresh context window. Two mechanisms carry knowledge across sessions so you don't have to re-explain yourself every time:

- **CLAUDEX.md** — instructions _you_ write once and Claudex reads every session
- **Auto-memory** — notes Claudex writes itself based on what it learns from you

---

## CLAUDEX.md: your instructions to Claudex

CLAUDEX.md is a plain text file where you write things Claudex should always know about your project or your preferences. Think of it as a permanent briefing that loads at the start of every conversation.

### What to put in CLAUDEX.md

Add things you'd otherwise have to repeat every session:

- Build and test commands (`npm run test`, `make build`)
- Coding conventions your team follows ("all new files must have JSDoc comments")
- Architectural decisions ("we use the repository pattern, never call the database directly from controllers")
- Personal preferences ("always use pnpm, not npm")

Don't include things Claudex can figure out by reading your code. CLAUDEX.md works best when it's short and specific — the longer it gets, the less reliably Claudex follows it.

### Where to create CLAUDEX.md

| File                          | Who it applies to                             |
| ----------------------------- | --------------------------------------------- |
| `~/.claudex/CLAUDEX.md`             | You, across all your projects                 |
| `CLAUDEX.md` in the project root | Your whole team (commit it to source control) |

You can have both. Claudex loads all CLAUDEX.md files it finds when you start a session — your personal one plus any in the project.

If your repository already has an `AGENTS.md` file for other AI tools, Claudex reads that too. No need to duplicate instructions.

### Generate one automatically with `/init`

Run `/init` and Claudex will analyze your codebase to create a starter CLAUDEX.md with build commands, test instructions, and conventions it finds. If one already exists, it suggests additions instead of overwriting.

### Reference other files

You can point CLAUDEX.md at other files so Claudex reads them too:

```markdown
See @README.md for project overview.

# Conventions

- Git workflow: @docs/git-workflow.md
```

Use `@path/to/file` anywhere in CLAUDEX.md. Relative paths resolve from the CLAUDEX.md file itself.

---

## Auto-memory: what Claudex learns about you

Auto-memory runs in the background. After each of your conversations, Claudex quietly saves useful things it learned — your preferences, feedback you gave, project context — so it can use them in future sessions without you repeating yourself.

This is different from CLAUDEX.md: you don't write it, Claudex does.

### What Claudex saves

Claudex looks for four kinds of things worth remembering:

| What                    | Examples                                                 |
| ----------------------- | -------------------------------------------------------- |
| **About you**           | Your role, background, how you like to work              |
| **Your feedback**       | Corrections you made, approaches you confirmed           |
| **Project context**     | Ongoing work, decisions, goals not obvious from the code |
| **External references** | Dashboards, ticket trackers, docs links you mentioned    |

Claudex doesn't save everything — only things that would actually be useful next time.

### Where it's stored

Auto-memory files live at `~/.claudex/projects/<project>/memory/`. All branches and worktrees of the same repository share the same memory folder, so what Claudex learns in one branch is available in others.

Everything saved is plain markdown — you can open, edit, or delete any file at any time.

### Periodic cleanup

Claudex periodically goes through its saved memories to remove duplicates and clean up outdated entries. This runs automatically in the background once a day after enough sessions have accumulated. You can trigger it manually with `/dream` if you want it to run now.

While cleanup is running, **✦ dreaming** appears in the corner of the screen. Your session continues normally.

### Turning it on or off

Auto-memory is on by default. To toggle it, open `/memory` and use the switches at the top. You can turn off just the automatic saving, just the periodic cleanup, or both.

You can also set them in `~/.claudex/settings.json` (applies to all projects) or `.claudex/settings.json` (this project only):

```json
{
  "memory": {
    "enableManagedAutoMemory": true,
    "enableManagedAutoDream": true
  }
}
```

---

## Commands

### `/memory`

Opens the Memory panel. From here you can:

- Turn auto-memory saving on or off
- Turn periodic cleanup (dream) on or off
- Open your personal CLAUDEX.md (`~/.claudex/CLAUDEX.md`)
- Open the project CLAUDEX.md
- Browse the auto-memory folder

### `/init`

Generates a starter CLAUDEX.md for your project. Claudex reads your codebase and fills in build commands, test instructions, and conventions it discovers.

### `/remember <text>`

Immediately saves something to auto-memory without waiting for Claudex to pick it up automatically:

```
/remember always use snake_case for Python variable names
/remember the staging environment is at staging.example.com
```

### `/forget <text>`

Removes auto-memory entries that match your description:

```
/forget old workaround for the login bug
```

### `/dream`

Runs the memory cleanup now instead of waiting for the automatic schedule:

```
/dream
```

---

## Troubleshooting

### Claudex isn't following my CLAUDEX.md

Open `/memory` to see which files are loaded. If your file isn't listed, Claudex can't see it — make sure it's in the project root or `~/.claudex/`.

Instructions work better when they're specific:

- ✓ `Use 2-space indentation for TypeScript files`
- ✗ `Format code nicely`

If you have multiple CLAUDEX.md files with conflicting instructions, Claudex may behave inconsistently. Review them and remove any contradictions.

### I want to see what Claudex has saved

Run `/memory` and select **Open auto-memory folder**. All saved memories are readable markdown files you can browse, edit, or delete.

### Claudex keeps forgetting things

If auto-memory is on but Claudex doesn't seem to remember things across sessions, try running `/dream` to force a cleanup pass. Also check `/memory` to confirm both toggles are enabled.

For things you always want Claudex to remember, add them to CLAUDEX.md instead — auto-memory is best-effort, CLAUDEX.md is guaranteed.
