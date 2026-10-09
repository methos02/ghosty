---
paths:
  - "backend/memory-bank/rules/**/*.md"
---
# Rule Writing Guide

Guide for writing rules in the **backend** rule set (Laravel 13 / PHP).

## Structure

Every rule file MUST have:
1. **Frontmatter** `paths`: glob patterns where the rule applies (`backend/**`).
2. **Title** `# Rule Name` matching the kebab-case filename in Title Case (`method-naming.md` -> `# Method Naming`). Rename the file when its content changes.
3. **Description**: 1-2 lines, agent-readable, no fluff.
4. **Examples** (optional): only if ambiguous without them; one BAD/GOOD pair per concern. Examples MUST reference names that exist in the code, or be clearly generic. No prose comments in examples.

## Strength vocabulary

- `MUST` / `MUST NOT`: absolute.
- `SHOULD`: recommended, real exceptions exist.
- `PREFER`: one valid option among several.
- Never `MUST` for a stylistic preference. Ban vague wording ("stay short", "if possible", "be careful").

## Principles

- Rules are read by agents. Be terse; imperative forms.
- No redundancy: check `rules/` before creating; merge rules on the same topic.
- Folder: `global/` (all PHP code), `files-type/` (one artifact type: controller, model, policy...), `tests/`. No per-language folder.
- Scope by nature of the artifact, not by folder name: match the filename convention first, folder as a union. Run `find` to confirm a pattern matches something before using it, and do not scope on an ambiguous suffix.
- Globs MUST target the backend stack (`backend/**`), never the frontend.
- Do not list rules in `backend/memory-bank/README.md`; the frontmatter `paths` is the index.
- A rename or merge updates every reference in `memory-bank/`, `.claude/agents/`, `.claude/commands/`.

## Language

- Rule prose: English.
- Identifiers (classes, methods, columns, API fields): English.
- User-facing messages: French, in `lang/fr/`. "continuité" is banned there as in code (@see global/domain-vocabulary.md).
