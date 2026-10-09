---
paths:
  - "backend/app/Policies/**/*.php"
---
# Policy Rules

- MUST name each public method after the Gate ability it answers (`viewAny`, `view`, `create`, `update`, `publish`, `delete`) and return `bool` (@see global/method-naming.md).
- MUST deny a banned user (`$user->isBanned()`) on every ability that writes or moderates; read abilities (`view`) do not check the ban (@see decisions/ADR-01-modele-de-ban-utilisateur.md).
- MUST test ownership by comparing `$user->id` with the model's `author_id`; factor a repeated check into a private method (`isOwnWork`).
- MUST use early returns, with no `else`.
- Controllers call the policy through `$this->authorize('ability', $model)`; a policy is never invoked from a service.
