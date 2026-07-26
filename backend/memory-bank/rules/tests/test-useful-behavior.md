---
paths:
  - "backend/tests/**/*.php"
---
# Test Only Useful Behavior

Tester ce que la fonction retourne ou fait, pas comment elle y parvient.

| Tester | NE PAS tester |
|--------|---------------|
| Valeurs de retour / status codes | Détails d'implémentation internes |
| Effets de bord (DB, mail, token) | Compteurs d'appels (sauf critique) |
| Sortie de transformation (Resource) | État interne, types de variables |
| Réponses d'erreur (422, 401) | Valeurs jamais consommées en prod |

Avant d'écrire : « Est-ce que quelqu'un s'en soucie si ça casse ? La prod utilise-t-elle cette valeur ? Est-ce le comportement ou l'implémentation ? ».

```php
// ❌ état interne
$this->assertCount(1, User::all());

// ✅ comportement observable
$response->assertCreated();
$this->assertDatabaseHas('users', ['email' => $this->datas['email']]);
```

Si un refactor sans changement de comportement casse le test, le test testait l'implémentation.
