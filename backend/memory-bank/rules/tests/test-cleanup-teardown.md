---
paths:
  - "backend/tests/**/*.php"
---
# Test Cleanup with tearDown

Chaque test doit être indépendant et exécutable dans n'importe quel ordre. Nettoyer tout état non géré automatiquement par Laravel dans `tearDown()`.

## Géré automatiquement (rien à faire)

Avec `RefreshDatabase` (hérité de `Tests\TestCase`) : transactions DB. Ainsi que les fakes `Mail::fake()`, `Event::fake()`, `Queue::fake()`, `Storage::fake()` (réinitialisés à chaque test).

## À nettoyer manuellement

Propriétés statiques, caches custom hors `Cache` Laravel, fichiers hors `Storage::fake()`, état de service externe.

```php
protected function tearDown(): void
{
    Storage::fake()->deleteDirectory('/');
    parent::tearDown();
}
```

⚠️ Un cache non vidé fuit vers le test suivant : `Cache::rememberForever('genres', ...)` persiste tant que le store `array` n'est pas réinitialisé — dans un test de cache, poser explicitement `Cache::flush()` en préambule.
