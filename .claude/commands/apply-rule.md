# Apply Rule Command

Process pending draft reports in `.claude/draft/rules/` by invoking the **`rule-writer`** agent, which critically analyzes each proposal and writes the accepted rules into the correct Ghosty rule set (`front` → `frontend/memory-bank/rules/`, `back` → `backend/memory-bank/rules/`).

This command is a **thin entry point**. It does no analysis of its own — all critical judgment (KEEP / UPDATE / REJECT / REROUTE / CONFLICT), the user-confirmation gate, draft consumption, and README update live inside the `rule-writer` agent. The command only resolves *which* draft(s) to hand it.

## Arguments

- `/apply-rule {file}.md` — process that specific draft (filename alone is enough; searched under `.claude/draft/rules/`).
- `/apply-rule` — no argument: process the **oldest** pending draft.
- `/apply-rule all` — process **every** pending draft, oldest first, one agent run per draft.

## Workflow

### Step 1: List Pending Drafts

```bash
ls -1t .claude/draft/rules/*.md 2>/dev/null   # newest first; oldest is the last line
```

If the folder is empty or missing → tell the user:
> "No pending drafts in `.claude/draft/rules/`. Run `/learn` first to capture one."

and stop.

### Step 2: Resolve Target(s)

- **filename given** → match under `.claude/draft/rules/{filename}`. 0 matches → report "Draft not found: `{filename}`" and abort. Multiple matches → list them numbered and ask which one.
- **no argument** → the oldest draft (last line of the `ls -1t` output).
- **`all`** → the full list, ordered oldest → newest.

### Step 3: Invoke the Agent

For each resolved draft, invoke the `rule-writer` agent with the draft path as its input.

The agent owns everything downstream: reading the full target rule set, deciding create vs update vs reject, showing its analysis table, **waiting for the user's confirmation before writing**, writing the rules, consuming the draft, and updating the `memory-bank/README.md` rules tree.

In **`all`** mode, process **sequentially** — a draft's run (including its confirmation gate) must finish before the next one starts. Never fan out multiple `rule-writer` runs in parallel: they may touch the same rule set and conflict.

### Step 4: Report

Relay each agent run's summary (rules written / rejected / unresolved conflicts). When done, list any drafts still pending and remind the user:
> "Once drafts are integrated, run the `rule-optimizer` agent (target `front`, `back`, or global) to defragment the accumulated rules."
