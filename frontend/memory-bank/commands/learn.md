# Learn Command

Capture frictions from a recently implemented feature, bug fix, or refactoring and write them as a **draft proposal report** for the vuemann rule set. Learnings come exclusively from the user's explicit remarks in the conversation (corrections, confirmations, feedback); git history is context only.

**Important**: This command never writes to `memory-bank/`. It writes a self-contained proposal report into the developer's vuemann repo at `C:/Users/{current user}/Projets/vuemann/.claude/draft/rules/`. Deciding what to actually do with each proposal is deferred to `/apply-rule`, run later in that vuemann repo.

## Phase 0: Context Detection

1. Resolve the target draft directory (same for every project — it always points at the developer's vuemann checkout):
   ```powershell
   $draftDir = Join-Path $env:USERPROFILE 'Projets\vuemann\.claude\draft\rules'
   ```
   This resolves to `C:/Users/{current user}/Projets/vuemann/.claude/draft/rules/`.

2. Detect origin (recorded in the report header only — it does not change the output path):
   - `memory-bank/rules/` exists at the current project root → **vuemann context**
   - otherwise → **child app context** (read the app name from `package.json`)

3. List `memory-bank/doc/` for reference when available:
   ```bash
   ls -1tr memory-bank/doc/ 2>/dev/null
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

For each retained friction, add a **category hint** (apply-rule makes the final call):

| Category hint | Likely destination in vuemann          |
|---------------|-----------------------------------------|
| `rule`        | `memory-bank/rules/`                    |
| `decision`    | `memory-bank/doc/internal/decisions/`   |
| `memory`      | `memory-bank/doc/`                      |
| `command`     | `memory-bank/commands/`                 |
| `template`    | `memory-bank/doc/templates/`            |

The hint is advisory only — do not finalize destinations here.

## Phase 3: Write Draft Report

1. Build a slug from the dominant theme (lowercase, dashes, no special characters).
2. Create `$draftDir` if it does not exist.
3. Write the report to `$draftDir/{slug}.md`.

Each proposal must be **self-contained** — apply-rule reads it in another repo/session, without this conversation.

### Report Format

```markdown
# Learn Report: {Topic}

- **Origin**: {vuemann | child app name}
- **Feature / context**: {1 line}

## Proposal 1: {short title}
- **Problem encountered**: {the friction, correction, or anti-pattern}
- **Origin remark**: {the user message that triggered it}
- **Suggested convention**: {what should be enforced or changed}
- **Suggested scope**: {file types / globs it would target}
- **Category hint**: rule | decision | memory | command | template

## Proposal 2: ...
```

## Phase 4: Hand Off

Tell the user:

> "Draft report saved at `C:/Users/{current user}/Projets/vuemann/.claude/draft/rules/{slug}.md`. In the vuemann repo, run `/apply-rule .claude/draft/rules/{slug}.md` to critically analyze it and generate the apply plan."
