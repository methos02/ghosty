---
paths:
  - "backend/tests/**/*.php"
---
# Test Structure & Conventions

Standards for backend tests (PHPUnit 11, Laravel 13). API pure : JSON + Sanctum.

## Organization

Les tests miroir la structure de l'application, dans un dossier par unité source :

| Source | Test |
|--------|------|
| `app/Http/Controllers/Api/V1/{Controller}.php` | `tests/Feature/Api/V1/{Controller}/{Controller}{Method}Test.php` |
| `app/Http/Requests/{Request}.php` | `tests/Feature/Requests/{Request}Test.php` |
| `app/Models/{Model}.php` | `tests/Feature/Models/{Model}ModelTest.php` |

**Le nom de fichier seul doit identifier le test**, sans lire le chemin. Le nom porte l'unité source complète + le sujet — onglet IDE, filtre PHPUnit (`--filter=NovelControllerIndexTest`) et stack trace sont auto-explicites.

```
✅ AuthControllerRegisterTest, NovelControllerIndexTest, GenreModelTest
❌ RegisterTest, IndexTest, GenreTest  (ambigus : onglet/filtre ne disent pas l'unité)
```

La double mention (dossier `NovelController/` + fichier `NovelController...Test`) est **assumée** : le dossier évite d'entasser des centaines de fichiers à plat, le nom reste lisible seul.

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
2. **Middleware / protection** — pour une route protégée, tester le contrat observable :
   ```php
   #[Test]
   public function requires_authentication(): void
   {
       $this->postJson('/api/v1/auth/logout')->assertUnauthorized();
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
