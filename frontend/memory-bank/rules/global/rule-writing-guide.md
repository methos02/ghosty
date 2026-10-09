---
paths:
  - "memory-bank/rules/**/*.md"
---
# Rule Writing Guide

## Structure

Every rule file MUST have:
1. **Frontmatter** `paths`: globs where the rule applies.
2. **Title** `# Rule Name`: the same words as the filename in Title Case (`no-else-or-v-else.md` -> `# No Else Or V-Else`). A file name MUST describe the rule it holds: rename the file when the rule changes.
3. **Description**: one or two imperative lines, no fluff.
4. **Examples**: only when the rule is ambiguous without them; **one BAD/GOOD pair per concern**. Examples contain no explanatory comment (only `// BAD` / `// GOOD` labels), use Ghosty names (novel, chapter, notification, comment, user), and reference only names that exist.

## Scope by nature, not by folder

A convention follows the **artifact**, not its address. Scope on the filename convention first (`**/use-*.js`, `**/*-dto.js`, `**/*-controller.js`), keeping the folder pattern alongside as a union so a consuming app with another layout is still covered.

- Run `find src -name '<pattern>'` before adding a pattern: a pattern matching nothing (`Use*.js` with kebab-case enforced) never applies.
- Do not scope on an ambiguous filename (`*-service.js` matches infrastructure services, `*-store.js` matches several kinds): qualify the folder, or state the exclusion in the body.

## Strength vocabulary

| Word | Meaning |
|---|---|
| `MUST` / `MUST NOT` | Absolute. Violation is a defect. |
| `SHOULD` | Recommended; a real exception is acceptable. |
| `PREFER ... over ...` | One valid option among several. |

Never `MUST` for a stylistic preference. State when the rule applies, what to do, what not to do, and the exceptions. No vague wording ("it would be better", "normally", "if possible", "be careful").

## Principles

- Rules are read by agents: terse, imperative.
- No redundancy: grep `rules/` before creating. One rule plus an exception beats several close rules.
- Do not restate what the linter or formatter already enforces; keep only what the tool cannot express, and say which tool covers the rest.
- A rule that departs from community practice states the cost it accepts.
- Folders: `global/` (all code), `files-type/` (controller, dto...), `language/` (`js/`, `vue/`), `tests/`.
- Rule prose is English ([language-policy](language-policy.md)). Rules do not list themselves in `memory-bank/README.md`.
