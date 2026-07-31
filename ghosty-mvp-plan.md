# Ghosty — Plan d'implémentation du MVP

Plan dérivé de [ghosty-mvp.md](ghosty-mvp.md), confronté à l'état réel du dépôt au 2026-07-31.

---

## 1. État des lieux

### Déjà en place

| Domaine | Backend | Frontend |
|---|---|---|
| Auth | `AuthController` (register/login/logout/me), token en cookie HttpOnly (ADR-04), throttle (ADR-05), ban (ADR-01) | `services/auth/`, LoginDialog/RegisterDialog, restauration de session SSR (ADR-06) |
| Genres | `Genre`, `GenreController@index`, seeder JSON | `apis/genres/dtos` |
| Romans | `Novel` (title, slug, genre, author, cover_url, is_favorite, chapter_count), `NovelController` index/show, `NovelRepository` | `apis/novels/` (repo/controller/dto/store/asyncData), HomePage, NovelCard, SearchBar, NovelDetailDialog |
| Œuvres | `Work` (novel_id, author_id, title, content, **order**, type chapter/cover), `WorkController@index` | `apis/works/`, `use-works`, PaginatorChapter |
| Infra | Repositories, Resources, Form Requests, PHPUnit (tests/Feature/Api/V1/…), Pint, PHPStan, memory-bank + ADR 01→06 | SSR isomorphe (`src/ssr/`), `@unhead`, i18n `t()`, Vitest, memory-bank rules |

### Écart structurant avec le MVP

Le modèle actuel est **linéaire** : `works.order` = numéro de chapitre, un seul fil par roman. Le MVP est un **arbre** : chaque chapitre a un parent, plusieurs suites coexistent, aucune n'est éliminée.

Rien de ce qui fait le cœur du MVP n'existe encore : arbre, propositions/branches, continuité principale, soutiens, suivi de branche, parcours de lecture, commentaires, signalements, covers proposées, profils, archivage.

### ⚠️ Dette documentaire à corriger en premier

[backend/CLAUDE.md](backend/CLAUDE.md) décrit un schéma **hérité du legacy 2016** qui *contredit* le MVP : `novels.status` = `voting|writing`, `works.status` = `accepted|rejected`, `VoteCalculationService::closeVotingSession()` qui rejette les propositions perdantes, votes `-1/0/+1`.

Le MVP §3 et §7 disent l'inverse : pas de cycles de vote, aucune proposition rejetée, le vote classe mais n'élimine pas. Tant que ce fichier n'est pas réécrit, tout agent (et tout dev) régénérera du code legacy. **C'est le premier livrable du lot 0.**

---

## 2. Décisions structurantes

D1 → D6 sont **tranchées (2026-07-31)**.

| # | Décision | Décision / recommandation | Impact si l'autre option est retenue |
|---|---|---|---|
| D1 ✅ | Modéliser l'arbre | **`works` disparaît.** Les chapitres passent dans **`chapters`** (arbre + `status`), l'illustration dans **`novel_covers`**. Plus de colonne `type` discriminante | Garder `works` + `parent_id` : moins de refonte, mais un `type` qui mêle deux entités aux règles opposées (une cover n'a ni parent, ni ordre, ni suite), et des FK non contraignables |
| D2 ✅ | Soutien | **Soutien positif uniquement** (`support` / retrait). **Aucun downvote.** Le seul signal négatif est le **signalement**, qui vise la faute (mauvaise qualité, haine, insulte…) et passe par la modération, pas par le classement | Vote `-1/0/+1` : permet d'enterrer une proposition par vote de foule, réintroduit la logique d'élimination que le MVP écarte |
| D3 ✅ | Continuité principale | **100 % automatique** : la suite la plus soutenue parmi les frères publiés, recalculée à chaque soutien. **Aucun verrou ni choix manuel** — un arbitrage humain serait un parti pris de l'auteur du chapitre parent sur le travail des autres | Sélection manuelle : contrôle éditorial, mais l'auteur du parent devient juge de ses concurrents et un roman abandonné fige sa continuité |
| D4 ✅ | Notion de « branche » | **Dérivée, pas de table.** Une branche = un chapitre dont `children_count > 0` ; « les branches auxquelles je participe » se lit dans `path`. Suivre/commenter une branche = suivre/commenter son **chapitre-tête**, dont elle emprunte l'identité (titre, auteur, résumé, soutiens) | Table `branches` : il faudrait lui donner des attributs propres (nom, description) **sans propriétaire légitime** — l'auteur du chapitre-tête n'a pas créé la branche, celui qui l'a poursuivie n'en possède pas la tête, l'auteur du roman serait le parti pris refusé en D3. S'y ajoute une création rétroactive et des branches imbriquées qui rendent l'appartenance d'un chapitre arbitraire |
| D5 ✅ | Archivage (MVP §9) | **Aucun archivage automatique sur inactivité.** Un chapitre sans suite reste publié indéfiniment : §3 promet qu'on peut le poursuivre « à tout moment », un minuteur contredirait cette promesse. L'encombrement se règle par le **tri par soutiens**, pas par un changement d'état. L'archivage devient une **issue de modération** (qualité / hors sujet), toujours sur décision humaine et réversible | Archivage à 60 j : désencombre, mais pénalise un excellent chapitre pour la seule raison que personne ne l'a *encore* repris, et l'effet est auto-réalisateur (moins visible → moins lu → moins repris → archivé) |
| D6 ✅ | Notifications | **Dans le MVP** (lot 3b), malgré leur absence de §14. Sans elles, un auteur n'apprend jamais que son chapitre a été poursuivi — or c'est l'événement qui le fait revenir écrire, et §16 en fait son indicateur central. **In-app seulement** (pas d'email au MVP), **agrégées**, sur le canal `database` natif de Laravel | Les exclure : −1 lot, mais l'indicateur « auteurs qui publient une deuxième contribution » mesurerait l'assiduité des gens plutôt que l'attrait du concept |

---

## 3. Modèle de données cible

### Migrations nouvelles

**`chapters`** (reprend `works` type=chapter ; `status` remplace le couple `type`/`order`)

```
id
novel_id        → novels (cascade)
parent_id       → chapters, nullable          -- null = chapitre racine
author_id       → users
title, content (longText), summary (nullable)
path            varchar(255)                  -- "1/12/45" : chemin matérialisé (ancêtres + soi)
depth           unsignedSmallInteger
children_count  unsigned default 0            -- suites PUBLIÉES uniquement ; > 0 ⇒ branche (D4)
support_count   unsigned default 0
comment_count   unsigned default 0
read_count      unsigned default 0
is_main_child   boolean default false         -- continuité mise en avant parmi les frères
status          tinyInteger                   -- 1 published (défaut, sans limite de temps)
                                              -- 2 archived : issue douce de modération (qualité,
                                              --   hors sujet) — reste consultable (§9), réversible
                                              -- 3 hidden : issue dure (haine, insulte, illégal)
                                              --   — retiré de la lecture + sanction
last_activity_at timestamp                    -- alimente « branches actives » (§16) et le tri
published_at, timestamps

index (novel_id, parent_id), (parent_id, is_main_child), (status, last_activity_at), (path)
index (novel_id, children_count, status, last_activity_at)   -- « branches actives » (§16)
```

**Règle de cohérence `children_count` (D4).** Il compte les suites **publiées**. Il est donc décrémenté quand la modération archive ou masque une suite, pas seulement à la suppression : sinon un parent reste affiché comme branche active alors que sa seule suite est invisible, ce qu'interdit §9. Corollaire — un chapitre peut **redevenir** une simple proposition ; comme rien ne l'archive plus par le temps qui passe (D5), il redevient simplement une suite candidate parmi les autres.

**`novel_covers`** (MVP §10 — illustration du roman uniquement)

```
id, novel_id → novels, author_id → users, image_path,
status (proposed | official | archived), support_count, comment_count, timestamps
```

**`supports`** (D2, polymorphe chapitre/cover)

```
id, user_id, supportable_type, supportable_id, created_at
unique (user_id, supportable_type, supportable_id)
```

**`comments`** (MVP §11)

```
id, author_id, commentable_type (Novel|Chapter|NovelCover), commentable_id,
parent_id (nullable), reply_count, content, is_spoiler bool,
status (visible | hidden | deleted), timestamps
index (commentable_type, commentable_id, parent_id)
```

**`follows`**, **`reading_progresses`**, **`chapter_reads`** (MVP §8, §16)

```
follows            : user_id, followable_type (Novel|Chapter), followable_id — unique
reading_progresses : user_id, novel_id, chapter_id, path — unique (user_id, novel_id)
chapter_reads      : user_id (nullable), chapter_id, session_key, created_at — unique lecture
```

**`reports`** + **`sanctions`** (MVP §12)

```
reports   : reporter_id, reportable_type (Chapter|Comment|NovelCover|User), reportable_id,
            reason (poor_quality|off_topic|plagiarism|unauthorized_illustration|spam|
                    hate_speech|insult|harassment|personal_attack|
                    support_manipulation|illegal),
            description, status (pending|processed), moderator_id,
            resolution (dismissed|hidden|removed|sanction), processed_at, timestamps
            unique (reporter_id, reportable_type, reportable_id)   -- 1 signalement par contenu
            index (status, created_at)
```

Motifs, en clair (MVP §12 + D2) :

| Motif | Couvre |
|---|---|
| `poor_quality` | texte manifestement bâclé, illisible ou incomplet — remplace le downvote |
| `off_topic` | sans rapport avec le chapitre parent ou le roman |
| `hate_speech` | racisme, propos haineux visant un groupe |
| `insult` / `personal_attack` | insulte, attaque visant une personne |
| `harassment` | acharnement répété |
| `plagiarism`, `unauthorized_illustration`, `spam`, `support_manipulation`, `illegal` | MVP §12 |

```
sanctions : user_id, moderator_id, type (warning|support_ban|write_ban|comment_ban|account_ban),
            until (nullable), reason, report_id (nullable), timestamps
```

**`notifications`** (D6) — table native Laravel (`php artisan make:notifications-table`, canal `database`), pas de schéma maison :

```
id (uuid), type, notifiable_type/notifiable_id, data (json), read_at (nullable), created_at
+ colonne ajoutée : group_key (string, nullable, index)   -- clé d'agrégation (cf. lot 3b)
unique (notifiable_id, group_key) WHERE read_at IS NULL   -- 1 notif vivante par groupe
```

`users.notifications_enabled` existe déjà et sert d'interrupteur général.

### Migrations d'ajustement

- `novels` : `+ root_chapter_id` (→ chapters), `+ official_cover_id` (→ novel_covers), `+ branch_count`, `+ contributor_count`, `+ last_activity_at` ; `cover_url` devient dérivé de la cover officielle (conservé pour le seed, marqué déprécié).
- `users` : `roles` json existe déjà (rôles cumulables ✓, MVP §13) — ajouter les valeurs `illustrator` / `moderator` et un `UserRole` enum.
- **Suppression complète de `works`** : table, `Work` model, `WorkController` / `WorkRepository` / `WorkResource`, `WorkSeeder` + `database/data/works.json`, `WorkFactory`, `WorkControllerIndexTest`, la relation `Novel::chapters()` (qui perd son `->where('type', …)`), la route `work.list`, et côté front `frontend/src/apis/works/`, `composables/use-works.js`, `PaginatorChapterComponent` + leurs tests. Tout est renommé/porté vers `chapters` dans la même PR.

### Services métier (backend)

| Service | Responsabilité |
|---|---|
| `ChapterTreeService` | `createRoot()`, `propose(parent)`, calcul `path`/`depth`, incréments `children_count`/`chapter_count`, réactivation du parent archivé, désarchivage en cascade |
| `MainContinuityService` | Recalcul de `is_main_child` à chaque soutien / nouvelle suite (D3). Départage déterministe à égalité de soutiens : **le plus ancien publié gagne** (une nouvelle proposition ne détrône jamais par hasard) |
| `SupportGuard` | Anti-abus (MVP §7) : email vérifié, ancienneté de compte minimale, 1 soutien par contenu, pas d'auto-soutien, throttle, journalisation IP |
| `ModerationService` | Seul chemin vers `archived` / `hidden` (D5), toujours déclenché par un modérateur — **jamais par un seuil de signalements**. Applique les sanctions, cohérence avec `users.banned_until` (ADR-01), désarchivage réversible |
| `MetricsService` | Indicateurs MVP §16 |

---

## 4. Surface API (v1)

```
POST   /novels                              créer roman + chapitre racine (transaction)
GET    /novels/{slug}                       + root_chapter, cover officielle, stats
GET    /novels/{slug}/tree                  arbre du multivers (exploration, §8)
GET    /novels/{slug}/archives              propositions archivées par la modération (§9, D5)

GET    /novels/{slug}/chapters/{chapter}    chapitre + ancêtres + suites triées + continuité principale
POST   /novels/{slug}/chapters              proposer une suite (parent_id — n'importe quel chapitre, §3)
PUT    /chapters/{chapter}                  éditer (auteur, fenêtre limitée)
GET    /chapters/{chapter}/children         suites paginées, triées par soutiens

POST   /chapters/{chapter}/support          DELETE pour retirer — recalcule la continuité (D3)
POST   /covers/{cover}/support
POST   /chapters/{chapter}/report           signalement (D2 : seul signal négatif)

POST   /novels/{slug}/covers                proposer une illustration
POST   /covers/{cover}/official             sélectionner l'identité visuelle officielle

GET    /comments?on=chapter&id=…            POST /comments, POST /comments/{c}/replies,
                                            DELETE /comments/{c}
POST   /reports                             GET /moderation/reports, POST /moderation/reports/{r}/resolve

GET    /me/notifications                    liste paginée + compteur non lues (D6)
POST   /me/notifications/{id}/read          PATCH /me/notifications/read-all

POST   /follows                             DELETE /follows
GET    /me/reading-progress                 PUT /me/reading-progress
GET    /me/reading-history

GET    /users/{pseudo}                      profil public + contributions + stats (§13)
GET    /metrics                             indicateurs MVP (§16, réservé admin)
```

---

## 5. Lots de livraison

Chaque lot est **vertical** (migration → model → repository → service → policy → Form Request → Resource → controller → tests Feature ; puis routes API front → repository → DTO → controller → store → vues → tests Vitest) et livrable indépendamment.

Rappel process : worktree par feature (`git worktree add ../ghosty-feature-{nom} -b feature/{nom}`), jamais de dev direct sur la branche principale ; agent `test-rule-checker` après chaque test écrit.

### Lot 0 — Fondations (bloquant) · S

1. Réécrire [backend/CLAUDE.md](backend/CLAUDE.md) : schéma multivers, suppression de `VoteCalculationService`/`closeVotingSession`, des statuts `voting|writing` et des `accepted|rejected`.
2. **ADR-07** — modèle multivers : arbre `chapters` + chemin matérialisé, disparition de `works`, **branche dérivée sans table** (D1, D4). Consigner l'argument décisif : une branche n'a pas de propriétaire légitime pour porter un nom ou une description, elle emprunte l'identité de son chapitre-tête.
3. **ADR-08** — soutien **positif seul** (aucun downvote, D2), signalement comme unique canal négatif, et continuité principale **automatique** (D3).
4. `config/ghosty.php` (seuils anti-abus des soutiens, profondeur d'arbre affichée, pagination des suites).
5. Migration `chapters` + `NovelChapterSeeder` (JSON dans `database/data/` — jamais de données en dur) produisant un multivers de démo conforme à l'exemple §5.
6. Retrait de `works` (back + front + tests) une fois `chapters` lisible par l'API.

> Sortie : la base porte le multivers, la documentation ne contredit plus le MVP.

### Lot 1 — Écriture et arbre · L

- `Chapter` model + `ChapterRepository` + `ChapterTreeService` + `ChapterPolicy`.
- `POST /novels` (roman + chapitre racine en transaction), `POST /novels/{slug}/chapters` (suite depuis **n'importe quel** chapitre, y compris le sien — MVP §6), `PUT /chapters/{id}`.
- Règles : `path`/`depth` calculés, `children_count`/`chapter_count` incrémentés atomiquement, `last_activity_at` propagé aux ancêtres.
- Front : `apis/chapters/` complet, pages `NovelCreatePage`, `ChapterWritePage`, éditeur de texte, `formRequest` de validation.

> Valide : « un auteur peut créer, poursuivre, bifurquer ».

### Lot 2 — Lecture et navigation · L

- `GET /novels/{slug}/chapters/{id}` (ancêtres, suites triées, continuité principale), `GET /novels/{slug}/tree`.
- Front : `ChapterReaderPage` (lecture linéaire par défaut = continuité principale), `ContinuationSwitcher` (« ce chapitre a N suites »), `BranchBreadcrumb` (retour à l'embranchement), `MultiversePage` (arbre repliable, vue d'exploration séparée — §8).
- **Règle d'affichage (D4)** : une branche n'a jamais de nom propre. Partout — switcher, fil d'Ariane, suivi, profil, arbre — elle est désignée par son chapitre-tête : « *{titre du chapitre}* — par {pseudo} ». Aucun libellé de branche à inventer, donc aucun champ à saisir nulle part.
- SSR : `asyncData` chapitre + arbre, `useHead` dédié (`src/head/use-chapter-head.js`), **`<link rel="canonical">` vers la continuité principale** pour éviter le contenu dupliqué entre réalités, 404 réel sur chapitre inconnu.

> Lots 1+2 = le cœur testable de l'hypothèse du MVP. Une V0 démontrable s'arrête ici.

### Lot 3 — Soutiens, classement et signalement · M/L

Les deux signaux communautaires d'un chapitre — positif et négatif — arrivent ensemble : sans downvote (D2), livrer les soutiens sans le signalement laisserait un contenu raciste ou bâclé sans aucun recours pour les lecteurs.

- `supports` polymorphe, `SupportGuard`, `MainContinuityService` (recalcul + départage à l'ancienneté), throttle dédié.
- Tri des suites par soutiens, mise en avant **automatique** de la continuité principale (D3).
- `reports` + `POST /chapters/{id}/report` avec les motifs de §3 (`poor_quality`, `hate_speech`, `insult`, …), unicité par signaleur.
- Front : `SupportButton` (optimiste + rollback), tri des propositions, badge « continuité principale », `ReportDialog`.

> ⚠️ Le **traitement** des signalements n'arrive qu'au lot 6. Entre les deux, les signalements s'empilent en base et sont traités à la main (requête SQL / commande artisan). Acceptable en bêta fermée, à ne pas laisser courir en ouverture publique.

### Lot 3b — Notifications (socle transversal) · M

Placé ici parce que les deux événements qui portent la rétention — « votre chapitre a été poursuivi » et « votre chapitre a été soutenu » — sont disponibles dès la fin du lot 3. Chaque lot ultérieur y branche ses propres types sans retoucher le socle.

- Table native Laravel (canal `database`), `NotificationService`, `GET /me/notifications` + marquage lu.
- Front : `apis/notifications/`, `NotificationBell` dans `HeaderComponent` (badge non lues), dropdown (le `DropdownComponent` existe déjà), rafraîchissement **par polling au chargement et à l'ouverture** — le service `websocket` est volontairement exclu du projet, pas de temps réel.

| Type | Déclencheur | Livré au lot |
|---|---|---|
| `chapter_continued` ★ | quelqu'un publie une suite à mon chapitre | 3b |
| `support_received` | mon chapitre / ma cover reçoit des soutiens (**agrégé**) | 3b |
| `main_continuity_gained` | ma suite devient la continuité principale (D3) | 3b |
| `followed_branch_extended` ★ | une branche que je suis reçoit une suite | 4 |
| `comment_received` / `comment_replied` | commentaire sur mon contenu, réponse à mon commentaire | 5 |
| `moderation_decision` | mon contenu est archivé/masqué, ou mon signalement est traité | 6 |
| `cover_selected` | mon illustration devient officielle | 7 |

**Trois règles non négociables :**

1. **Agrégation par `group_key`** — 50 soutiens sur un chapitre font *une* notification « 12 personnes ont soutenu *{titre}* », pas 50 lignes. Sans ça, la cloche devient inutilisable dès le premier chapitre populaire, et le soutien (D2) redevient bruyant alors qu'on l'a voulu discret.
2. **Jamais se notifier soi-même** — §6 autorise explicitement un auteur à poursuivre son propre chapitre : ce cas ne doit déclencher aucune notification.
3. **Pas de notification de perte** — avec la continuité automatique (D3), une suite peut être détrônée à tout moment. On notifie le gain, jamais la perte : annoncer « vous n'êtes plus la continuité principale » transformerait un classement en défaite, à rebours de §7 (« une proposition moins soutenue peut toujours devenir une branche »).

### Lot 4 — Suivi et parcours de lecture · M

- `follows`, `reading_progresses`, `chapter_reads`.
- Reprise de lecture (« continuer où j'en étais »), historique du parcours (§8), suivi d'une branche (§8).
- Invité non connecté : progression en `ssr-storage`, fusionnée à la connexion.

### Lot 5 — Commentaires · M

- `comments` polymorphe (roman / branche / chapitre / cover), réponses à un niveau, masquage divulgâcheur, suppression par l'auteur.
- Front : `CommentThread`, `CommentForm`, masque spoiler cliquable, compteurs.

### Lot 6 — Traitement de la modération · M

- `sanctions` + `ModerationService`, rôle `moderator`, policies de masquage (`status = hidden` sur chapitre/commentaire/cover).
- File de traitement des signalements ouverts au lot 3. Deux issues distinctes selon la gravité (D5) : **`archived`** pour un problème de qualité ou de hors-sujet — le texte reste consultable depuis le profil de son auteur (§9), la décision est réversible ; **`hidden` + sanction** pour la haine, l'insulte, le harcèlement ou l'illégal — retrait de la lecture. Un contenu haineux n'est jamais « simplement archivé ».
- **Aucune bascule d'état automatique sur un nombre de signalements** : sans ce garde-fou, le bouton « signaler » redevient le downvote supprimé en D2, actionnable en brigade.
- Sanctions graduées appliquées aux gardes d'écriture / soutien / commentaire ; articulation avec `users.banned_until` (**revoir ADR-01** : la table `sanctions` peut le remplacer).
- Extension du signalement aux commentaires et aux covers (le lot 3 ne couvrait que les chapitres).
- Front : back-office minimal `/moderation`, `ReportDialog` étendu aux autres contenus.

### Lot 7 — Illustration du roman · M

- `novel_covers`, upload via `Storage::disk()` + validation MIME/taille, sélection de l'officielle par l'auteur du roman, archivage des autres.
- Front : `CoverGallery`, `CoverProposeDialog`, remplacement de `cover_url` par la cover officielle.

### Lot 8 — Profils et statistiques · S/M

- `GET /users/{pseudo}` : romans, chapitres, propositions, branches auxquelles l'utilisateur participe, illustrations, stats simples (§13).
- Front : `ProfilePage` + onglets.

### Lot 9 — Indicateurs · S

- `MetricsService` + `GET /metrics` couvrant les 9 indicateurs de §16.
- L'indicateur « propositions archivées sans interaction » (§16) devient une **mesure** et non plus la conséquence d'un mécanisme : on compte les propositions sans soutien ni commentaire ni suite après N jours, **sans changer leur état** (D5). Le chiffre reste observable, la sanction disparaît.
- Page « archives du roman » alimentée par les seules décisions de modération, avec un discours non punitif (§9).

> Le lot a perdu sa commande planifiée d'archivage : plus rien n'est archivé par le temps qui passe.

### Hors MVP (V2)

Forum par roman et espaces privés (§15), **notifications par email et temps réel** (le MVP s'arrête à l'in-app avec polling, D6), illustration par branche/chapitre, édition/export.

---

## 6. Risques et points de vigilance

| Risque | Mitigation |
|---|---|
| **SEO — contenu dupliqué** : N réalités partagent les mêmes chapitres d'amont | Canonical vers la continuité principale, URL stable par chapitre, arbre en `noindex` |
| **Performance de l'arbre** : un roman très ramifié explose la requête | Chemin matérialisé (1 requête pour une branche entière), profondeur d'affichage plafonnée + chargement à la demande, `children_count` dénormalisé |
| **Compteurs désynchronisés** (`children_count`, `support_count`, `chapter_count`) | Incréments atomiques SQL + commande de reconciliation, tests Unit dédiés (cf. `rules/files-type/model.md`) |
| **Manipulation des soutiens** (§7) | `SupportGuard` : email vérifié + ancienneté + unicité + pas d'auto-soutien + throttle ; signalement `support_manipulation` |
| **Sans downvote (D2) ni archivage automatique (D5), un contenu médiocre n'est freiné que par la modération** | Signalement livré **avec** les soutiens (lot 3) ; tri par soutiens qui relègue sans exclure ; traitement humain assumé, d'où l'importance de ne pas ouvrir publiquement avant le lot 6 |
| **Encombrement des suites** : un chapitre à 40 propositions, désormais sans purge par le temps (D5) | Tri par soutiens + pagination « voir les N autres suites » (lot 2/3) — la visibilité décroît proportionnellement, la porte ne se ferme jamais |
| **Le soutien porte trois rôles à lui seul** : classer les suites (D2), désigner la continuité principale (D3), réguler la visibilité en l'absence d'archivage (D5) | Truquer les soutiens ne fausse plus un classement mais détourne le parcours de lecture par défaut → `SupportGuard` est une pièce critique du lot 3, pas un confort ; motif de signalement `support_manipulation` ; suivre l'indicateur §16 « exploration des réalités alternatives » |
| **Notifications bruyantes** (D6) : un chapitre populaire génère des dizaines d'événements | Agrégation par `group_key` imposée dès le socle (lot 3b), in-app seul, `notifications_enabled` en interrupteur |
| **Continuité automatique (D3) : effet boule de neige** — la suite en tête capte les lecteurs, donc les soutiens, donc reste en tête | Les suites concurrentes restent visibles depuis le chapitre parent (`ContinuationSwitcher`, lot 2) ; à surveiller via l'indicateur « lecteurs qui explorent une réalité alternative » (§16) |
| **Suppression de `works`** (D1) casse le front existant (`apis/works/`, `use-works`, PaginatorChapter) et 4 fichiers de tests | Fait dans le lot 0, en un seul worktree, tests migrés vers `chapters` dans la même PR |
| **Dérive documentaire** : le CLAUDE.md backend décrit encore le legacy | Lot 0, point 1 — préalable à tout code |

---

## 7. Ordre d'attaque conseillé

```
Lot 0 ─→ Lot 1 ─→ Lot 2 ─→ Lot 3 ─→ Lot 3b ──┬─→ Lot 4
   (bloquant)  (cœur MVP)          (socle     ├─→ Lot 5 ─→ Lot 6
                                    notifs)   ├─→ Lot 7
                                              └─→ Lot 8 ─→ Lot 9
```

Lots 0→3b : séquentiels. Le socle de notifications passe avant la parallélisation pour que les lots 4 à 7 y branchent leurs types au fil de l'eau plutôt que dans une reprise finale.

À partir du lot 4, les branches sont parallélisables (un worktree chacune), sauf 6 qui dépend de 5 (modérer des commentaires suppose des commentaires) et 9 qui consolide les compteurs des lots précédents.
