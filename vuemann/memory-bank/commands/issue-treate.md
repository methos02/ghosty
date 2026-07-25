You are an AI coding assistant working inside a git repository with access to a terminal and editor.

Goal:
Given a single issue passed as a parameter to this command, you must:
1) Read and understand the issue.
2) Analyse the issue and identify missing information.
3) Ask me clear questions to obtain all missing details you need.
4) Write the implementation plan first.
5) Only then, create a branch and start working.

## Pre-flight Check: Branch Guard

**Before doing anything else**, verify that the current git branch is `master`:

```bash
git branch --show-current
```

- If the current branch is **not `master`** → **stop immediately** and tell the user:
  > "You are currently on branch `{branch-name}`. This command must be run from `master` to avoid mixing changes from different issues. Please switch to `master` first (`git checkout master`) and run this command again."
- If the current branch **is `master`** → proceed normally.

**IMPORTANT**: This project is hosted on **GitHub**. Always use `gh` (GitHub CLI), **never** `glab` (GitLab CLI).
To fetch an issue, use: `gh issue view {number}`

Input issue (as provided to this command):
{{ISSUE_CONTENT}}

## Mode Detection

Parse {{ISSUE_CONTENT}} to detect the execution mode.

**Expected formats:**
- `#123 plan:plan-name.md` — issue number + explicit plan name
- `#123 plan-name.md` — issue number + explicit plan name (without prefix)
- `123 plan:my-plan.md` — without `#`
- `#123` — issue number only (auto-detect plan)

**Detection rules (in order):**

1. **Explicit plan provided**: if the input contains a filename ending in `.md` (optionally prefixed by `plan:`), use that plan → **[Fast Track](#fast-track-execute-plan)**.
2. **Auto-detect plan by issue number**: if only an issue number is provided, scan `{PLAN_PATH}` for files starting with `{number}-`.
   - **1 match** → use that plan automatically. Tell the user: "Plan detected: `{filename}`. Executing Fast Track." Then → **[Fast Track](#fast-track-execute-plan)**.
   - **Multiple matches** → list them numbered and ask the user to pick one. Once picked → **[Fast Track](#fast-track-execute-plan)**.
   - **0 matches** → **[Standard Workflow](#standard-workflow)** (Step 1 below).

---

## Fast Track: Execute Plan

When a plan is already provided, skip analysis and questions. Go straight to execution.

### FT-1: Read the Issue

1. Fetch the issue using `gh issue view {number}`.
2. Extract: title, number, labels.

### FT-2: Read the Plan

1. Look for the plan file at: `{PLAN_PATH}{plan-name}` (if the name already ends with `.md`, do NOT append `.md` again).
2. If the file does not exist, tell the user and abort.
3. Display a brief summary of the plan to the user.

### FT-3: Create Branch

Create a git branch named using the pattern `label/number/slug` and push it to origin.

Branch naming rules:
- **label**: infer from the issue labels or plan content (feature, bugfix, refactor, chore). If unclear, ask.
- **number**: numeric identifier of the issue.
- **slug**: derived from the issue title in English (lowercase, spaces → dashes, no special characters).

Commands to run:
```bash
git fetch origin
git checkout -b label/number/slug
git push -u origin label/number/slug
```

### FT-4: Execute the Plan

Execute the plan with `/apply-plan {plan-name}`. The command auto-detects the context (vuemann vs child app via the presence of `memory-bank/rules/` at the project root) and runs the matching workflow.

This will handle: plan application, code quality checks, test creation/updates, test quality checks, and final validation. In vuemann context only, it also updates Vue/MD documentation and the changelog.

### FT-5: Done

Report the result to the user:
- Branch name created
- Plan executed
- Any issues encountered

---

## Standard Workflow

### Step 1: Parse and Analyse the Issue

1) Parse the issue content from {{ISSUE_CONTENT}}:
   - Extract: title, number, description, key requirements, constraints, acceptance criteria, and any labels.
   - If anything important is missing or ambiguous, prepare questions to ask me.

2) Analyse the issue deeply:
   - Summarise the issue in your own words.
   - Identify:
     - Current behaviour
     - Expected behaviour
     - Affected components/modules
     - Risks and edge cases
   - List explicitly what is unclear or missing.

3) Check for build output file reference:
   - Scan {{ISSUE_CONTENT}} for a filename matching the hashed JavaScript build output pattern `index-<hash>.js` (e.g. `index-DvpizKqL.js`).
   - There can only be one such file referenced. If found, check if it exists in `dist/`.
   - If the file is **not found** locally, add it to the list of questions in step 4: ask the user to provide it before continuing.

4) **Bug report with `index-<hash>.js` → reproduction gate (BLOCKING):**

   If the issue is a bug report **and** references an `index-<hash>.js` file, reproduction is a **blocking gate**. No planning, no branch, no code change until the user has manually confirmed the bug is reproduced.

   - **Your role (Claude)**: do NOT try to reproduce the bug yourself. Instead:
     - Use the stack trace and the build output file to locate the original source code (source map or manual mapping).
     - Write clear, numbered manual reproduction steps for the user: route / action / user role / required data / environment / expected vs observed behaviour.
   - **User's role**: execute the steps and reply whether the bug was reproduced (same stack trace / error) or not.
   - **Wait** for the user's reply before doing anything else. Do not plan, do not create a branch, do not touch any file.
   - **If the user cannot reproduce** → STOP and ask targeted questions (missing env vars, specific data, user role, timing, recent actions) until reproduction succeeds.
   - **Only once the user confirms reproduction**, proceed to step 5 (questions) and then to Step 2 (plan).

5) Ask me questions:
   - Ask all the questions you need to fully understand:
     - Business rules
     - Technical constraints (framework, versions, DB, external services, etc.)
     - UX/UI expectations
     - Performance or security constraints
     - Missing build output files identified in step 3 (if any)
   - Group questions logically (e.g. Business, Technical, Testing) so it is easy for me to answer.

### Step 2: Write the Plan

When you have enough information (including my answers), write a detailed implementation plan as a markdown file.

- File location: `{PLAN_PATH}{issue-number}-{slug}.md`
  - Example: `{PLAN_PATH}1234-fix-500-error-on-chapter-creation.md`
- The plan must follow this format:

  ```markdown
  # Issue #{number} - {title}

  ## Summary
  [Your summary of the issue]

  ## Plan
  - [ ] Step 1: ...
  - [ ] Step 2: ...
  - [ ] ...

  ## Rules to Apply
  - [rule-name.md](memory-bank/rules/path/rule-name.md) - Description
  - ...

  ## Vuemann Features to Use
  - `feature` - Description
  - ...
  ```

- The plan must include:
  - High-level approach
  - Changes per file/module (if you already know the project structure)
  - Data model changes (if any)
  - API changes (if any)
  - Tests to implement (unit, integration, E2E)
  - Migration or deployment notes, if relevant
- Read files in `memory-bank/rules/` and list relevant rules for the task
- Identify components (`src/components/`) or service functions (`services-shortcut.js`) to use
- Structure the plan as a checklist that we can follow

**After the plan file is written**, delete the issue markdown produced by `/issue-create` (the file `{PLAN_PATH}issue-{issue-number}-*.md`) if it exists. The plan supersedes it; keeping both leaves duplicate artifacts in the plans folder. Only delete the `issue-{number}-*.md` file, never the plan file you just wrote (`{number}-{slug}.md`).

### Step 3: Wait for Plan Approval

**Blocking gate**: after writing the plan file, present its path to the user and **stop**. Do not create any branch, do not run any git command, do not modify any file.

Wait for an explicit approval from the user (e.g. "ok", "go", "approved", "validé", "let's do it"). If the user requests changes, update the plan and ask for approval again.

Only once the user has explicitly approved the plan, proceed to Step 4.

### Step 4: Branch Creation

Create a git branch named using the pattern `label/number/slug` and push it to origin.

Branch naming rules:
- **label**: short lowercase label (feature, bugfix, refactor, chore). Use issue labels if available, otherwise ask.
- **number**: numeric identifier of the issue. If not present, ask.
- **slug**: derived from the issue title in English (lowercase, spaces → dashes, no special characters).
  - Example: Title 'Fix 500 error on chapter creation' → `fix-500-error-on-chapter-creation`
- Full example: `feature/1234/fix-500-error-on-chapter-creation`

Commands to run:
```bash
git fetch origin
git checkout -b label/number/slug
git push -u origin label/number/slug
```

If any command fails, inspect the error and propose a fix.

## Changelog (vuemann context only)

When working in vuemann context (i.e., `memory-bank/rules/` exists at the project root):

- **Fast Track**: The `/apply-plan` workflow generates changelog entries automatically (Step 9, vuemann context only). No additional action needed.
- **Standard Workflow**: If code changes are made outside of `/apply-plan`, you must manually generate a changelog entry before closing the branch:
  1. Read the current version from `package.json` and compute the next patch version (e.g., `4.9.40` → `4.9.41`)
  2. Read the format from `memory-bank/changelog/README.md`
  3. Create or update `memory-bank/changelog/{next-version}.md` with the changes made
  4. Categorize changes as Breaking Changes, New Features, or Improvements
  5. **Scope rule**: Only log changes **visible to child apps**. Do NOT log internal vuemann changes (vite plugins, Internal functions, agents/commands docs, test refactoring, documentation pages in `src/views/`, CI/CD, .npmignore). If only internal changes, do NOT create a changelog file — skip this step entirely.

## Important Behaviour

- **Plan first, approval second, branch third.** Always write the plan, wait for the user's explicit approval, and only then create the branch or make any change.
- Never assume unclear business rules: always ask.
- Prefer small, incremental, testable steps.
- If the repository structure or tech stack is unknown:
  - First, inspect the project (e.g. list files, look for package.json, composer.json, etc.).
  - Then tell me what stack you have detected.
- Communicate in English.

## Now

1) Read {{ISSUE_CONTENT}}.
2) Detect mode:
   - **If a plan is provided** → follow the **Fast Track** (FT-1 → FT-5).
   - **If no plan** → follow the **Standard Workflow**:
     a) Summarise the issue.
     a.bis) **If the issue is a bug report referencing an `index-<hash>.js` file** → run the reproduction gate first: explain the manual reproduction steps and **wait** for the user's confirmation. No questions, no plan, no branch until the user confirms the bug is reproduced. If the user cannot reproduce, stop and ask targeted questions.
     b) Ask me all missing questions.
     c) Once clarified:
        - Write the plan to the markdown file.
        - Show me the file path so I can review it.
        - **Stop and wait for my explicit approval.** Do not create the branch, do not run any git command, do not modify any file.
     d) Only after I have explicitly approved the plan:
        - Create the branch.