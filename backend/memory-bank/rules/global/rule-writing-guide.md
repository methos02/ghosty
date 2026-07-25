---
paths:
  - "backend/memory-bank/rules/**/*.md"
---
# Rule Writing Guide

Guide for writing rules in the **backend** rule set (Laravel 13 / PHP).

## Structure

Every rule file must have:
1. **Frontmatter** `paths` — glob patterns where the rule applies (target `backend/**`)
2. **Title** `# Rule Name` — matches kebab-case filename
3. **Description** — 1-2 lines, agent-readable, no fluff
4. **Examples** (optional) — only if ambiguous without them; one BAD/GOOD pair max

## Principles

- Rules are read by agents. Be terse
- No redundancy — check `rules/` before creating
- Folder: `global/` (all PHP code), `files-type/` (controller, model, resource, request, policy, seeder...), `langage/php/`, `tests/`
- Globs must target the backend stack (`backend/**`), never the frontend
- Update `backend/memory-bank/README.md` rules tree after creating a rule
