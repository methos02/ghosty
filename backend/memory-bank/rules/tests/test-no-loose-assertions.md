---
paths:
  - "backend/tests/**/*.php"
---
# No Loose Assertions

Utiliser des valeurs attendues explicites. Éviter les matchers qui acceptent n'importe quoi (`$this->anything()`, `assertJsonStructure` seul quand la valeur est connue).

Un test doit documenter la sortie exacte : une structure fausse ne doit pas passer.

```php
// ❌ lâche — ne vérifie que la présence des clés
$response->assertJsonStructure(['data' => ['id', 'name']]);

// ✅ explicite — vérifie les valeurs
$response->assertJsonPath('data.0.name', $genre->name);
$response->assertJsonPath('data.0.slug', 'science-fiction');
```

`assertJsonStructure` reste utile pour la **forme** d'une collection paginée (clés `data`, `meta`, `links`), à combiner avec `assertJsonPath` / `assertJsonCount` sur les valeurs qui comptent.

## Exceptions

Uniquement pour les valeurs réellement incontrôlables : IDs auto-incrémentés quand la valeur n'importe pas, timestamps générés, tokens. Vérifier alors le type/format (`assertIsString`, regex), pas la présence seule.
