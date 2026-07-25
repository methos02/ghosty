# Goal
Apply the plan "$ARGUMENTS" to the current project with full quality assurance. Auto-detects whether the project is **vuemann itself** or a **child application** and runs the matching workflow.

# Context

- **Plan location**: `{PLAN_PATH}$ARGUMENTS` (if `$ARGUMENTS` already ends with `.md`, do NOT append `.md` again)
- **Context detection** — runs at Step 0 and drives every later path/step:
  - `memory-bank/rules/` exists at the project root → **vuemann context** (rules live in this repo)
  - Otherwise → **app context** (rules live in `node_modules/@brugmann/vuemann/memory-bank/rules/`)
- **Source rules base path** (resolved from context):
  - vuemann: `memory-bank/rules/`
  - app: `node_modules/@brugmann/vuemann/memory-bank/rules/`
  - Subfolders used below: `global/*.md`, `files-type/*.md`, `langage/**/*.md`, `tests/*.md`

# Workflow

## Step 0: Detect Context, Issue Linkage, and Branch Guard

### 0.1 Detect Context
Detect context (vuemann / app) per the rule above. Resolve the rules base path. Display: "Context: {vuemann|app}".

### 0.2 Issue Linkage Gate (BLOCKING when not linked)

**IMPORTANT**: This project is hosted on **GitHub**. Use `gh` (GitHub CLI), **never** `glab` (GitLab CLI).

A plan must be linked to an issue before it is applied. Detect linkage by the **plan file name**:

- **Linked** → the file name starts with `{number}-` (one or more digits followed by a hyphen), e.g. `1234-refactor-auth.md`. Note the issue number (leading digits) for later steps and skip to 0.3.
- **Not linked** → the file name has no numeric prefix, e.g. `refactor-auth.md`. **Create the issue first** (steps below). Do NOT create a branch or modify any source file until the issue exists.

When not linked, create the issue via a draft-validation flow (no long questioning phase):

1. Read the plan file content (`{PLAN_PATH}$ARGUMENTS`).
2. Derive a draft issue **from the plan**:
   - **Title**: short, action-oriented, English — from the plan's H1 / summary.
   - **Label**: `bug` or `New Feature` (infer from the plan; if ambiguous default to `New Feature`; confirm with `gh label list` if unsure).
   - **Body**: a concise issue *specification* (Context, User Story if inferable, Scope, Acceptance Criteria). Do NOT copy the implementation steps — the issue is a spec; the plan holds the steps.
3. Write the draft to `{PLAN_PATH}.issue-draft-{slug}.md` (`{slug}` = the plan file name without its `.md` extension) and show its full path to the user.
4. **Blocking gate**: wait for explicit approval ("ok", "go", "approved", "validé", "create it"). If the user requests changes, update the draft in place and ask again. Do NOT call `gh` before approval.
5. On approval, write the cleaned body to `{PLAN_PATH}.issue-body-tmp.md`, then run:
   ```bash
   gh issue create --title "{title}" --body-file {PLAN_PATH}.issue-body-tmp.md --label "{label}"
   ```
6. Capture the issue number and URL from the `gh` output. Report: `Issue #{number} created — {url}`. Delete `{PLAN_PATH}.issue-body-tmp.md`.
7. **Rename the plan** to `{PLAN_PATH}{number}-{slug}.md` for traceability. Use this renamed file as the **effective plan name** for every later step (Step 1 onward and the branch guard below).
8. **Delete the issue draft**: remove `{PLAN_PATH}.issue-draft-{slug}.md` — it has served its purpose now that the issue exists. The **plan file itself is kept** until the work is merged; `/issue-close` deletes it after the merge.

### 0.3 Branch Guard
1. Run `git rev-parse --abbrev-ref HEAD`. If the current branch is `master`:
   - Derive a branch name from the **effective plan name** (the renamed `{number}-{slug}.md` when an issue was just created, otherwise `$ARGUMENTS`): strip a trailing `.md`, lowercase, replace any non-alphanumeric character with `-`, and prefix with `apply/`. Example: `1234-refactor-auth.md` → `apply/1234-refactor-auth`.
   - Create and switch with `git checkout -b <branch>`. If the branch already exists, switch with `git checkout <branch>` instead.
2. If the current branch is not `master`, skip the branch creation and continue on the current branch.

## Step 1: Apply Plan
**Agent**: `plan-applier`
**Input**:
- Plan name: the **effective plan name** from Step 0 (the renamed `{number}-{slug}.md` if an issue was just created, otherwise `$ARGUMENTS`)
- Context: `{vuemann|app}` (from Step 0)

Apply the steps from the plan that match the detected context.

## Step 2: Code Quality Loop
**Agent**: `code-quality-checker`
**Input**: Context: `{vuemann|app}`

1. Read ALL source rule files: `{rules-base}/global/*.md`, `{rules-base}/files-type/*.md`, `{rules-base}/langage/**/*.md`
2. Find modified source files via `git diff --name-only` (filter `src/**/*.js`, `src/**/*.vue`)
3. For each file, check against rules matching its path (use frontmatter `paths` to filter)
4. Apply corrections
5. Run `npm run lint`
6. Repeat if issues remain

Exit condition: **ALL_FILES_COMPLIANT**

## Step 3: Create/Update Tests
**Agent**: `test-creator-updater`
**Input**: Context: `{vuemann|app}`

1. Read ALL test rule files: `{rules-base}/tests/*.md`
2. Find modified source files via `git diff --name-only` (filter `src/**/*.js`)
3. For each modified source file, create or update the corresponding test file following:
   - File structure from `test-structure.md`
   - Seeder pattern from `no-hardcoded-data-but-seeders-instead.md`
   - Mock rules from `mock-external-services.md`, `no-mock-current-app-logic.md`, `test-cleanup.md`
   - Assertion rules from `verify-dto-output-in-tests.md`, `compare-with-dto-transformation.md`, `use-toHaveBeenCalledWith-if-argument.md`, `forbidden-test-patterns.md`
   - Quality rules from `avoid-redundant-tests.md`, `test-only-useful-behavior.md`

## Step 4: Test Quality Loop
**Agent**: `test-quality-checker`
**Input**: Context: `{vuemann|app}`

1. Read ALL test rule files: `{rules-base}/tests/*.md`
2. Find modified/created test files via `git diff --name-only` (filter `tests/**/*.test.js`)
3. For each test file, check against ALL test rules
4. Apply corrections
5. **Run scoped tests only** — never the full suite inside the loop. Build the file list from step 2 and run:
   ```bash
   npx vitest run <space-separated-modified-test-files>
   ```
   Rationale: the full suite takes ~40 s; iterating on it is wasteful when only a handful of files changed. A scoped run on one file is typically 3-8 s.
6. If corrections were applied in this iteration, repeat from step 3. Exit the loop as soon as one iteration produces zero corrections AND the scoped run is green.

Exit condition: **ALL_TESTS_COMPLIANT**

## Step 5: Full Suite Sanity Check
Run the full test suite **exactly once**, after Step 4 has converged, to catch any cross-file regression the scoped runs could have missed:

```bash
npm test
```

If it fails, hand control back to the `test-quality-checker` agent with the failing file list, then re-run only those files (not the full suite again).

## Step 6: Final Code Quality Check (conditional)
**Agent**: `code-quality-checker`
**Input**: Context: `{vuemann|app}`

**Skip this step entirely** if Step 4 did not modify any `src/**/*.{js,vue}` file (the normal case — test corrections should never touch source code). Run `git diff --name-only` between the start and end of Step 4 to verify.

If source files were modified in Step 4, re-run the same workflow as Step 2 on those files only.

Exit condition: **ALL_FILES_COMPLIANT** (or skipped).

## Steps 7–9: Vuemann-only documentation and changelog

**Skip Steps 7, 8, and 9 entirely if context = `app`.** Child apps do not own vuemann's documentation or changelog.

### Step 7: Update Vue Documentation (vuemann context only)
If the plan introduced new functionality (new component, new service method, new helper, new prop, new event, etc.):
1. Update the corresponding `.vue` documentation page in `src/views/` to reflect the new functionality
2. If a new component or service was created, create its documentation page following existing patterns

### Step 8: Update MD Documentation (vuemann context only)
If the plan introduced new functionality:
1. Update the corresponding `.md` documentation file in `memory-bank/doc/` to reflect the new functionality
2. If a new component or service was created, create its `.md` doc file following existing patterns
3. Update `CLAUDE.md` if the new functionality should be referenced there (new component, new service, new helper)

### Step 9: Update Changelog (vuemann context only)

Generate or update the changelog entry for the **next** vuemann version.

1. Read the current version from `package.json` and compute the next patch version (e.g., `4.10.12` → `4.10.13`). This is `{next-version}`.
2. The target file is **always** `memory-bank/changelog/{next-version}.md`. Never use the `current-` prefix — the legacy `current-{version}.md` naming is deprecated. Ignore any existing `current-*.md` files; if one exists it means it was never renamed to its target version and should be handled separately, not appended to.
3. Read the changelog format from `memory-bank/changelog/README.md`.
4. Check if `memory-bank/changelog/{next-version}.md` exists:
   - If yes: read the existing file and append new entries to the appropriate sections (Breaking Changes / New Features / Improvements)
   - If no: create a new file following the format
5. Analyze the changes made (via `git diff --name-only` against `master`) and categorize each change:
   - **Breaking Changes**: renamed/removed exports, changed component props, changed function signatures, removed features
   - **New Features**: new components, helpers, services, props, events
   - **Improvements**: performance, accessibility, bug fixes, refactoring that affects behavior
6. Write entries following the format defined in `memory-bank/changelog/README.md`
7. Every section must be present, even if empty (write "None")

**Scope rule**: Only log changes **visible to child apps**. Do NOT log:
- Vite plugin internals (vuemann-vite)
- Internal functions (exports with `Internal` suffix, private modules)
- Agent/command/memory-bank documentation changes
- Test refactoring or test-only changes
- Documentation pages inside vuemann (`src/views/`)
- CI/CD changes, .npmignore, package.json internal adjustments
- Refactoring that doesn't change the public API

If a version only has internal changes (no impact on child apps), do NOT create a changelog file. Skip this step entirely.

## Step 10: Cleanup Issue Temp Files

Remove the throwaway issue-creation artifacts so they don't accumulate in `{PLAN_PATH}`:

```bash
rm -f {PLAN_PATH}.issue-draft-*.md {PLAN_PATH}.issue-body-tmp.md
```

**Do NOT delete the plan file** here. The plan is the source of truth until the pull request is merged — `/issue-close` deletes `{PLAN_PATH}{issue_number}-*.md` after the merge. Deleting it now would lose the plan if the PR is never merged.

# Success Criteria

- All plan steps for the detected context executed
- All source files pass code quality rules
- All tests created/updated for modified files
- All tests pass quality rules via scoped runs during the loop + one full-suite sanity check at the end
- Final lint passes
- **Vuemann context only**: Vue and MD documentation updated if new functionality was added; changelog entry created/updated if changes impact child apps
