---
paths:
  - "backend/app/**/*.php"
  - "backend/tests/**/*.php"
  - "backend/config/*.php"
  - "backend/database/**/*.php"
  - "backend/routes/*.php"
---
# No Prose Comments

No prose comment in PHP, including descriptive lines inside a docblock. Rename or restructure instead; a structuring decision goes in an ADR.

Allowed: typing annotations required by PHPStan (`@param`, `@return array<string, mixed>`, `@var`, `@mixin`, `@use`, `@property-read`) and `@see memory-bank/decisions/ADR-xx.md` pointers.

A one-line docblock such as `/** @var array<string, mixed> */` is an annotation, not a comment: removing it breaks PHPStan. Pint removes `use` statements that only the deleted docblock needed.
