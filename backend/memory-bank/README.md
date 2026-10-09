# Backend Memory-Bank

Rule set and knowledge base for the **Ghosty backend** (Laravel 13 / PHP). Sibling of `frontend/memory-bank/`. Shared tooling (the `/learn` command, the `rule-writer` and `rule-optimizer` agents) lives at the monorepo root in `.claude/`.

## Structure

```
backend/memory-bank/
├── decisions/     # ADRs (architecture decisions)
├── doc/           # Operational notes (local setup)
└── rules/         # Coding rules enforced by agents
    ├── global/        # apply to all PHP code
    ├── files-type/    # one artifact type (controller, model, policy...)
    └── tests/         # PHPUnit test rules
```

Rules live in `rules/`; each is scoped by its frontmatter `paths`. This README does not list them. Authoring conventions: `rules/global/rule-writing-guide.md`.

## Workflow

1. `/learn` (root command): capture frictions from a session into `.claude/draft/rules/`, tagged `Target: back`.
2. `rule-writer` agent: critically analyzes each `back` proposal and writes accepted rules into `backend/memory-bank/rules/`.
3. `rule-optimizer` agent: defragments the written rules (run with `back`, a file path, or globally).
