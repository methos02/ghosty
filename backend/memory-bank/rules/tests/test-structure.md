---
paths:
  - "backend/tests/**/*.php"
---
# Test Structure & Conventions

Standards for backend tests (PHPUnit 11, Laravel 13). API pure : JSON + Sanctum.

## Organization

Les tests miroir la structure de l'application, dans un dossier par unité source. **Le nom de fichier est obligatoire et non négociable** : il doit à lui seul identifier l'unité source ET le sujet, sans jamais avoir besoin de lire le chemin (onglet IDE, filtre PHPUnit `--filter=...`, stack trace).

| Source | Dossier de test | Nom de fichier obligatoire |
|--------|------------------|------------------------------|
| `app/Http/Controllers/Api/V1/{Controller}.php` | `tests/Feature/Api/V1/{Controller}/` | `{Controller}{Method}Test.php` |
| `app/Http/Requests/{Request}.php` | `tests/Feature/Requests/` | `{Request}Test.php` |
| `app/Models/{Model}.php` | `tests/Feature/Models/` | `{Model}ModelTest.php` |

**Interdiction stricte** du nom court (sujet seul, sans suffixe d'unité) — comparer nom par nom, pas seulement colonne par colonne :

```
✅ AuthControllerRegisterTest.php   ❌ RegisterTest.php
✅ NovelControllerIndexTest.php     ❌ IndexTest.php
✅ GenreModelTest.php               ❌ GenreTest.php
```

Un nom de test contrôleur qui ne contient pas `Controller` avant le suffixe `{Method}Test`, ou un nom de test modèle qui ne finit pas par `ModelTest`, est **non conforme** : à corriger avant la revue, pas une variante tolérée.

Critère vérifiable (grep) : dans `tests/Feature/Api/V1/**`, tout `*Test.php` doit matcher `Controller[A-Z][A-Za-z0-9]*Test\.php$` ; dans `tests/Feature/Models/`, tout fichier doit matcher `ModelTest\.php$`. Un fichier qui ne matche pas est à renommer.

La double mention (dossier `NovelController/` + fichier `NovelController...Test`) est **assumée** : le dossier évite d'entasser des centaines de fichiers à plat, le nom reste lisible seul — ce n'est pas une redondance à supprimer.

Contraintes PHPUnit : le fichier doit finir par `Test.php` (discovery) et le nom de classe == nom de fichier (PSR-4 `Tests\`) — pas de tiret, casse `PascalCase`.

## Class Structure

- Attribut `#[Test]` (jamais le préfixe `test_`)
- Étendre `Tests\TestCase` (fournit déjà `RefreshDatabase`, `getDatas`, `hasFormRequest`)
- Nom de méthode descriptif en `snake_case`
- **Un test = un scénario = une raison d'échouer**

## Controller Tests — 3 volets

1. **FormRequest** (si le contrôleur en a un) :
   ```php
   #[Test]
   public function form_request(): void
   {
       $this->assertTrue($this->hasFormRequest(AuthController::class, 'register', RegisterRequest::class));
   }
   ```
2. **Middleware / protection** — pour une route protégée, deux tests complémentaires, pas un seul :
   - le contrat observable (comportemental) :
   ```php
   #[Test]
   public function requires_authentication(): void
   {
       $this->postJson('/api/v1/auth/logout')->assertUnauthorized();
   }
   ```
   - si la route porte des middlewares, un **unique** test structurel `has_middleware()` par route/action qui assert la liste **complète**, insensible à l'ordre (`assertEqualsCanonicalizing`) — jamais un test par middleware, tout ajout ou retrait fait échouer le test :
   ```php
   #[Test]
   public function has_middleware(): void
   {
       $route = Route::getRoutes()->getByAction(AuthController::class.'@logout');
       $this->assertNotNull($route);
       $this->assertEqualsCanonicalizing(['auth:sanctum'], $route->gatherMiddleware());
   }
   ```
3. **Fonctionnels** — comportement : `registers_user`, `rejects_invalid_password`, une règle de validation par test.

## Factories

**Toujours** utiliser les factories pour créer des modèles (`User::factory()`, `Genre::factory()`, `Novel::factory()`). Vérifier les states custom (ex. `banned()`) avant tout setup manuel.

## Test Data

```php
protected array $datas = ['pseudo' => 'John', 'email' => 'john@example.com', ...];

$this->postJson('/api/v1/auth/register', $this->getDatas(['email' => 'invalid']));
```

## Assertions

`assertOk()`, `assertCreated()`, `assertStatus(422)`, `assertUnauthorized()`, `assertJsonValidationErrors([...])`, `assertJsonStructure([...])`, `assertJsonPath()`, `assertDatabaseHas()`. Relire la DB avec `$model->refresh()` si besoin.
