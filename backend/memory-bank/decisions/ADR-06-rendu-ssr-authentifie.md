# ADR-06: Rendu SSR authentifié via le cookie de session

**Date**: 2026-07-31
**Status**: Accepted

## Context

Après [ADR-04](ADR-04-token-en-cookie-httponly.md), le front ne peut plus lire son token. L'état d'authentification n'était donc connu qu'après un aller-retour `GET /auth/me` déclenché au démarrage du client : le HTML rendu par le serveur affichait « Connexion / Inscription » puis basculait sur le pseudo une fois la réponse arrivée.

Le store auth était par ailleurs un singleton de module (`ref()` au niveau fichier), ce qui viole la règle SSR n°1 du projet : au premier code serveur qui l'écrirait, l'utilisateur d'une requête fuiterait dans le rendu d'une autre.

## Decision

Le cookie `ghosty_token` étant posé sur le domaine parent (`.ghosty.local`, `.ghosty.fr`), il accompagne aussi les requêtes vers le serveur Node. Celui-ci peut donc rendre la page déjà authentifiée.

- **Store auth request-scoped** : `createAuthStore()` (factory) fournie par `provide(AUTH_STORE_KEY)` dans `ssr/app.js`, avec `serialize()` / `hydrate()` comme les autres stores.
- `useAuthStore()` fait `inject(AUTH_STORE_KEY, clientStore)` en contexte de composant. Hors contexte (handlers, `authFunctions`), il retourne le store client, posé une seule fois par `setClientAuthStore()` — **uniquement quand `ssr` est faux**. Côté serveur, ce repli n'existe pas : `useAuthStore()` crée alors un store anonyme jetable, jamais partagé entre requêtes.
- **`server.js`** transmet `req.headers.cookie` à `render(url, { cookie })`.
- **`entry-server`** appelle `authFunctions.restoreSession(stores.auth, cookie)` avant le routage : la fonction ne contacte `/auth/me` que si le témoin `ghosty_session` est présent, en réinjectant l'en-tête `Cookie` reçu. Elle retourne un `{ status }` uniforme — pas de `try/catch` : `req()` convertit déjà toute erreur réseau en statut, et `entry-server` ne logue que les `≥ 500`, exactement comme `runAsyncData`. Un cookie périmé (401) est un cas nominal : rendu anonyme, rien à signaler.
- L'état auth part dans `__INITIAL_STATE__` ; le client l'hydrate et **n'appelle `/auth/me` que si le store est vide** (navigation SPA, ou SSR indisponible).

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Restauration serveur + hydratation (retenu)** | Zéro flash, zéro requête client redondante, HTML correct pour un utilisateur connecté | Un appel `/auth/me` serveur par requête *authentifiée* ; store à rendre request-scoped |
| Garder le fetch client après mount | Aucun changement | Flash « déconnecté » à chaque chargement ; mismatch d'hydratation ; store partagé non conforme à la règle SSR |
| Persister le profil dans un cookie lisible | Pas d'appel API | Donnée falsifiable côté client et vite périmée |

## Consequences

- **Positive**: le header est rendu authentifié dès le premier octet ; plus d'aller-retour redondant ; le store auth respecte enfin la règle des stores request-scoped, ce qui débloque les futures pages nécessitant l'utilisateur au rendu.
- **Negative**: chaque rendu d'un visiteur connecté ajoute un appel `/auth/me` Node → Laravel. Les visiteurs anonymes (le gros du trafic SEO) n'en paient aucun grâce au témoin `ghosty_session`.
- **Risks**: les gardes de rôle (`meta.roles`) ne sont toujours pas évaluées au SSR — `routerFunctions.beforeEach` passe par le service auth global, sans accès au store de la requête. Aucune route ne déclare de rôle aujourd'hui ; la première qui le fera devra recevoir le store explicitement, comme `asyncData`. Le serveur Node doit joindre l'API (`VITE_GHOSTY_API_URL` absolue).

## Références

- `frontend/src/services/auth/src/auth-store.js`, `frontend/src/services/auth/src/auth-functions.js` → `restoreSession()`
- `frontend/src/ssr/app.js`, `frontend/src/ssr/entry-server.js`, `frontend/src/ssr/entry-client.js`
- `frontend/server.js`
