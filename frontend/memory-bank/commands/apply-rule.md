# Apply Rule Command

Read proposals for new rules or improvements to existing rules, critically analyze them, and produce a plan describing what should **actually** be done. This command never writes to `memory-bank/rules/` directly — it always generates a plan for the user to review and apply via `/apply-plan`.

Its primary input is the **draft reports** produced by `/learn` in `.claude/draft/rules/`. Run this command from the vuemann repo.

**Important**: This command is critical, not compliant. It rejects weak, redundant, or vague proposals and only retains what genuinely improves the rule set.

## Arguments

- **With filename** (`/apply-rule my-report.md`): read the report from `.claude/draft/rules/{filename}` (or an absolute path if provided).
- **Without arguments** (`/apply-rule`): take the **first** report in `.claude/draft/rules/` (oldest by modification time) and process only that one. If the folder is empty or missing, fall back to extracting proposals from the current conversation.

Record the processed report path — it is deleted in Phase 4 once the plan is generated.

## Phase 1: Collect Proposals

### Source

- **Draft mode** (default): read each report in `.claude/draft/rules/`. A report uses the `/learn` format — one `## Proposal N:` block per proposal, with fields `Problem encountered`, `Origin remark`, `Suggested convention`, `Suggested scope`, `Category hint`, plus a report-level `Origin`.
- **Conversation mode** (fallback): scan the user's explicit messages for sentences like:
  - "we should add a rule that..."
  - "this rule should also cover..."
  - "the rule X is unclear / wrong / missing..."
  - "I want to enforce..."

If no proposals are found, stop and tell the user:
> "No rule proposals found in `.claude/draft/rules/`. Run `/learn` in the relevant project, or describe proposals in chat, then re-run `/apply-rule`."

### Normalize

For each proposal, extract:
- **Intent** — what the proposal wants to enforce or change (draft: `Suggested convention`)
- **Scope** — which files / file types it targets (draft: `Suggested scope`)
- **Origin** — which report, user message, or block it came from (draft: report `Origin` + `Origin remark`)
- **Category hint** — the draft's suggested destination (advisory; verify in Phase 2)

## Phase 2: Critical Analysis

Read **all** existing rules in `memory-bank/rules/**/*.md` before judging.

For each proposal, answer these questions and reject anything that fails:

1. **Is it already covered?**
   - Search existing rules for the same intent. If a rule already says the same thing → **REJECT** as redundant. Cite the existing file.

2. **Does it contradict an existing rule?**
   - If yes → flag the contradiction. Do NOT silently override. Ask the user which one wins.

3. **Is it specific enough to be enforceable by an agent?**
   - "Write clean code" → **REJECT** (too vague).
   - "Functions must be ≤ 15 lines" → **KEEP** (measurable).

4. **Is it a rule, or is it a one-off preference?**
   - Rules apply to a class of situations. If it only fits one specific file → **REJECT** as not generalizable.

5. **Does it belong in `memory-bank/rules/`?**
   - Code conventions / patterns → `memory-bank/rules/`
   - Project context → `memory-bank/doc/`
   - Workflow / prompt → `memory-bank/commands/`
   - Tech decision → `memory-bank/doc/internal/decisions/`
   - If it does not belong in `rules/` → **REROUTE** (note the correct destination, do not save to `rules/`).

6. **Which folder?**
   - `global/` — applies to all code
   - `files-type/` — applies to a file role (controller, dto, service)
   - `langage/` — applies to a language (js, vue)
   - `tests/` — applies to test files only

7. **Is the proposal an *improvement* to an existing rule rather than a new one?**
   - If yes → mark as **UPDATE** with the target file path.

### Output of Phase 2

Build an analysis table:

| # | Proposal (1 line) | Verdict | Reason | Target |
|---|-------------------|---------|--------|--------|
| 1 | ...               | KEEP    | ...    | `memory-bank/rules/global/foo.md` (create) |
| 2 | ...               | REJECT  | redundant with `bar.md` | — |
| 3 | ...               | UPDATE  | sharpens existing rule | `memory-bank/rules/files-type/baz.md` |
| 4 | ...               | REROUTE | belongs to `doc/` not `rules/` | `memory-bank/doc/...` |
| 5 | ...               | CONFLICT | contradicts `qux.md` line N | needs user decision |

Show this table to the user **before** generating the plan, and ask:
> "Here is my critical analysis. Confirm verdicts (or override any) before I write the plan."

Wait for confirmation. Apply any user override.

## Phase 3: Generate Plan

Build a slug from the dominant theme of the kept/updated proposals (lowercase, dashes, no special chars).

Write the plan to: `{PLAN_PATH}apply-rule-{slug}.md`

### Plan Format

```markdown
# Apply Rule: {Theme}

## Summary
{1-3 lines: what proposals were retained, what was rejected and why in one breath}

## Plan

- [ ] Step 1: **create** `memory-bank/rules/{folder}/{kebab-name}.md`
  ```markdown
  ---
  paths:
    - "{glob}"
  ---
  # {Rule Name}

  {1-2 line description}

  ## BAD
  {only if ambiguous}

  ## GOOD
  {only if ambiguous}
  ```

- [ ] Step 2: **update** `memory-bank/rules/{folder}/{existing}.md`
  - Change: {exact diff or instruction}
  - Reason: {one line}

- [ ] Step N: ...

## Rejected Proposals (for traceability)
- "{proposal}" — {reason}
- ...

## Unresolved Conflicts
- "{proposal}" vs `{existing rule}` — needs user decision before applying

## Rules to Apply
- [rule-writing-guide.md](memory-bank/rules/global/rule-writing-guide.md) — frontmatter + structure for any new rule

## Post-Apply
- [ ] Update `memory-bank/README.md` rules tree (any new rule added)
- [ ] Run `/optimize-rule {new-rule-file}.md` on each newly created rule to ensure token-efficient form
```

### Constraints on Step Content

- Every new rule **must** include the `paths:` frontmatter and follow `rule-writing-guide.md`.
- Every update step must give the **exact** change (insertion / replacement text), not a vague "improve wording".
- Never propose a step that creates a rule already rejected in the analysis table.

## Phase 4: Hand Off

1. **Consume the draft**: once the plan is written, delete the processed report from `.claude/draft/rules/` (draft mode only — nothing to delete in conversation mode). The plan now holds the concrete rule content, so the draft is no longer needed.

2. Tell the user:
   > "Plan saved at `{PLAN_PATH}apply-rule-{slug}.md`. Draft `{report}` consumed and removed. Review the plan, then apply with `/apply-plan apply-rule-{slug}.md`."

Do **not** apply the plan in this command. Do **not** create or modify any file under `memory-bank/rules/`.

## Hard Rules

- Never accept a proposal without checking for duplication against the full `memory-bank/rules/` tree.
- Never silently resolve a contradiction — surface it.
- Never write a rule that is too vague for an agent to enforce.
- Never bypass the user confirmation step between Phase 2 and Phase 3.
