# ADR-14: Librairie externe : vraie valeur ajoutée, isolée derrière un contrat

**Date**: 2026-11-06
**Status**: Accepted

## Context

La philosophie du projet (« Architecture Native JavaScript ») se lisait comme « tout en natif ». Appliquée au rendu serveur, cette lecture a produit un SSR maison (`server.js`, `src/ssr/`) qui porte seul des sujets sensibles : échappement de l'état contre le XSS, isolation des requêtes, gardes de route au rendu. En deux jours de revue sont apparus un échappement fait main (remplacé par `devalue`), un routeur gardé dans une variable partagée par toutes les requêtes et des gardes de rôle non évaluées au SSR ([ADR-06](ADR-06-rendu-ssr-authentifie.md)).

Le but du JS natif n'a jamais été de réécrire ce que d'autres maintiennent mieux, mais de garder la logique portable : plus elle vit dans des fichiers `.js`, moins il y a à migrer si l'on quitte Vue. [ADR-02](ADR-02-slug-natif-sans-package.md) posait déjà, côté Laravel, la moitié de la règle : un package seulement pour une vraie valeur ajoutée. Il manquait l'autre moitié : comment l'intégrer sans s'y enfermer.

## Decision

**1. Natif quand c'est utile, pas par principe.** Le code de Ghosty reste en JS natif tant que le besoin est simple et circonscrit. On ne réécrit ni Vue ni ses briques de base.

**2. Une librairie externe est acceptée à deux conditions cumulatives.**

- **Vraie valeur ajoutée** : elle résout un problème complexe, sensible ou plein de cas limites (sécurité, sérialisation, rendu serveur, upload…), que le code maison couvrirait moins bien. Un besoin de quelques lignes ne justifie pas une dépendance.
- **Isolée derrière un contrat** : un seul module l'importe (l'adaptateur). Le reste du code dépend du contrat défini par Ghosty, jamais de la librairie. Remplacer la librairie revient à réécrire l'adaptateur, sans toucher `apis/`, les vues ni les stores.

Seul Vue échappe à la seconde condition : c'est le socle. Et même Vue est contenu : la logique vit dans des fichiers `.js` pour que changer de framework laisse le moins possible à migrer. Les librairies de l'écosystème Vue suivent la règle : vue-router est isolé dans le service router de Vuemann (`services/router/`), qui sert de contrat au reste du code.

**3. Application au SSR.** Le moteur de rendu (aujourd'hui Express + `renderToString` + `devalue` + unhead) devient un adaptateur remplaçable, comme vue-router derrière le service router de Vuemann. L'application lui expose un contrat :
- `createApp()` ;
- un **registre unique des stores**, avec leur état à sérialiser et à hydrater ;
- le **préchargement par route** ;
- le **head** de la page.

Un framework qui prend la main sur l'application (point d'entrée, routage, chargement des données) ne peut pas être isolé ainsi : il est exclu.

**4. Exemples.**
- `devalue` : retenu. Sérialisation sûre contre le XSS, dates conservées ; seul `ssr/engine/state-script.js` l'importe.
- Pinia : écarté. Un store natif tient en quelques lignes ; son seul apport, l'état SSR isolé et sérialisé, est couvert par le registre de stores du contrat.
- Nuxt : écarté. Il possède l'application et ne peut pas être isolé.
- Vike : candidat comme moteur SSR, à évaluer branché sur le contrat.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Valeur ajoutée + isolation (retenu)** | Sujets sensibles confiés à du code éprouvé ; logique métier portable ; remplacement localisé | Un contrat et un adaptateur à concevoir et maintenir |
| Tout en natif | Aucune dépendance ; tout est maîtrisé | Infrastructure sensible portée seule ; bugs que d'autres ont déjà corrigés |
| Librairie utilisée directement partout | Rien à concevoir | Le code dépend de la librairie ; la remplacer touche tout le projet |
| Framework complet (Nuxt) | Conventions toutes prêtes, SSR maintenu par d'autres | Prend la main sur l'architecture ; incompatible avec Vuemann et Controllers → Repositories → DTO ; impossible à isoler |

## Consequences

- **Positive**: les sujets sensibles s'appuient sur du code éprouvé ; le choix d'une librairie se justifie par deux critères vérifiables ; changer de moteur SSR ne touche qu'un adaptateur.
- **Negative**: chaque librairie retenue demande un contrat et un adaptateur.
- **Risks**: un contrat mal découpé laisse fuir la librairie dans le code ; à vérifier à chaque nouvel import d'une dépendance hors de son adaptateur.

## Références

- [ADR-02](ADR-02-slug-natif-sans-package.md) — natif d'abord pour un besoin simple
- [ADR-06](ADR-06-rendu-ssr-authentifie.md) — rendu SSR authentifié
- Contrat : `frontend/src/ssr/app.js`, `store-registry.js`, `server-app.js`, `client-app.js`
- Moteur : `frontend/src/ssr/engine/`, `frontend/server.js`
