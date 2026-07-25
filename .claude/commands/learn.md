# Learn Command

Capture frictions from a recently implemented feature, bug fix, or refactoring and write them as a **draft proposal report** for the Ghosty rule set. Learnings come exclusively from the user's explicit remarks in the conversation (corrections, confirmations, feedback); git history is context only.

**Important**: This command never writes to any `memory-bank/`. It writes a self-contained proposal report into **this repo** at `.claude/draft/rules/`. Deciding what to actually do with each proposal is deferred to the `rule-writer` agent, run later.

Ghosty is a monorepo: rules live in **two** separate rule sets — `frontend/memory-bank/rules/` (Vue 3 / JS) and `backend/memory-bank/rules/` (Laravel / PHP). Every proposal must therefore declare a **Target** (`front` or `back`) so the `rule-writer` agent routes it to the correct rule set.

## Phase 0: Context Detection

1. Resolve the draft directory (always inside this repo):
   ```powershell
   $draftDir = Join-Path (git rev-parse --show-toplevel) '.claude/draft/rules'
   ```
   This resolves to `<repo-root>/.claude/draft/rules/`.

2. Detect the **Target** of the work discussed. This is per-proposal, but pre-compute a default from what the conversation touched:
   - Changes under `frontend/**` → default Target `front`
   - Changes under `backend/**` → default Target `back`
   - Both touched → no default; decide Target per proposal in Phase 2
   ```bash
   git diff --name-only HEAD | grep -E '^(frontend|backend)/' | cut -d/ -f1 | sort -u
   ```

3. List the relevant rule set(s) for reference when available:
   ```bash
   ls -1 frontend/memory-bank/rules 2>/dev/null   # front
   ls -1 backend/memory-bank/rules 2>/dev/null    # back
   ```

## Phase 1: Auto-Analysis

### Source Priority

- **Primary source (learnings)**: the user's explicit remarks — corrections ("don't do X", "that's wrong"), confirmations ("yes, that's the right approach"), feedback ("this pattern works well"). Only these produce proposals.
- **Context only (never a source of learnings)**: `git diff`, `git log` — use them to understand what changed, never to infer a learning from code alone.

### Fallback: No Remarks Found

If the conversation has no explicit remark, correction, or feedback, stop and tell the user:

> "I found no explicit remarks or corrections in this conversation to learn from. If you have feedback, share it and run `/learn` again."

Do not proceed.

### Analysis Questions

Scan the user's explicit remarks and answer:

1. What did the user explicitly confirm or validate as working well?
2. What did the user correct or flag as wrong?
3. What decisions did the user explicitly state or justify?
4. What patterns did the user say should be reused?
5. What did the user say should be avoided?

Then present a short recap and ask which frictions to include:

> "Here's what I extracted from your remarks. Which should I include in the draft report?"
>
> 1. ...
> 2. ...

## Phase 2: Categorize Proposals

For each retained friction, set two hints (the `rule-writer` agent makes the final call):

**Target** (`front` | `back`) — which rule set the proposal belongs to:

| Target  | Rule set                        | Stack        |
|---------|---------------------------------|--------------|
| `front` | `frontend/memory-bank/rules/`   | Vue 3 / JS   |
| `back`  | `backend/memory-bank/rules/`    | Laravel / PHP|

If a friction is genuinely relevant to both stacks, split it into one `front` proposal and one `back` proposal.

**Category hint** — likely destination inside the chosen rule set:

| Category hint | Likely folder in `{target}/memory-bank/`      |
|---------------|-----------------------------------------------|
| `rule`        | `rules/`                                       |
| `decision`    | `decisions/` (ADR)                             |
| `doc`         | `doc/`                                          |

The hints are advisory only — do not finalize destinations here.

## Phase 3: Write Draft Report

1. Build a slug from the dominant theme (lowercase, dashes, no special characters).
2. Create `$draftDir` if it does not exist.
3. Write the report to `$draftDir/{slug}.md`.

Each proposal must be **self-contained** — the `rule-writer` agent reads it in another session, without this conversation.

### Report Format

```markdown
# Learn Report: {Topic}

- **Feature / context**: {1 line}

## Proposal 1: {short title}
- **Target**: front | back
- **Problem encountered**: {the friction, correction, or anti-pattern}
- **Origin remark**: {the user message that triggered it}
- **Suggested convention**: {what should be enforced or changed}
- **Suggested scope**: {file types / globs it would target}
- **Category hint**: rule | decision | doc

## Proposal 2: ...
```

## Phase 4: Hand Off

Tell the user:

> "Draft report saved at `.claude/draft/rules/{slug}.md`. Invoke the `rule-writer` agent on it to critically analyze each proposal and write the accepted rules into the right rule set (`front` → `frontend/memory-bank/rules/`, `back` → `backend/memory-bank/rules/`). After rules are written, run the `rule-optimizer` agent to defragment them."
