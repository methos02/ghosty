---
paths:
  - "backend/**/*.php"
  - "backend/phpstan.neon"
---
# PHPStan Fix At Cause

PHPStan level `max` stays at zero errors with no baseline, no `@phpstan-ignore*`, no `assert()` or inline `@var` used to silence the tool, and no widened parameter or return type. Each error is a real contract defect: fix the contract.

Legitimate fixes: typed accessors (`Config::string/integer/boolean`), a dedicated settings object for a group of config values, `@property` / generics in PHPDoc, an explicit type check (`is_string()`) when the value is legitimately optional, an explicit exception when an internal contract is broken. A cast is acceptable only on a value whose type is already proven, never on `mixed`.

**BAD**

```php
new Cookie('token', $value, (int) config('auth.token_ttl'));
```

**GOOD**

```php
new Cookie('token', $value, $this->settings->ttl);
```
