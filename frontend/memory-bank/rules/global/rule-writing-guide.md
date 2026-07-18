---
paths:
  - "memory-bank/rules/**/*.md"
---
# Rule Writing Guide

## Structure

Every rule file must have:
1. **Frontmatter** `paths` — glob patterns where the rule applies
2. **Title** `# Rule Name` — matches kebab-case filename
3. **Description** — 1-2 lines, agent-readable, no fluff
4. **Examples** (optional) — only if ambiguous without them; one BAD/GOOD pair max

## Principles

- Rules are read by agents. Be terse
- No redundancy — check `rules/` before creating
- Folder: `global/` (all code), `files-type/` (controller, dto...), `langage/` (js, vue), `tests/`
- Update `memory-bank/README.md` rules tree after creating a rule
