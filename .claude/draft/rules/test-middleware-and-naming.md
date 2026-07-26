# Learn Report: Conventions de test backend (middlewares & nommage)

- **Feature / context**: Mise en place de la suite de tests backend Ghosty (Laravel 13, API JSON + Sanctum), inspirée des tests et règles findart.

## Proposal 1: Tester explicitement la présence des middlewares de protection
- **Target**: back
- **Problem encountered**: Les routes protégées (`auth/me`, `auth/logout`) n'avaient qu'un test comportemental (401 sans token). Il manquait un test vérifiant, au niveau de la définition de route, que le middleware `auth:sanctum` est bien accroché. Le 401 vérifie le comportement observable ; il ne documente pas la configuration et une régression de config peut passer inaperçue selon le contexte.
- **Origin remark**: « je ne vois pas un test important, que les fonction de auth/me et logout soit protégé par le middleware sanctum ».
- **Suggested convention**: Chaque test de contrôleur dont la route porte des middlewares doit inclure un test dédié à la présence des middlewares, en complément des tests fonctionnels. Récupérer la route via `Route::getRoutes()->getByAction(Controller::class.'@method')` (routes API non nommées), guarder le `null` avec `assertNotNull` (narrowing PHPStan), puis assertion sur `gatherMiddleware()`.
- **Suggested scope**: `backend/tests/**/*Test.php` (tests de contrôleurs)
- **Category hint**: rule

## Proposal 2: Un seul test `has_middleware` par route, assertion exhaustive
- **Target**: back
- **Problem encountered**: Premier jet = un test ciblé sur un seul middleware (`is_protected_by_sanctum_middleware`). Non extensible : quand une route porte plusieurs middlewares, on multiplie les tests ou on en oublie.
- **Origin remark**: « il faut juste un test pour tous les middleware, ici il n'y en a encore qu'un mais plus tard il pourra y en avoir plusieurs donc un test has_middleware serait mieux ».
- **Suggested convention**: Un unique test nommé `has_middleware()` par route/action, qui assert **l'ensemble** de la liste de middlewares (pas un test par middleware). Utiliser une assertion exhaustive et insensible à l'ordre (`assertEqualsCanonicalizing([...attendus], $route->gatherMiddleware())`) : tout ajout OU retrait de middleware fait échouer le test, donc pas de régression silencieuse. Étendre = ajouter l'entrée dans le tableau attendu.
- **Suggested scope**: `backend/tests/**/*Test.php` (tests de contrôleurs)
- **Category hint**: rule

## Proposal 3: Nom de fichier de test = unité source complète + sujet
- **Target**: back
- **Problem encountered**: Convention initiale `{Subject}{Method}Test` sans le suffixe de l'unité (`RegisterTest`, `GenreIndexTest`, `GenreTest`) : l'onglet IDE et le filtre PHPUnit ne disent pas de quelle unité il s'agit (contrôleur vs modèle vs autre contrôleur homonyme).
- **Origin remark**: « au niveau des nom de fichier de test je préfère mettre : NovelController-index, GenreModel ... comme cela on sait directement dans les onglets ce que cela teste » puis « on garde les dossiers sinon on va avoir des dossiers avec des centaines de fichiers à l'intérieur, c'est un coup assumé d'avoir la double info ».
- **Suggested convention**: Le nom de fichier porte l'unité source **complète** + le sujet : contrôleur → `{Controller}{Method}Test.php` (ex. `AuthControllerRegisterTest`, `NovelControllerIndexTest`), modèle → `{Model}ModelTest.php` (ex. `GenreModelTest`). Conserver un dossier par unité (`Api/V1/NovelController/…`) pour ne pas entasser des centaines de fichiers à plat — la double mention dossier + nom est **assumée**. Contraintes techniques : fichier finissant par `Test.php` (discovery PHPUnit) et nom de classe == nom de fichier en PascalCase (PSR-4 `Tests\`), donc pas de tiret ni de forme `-index`.
- **Note d'état**: déjà partiellement appliqué dans `backend/memory-bank/rules/tests/test-structure.md` durant la session ; à réconcilier plutôt que dupliquer.
- **Suggested scope**: `backend/tests/**/*Test.php`
- **Category hint**: rule
