# ADR-12: Suivi de branche et parcours de lecture

**Date**: 2026-10-09
**Status**: Accepted

## Context

Le MVP §8 demande que le lecteur puisse **suivre une branche** et **retrouver l'historique de son parcours de lecture** ; §16 veut mesurer « le nombre de personnes qui suivent une branche », « les lecteurs qui reviennent » et « le taux de lecture jusqu'à la fin ». Le plan (lot 4) prévoit trois tables : `follows`, `reading_progresses`, `chapter_reads`, ainsi qu'une progression invitée gardée dans le navigateur et fusionnée à la connexion — écartée ici (point 6).

[ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md) a écarté la table `branches` : une branche est **dérivée**, désignée par son chapitre-tête.

## Decision

**1. Suivre une branche, c'est suivre son chapitre-tête.** `follows` porte `user_id` et `chapter_id`, unique par paire. Ce n'est **pas** une relation polymorphe `Novel|Chapter` comme l'envisageait le plan : suivre un roman revient à suivre son chapitre d'origine, tête de tout l'arbre. Une seconde forme dirait deux fois la même chose.

**2. `followed_branch_extended`.** À chaque publication d'une suite, les abonnés de **n'importe quel ancêtre** du nouveau chapitre (le `path` du parent) sont notifiés. Les notifications sont agrégées par abonné et par roman, avec la liste des nouveaux chapitres, sur la même forme que `main_branch_*` ([ADR-10](ADR-10-notifications-in-app-agregees.md)). Deux personnes ne reçoivent rien :
- l'auteur de la suite, qui ne se notifie jamais lui-même ;
- l'auteur du chapitre parent, qui reçoit déjà `chapter_continued` pour le même événement. Deux notifications pour une seule suite seraient du bruit.

Un brouillon ne notifie personne : seule la publication compte.

**3. Une lecture unique par lecteur et par chapitre.** `chapter_reads` porte `chapter_id`, `user_id` (nul pour un invité) et `session_key`, une clé UUID générée par le navigateur et gardée dans `ssr-storage`. Deux contraintes uniques, `(chapter_id, session_key)` et `(chapter_id, user_id)`, garantissent qu'un même navigateur et un même compte ne comptent qu'une fois. MySQL accepte plusieurs `NULL` dans la seconde : les invités ne sont donc contraints que par la première. Une lecture nouvelle incrémente `chapters.read_count`.

**4. `read_count` s'incrémente sans horodatage.** L'incrément passe par `toBase()`, sans toucher `chapters.updated_at`. Ce champ sert de marqueur « roman à recalculer » pour la commande planifiée des cumuls de soutiens ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)) : une lecture qui le pousserait relancerait le recalcul toutes les cinq minutes sur tout roman lu.

**5. La progression du compte suit la dernière lecture.** `reading_progress` (une ligne par lecteur et par roman) pointe le dernier chapitre lu et sa date `read_at`. Le nom de table suit la convention Laravel : « progress » est indénombrable, le modèle `ReadingProgress` lit donc `reading_progress`. Un brouillon relu par son auteur ne compte ni comme lecture ni comme progression.

**6. Un invité n'a ni historique ni reprise de lecture.** Sa lecture compte dans `read_count` (point 3), mais rien n'est gardé pour lui : ni progression dans le navigateur, ni rattachement de ses lectures anonymes au compte qu'il ouvrirait ensuite. Pour retrouver son parcours, il faut être connecté.

**7. L'enregistrement d'une lecture est une écriture explicite.** `POST /chapters/{id}/read` est appelé par la page de lecture, côté client uniquement. Il n'est jamais déclenché par le `GET` de lecture, que le rendu SSR rejoue à chaque requête. L'endpoint est public et limité par IP (`throttle:chapter-read`). Les erreurs ne sont pas affichées au lecteur : un compteur manqué ne mérite pas d'interrompre la lecture.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Suivi du chapitre-tête seul (retenu)** | Une seule forme ; cohérent avec la branche dérivée d'ADR-07 | Le front doit présenter « suivre le roman » comme « suivre le premier chapitre », s'il le propose un jour |
| `follows` polymorphe `Novel\|Chapter` (plan) | Libellé « suivre le roman » direct | Deux formes pour une même portée ; double notification si l'on suit les deux |
| Notifier seulement les suites directes du chapitre suivi | Moins de notifications | Contredit « suivre une branche » : la branche continue bien au-delà de la première suite |
| Enregistrer la lecture dans le `GET` de lecture | Aucun appel en plus | Rejoué par le SSR et par les robots ; un `GET` qui écrit ; double comptage au rendu puis à l'hydratation |
| Clé de lecture générée par le serveur (session Laravel) | Non falsifiable | L'API est sans état (cookie de jeton, ADR-04) ; il faudrait réintroduire une session pour les invités |
| `read_count` calculé à la volée (`COUNT` sur `chapter_reads`) | Toujours exact | Une agrégation par chapitre à chaque liste ; contraire à la règle des compteurs dénormalisés (ADR-03) |
| Progression invitée gardée dans le navigateur, fusionnée à la connexion (plan) | Le parcours d'avant la connexion n'est pas perdu | Un endpoint de fusion, des règles d'arbitrage (date la plus récente, chapitre dépublié, lecture déjà comptée) et un risque sur appareil partagé, pour un gain faible : se connecter suffit |

## Consequences

- **Positive**: les indicateurs §16 « personnes qui suivent une branche », « lecteurs qui reviennent » et « lecture jusqu'à la fin » deviennent mesurables par `follows`, `chapter_reads` et `reading_progress`. La boucle de rétention s'étend au lecteur : il est prévenu quand la branche qu'il suit continue.
- **Negative**: la clé de session vient du client. Un script qui en génère de nouvelles gonfle `read_count`, dans la limite du throttle par IP. Le compteur est une statistique, jamais une autorisation ni un critère de classement.
- **Risks**: le lot modération devra exclure des listes « Mes lectures » les chapitres masqués (`hidden`) après coup ; aujourd'hui, une progression ou un suivi peut pointer vers un chapitre masqué. Une page très suivie produit une notification par abonné et par publication : à surveiller si le volume grossit (file asynchrone).

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §8 (lecture et navigation), §16 (indicateurs)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 4, type `followed_branch_extended`
- [ADR-03](ADR-03-compteur-denormalise-chapter-count.md) — compteurs dénormalisés
- [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md) — branche dérivée, désignée par son chapitre-tête
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) — recalcul planifié déclenché par `chapters.updated_at`
- [ADR-10](ADR-10-notifications-in-app-agregees.md) — agrégation des notifications
