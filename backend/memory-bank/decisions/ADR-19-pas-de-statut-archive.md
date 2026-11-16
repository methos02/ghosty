# ADR-19: Pas de statut « archivé » : un chapitre retiré par la modération est masqué

**Date**: 2026-11-16
**Status**: Accepted

## Context

Le MVP §9 prévoyait d'archiver une proposition restée sans interaction : elle n'était plus mise en avant mais restait consultable, depuis le profil de son auteur ou les « archives du roman ». [ADR-09](ADR-09-pas-d-archivage-automatique.md) a supprimé cet archivage par le temps et a gardé le statut `archived` comme **issue douce de modération** (« qualité insuffisante, hors sujet »), à côté de `hidden`. [ADR-15](ADR-15-traitement-de-la-moderation.md) l'a mis en œuvre ; [ADR-17](ADR-17-profils-et-signalement-utilisateur.md) l'a laissé sur le profil ; le lot 9 ([ADR-18](ADR-18-indicateurs-du-mvp.md)) a ouvert une page publique d'archives par roman.

À l'usage, l'issue n'a pas de cas propre :

- un modérateur ne retire un chapitre que s'il enfreint une règle. Une règle enfreinte ne justifie pas de laisser le texte en accès public ;
- une qualité d'écriture minimale fait partie des règles : un texte bâclé ou illisible (écriture SMS, fautes à chaque phrase) est une infraction, pas un simple texte faible. La V1 de Ghosty en a connu. Il n'a pas à rester en lecture publique ;
- la page d'archives exposait précisément au public ce que la modération venait de retirer.

## Decision

**1. Le statut `archived` disparaît.** Un chapitre est `draft`, `published` ou `hidden`. `Chapter::STATUS_ARCHIVED`, le scope `archived`, `isArchived()` et l'état de factory `archived()` sont supprimés. La valeur `2` de `chapters.status` n'est plus utilisée.

**2. Une seule issue retire un chapitre de la lecture : `hidden`.** `ReportResolution::Archived` est supprimé. Pour une feuille, la modération choisit entre `dismissed`, `hidden` et `passage_removed` ; pour un chapitre poursuivi, entre `dismissed` et `passage_removed` (inchangé, [ADR-15](ADR-15-traitement-de-la-moderation.md) §2). `ChapterService::hide()` remplace `removeFromReading($chapter, $status)`.

**3. Un chapitre masqué n'est visible que de la modération et de son auteur.** Le public reçoit un 404 (`ChapterPolicy::view`). Les modérateurs l'ouvrent par `GET /moderation/chapters/{id}` et le retrouvent par les signalements traités (`GET /moderation/reports?status=2`). Le rétablissement reste possible.

**4. Pas d'archives du roman.** La route `GET /novels/{slug}/archives` et la page associée sont retirées avant fusion du lot 9.

**5. Le profil ne liste que les chapitres publiés.** Le scope `visibleOnProfile` est remplacé par `published` ; les statistiques du profil ne comptent plus que les chapitres publiés.

**6. La qualité minimale reste une règle modérée.** Le motif `poor_quality` (« chapitre bâclé ou illisible ») est conservé : un texte en dessous du standard de Ghosty se masque comme toute autre infraction. Le soutien départage les textes acceptables ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)), il n'est pas chargé de faire respecter le standard.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Supprimer `archived` (retenu)** | Une issue par situation ; rien d'exposé au public après une décision de modération | L'auteur ne peut plus montrer publiquement un texte retiré |
| Garder `archived`, sans page d'archives | Moins de changements | Une sanction à moitié publique, sans cas d'usage distinct de `hidden` |
| Garder `archived` dans l'arbre, replié | Le texte reste à sa place | Deux notions de visibilité ([ADR-09](ADR-09-pas-d-archivage-automatique.md) l'a déjà écarté) ; un texte fautif reste en lecture |

## Consequences

- **Positive** : la modération n'a plus qu'une manière de retirer un chapitre ; aucune liste publique ne montre un contenu sanctionné.
- **Negative** : l'issue est plus sévère qu'avant pour `poor_quality` et `off_topic`. Un texte sous le standard n'est plus lisible publiquement. Il reste rétablissable, et son auteur garde l'accès.
- **Migration** : aucune donnée à convertir tant que le projet n'est pas en production. Une base qui contiendrait des chapitres `status = 2` ou des signalements `resolution = 'archived'` doit les passer en `3` / `'hidden'`.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §9, §12
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md), [ADR-09](ADR-09-pas-d-archivage-automatique.md), [ADR-15](ADR-15-traitement-de-la-moderation.md), [ADR-17](ADR-17-profils-et-signalement-utilisateur.md), [ADR-18](ADR-18-indicateurs-du-mvp.md)
