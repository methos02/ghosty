---
paths:
  - "backend/tests/**/*.php"
---
# Avoid Redundant Tests

Chaque test vérifie un comportement unique. Ne pas dupliquer une assertion entre deux tests.

## Signes de redondance

| Pattern | Problème |
|---------|----------|
| Deux tests validant le même appel | Fusionner |
| Tester une transformation déjà couverte ailleurs | Supprimer le doublon |
| Plusieurs tests pour le même retour vide (null, [], {}) | Ne garder que le vrai cas vide |
| Même résultat attendu dans plusieurs tests | Consolider |

Une règle de validation = un test. `email_is_required` et `email_cannot_be_empty` testant tous deux `email => ''` sont redondants : garder un seul cas par règle (required, format, unique, min...).

```php
// ❌ redondant
public function email_is_required(): void { /* email => '' */ }
public function email_cannot_be_empty(): void { /* email => '' */ }

// ✅ une règle par test
public function email_is_required(): void { /* email => '' */ }
public function email_must_be_valid(): void { /* email => 'invalid' */ }
public function email_must_be_unique(): void { /* email déjà pris */ }
```

Avant d'écrire un test, vérifier que le comportement n'est pas déjà couvert.
