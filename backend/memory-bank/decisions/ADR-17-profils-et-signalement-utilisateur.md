# ADR-17: Profils publics, statistiques calculées et signalement d'un utilisateur

**Date**: 2026-11-13
**Status**: Accepted
**Amendé le**: 2026-11-16 — le profil ne liste et ne compte plus que les chapitres publiés, le statut archivé n'existant plus (voir [ADR-19](ADR-19-pas-de-statut-archive.md))

## Context

Le MVP §13 décrit le profil d'un contributeur : ses romans, ses chapitres, ses propositions, les branches auxquelles il participe, ses illustrations proposées ou sélectionnées, et « quelques statistiques simples de lectures, de soutiens et de contributions ». Les rôles (lecteur, auteur, illustrateur, modérateur) sont cumulables.

Trois notions du §13 ne correspondent plus au modèle :

- **« Chapitres » et « propositions »** : depuis [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md), tout texte est un chapitre de l'arbre. La seule frontière qui les distinguerait est l'appartenance à la branche principale, qui se déplace à chaque soutien ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)).
- **« Branches auxquelles il participe »** : une branche n'a pas de table, c'est un chapitre poursuivi ([ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md)).
- **Le rôle `author`** n'est jamais posé : seul `illustrator` l'est, à la première proposition ([ADR-16](ADR-16-illustrations-du-roman.md)).

[ADR-15](ADR-15-traitement-de-la-moderation.md) a reporté au profil le signalement d'un utilisateur.

## Decision

**1. Un profil public par compte, à `/users/{username}`.** Il expose l'identité (nom d'utilisateur, avatar, date d'inscription, rôles), les statistiques et quatre listes paginées séparément : romans, chapitres, branches, illustrations. Un contenu masqué (`hidden`) ou en brouillon n'y figure jamais. Un chapitre archivé y reste, signalé comme tel : c'est le lieu où il demeure consultable (MVP §9, [ADR-09](ADR-09-pas-d-archivage-automatique.md)). Un compte sous `account_ban` garde son profil : ses contributions restent publiées.

**2. Un seul onglet « Chapitres », marqué par la branche principale.** Il liste les chapitres publiés et archivés de l'auteur, les plus récents en tête. Un chapitre dont l'identifiant figure dans le `path` de `novels.main_branch_last_chapter_id` porte `is_in_main_branch` : la marque suit les soutiens sans qu'un chapitre change de liste.

**3. « Branches » = ses chapitres poursuivis.** Les chapitres publiés de l'auteur dont `continuations_count > 0`, triés par nombre de suites. C'est ce que son écriture a lancé ; une requête indexée suffit.

**4. Illustrations : proposées ou sélectionnées.** Ses illustrations publiées, chacune marquée `is_official` quand elle est l'officielle de son roman.

**5. Les statistiques sont calculées à la lecture, pas dénormalisées.** Pour un profil :

| Statistique | Calcul |
|---|---|
| Lectures reçues | somme des `read_count` de ses chapitres publiés et archivés |
| Soutiens reçus | somme des `like_count` de ses chapitres publiés et archivés et de ses illustrations publiées |
| Suites reçues | chapitres publiés **d'autres auteurs** dont le parent est l'un des siens |
| Contributions | nombre de romans, de chapitres publiés et archivés, d'illustrations publiées, d'illustrations officielles |

Ce sont des agrégats sur `author_id`, indexé. Les dénormaliser imposerait sept compteurs par utilisateur, à tenir à jour sur chaque publication, soutien, lecture, modération et élection d'illustration, pour une page consultée bien moins souvent que ces événements ne se produisent. Les compteurs existants (`read_count`, `like_count`, `continuations_count`) restent la source. Le lot 9 (`MetricsService`) reprendra la même règle.

**6. Le rôle `author` est posé à la première publication**, comme `illustrator` à la première proposition ([ADR-16](ADR-16-illustrations-du-roman.md)). Il sert à l'affichage du profil, jamais à une autorisation.

**7. Un utilisateur se signale depuis son profil** (`POST /users/{username}/report`). Les garde-fous sont ceux d'un contenu : compte connecté et non banni, pas d'auto-signalement, un signalement par signaleur et par cible. Les motifs se limitent à ceux qui visent une personne : `spam`, `hate_speech`, `insult`, `harassment`, `personal_attack`, `like_manipulation`, `illegal`. Les motifs de contenu (`poor_quality`, `off_topic`, `plagiarism`, `unauthorized_illustration`) se signalent sur le contenu.

**8. La décision sur un utilisateur ne touche aucun contenu.** Elle a deux issues : `dismissed` (sans sanction) ou `sanctioned` (sanction obligatoire). Le reste suit [ADR-15](ADR-15-traitement-de-la-moderation.md) : la décision clôt tous les signalements en attente sur ce compte, `content_moderated` prévient la personne sanctionnée, `report_processed` prévient chaque signaleur.

**9. `Reportable` désigne un responsable, plus un auteur.** Le contrat expose `reportedUser()` : l'auteur pour un chapitre, un commentaire ou une illustration, le compte lui-même pour un utilisateur. Garde-fous, dossier de modération et notifications lisent ce responsable.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Un onglet, marque de branche principale (retenu)** | Une liste stable ; la marque suit les soutiens | S'écarte du découpage littéral du §13 |
| Onglets « Chapitres » (branche principale) / « Propositions » | Fidèle au §13 | Un chapitre change d'onglet à chaque bascule de la branche principale |
| Onglets racines / suites | Stable | Distinction sans valeur pour le lecteur |
| Branches = fins de branche dont le `path` traverse ses chapitres | Exhaustif | Liste longue et redondante sur un roman ramifié |
| **Statistiques calculées (retenu)** | Aucun invariant de plus ; toujours justes | Quelques agrégats à chaque affichage d'un profil |
| Statistiques dénormalisées sur `users` | Lecture instantanée | Sept compteurs à maintenir sur tous les événements, réconciliation à prévoir |
| Signalement d'un utilisateur reporté | Lot plus court | Le harcèlement hors d'un contenu précis reste sans recours |

## Consequences

- **Positive** : le profil reflète toujours l'état réel des contenus ; aucune colonne ajoutée ; le signalement d'un utilisateur réutilise la file, les sanctions et les notifications existantes.
- **Negative** : un profil très actif coûte quelques agrégats par affichage ; la marque `is_in_main_branch` demande une sous-requête par chapitre listé.
- **Risks** : l'unicité `(reporter_id, reportable_type, reportable_id)` interdit de signaler à nouveau un utilisateur après un premier signalement traité, même si le comportement reprend. À revoir si la modération le constate.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §9, §13
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 8
- [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md), [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md), [ADR-15](ADR-15-traitement-de-la-moderation.md), [ADR-16](ADR-16-illustrations-du-roman.md)
