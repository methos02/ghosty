You are an AI coding assistant working inside a git repository with access to a terminal and editor.

# Issue Create Command

Goal:
Given a free-form user story passed as a parameter to this command, you must:
1) Read and understand the user story.
2) Analyse it deeply and identify everything that is missing or ambiguous.
3) Ask the user clear, grouped questions to gather all the information needed to write a high-quality issue.
4) Write a draft issue to a markdown file so the user can review it.
5) Wait for the user's explicit approval.
6) Only then, create the issue on GitHub via `gh issue create`.

**This command is NOT a replacement for the planning phase.** It produces an issue specification — not an implementation plan. The implementation plan will be written later by `/issue-treate` once the issue is approved.

**IMPORTANT**: This project is hosted on **GitHub**. Always use `gh` (GitHub CLI), **never** `glab` (GitLab CLI).

Input user story (as provided to this command):
{{USER_STORY}}

---

## Step 1: Analyse the User Story

1. Read `{{USER_STORY}}` carefully.
2. Summarise it in your own words (2–4 sentences).
3. Identify:
   - **Implicit role/persona** (who benefits?)
   - **Implicit action/feature** (what is being asked?)
   - **Implicit value/goal** (why does it matter?)
   - **Type guess**: feature, bug, refactor, chore — based on phrasing.
4. List explicitly:
   - What is **already clear** in the user story.
   - What is **unclear, missing, or ambiguous**.

Show this analysis to the user **before** asking questions, so the user can correct misunderstandings early.

---

## Step 2: Ask Clarifying Questions

Ask **only** the questions needed to fill the real gaps. Skip categories that are already fully covered by the user story. Group questions by theme so the user can answer in batches.

Standard categories (use as a checklist, not a template):

### A. Business / Product
- Who is the targeted user / role / persona?
- What concrete problem does this solve?
- What is the user's current workaround (if any)?
- Why now? Is there a deadline or external trigger?

### B. Functional Scope
- What is **in scope** (must-have behaviour)?
- What is **explicitly out of scope** (to prevent scope creep)?
- Which existing pages, screens, or flows are impacted?
- Are there variants depending on user role / permissions / plan / locale?

### C. Acceptance Criteria
- How do we know the issue is done? List concrete, testable criteria.
- What are the manual steps a reviewer should run to validate it?
- Are automated tests required (unit / integration / e2e)?

### D. Technical Context (Vuemann-specific when applicable)
- Affected components (`src/components/`) or views (`src/views/`)?
- Affected services (`services-shortcut.js`, `services-helper.js`)?
- Data model / API changes (DTOs, endpoints, payload shape)?
- Cross-cutting concerns: auth, i18n, routing, flash, dialog?
- Performance, security, or accessibility constraints?

### E. UX / UI (skip if backend-only)
- Are there mockups, screenshots, or visual references?
- Expected user flow (step-by-step)?
- Empty / error / loading states?
- Responsive / mobile considerations?

### F. Edge Cases & Risks
- What can go wrong? (network failures, concurrent edits, invalid data, etc.)
- What state must be preserved / migrated?
- Backwards compatibility concerns?

### G. Metadata
- Issue **type / label**: `bug` or `New Feature` (the only labels currently defined in this project — confirm with `gh label list` if unsure).
- Priority / weight?
- Milestone?
- Assignee (default: current user)?
- Linked issues or pull requests?

**Rules for questioning**:
- Do not ask a question whose answer is already in the user story.
- Group questions by category and number them so the user can answer point by point.
- If the user's answer is incomplete or contradictory, ask follow-ups before moving on.
- Never invent answers. If you are unsure, ask.

---

## Step 3: Write the Draft Issue

Once the user has answered all blocking questions, write the issue draft to:

`{PLAN_PATH}issue-draft-{slug}.md`

Where `{slug}` is derived from the issue title in English (lowercase, spaces → dashes, no special characters).

The draft must use this **exact** format (this is the body that will be sent to GitHub):

```markdown
# {issue title}

> **Draft issue — pending user approval before creation on GitHub.**
> **Label:** {bug | New Feature}
> **Slug:** {slug}

## Context
{Why this is needed. Current situation. Trigger / pain point.}

## User Story
As a **{role}**, I want **{action}**, so that **{benefit}**.

## Scope

### In scope
- {item 1}
- {item 2}

### Out of scope
- {item 1}
- {item 2}

## Acceptance Criteria
- [ ] {criterion 1, concrete and testable}
- [ ] {criterion 2}
- [ ] ...

## Technical Notes
- **Affected components / views:** {list}
- **Affected services:** {list}
- **Data model / API changes:** {none | description}
- **Cross-cutting concerns:** {auth, i18n, routing, flash, dialog, ...}
- **Constraints:** {performance, security, a11y, ...}

## UX / UI
{Mockups, references, user flow, states. Omit section if backend-only.}

## Edge Cases & Risks
- {risk 1}
- {risk 2}

## Metadata
- **Type:** {feature | bug | refactor | chore}
- **Label:** {bug | New Feature}
- **Priority / weight:** {value or N/A}
- **Milestone:** {value or N/A}
- **Assignee:** {value or default}
- **Linked issues / PRs:** {list or none}
```

**Quality checks before writing the draft**:
- Title is short, action-oriented, in English.
- Every acceptance criterion is concrete and testable (no vague "works correctly").
- "Out of scope" is non-empty when the topic could grow — it is a signal of intent.
- Technical notes reference real files / components when known.
- The draft does **not** contain implementation steps — that is the plan's job, not the issue's.

After writing the file, show its full path to the user and **stop**.

---

## Step 4: Review Loop (Blocking Gate)

Wait for the user's explicit approval before creating the issue. Acceptable approval signals:
- "ok", "go", "approved", "validé", "let's create it", "create it"

If the user requests changes:
- Update the draft file in place.
- Show a short diff or summary of what changed.
- Ask for approval again.

Do **not** call `gh` until the user has explicitly approved the current draft.

---

## Step 5: Create the Issue on GitHub

Once approved:

1. Extract from the draft:
   - **Title** (the H1 of the draft, without the `# ` prefix)
   - **Body** (the full draft markdown, **excluding** the `> Draft issue — pending...` blockquote and the `> **Slug:**` / `> **Label:**` lines — those are draft metadata, not issue body content)
   - **Label** (from the metadata block: `bug` or `New Feature`)
   - **Optional**: milestone, assignee, weight, linked-issues if specified

2. Write the cleaned body to a temporary file (to preserve newlines and special characters):
   - Path: `{PLAN_PATH}.issue-body-tmp.md`

3. Run:
   ```bash
   gh issue create --title "{title}" --body-file {PLAN_PATH}.issue-body-tmp.md --label "{label}"
   ```
   Add `--milestone`, `--assignee` only if the user provided values.

4. On success:
   - Capture the issue number and URL from `gh` output.
   - Report to the user: `Issue #{number} created — {url}`
   - Delete the temporary body file.
   - Optionally rename the draft file to `issue-{number}-{slug}.md` for traceability.

5. On failure:
   - Show the full `gh` error.
   - Do not retry blindly. Diagnose (auth? permissions? invalid label?) and ask the user how to proceed.

---

## Important Behaviour

- **Analyse → Ask → Draft → Approve → Create.** Never skip a step. Never create the issue before the user has reviewed the draft file.
- Never invent business rules, personas, or acceptance criteria. Always ask.
- Prefer concise, testable criteria over verbose prose.
- The draft is an **issue specification**, not an implementation plan. Do not include code, file diffs, or step-by-step implementation. That belongs to `/issue-treate`.
- Communicate in English (the issue body itself is in English). Conversation with the user can be in French if the user writes in French.
- Do **not** create a git branch. Branching happens later, in `/issue-treate`.
- Do **not** modify any source file. This command only writes to the plans folder and calls `gh`.

---

## Now

1. Read `{{USER_STORY}}`.
2. Show your analysis (summary + clear vs unclear).
3. Ask grouped questions for the unclear parts only.
4. Wait for answers. Loop until you have what you need.
5. Write the draft to `{PLAN_PATH}issue-draft-{slug}.md` and show the path.
6. Wait for explicit approval. Loop on revisions if needed.
7. Once approved, run `gh issue create` and report the issue URL.
