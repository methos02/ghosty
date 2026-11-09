# ADR-15: Traitement de la modération — retrait de contenu, retrait de passage et sanctions

**Date**: 2026-11-06
**Status**: Accepted

## Context

Le lot 3 a ouvert les signalements de chapitres ; ils s'empilent en base sans traitement. Le MVP §12 demande de pouvoir « masquer, archiver ou supprimer un contenu qui enfreint les règles et sanctionner les comptes concernés ». [ADR-09](ADR-09-pas-d-archivage-automatique.md) fixe deux issues de modération pour un chapitre : `archived` (qualité, hors sujet, reste consultable) et `hidden` (haine, insulte, illégal, retiré de la lecture).

Trois difficultés restaient ouvertes :

1. **Un chapitre poursuivi ne peut pas disparaître.** Ses suites ont été écrites par d'autres auteurs, de bonne foi, à partir de son texte. Le retirer rend l'histoire incompréhensible ; le retirer avec son sous-arbre punit des innocents.
2. **Le ban reposait sur `users.banned_until`** ([ADR-01](ADR-01-modele-de-ban-utilisateur.md)) : pas de ban définitif, pas d'historique, pas de sanction partielle (interdire de commenter sans interdire de lire).
3. **Plusieurs signalements visent souvent le même contenu.** Les traiter un par un conduirait à des décisions contradictoires sur un même texte.

## Decision

**1. Le modérateur décide sur un contenu, pas sur un signalement.** La file (`GET /moderation/reports`) regroupe les signalements par contenu signalé. Une décision clôt d'un coup tous les signalements en attente de ce contenu (`status = processed`, `moderator_id`, `resolution`, `processed_at`). Aucun changement d'état n'est jamais déclenché par un nombre de signalements ([ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md)).

**2. Quatre issues, selon le contenu.**

| Issue | Chapitre | Commentaire | Effet |
|---|---|---|---|
| `dismissed` | ✅ | ✅ | aucun changement de contenu |
| `archived` | feuille seulement | ❌ | `status = archived`, reste consultable, réversible |
| `hidden` | feuille seulement | ✅ | retiré de la lecture, réversible |
| `passage_removed` | ✅ | ❌ | passages fautifs remplacés par une mention, le chapitre reste publié |

« Feuille » = chapitre publié, non racine, sans suite publiée (`Chapter::isRemovableByModeration()`). Un chapitre poursuivi ou la racine d'un roman ne peut perdre qu'un passage : l'histoire garde son sens et les auteurs des suites ne sont pas pénalisés. La règle est portée par la validation (`ModerateChapterRequest`), qui refuse en 422 une issue interdite.

**3. Le retrait de passage ne peut que retirer.** Le modérateur remplace un passage par le marqueur `config('ghosty.moderation.removed_passage_marker')`, que le front affiche comme « passage retiré par la modération ». La règle `PassageRemovalOnly` vérifie que chaque fragment conservé figure dans l'original, dans l'ordre, et qu'au moins un passage a été retiré : un modérateur ne peut pas réécrire le texte d'un auteur. Le texte original est conservé dans `chapter_versions` (traçabilité, rétablissement manuel en cas d'erreur). Le retrait de passage pose `corrected_at` : il consomme la correction unique de l'auteur ([ADR-11](ADR-11-chapitre-publie-non-reecrivable.md)), qui ne peut donc pas réintroduire le passage retiré.

**4. Retirer une feuille maintient les invariants à la source.** `ChapterService::removeFromReading()` tronque la branche principale si la feuille en était la fin, décrémente `continuations_count` du parent ([ADR-07](ADR-07-modele-multivers-arbre-de-chapitres.md)) et `chapter_count` du roman ; le recalcul planifié des cumuls réélit ensuite la branche principale. `restore()` fait l'inverse, et n'est permis que si le parent est encore publié. Masquer un commentaire décrémente `comment_count` et le `reply_count` du parent ; un commentaire masqué qui a des réponses laisse une trace « masqué par la modération », comme un commentaire supprimé ([ADR-13](ADR-13-commentaires.md)).

**5. La table `sanctions` remplace `users.banned_until`.** Une sanction a un type, une fin optionnelle (`until` nul = définitive), un **motif obligatoire**, communiqué à l'auteur dans sa notification (traçabilité en cas de contestation), et un lien vers le signalement qui l'a motivée. Masquer un commentaire entraîne **toujours une sanction de son auteur, au minimum un avertissement** : un commentaire n'est masqué que pour une faute, et cette faute doit lui être signifiée.

| Type | Bloque |
|---|---|
| `warning` | rien (avertissement notifié) |
| `write_ban` | créer, corriger, publier un roman ou un chapitre |
| `comment_ban` | commenter, répondre |
| `account_ban` | la connexion et toute écriture |

`User::isBanned()` lit un `account_ban` actif ; `isWriteBanned()` et `isCommentBanned()` l'incluent. Il n'y a pas d'interdiction de soutenir seule : un soutien abusif relève de `LikeAuthorizationService` et du motif `like_manipulation`, et seul un `account_ban` retire le droit de soutenir. Les colonnes `banned_until` et `warning_count` disparaissent. Le ban définitif devient possible, et la connexion affiche deux messages distincts. Un `account_ban` révoque les jetons Sanctum du compte : il est déconnecté sur-le-champ.

**6. Deux notifications** ([ADR-10](ADR-10-notifications-in-app-agregees.md)) : `content_moderated` à l'auteur du contenu (issue + sanction éventuelle ; rien si le signalement est rejeté sans sanction) et `report_processed` à chaque signaleur. Elles sont groupées par contenu modéré.

**7. Périmètre du signalement** : chapitres et commentaires. Les illustrations arrivent au lot 7, le signalement d'un utilisateur avec son profil (lot 8).

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **Feuille retirable, passage retiré sur un chapitre poursuivi (retenu)** | L'histoire reste lisible ; les auteurs des suites ne paient pas la faute d'un autre | Un texte entièrement haineux mais poursuivi doit voir tout son texte retiré |
| Retrait en cascade du sous-arbre | Simple à expliquer | Punit des auteurs de bonne foi ; contraire à l'esprit d'[ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) |
| Retrait du seul chapitre, suites conservées | Aucun travail perdu | Un trou au milieu d'une branche : l'histoire n'a plus de sens |
| Édition libre du texte par le modérateur | Souple | Le modérateur peut réécrire un auteur ; aucune garantie que seul le passage fautif a changé |
| Garder `banned_until` à côté de `sanctions` | Pas de migration de `users` | Deux sources à garder cohérentes ; toujours pas de ban définitif |
| Décision par signalement | Granulaire | Décisions contradictoires sur un même contenu |

## Consequences

- **Positive**: chaque signalement reçoit une réponse humaine traçable ; le multivers reste cohérent après une décision ; les sanctions sont graduées, datées, historisées, et peuvent être définitives.
- **Negative**: une page de profil et des archives du roman (lot 9) restent nécessaires pour consulter un chapitre archivé ailleurs que par lien direct. Le rétablissement d'un passage retiré n'a pas d'écran : l'original est en base.
- **Risks**: la charge de modération reste le facteur limitant de l'ouverture publique ([ADR-09](ADR-09-pas-d-archivage-automatique.md)).

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §9, §12
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — lot 6
- `app/Services/ModerationService.php`, `app/Rules/PassageRemovalOnly.php`, `app/Models/Sanction.php`
- Remplace [ADR-01](ADR-01-modele-de-ban-utilisateur.md)
