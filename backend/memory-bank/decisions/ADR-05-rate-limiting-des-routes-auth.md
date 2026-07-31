# ADR-05: Rate limiting des routes d'authentification

**Date**: 2026-07-31
**Status**: Accepted

## Context

Depuis Laravel 11, le groupe de middlewares `api` est vide par défaut : aucun `throttle` n'est appliqué. `POST /v1/auth/login` acceptait donc un nombre illimité de tentatives.

Une fois le token sorti du `localStorage` ([ADR-04](ADR-04-token-en-cookie-httponly.md)), le vol de session par XSS n'est plus la voie la plus courte : le bruteforce du mot de passe le devient. `POST /v1/auth/register` est par ailleurs ouvert à la création de comptes en masse.

## Decision

Deux limiteurs nommés, déclarés dans `AppServiceProvider`, appliqués par route :

- **`login`** — 5 tentatives/minute par couple **email + IP**. Le couple (et non l'IP seule) évite qu'un utilisateur derrière un NAT partagé (entreprise, campus, 4G) soit bloqué par l'activité d'un voisin, tout en plafonnant l'attaque sur un compte donné.
- **`register`** — 5 créations/heure par **IP**. Ici l'email varie à chaque tentative, il ne peut pas servir de clé : seule l'IP identifie l'abus.

Les routes protégées (`logout`, `me`) ne sont pas throttlées : elles exigent déjà un token valide, il n'y a rien à deviner.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Limiteurs nommés par route (retenu)** | Clé adaptée à chaque menace ; quotas lisibles et testables | Deux limiteurs à maintenir |
| `throttle:60,1` global sur le groupe `api` | Une ligne | Trop permissif pour un login (60 essais/min), trop grossier ailleurs |
| Un seul limiteur par IP pour login + register | Le plus simple | Bloque tout un NAT partagé sur le login ; quota unique inadapté aux deux menaces |
| Verrouillage de compte après N échecs | Bloque l'attaque à la source | Déni de service trivial contre n'importe quel compte connu |

## Consequences

- **Positive**: le bruteforce en ligne devient impraticable (5 essais/min) ; la création de comptes en masse depuis une IP est plafonnée ; Laravel répond `429` avec `Retry-After`, exploitable par le front.
- **Negative**: un utilisateur qui se trompe 5 fois attend une minute ; une IP partagée est plafonnée à 5 inscriptions/heure.
- **Risks**: quotas basés sur le cache (`CACHE_STORE`) — en production multi-process, un store partagé (fichier/DB/Redis) est nécessaire pour que le compteur soit global. Un attaquant distribué sur de nombreuses IP contourne la limite par IP : si le besoin apparaît, ajouter un captcha ou un délai progressif.

## Références

- `app/Providers/AppServiceProvider.php` → `defineAuthRateLimiters()`
- `routes/api.php`
- `tests/Feature/Api/V1/AuthController/AuthControllerLoginTest.php`
