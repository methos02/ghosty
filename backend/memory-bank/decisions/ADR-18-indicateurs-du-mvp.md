# ADR-18: Indicateurs du MVP calculés à la demande

**Date**: 2026-11-15
**Status**: Accepted

## Context

Le MVP §16 liste neuf indicateurs qui doivent « permettre de décider si le fonctionnement multivers mérite d'être développé davantage ». Le §16 les nomme sans les définir : « lecteurs qui reviennent », « branches actives », « lecture jusqu'à la fin » n'ont pas de sens univoque dans un arbre où rien n'est clos.

Trois contraintes héritées :

- [ADR-09](ADR-09-pas-d-archivage-automatique.md) : « propositions archivées sans interaction » devient une **mesure**, sans changer l'état d'aucun contenu.
- [ADR-17](ADR-17-profils-et-signalement-utilisateur.md) : les statistiques se calculent à la lecture, jamais dénormalisées ; « le lot 9 reprendra la même règle ».
- [ADR-12](ADR-12-suivi-de-branche-et-parcours-de-lecture.md) : `chapter_reads` garde une ligne par chapitre et par lecteur (compte, sinon session navigateur), horodatée à la **première** lecture.

## Decision

**1. `GET /metrics`, réservé aux administrateurs.** Le rôle `admin` seul, non banni (`User::canViewMetrics()`), via `UserPolicy::viewMetrics`. Un modérateur n'y a pas accès : les indicateurs pilotent le produit, pas la modération.

**2. Une période glissante, choisie à la demande.** `?days=` de 1 à 365, 30 par défaut (`ghosty.metrics.default_days`). La réponse rappelle la période (`days`, `from`, `to`).

**3. Chaque indicateur est un couple `count` / `total`.** `total` est le dénominateur qui donne son sens au chiffre ; il vaut `null` pour un simple compte. Le taux se calcule à l'affichage.

**4. Un lecteur est un compte, sinon une session navigateur.** Un compte qui lit sur deux appareils reste un lecteur ; un invité qui vide son stockage en devient deux. C'est la seule identité dont dispose `chapter_reads`.

**5. Les neuf définitions :**

| Clé | `count` | `total` | Fenêtre |
|---|---|---|---|
| `returning_readers` | lecteurs ayant ouvert un chapitre **nouveau pour eux** sur au moins deux jours distincts | lecteurs actifs | période |
| `returning_authors` | auteurs ayant publié un chapitre qui n'était pas leur premier | auteurs ayant publié | période |
| `continued_continuations` | suites (chapitres non racines) publiées et poursuivies | suites publiées | publiées dans la période |
| `active_branches` | branches ayant reçu une suite publiée | branches existantes | période / instantané |
| `alternate_branch_readers` | lecteurs ayant lu un chapitre hors de la branche principale | lecteurs actifs | période |
| `branch_followers` | comptes qui suivent au moins une branche | — | instantané |
| `completed_readings` | couples lecteur × roman ayant atteint une fin de branche | couples lecteur × roman | période |
| `comments` / `likes` | commentaires et soutiens créés | — | période |
| `inactive_continuations` | suites publiées depuis plus de 30 jours sans soutien, commentaire ni suite | suites publiées depuis plus de 30 jours | instantané |

Précisions :

- **Hors de la branche principale** : ni ancêtre ni descendant de `novels.main_branch_last_chapter_id`. Le descendant est exclu parce que la lecture prolonge la branche élue à travers les suites sans soutien ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)) : y lire n'est pas explorer.
- **Fin de branche** : un chapitre publié sans suite publiée (`continuations_count = 0`), à l'instant du calcul.
- **Publication** : tout chapitre au `published_at` renseigné, même masqué depuis : l'indicateur mesure un comportement d'auteur, pas l'état actuel d'un texte.
- **Suite poursuivie** : `continuations_count > 0`, suites de l'auteur lui-même comprises (MVP §6 l'autorise).
- **`inactive_continuations`** : le délai est `ghosty.metrics.inactive_after_days` (30). Aucun état n'est modifié ([ADR-09](ADR-09-pas-d-archivage-automatique.md)).

**6. Tout est calculé à la demande**, par une requête agrégée par indicateur, toutes réunies dans `MetricsRepository` ; `MetricsService` les assemble. C'est une exception assumée à la règle « un repository par entité » : les agrégats croisent chapitres, lectures, suivis, commentaires et soutiens, et les rassembler garde les repositories métier libres de requêtes qui ne servent qu'au pilotage. Aucune table, aucun compteur, aucune commande planifiée.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Calcul à la demande (retenu)** | Toujours juste ; aucun invariant de plus ; période libre | Une dizaine d'agrégats par affichage, sur une page vue par une poignée d'administrateurs |
| Instantanés quotidiens en table | Historique, courbes | Commande planifiée, table, et une période figée ; prématuré tant que le MVP n'a pas de trafic |
| Ouvrir les indicateurs aux modérateurs | Plus de regards | Données de pilotage sans rapport avec la file de modération |
| Lecteur revenant = présent sur deux périodes consécutives | Mesure de cohorte classique | Deux périodes à interroger, sens moins lisible ; repoussé à une V2 avec instantanés |
| Retour lu dans `reading_progress.read_at` | Capte la relecture | Réservé aux comptes, écrasé à chaque lecture : ne donne pas le nombre de jours |

## Consequences

- **Positive** : les neuf indicateurs du §16 sont observables sans toucher au schéma ; les définitions sont figées ici, donc comparables d'une période à l'autre.
- **Negative** : un retour qui ne relit que des chapitres déjà lus n'est pas vu (`chapter_reads` ne garde que la première lecture) ; une suite récemment publiée a mécaniquement moins de chances d'être déjà poursuivie, d'où un `continued_continuations` plus bas sur une courte période.
- **Risks** : les agrégats parcourent `chapter_reads` sur la période ; si la table grossit au point de ralentir la page, passer aux instantanés quotidiens (alternative écartée) plutôt que d'indexer à l'aveugle.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §9, §16
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 9
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md), [ADR-09](ADR-09-pas-d-archivage-automatique.md), [ADR-12](ADR-12-suivi-de-branche-et-parcours-de-lecture.md), [ADR-17](ADR-17-profils-et-signalement-utilisateur.md), [ADR-19](ADR-19-pas-de-statut-archive.md)
