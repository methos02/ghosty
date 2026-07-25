# Optimize Rule Command

Invoke the `rule-optimizer` subagent on a single rule file or on the entire `memory-bank/rules/` folder.

## Arguments

- **With filename** (`/optimize-rule some-rule.md`): optimize only the specified file.
- **Without arguments** (`/optimize-rule`): global mode — optimize every rule in `memory-bank/rules/`.

## Workflow

### Step 1: Parse Argument

Check if a filename was provided.

### Step 2: Resolve Target (single-file mode only)

1. Search under `memory-bank/rules/**/{filename}` (the filename alone is enough — the user does not need to provide the full path).
2. If **0 matches** → report "Rule not found: `{filename}`" and abort.
3. If **multiple matches** → list them numbered and ask the user to pick one.
4. If **1 match** → use it.

### Step 3: Invoke Agent

- **Single-file mode**: invoke the `rule-optimizer` subagent with the resolved file path as input.
- **Global mode**: invoke the `rule-optimizer` subagent with NO file path (agent will scan all rules).

### Step 4: Report

When the agent finishes, relay its summary:
- Files processed
- Changes applied / skipped
- Unresolved contradictions (if any)
