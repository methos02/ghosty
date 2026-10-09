# Backend Memory-Bank

Rule set and knowledge base for the **Ghosty backend** (Laravel 13 / PHP). Sibling of `frontend/memory-bank/`. Shared tooling (the `/learn` command, the `rule-writer` and `rule-optimizer` agents) lives at the monorepo root in `.claude/`.

## Structure

```
backend/memory-bank/
├── decisions/     # ADRs (architecture decisions)
├── doc/           # Operational notes (local setup)
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
- `rules/global/dependency-naming.md` — dépendances injectées suffixées `R` (repository) / `H` (helper) ; nom nu = donnée
- `rules/global/branch-not-continuity.md` — on dit « branche » / « branche principale », jamais « continuité » ni « current » ; dernier chapitre = `lastChapterOfMainBranch`
- `rules/global/explicit-method-names.md` — méthodes nommant l'entité, le critère et la nature du retour, sans préposition finale ni métaphore ; nommées selon l'usage de l'appelant
- `rules/global/no-alter-migration-before-release.md` — avant la prod, on modifie la migration `create_*` et on `migrate:fresh`
- `rules/global/root-cause-first.md` — corriger la cause, jamais rustiner le symptôme
- `rules/global/maintain-invariant-at-source.md` — valeur dénormalisée tenue à jour par chaque événement, aucun fallback en lecture
- `rules/global/no-closure-param-in-service.md` — pas de closure « au milieu » dans un service, étapes chaînées explicitement
- `rules/files-type/controller.md` — contrôleurs minces : aucune requête, injection, variable intermédiaire avant la Resource
- `rules/files-type/repository.md` — seul endroit pour l'accès DB ; jamais couplé à `Request` ; requêtes uniquement
- `rules/files-type/seeder.md` — insert-only, pas de `truncate` ; re-seed via `migrate:fresh --seed`
- `rules/files-type/model.md` — `@property` dans l'ide-helper ; relation non nullable déclarée `@property-read` ; comportement réutilisable → trait `Concerns/` ; compteurs dénormalisés à maintenir
- `rules/langage/php/constructor-style.md` — constructeurs multi-ligne, un paramètre promu par ligne
- `rules/global/phpstan-fix-at-cause.md` — PHPStan max à zéro erreur, sans baseline ni ignore ; corriger le contrat
- `rules/global/crud-verbs-by-default.md` — verbes CRUD par défaut, qualificatif seulement s'il distingue, pas de revendication de cycle de vie
- `rules/global/domain-vocabulary.md` — un mot du domaine = un sens ; réutiliser le terme du code (`like`)
- `rules/global/no-unreachable-expression.md` — pas d'expression qu'aucun chemin n'atteint
- `rules/global/numbered-migrations.md` — migrations `NNNN_description.php`, jamais datées
- `rules/global/no-prose-comments.md` — aucun commentaire de prose, annotations de typage et `@see ADR` admis
- `rules/global/english-identifiers.md` — identifiants en anglais, messages en français dans `lang/fr/`
- `rules/global/class-suffix-matches-folder.md` — le suffixe de classe annonce son dossier (`Support`, `DTO`...)
- `rules/files-type/dto.md` — DTO `final readonly` suffixés `DTO`, frontière DTO/service, clé d'imbrication portée par le DTO
- `rules/files-type/request.md` — deux ressources dans une requête : imbriquer, jamais préfixer
- `rules/files-type/resource.md` — Resource liste/détail explicites, jamais conditionnée à la route
- `rules/tests/test-structure.md` — organisation, nommage (strict, grep-vérifiable), structure de classe, test structurel `has_middleware()`, factories, assertions
- `rules/tests/test-avoid-redundant.md` — un comportement unique par test, une règle de validation par test
- `rules/tests/test-cleanup-teardown.md` — isolation via `tearDown`, ce que Laravel gère vs pas
- `rules/tests/test-no-loose-assertions.md` — valeurs explicites, pas de matchers fourre-tout
- `rules/tests/test-useful-behavior.md` — tester le comportement observable, pas l'implémentation
