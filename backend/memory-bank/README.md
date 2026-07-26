# Backend Memory-Bank

Rule set and knowledge base for the **Ghosty backend** (Laravel 13 / PHP). Sibling of `frontend/memory-bank/`. Shared tooling (the `/learn` command, the `rule-writer` and `rule-optimizer` agents) lives at the monorepo root in `.claude/`.

## Structure

```
backend/memory-bank/
├── decisions/     # ADRs (architecture decisions)
└── rules/         # Coding rules enforced by agents
    ├── global/        # apply to all PHP code
    │   └── rule-writing-guide.md
    ├── files-type/    # controller, model, resource, request, policy, seeder...
    ├── langage/
    │   └── php/       # PHP-specific rules
    └── tests/         # Pest/PHPUnit test rules
```

## Workflow

1. `/learn` (root command) — capture frictions from a session into `.claude/draft/rules/`, tagged `Target: back`.
2. `rule-writer` agent — critically analyzes each `back` proposal and writes accepted rules into `backend/memory-bank/rules/`.
3. `rule-optimizer` agent — defragments the written rules (run with `back`, a file path, or globally).

## Rules Tree

_Add each new rule here._

- `rules/global/rule-writing-guide.md` — frontmatter + structure for any new backend rule
- `rules/tests/test-structure.md` — organisation, nommage (strict, grep-vérifiable), structure de classe, test structurel `has_middleware()`, factories, assertions
- `rules/tests/test-avoid-redundant.md` — un comportement unique par test, une règle de validation par test
- `rules/tests/test-cleanup-teardown.md` — isolation via `tearDown`, ce que Laravel gère vs pas
- `rules/tests/test-no-loose-assertions.md` — valeurs explicites, pas de matchers fourre-tout
- `rules/tests/test-useful-behavior.md` — tester le comportement observable, pas l'implémentation
