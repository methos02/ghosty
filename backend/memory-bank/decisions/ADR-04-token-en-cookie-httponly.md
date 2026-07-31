# ADR-04: Token d'accès transporté par un cookie HttpOnly

**Date**: 2026-07-31
**Status**: Accepted

## Context

`POST /v1/auth/login` et `/v1/auth/register` renvoyaient le token Sanctum en clair dans le corps JSON. Le front le rangeait dans `localStorage` (`auth_token`) et le rejouait en `Authorization: Bearer` à chaque requête.

`localStorage` est lisible par n'importe quel script de la page : un seul XSS (dépendance npm compromise, contenu utilisateur mal échappé, extension) suffit à exfiltrer un token qui n'expire pas (`sanctum.expiration = null`) et à usurper le compte durablement. Le token étant aussi persisté, il survit à la fermeture de l'onglet.

Le legacy Ghosty souffrait déjà du même défaut sous une autre forme (mot de passe en clair dans un cookie) — reproduire une variante moderne du problème n'était pas acceptable pour un projet dont l'audit fait de ce point une vulnérabilité critique.

## Decision

Le token n'est **jamais** exposé au JavaScript.

- L'API le pose dans un cookie **HttpOnly + Secure + SameSite=Lax** (`ghosty_token`), et ne le met plus dans le corps de la réponse.
- `Sanctum::getAccessTokenFromRequestUsing()` (dans `AppServiceProvider`) lit le token **uniquement** depuis ce cookie. L'en-tête `Authorization: Bearer` n'est plus une voie d'authentification : un token valide envoyé ainsi reçoit un 401. Un seul transport, pas de chemin parallèle à maintenir ni à auditer.
- Le front n'envoie plus d'`Authorization` : `requestInterceptor` pose `credentials: 'include'` et le navigateur joint le cookie tout seul.
- Un second cookie **`ghosty_session`, lisible et sans secret**, indique au front qu'une session existe : sans lui, aucun appel à `/auth/me` n'est tenté au démarrage.
- `authStore` ne contient plus que `user` ; plus rien n'est écrit dans `localStorage`. La session est restaurée après le mount via `auth.fetchCurrentUser()`.

Contrainte induite : front et API doivent être servis sur le **même site** (`app.ghosty.local` / `api.ghosty.local` en dev, `ghosty.fr` / `api.ghosty.fr` en prod) pour que `SameSite=Lax` s'applique, et le CORS passe en `supports_credentials` avec des origines explicites.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Cookie HttpOnly posé par Laravel (retenu)** | Token hors de portée du JS ; backend reste une API REST à tokens ; peu de pièces mobiles | Impose des domaines same-site et un CORS avec credentials |
| Sanctum SPA stateful (session + XSRF) | Protection CSRF native de Laravel | Infra session + round-trip `/sanctum/csrf-cookie` ; abandonne les personal access tokens ; même contrainte de domaine |
| BFF : proxy sur le serveur Node SSR | Zéro CORS, cookie toujours first-party | Node entre dans le chemin d'auth ; changement le plus lourd |
| Garder `localStorage` | Rien à faire | La vulnérabilité reste |

## Consequences

- **Positive**: un XSS ne peut plus lire ni exfiltrer le token ; le front n'a plus aucun secret à gérer ; `logout` expire les deux cookies côté navigateur en plus de révoquer le token en base.
- **Negative**: un aller-retour `/auth/me` au démarrage pour les visiteurs connectés, donc un bref état « déconnecté » avant restauration ; le dev impose une entrée `hosts` (`app.ghosty.local`) ; un futur client non navigateur (mobile, script) devra rouvrir explicitement une voie Bearer plutôt que d'en hériter.
- **Risks**: `SameSite=Lax` protège du CSRF cross-site mais pas d'un sous-domaine hostile — à revoir si Ghosty ouvre des sous-domaines tiers. Le rendu SSR reste anonyme : rendre l'auth request-scoped (`createAuthStore()` + `provide()`) est le prolongement naturel de cette décision.

## Références

- `app/Http/Controllers/Api/V1/AuthController.php`
- `app/Providers/AppServiceProvider.php`
- `config/sanctum.php` → `token_cookie`, `config/cors.php`
- `frontend/src/services/auth/src/auth-store.js`, `frontend/src/services/ajax/src/models/request-interceptor.js`
