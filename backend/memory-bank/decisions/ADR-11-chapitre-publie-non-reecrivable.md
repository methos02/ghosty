# ADR-11: Un chapitre publié ne se réécrit pas — seules ses fautes se corrigent

**Date**: 2026-08-03
**Status**: Accepted

## Context

Le lot 1 avait ouvert une fenêtre d'édition de trente minutes après publication, fermée dès qu'une suite existait. Ce compromis est faux dès la première minute : un chapitre est **lisible à la seconde où il est publié** (MVP §3), et rien n'empêche qu'il soit lu, soutenu ou commenté avant la fin de la fenêtre. Un lecteur peut donc soutenir un texte, puis en découvrir un autre à la relecture — son soutien porterait sur quelque chose qui n'existe plus.

La contrainte « pas de suite existante » ne protège pas davantage : elle empêche de trahir les auteurs qui ont poursuivi le chapitre, pas les lecteurs qui l'ont déjà lu. Or dans un multivers où aucune proposition n'est éliminée ([ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md)), le texte publié est le seul point fixe sur lequel tout le reste s'appuie : les soutiens le classent, les suites le prolongent, les commentaires le discutent.

Reste un besoin légitime et minuscule : un auteur qui repère une faute d'orthographe après publication. L'interdire entièrement condamne le texte à porter sa coquille pour toujours.

## Decision

**1. Le contenu publié est immuable.** Il n'existe plus d'endpoint d'édition. `PUT /chapters/{chapter}` devient une **correction** : l'auteur soumet le même texte, fautes rattrapées.

**2. « Même texte » est vérifié par une part de changement**, via la règle `LimitedTextChange` : au plus `max_changed_percent` du texte modifié, mesuré par une distance d'édition **au niveau du mot**, casse ignorée. Appliqué au titre, au texte et au résumé.

**3. Plus d'interdiction liée aux suites.** Un chapitre poursuivi reste corrigeable : ce qui protège les auteurs qui l'ont prolongé, c'est l'ampleur du changement, pas son moment.

**4. Amendement du 2026-08-03 — le brouillon échappe à tout cela.** Le legacy proposait `Brouillon` à côté de `Publier`, et une page « Mes brouillons » ; l'usage est rétabli. Un chapitre existe donc en deux régimes, et un seul est figé :

| | Brouillon (`status = 0`) | Publié (`status = 1`) |
|---|---|---|
| Qui le voit | son auteur seul | tout le monde |
| Écriture | **réécriture libre**, aussi souvent que voulu | correction de fautes uniquement |
| Longueur minimale | non exigée — un texte s'écrit par étapes | exigée **au moment de publier** |
| Compteurs (`chapter_count`, `continuations_count`) | intacts | mis à jour à la publication |
| Suppression | possible (`DELETE`), le roman part avec son chapitre d'origine | jamais |

Rien ne change pour le publié : ce qui a été lu reste ce qui a été lu. Le figeage se déclenche à la publication, pas à la création — c'est le geste de publier qui engage l'auteur.

**5. Amendement du 2026-08-08 — trois limites au lieu d'une.** La vérification mot à mot s'est révélée intenable en français : `mangeait` → `mangé` est à quatre caractères de distance, et corriger trois accents sur une phrase courte dépassait les 10 % de mots autorisés. Une relecture ordinaire était refusée, alors qu'`il peut` → `il pue` passait — la règle mesurait la forme des mots, pas ce qui compte : le récit.

Le contrôle lexical est donc remplacé par trois bornes indépendantes, dont chacune suffit à refuser :

| Borne | Valeur | Ce qu'elle empêche |
|---|---|---|
| **Fenêtre** — `published_at + correction.window_hours` | 48 h | qu'un texte lu, soutenu et prolongé depuis des mois change encore |
| **Quota** — `corrected_at` doit être nul | une seule fois | la dérive par retouches successives, chacune sous le seuil |
| **Ampleur** — part du texte modifiée | `max_changed_percent` 1 %, plancher `min_changed_words` 5 | la réécriture déguisée en correction |

Les deux premières sont portées par `ChapterPolicy::update` via `Chapter::isCorrectable()`, donc répondent **403** ; la troisième est une règle de validation, donc **422**.

Le plancher en mots existe parce que le pourcentage seul rend un texte court incorrigible : 1 %% de 61 mots vaut zéro. Il garantit un budget minimal quelle que soit la longueur, et le pourcentage ne prend le relais qu au-delà de 500 mots.

Reformuler une tournure devient acceptable, et c'est voulu : ce qu'on protège n'est pas la lettre du texte mais l'histoire que les lecteurs ont soutenue et que d'autres ont prolongée. Une distance d'édition au niveau du mot, casse ignorée, mesure cela mieux qu'une comparaison caractère par caractère — elle tolère les insertions et suppressions au lieu d'exiger un nombre de mots identique.

**Limite assumée** : la mesure reste quantitative. Changer dix mots sur cent est refusé même si le sens tient ; en changer trois qui renversent une intrigue passe. Le garde-fou contre le second cas n'est pas technique, c'est le signalement — et la fenêtre de 48 h en réduit fortement la portée, puisque peu de lecteurs auront lu le texte avant.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Immuable + correction vérifiée (retenu)** | Ce qui a été lu, soutenu et poursuivi reste vrai ; l'auteur garde le droit de se relire ; aucune date arbitraire à défendre | Une règle de comparaison à écrire et à régler ; une correction légitime mais massive (accents oubliés partout) peut être refusée |
| Fenêtre d'édition de N minutes (état précédent) | Simple ; couvre le remords immédiat | Le chapitre est lisible dès la publication : la fenêtre trahit les lecteurs de la première minute ; N est indéfendable |
| Aucune édition du tout | Le plus simple à défendre et à implémenter | Une coquille reste visible pour toujours, ce que rien ne justifie |
| Édition libre + historique de versions public | Transparence totale ; usage courant (wikis) | Une interface d'historique, un stockage de versions et une notion de « version lue » à porter — hors MVP, et le lecteur devrait comparer des versions pour savoir ce qu'il a soutenu |
| Édition libre + invalidation des soutiens | Rend la réécriture honnête | Punit les soutiens pour une virgule ; ouvre le blanchiment d'un texte signalé |

## Consequences

- **Positive**: le texte est un point fixe — soutien, suite et commentaire portent sur ce qui a été lu. Aucune purge de soutiens ni historique de versions à construire. La modération n'a pas à surveiller la réécriture d'un contenu signalé après coup.
- **Negative**: une correction volumineuse mais légitime (tous les accents d'un texte tapé sans clavier français) dépasse `max_changed_percent` et sera refusée ; l'auteur devra passer par la modération. Le seuil est un réglage à observer sur les premiers usages.
- **Risks**: la règle est purement lexicale — elle laisse passer une inversion de sens tenant en deux caractères (« il peut » → « il pue », « ira » → « ura »). Elle rend la réécriture pénible et traçable, pas impossible ; le vrai garde-fou reste le signalement ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)). Si l'abus apparaît, la réponse sera la notification des lecteurs/soutiens d'un chapitre corrigé, pas le durcissement du seuil.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §3 (publication continue), §7 (soutien), §12 (modération)
- [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md) — l'arbre s'appuie sur des chapitres publiés
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) — le signalement est la seule voie négative
