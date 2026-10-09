---
paths:
  - "backend/tests/**/*.php"
---
# Test Behavior

## Test observable behavior only

MUST test what the code returns or does, not how: return values, status codes, side effects (DB, mail, token), Resource output, error responses (422, 401). MUST NOT test internal state, call counts (unless critical), or values production never consumes. If a behavior-preserving refactor breaks a test, that test was testing the implementation.

**BAD**

```php
$this->assertCount(1, User::all());
```

**GOOD**

```php
$response->assertCreated();
$this->assertDatabaseHas('users', ['email' => $this->datas['email']]);
```

## No redundant tests

- MUST check the behavior is not already covered before writing a test; merge two tests exercising the same call, delete a transformation tested elsewhere.
- One validation rule = one test (`required`, `format`, `unique`, `min`...). `email_is_required` and `email_cannot_be_empty` both sending an empty email are redundant.
- Keep one test for an empty result (`null`, `[]`), the real empty case.

## Explicit assertions

- MUST assert explicit expected values (`assertJsonPath`, `assertJsonCount`); MUST NOT use `$this->anything()` or `assertJsonStructure` alone when the value is known.
- `assertJsonStructure` is allowed for the **shape** of a paginated collection (`data`, `meta`, `links`), combined with `assertJsonPath` on the values that matter.
- Exception: uncontrollable values (auto-increment ids, generated timestamps, tokens). Assert type or format (`assertIsString`, regex), never presence alone.

**BAD**

```php
$response->assertJsonStructure(['data' => ['id', 'name']]);
```

**GOOD**

```php
$response->assertJsonPath('data.0.name', $genre->name);
$response->assertJsonPath('data.0.slug', 'science-fiction');
```
