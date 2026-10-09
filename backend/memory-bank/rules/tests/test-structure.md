---
paths:
  - "backend/tests/**/*.php"
---
# Test Structure

PHPUnit 12, Laravel 13, JSON API with Sanctum.

## Layout and file names

Tests mirror the source, one folder per source unit. The file name MUST identify the source unit and the subject on its own (IDE tab, `--filter`, stack trace); a short subject-only name is non-compliant.

| Source | Test folder | File name |
|---|---|---|
| `Http/Controllers/Api/V1/{Controller}.php` | `tests/Feature/Api/V1/{Controller}/` | `{Controller}{Method}Test.php` |
| `Models/{Model}.php` | `tests/Feature/Models/` | `{Model}ModelTest.php` |
| `Services/{Service}.php` | `tests/Feature/Services/` | `{Service}Test.php` |
| `Support/{Support}.php` | `tests/Feature/Support/` (database-free: `tests/Unit/Support/`) | `{Support}Test.php` |
| `Rules/`, `Console/Commands/` | `tests/Feature/Rules/`, `tests/Feature/Console/` | `{Class}Test.php` |

**BAD** `RegisterTest.php`, `GenreTest.php`. **GOOD** `AuthControllerRegisterTest.php`, `GenreModelTest.php`.

The folder + file-name double mention is intended. Class name MUST equal file name (PSR-4), ending in `Test`.

## Class

- MUST use the `#[Test]` attribute (never the `test_` prefix), extend `Tests\TestCase` (provides `RefreshDatabase`, `getDatas`, `hasFormRequest`), name methods in descriptive `snake_case`.
- One test = one scenario = one reason to fail.
- Each test is independent. Laravel resets the DB and fakes; clear anything else yourself, e.g. `Cache::flush()` at the start of a cache test (the `array` store persists across tests).
- Test data: set `protected array $datas` (`username`, `email`...) and override per case with `$this->getDatas(['email' => 'invalid'])`.
- MUST create models with factories (`User::factory()`), after checking existing states (`banned()`). Unit tests without database build models with `forceFill([...])`: `new Chapter(['id' => 10])` leaves `id` null because the column is guarded.

## Controller tests

1. **FormRequest**, if the action has one: `$this->assertTrue($this->hasFormRequest(AuthController::class, 'register', RegisterRequest::class))`.
2. **Protected route**: one behavioral test (`requires_authentication`: `postJson(...)->assertUnauthorized()`) and, if the route has middleware, ONE `has_middleware()` test per action asserting the full list with `assertEqualsCanonicalizing` against `Route::getRoutes()->getByAction(Controller::class.'@action')->gatherMiddleware()`. MUST NOT write one test per middleware.
3. **Functional**: `registers_user`, `rejects_invalid_password`; validation rules per @see tests/test-behavior.md.
