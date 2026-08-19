# ADR-07: Modèle multivers — arbre de chapitres, branche dérivée

**Date**: 2026-07-31
**Status**: Accepted

## Context

Le MVP ([ghosty-mvp.md](../../../ghosty-mvp.md)) fait du multivers narratif son cœur : chaque chapitre publié peut recevoir plusieurs suites, qui coexistent sans qu'aucune ne soit éliminée (§3, §17). Le modèle en place est linéaire — une table `works` avec `order` (numéro de chapitre) et `type` (chapitre ou couverture), héritée du legacy 2016 — et ne peut pas représenter deux suites du même chapitre.

Trois questions se posaient :

1. **Où stocker l'arbre ?** Étendre `works` avec un `parent_id`, ou éclater en tables dédiées.
2. **Comment lire une branche entière** sans N requêtes récursives, sur un hébergement mutualisé (O2Switch, MySQL 8) ?
3. **La « branche » (§4) est-elle une entité ?** Une proposition devient une branche quand un autre chapitre la poursuit.

Sur le point 1, une table unique posait un problème d'intégrité qu'aucune clé étrangère ne peut couvrir : `novels.official_cover_id → works.id` autoriserait à désigner un *chapitre* comme identité visuelle, et `chapters.parent_id → works.id` un chapitre dont le parent serait une *couverture*. Le legacy montrait déjà la dérive, avec une colonne `content` documentée comme « HTML pour les chapitres, URL pour les couvertures ».

Sur le point 3, la question décisive n'est pas le coût de la table mais la **propriété** de ses attributs. Une table `branches` appelle un nom et une description ; or personne n'a de titre légitime à les écrire. L'auteur du chapitre-tête n'a pas créé la branche — il a publié une proposition, c'est quelqu'un d'autre qui l'a transformée en branche en la poursuivant ; il nommerait donc un ensemble majoritairement écrit par d'autres. Celui qui l'a poursuivie ne possède pas la tête. L'auteur du roman serait le parti pris écarté par [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md). S'y ajoute que le périmètre d'une branche est mouvant (elle grossit à chaque ajout en dessous d'elle) et qu'elle en contient d'autres, imbriquées : l'appartenance d'un chapitre à *une* branche n'a pas de réponse non arbitraire.

## Decision

**1. `works` disparaît**, remplacée par deux tables aux règles disjointes :

- **`chapters`** — l'arbre narratif ;
- **`novel_covers`** — l'illustration, qui ne concerne que le roman entier (MVP §10).

Il n'y a plus de colonne `type` discriminante, donc plus de filtre à ne pas oublier dans les requêtes, et les clés étrangères redeviennent contraignables par la base.

**2. L'arbre est parcouru par chemin matérialisé.** Chaque chapitre porte `parent_id` (null pour la racine), `path` et `depth`. Le chemin liste les ancêtres puis le chapitre lui-même, encadré de séparateurs — `/1/12/45/` — afin qu'un préfixe `LIKE '/1/12/%'` sélectionne le sous-arbre de 12 sans jamais capturer 120. Une branche entière, un fil d'Ariane ou les ancêtres d'un chapitre se lisent ainsi en une requête, sans CTE récursive.

**3. La branche n'est pas une entité mais un état dérivé.** Une branche est un chapitre dont `continuations_count > 0` (§4). Elle emprunte l'identité de son **chapitre-tête** : titre, auteur, résumé, soutiens. Elle n'a donc ni nom ni description propres — aucun champ à saisir nulle part, et l'interface la désigne partout par « *{titre du chapitre}* — par {pseudo} ». « Les branches auxquelles je participe » (§13) se lit dans `path` : les ancêtres d'un chapitre qui sont eux-mêmes des branches.

`continuations_count` ne compte que les suites **publiées** : il est décrémenté quand la modération archive ou masque une suite, pas seulement à la suppression. Sans cela, un parent resterait affiché comme branche active alors que sa seule suite est invisible, ce qu'interdit §9.

Il s'appelle `continuations_count` et non `children_count` : Eloquent réserve ce dernier nom au résultat de `withCount('children')`, qui écraserait silencieusement la valeur dénormalisée au premier eager loading.

**4. `ChapterService` est le seul autorisé à écrire dans `chapters`.** Le chemin matérialisé n'est pas une donnée que l'on saisit : il se déduit de la position du chapitre dans l'arbre, et quatre valeurs doivent bouger ensemble à chaque écriture.

| Valeur | Portée | Quand |
|---|---|---|
| `path` | le chapitre | à la création, après insertion — il contient son propre id |
| `depth` | le chapitre | à la création, `parent.depth + 1` |
| `continuations_count` | le parent direct | à la publication |
| `chapter_count` | le roman | à la publication |

Un contrôleur qui appellerait `ChapterRepository::create()` directement obtiendrait une ligne valide pour la base et invisible pour l'arbre : sans `path`, aucun préfixe `LIKE` ne la trouve ; sans incrément, le parent n'apparaît pas comme branche. La base ne peut pas l'en empêcher — aucune contrainte n'exprime « ce compteur suit cette insertion ». La règle tient donc au fait que ces calculs n'existent qu'à un seul endroit, privés (`withPath`, `registerPublication`, `attributes`), et que le service enveloppe chaque écriture dans une transaction.

Le service porte le même découpage que le reste du domaine — `createRoot`, `create`, `update`, `publish`, `delete` — et `publish` reste distinct de `update` précisément parce qu'il déclenche ces trois derniers effets.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **`chapters` + `novel_covers`, branche dérivée (retenu)** | Contraintes FK réelles ; aucune colonne morte ; pas de filtre `type` ; la branche ne peut pas diverger de son chapitre-tête | Deux modèles à écrire ; les tables polymorphes (`likes`, `comments`) ciblent deux types |
| Garder `works` + `parent_id` + `type` | Aucune refonte immédiate ; une seule table à requêter | ~9 colonnes de l'arbre sans objet pour une couverture, donc nullable pour tous ; FK incapables d'interdire « chapitre comme couverture officielle » ; validation et statuts conditionnés par `type` |
| Table `branches` explicite | Identifiant stable, métadonnées et compteurs propres ; utile au forum V2 (§15) | Attributs sans propriétaire légitime ; création rétroactive à maintenir dans la transaction d'écriture ; branches imbriquées rendant l'appartenance arbitraire ; état dupliqué avec `continuations_count` |
| Adjacency list seule (`parent_id` sans `path`) | Schéma minimal | Remonter les ancêtres coûte une requête par niveau ; « branches auxquelles je participe » devient récursif |
| `lft`/`rgt` (nested set) | Lectures de sous-arbre très rapides | Toute insertion réécrit une large partie de la table — rédhibitoire pour un site où l'on publie en continu (§3) |

## Consequences

- **Positive**: l'arbre est représentable et lisible en une requête ; la base garantit qu'un chapitre ne peut pas devenir une couverture ; aucune notion de branche à administrer, donc aucune question de gouvernance à trancher ; les invariants de l'arbre tiennent dans une seule classe, donc une seule à relire quand ils changent.
- **Negative**: `works` et tout ce qui en dépend sont supprimés (modèle, contrôleur, repository, resource, seeder, factory, test, et côté front `apis/works/`, `use-works.js`, `PaginatorChapterComponent`). La pagination linéaire « chapitre N sur M » disparaît avec `order`, remplacée par la navigation parent → suites.
- **Risks**: `path` doit être recalculé si un chapitre change de parent — le MVP ne le permet pas, mais toute fonctionnalité future de déplacement devra réécrire le sous-arbre. `continuations_count` est dénormalisé : incréments atomiques obligatoires, plus une commande de réconciliation. Si des branches nommées deviennent nécessaires (forum V2, §15), la table s'ajoutera par `INSERT … SELECT` sur `chapters WHERE continuations_count > 0` — la dérivation ne ferme aucune porte.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §3 (publication continue), §4 (proposition/branche), §8 (navigation), §10 (illustration du roman), §13 (profils)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — décisions D1 et D4
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) — soutien et continuité courante
