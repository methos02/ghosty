# ADR-10: Notifications in-app agrégées, sur le canal `database` natif

**Date**: 2026-07-31
**Status**: Accepted

## Context

Le périmètre fonctionnel du MVP (§14) ne mentionne pas les notifications. Mais §16 fait des « auteurs qui publient une deuxième contribution » et des « propositions réellement poursuivies » ses indicateurs centraux, or l'événement qui ramène un auteur — *quelqu'un a écrit une suite à mon chapitre* — n'est visible nulle part sans notification : il faudrait repasser vérifier à la main. L'indicateur mesurerait alors l'assiduité des utilisateurs plutôt que l'attrait du concept.

Le soutien ne comble pas ce manque : il dit qu'on a aimé un chapitre, pas qu'on l'a poursuivi.

Contraintes techniques du projet : hébergement mutualisé O2Switch, `QUEUE_CONNECTION=sync`, et le service `websocket` est volontairement exclu de la stack front (comme `log` et `auth-keycloak`).

## Decision

**1. Les notifications entrent dans le MVP**, sur le canal **`database` natif de Laravel** (`php artisan make:notifications-table`) — pas de schéma maison. Une seule colonne est ajoutée à la table native : `group_key` (indexée), qui porte l'agrégation.

**2. In-app uniquement.** Pas d'email au MVP (file `sync` sur mutualisé : un envoi bloquerait la requête), pas de temps réel (`websocket` exclu). Le rafraîchissement se fait par **polling** au chargement de page et à l'ouverture de la cloche. `users.notifications_enabled`, qui existe déjà, sert d'interrupteur général.

**3. Les notifications sont agrégées par `group_key`.** Cinquante soutiens sur un chapitre produisent *une* entrée « 12 personnes ont soutenu *{titre}* », pas cinquante. Une contrainte d'unicité sur `(notifiable_id, group_key)` limitée aux notifications non lues garantit une seule entrée vivante par groupe. Sans cela, la cloche devient inutilisable dès le premier chapitre populaire, et le soutien redeviendrait bruyant alors qu'[ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) l'a voulu discret.

**4. Types d'événements** (chacun livré avec la fonctionnalité qui le produit) :

| Type | Déclencheur |
|---|---|
| `chapter_continued` | une suite est publiée sur mon chapitre |
| `like_received` | mon chapitre ou ma couverture reçoit des soutiens (agrégé) |
| `current_continuity_gained` | ma suite devient la continuité courante |
| `followed_branch_extended` | une branche que je suis reçoit une suite |
| `comment_received` / `comment_replied` | commentaire sur mon contenu, réponse à mon commentaire |
| `moderation_decision` | mon contenu est archivé ou masqué, ou mon signalement est traité |
| `cover_selected` | mon illustration devient officielle |

**5. Deux interdits :**

- **Jamais se notifier soi-même.** §6 autorise explicitement un auteur à poursuivre son propre chapitre : ce cas ne déclenche rien.
- **Jamais notifier une perte.** Voir [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) : on notifie le gain de la continuité courante, jamais sa perte.

## Alternatives Considered

| Alternative | Pros | Cons |
|---|---|---|
| **In-app agrégé, canal `database` (retenu)** | Aucune infrastructure ; boucle de rétention couverte ; conforme aux contraintes O2Switch | Pas de rappel hors site ; polling au lieu de push |
| Aucune notification (lecture littérale de §14) | Un lot en moins | L'indicateur central de §16 devient ininterprétable |
| Compteur de retour sur le profil (« depuis votre dernière visite… ») | Coût quasi nul, aucune table | Invisible tant que l'utilisateur ne visite pas son profil — ne ramène personne |
| Notifications + email | Ramène hors du site | File `sync` sur mutualisé ; délivrabilité, désinscription, RGPD — hors périmètre MVP |
| Temps réel (websocket) | Immédiat | Service exclu de la stack ; inutile à ce volume |
| Table `notifications` maison (ancien schéma documenté) | Colonnes sur mesure | Réécrit ce que Laravel fournit ; perd `MorphMany`, `markAsRead()` et l'outillage natif |

## Consequences

- **Positive**: la boucle « mon chapitre a été poursuivi → je reviens écrire » est fermée, donc §16 devient interprétable ; aucune infrastructure ajoutée ; l'agrégation garde la cloche lisible.
- **Negative**: rien ne ramène un utilisateur inactif hors du site ; la fraîcheur dépend du polling.
- **Risks**: l'agrégation doit être posée **dès le socle** — la rétrofitter sur des types déjà livrés supposerait de migrer des notifications existantes. L'ajout d'email en V2 devra traiter désinscription et rythme d'envoi, absents ici.

## Références

- [ghosty-mvp.md](../../../ghosty-mvp.md) — §6 (poursuivre son propre chapitre), §14 (périmètre), §16 (indicateurs)
- [ghosty-mvp-plan.md](../../../ghosty-mvp-plan.md) — décision D6, lot 3b
- [ADR-08](ADR-08-soutien-positif-et-continuite-automatique.md) — pas de notification de perte
