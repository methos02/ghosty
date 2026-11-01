# ADR-13: Commentaires

**Date**: 2026-10-31
**Status**: Accepted

## Context

Le MVP §11 demande des commentaires « simples », attachés au roman, à une branche, à un chapitre et à l'illustration du roman, avec réponses, masquage des divulgâcheurs, signalement, masquage par la modération et blocage des abus. Le plan (lot 5) prévoit une table `comments` polymorphe, des réponses à un niveau et la suppression par l'auteur ; la modération des commentaires relève du lot 6, l'illustration du lot 7.

[ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md) a écarté la table `branches` : une branche est désignée par son chapitre-tête (décision D4 du plan).

## Decision

**1. Deux cibles aujourd'hui : roman et chapitre.** `comments` est polymorphe (`commentable_type`, `commentable_id`). Commenter une branche, c'est commenter son chapitre-tête, comme la suivre ([ADR-12](ADR-12-suivi-de-branche-et-parcours-de-lecture.md)). `NovelCover` rejoindra la morph map au lot 7, sans changer la table.

**2. Réponses à un niveau.** Une réponse porte le `parent_id` d'un commentaire principal et la même cible. On ne répond pas à une réponse : un fil reste lisible sans arborescence.

**3. Pas d'édition.** Un commentaire publié ne se modifie pas : une réponse ne doit jamais viser un texte qui a changé. C'est la même logique que l'immuabilité des chapitres ([ADR-11](ADR-11-chapitre-publie-non-reecrivable.md)).

**4. Suppression par l'auteur : le texte disparaît, la trace reste si elle porte des réponses.** Supprimer passe `status` à `deleted` et efface `content`. Dans le fil :
- un commentaire supprimé **avec** des réponses visibles reste affiché, anonyme (« Commentaire supprimé »), pour que les réponses gardent leur contexte ;
- sans réponse, il disparaît ;
- une réponse supprimée disparaît toujours.

La ligne n'est jamais effacée : la modération (lot 6) pourra relire un signalement visant un commentaire supprimé entre-temps. Le statut `hidden` est réservé à la modération.

**5. Divulgâcheur signalé par son auteur.** `is_spoiler` est coché à l'écriture. L'API sert le texte avec le drapeau ; c'est le front qui le masque derrière un clic. Masquer côté serveur obligerait à un second appel pour lire un texte que le lecteur a décidé de voir.

**6. Compteurs dénormalisés.** `chapters.comment_count` et `novels.comment_count` comptent les commentaires **et** les réponses visibles ; `comments.reply_count` compte les réponses visibles. Le `CommentService` est le seul écrivain ([ADR-03](ADR-03-compteur-denormalise-chapter-count.md)). Les incréments passent par `toBase()`, sans toucher `chapters.updated_at`, qui déclenche le recalcul planifié des cumuls de soutiens ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)).

**7. Notifications.** `comment_received` prévient l'auteur du contenu commenté (chapitre ou roman) d'un commentaire principal ; `comment_replied` prévient l'auteur du commentaire d'une réponse. Une réponse ne notifie pas l'auteur du contenu : il n'est pas l'interlocuteur. Les deux sont agrégées par contenu commenté ([ADR-10](ADR-10-notifications-in-app-agregees.md)), et personne n'est notifié de sa propre action.

**8. Routes imbriquées.** `GET|POST /chapters/{id}/comments`, `GET|POST /novels/{slug}/comments`, `POST /comments/{id}/replies`, `DELETE /comments/{id}`, au lieu du `GET /comments?on=chapter&id=…` du plan : c'est la forme des autres actions sur un chapitre (`/follow`, `/like`, `/report`), et la cible est validée par la route plutôt que par un paramètre à contrôler. L'écriture est limitée par utilisateur (`throttle:comment`).

**9. Ordre.** Commentaires principaux du plus récent au plus ancien, paginés ; réponses dans l'ordre chronologique sous leur commentaire.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Trace si réponses (retenu)** | Les réponses des autres gardent leur contexte ; pas de trace inutile | Trois cas d'affichage |
| Suppression définitive (cascade) | Le plus simple | Efface les réponses des autres lecteurs |
| Toujours une trace | Un seul cas | Des « Commentaire supprimé » sans objet dans le fil |
| Édition libre ou limitée dans le temps | Corriger une coquille | Une réponse peut viser un texte qui a changé ; il faut un historique pour la modération |
| Réponses imbriquées sans limite | Conversations profondes | Arborescence illisible sur mobile ; se rapproche du forum hors MVP |
| Spoiler masqué côté serveur | Rien ne fuit dans la réponse | Second appel pour lire ; le spoiler n'est pas un secret, juste une courtoisie |
| `GET /comments?on=…&id=…` (plan) | Un seul endpoint pour toutes les cibles | Validation de la cible à la main ; forme différente des autres actions sur un chapitre |

## Consequences

- **Positive**: le lecteur peut réagir, encourager et relever une incohérence (§11) ; l'auteur est prévenu ; les compteurs sont prêts pour les indicateurs §16 (« propositions sans commentaire »).
- **Negative**: le signalement et le masquage des commentaires attendent le lot 6 ; d'ici là, seuls le throttle et le bannissement bornent les abus.
- **Risks**: les réponses sont chargées en entier sous chaque commentaire de la page ; un fil très actif pourra demander de les paginer à leur tour.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §11 (commentaires), §16 (indicateurs)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 5, décision D4, types `comment_received` / `comment_replied`
- [ADR-03](ADR-03-compteur-denormalise-chapter-count.md), [ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md), [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md), [ADR-10](ADR-10-notifications-in-app-agregees.md), [ADR-11](ADR-11-chapitre-publie-non-reecrivable.md), [ADR-12](ADR-12-suivi-de-branche-et-parcours-de-lecture.md)
