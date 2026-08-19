# Lot 1 — Écriture et arbre : état au 2026-08-19

Document de reprise. Il résume ce qui a été livré, les décisions prises, les pièges
rencontrés et ce qui reste ouvert avant la fusion dans `main`.

---

## 1. Où en est le dépôt

| | |
|---|---|
| Worktree | `c:\wamp64\www\ghosty-feature-ecriture-arbre` |
| Branche | `feature/ecriture-arbre` |
| État | **4 commits d'avance sur `main`, 1 commit de retard** |
| Fusion | `git merge-tree` ne signale **aucun conflit** |

Le commit d'avance de `main` (`e008bb8`) dépose un rapport `/learn` dans
`.claude/draft/rules/lot1-ecriture-et-etats-d-ecran.md` : quatre leçons du lot 1 qui
attendent d'être transformées en règles par l'agent `rule-writer`.

### Environnement de développement

`babyborn_old` occupe **5173 et 5174**. Ghosty tourne donc ailleurs :

```bash
cd c:\wamp64\www\ghosty-feature-ecriture-arbre\backend
php artisan serve --host=api.ghosty.local --port=8080

cd c:\wamp64\www\ghosty-feature-ecriture-arbre\frontend
npm run dev:ssr        # lit .env : PORT=5180
```

→ **http://app.ghosty.local:5180**

Les `.env` du worktree (non versionnés) pointent sur ces ports ; côté API,
`SANCTUM_STATEFUL_DOMAINS` et `CORS_ALLOWED_ORIGINS` incluent `app.ghosty.local:5180`.

> Le catalogue de traductions est compilé au **démarrage** du serveur par un plugin
> Vite. Après avoir ajouté des clés, relancer `npm run dev:ssr`, sinon la clé brute
> s'affiche. Vitest ne recompile pas ce catalogue : un test qui échoue sur une clé
> non traduite se corrige en relançant le serveur, pas en changeant le test.

---

## 2. Ce qui a été livré

### Backend

| Domaine | Contenu |
|---|---|
| Écriture | `ChapterService` (chemin matérialisé, profondeur, compteurs), `BranchService` (cumul des soutiens propagé par le `path`), `NovelService` (roman + chapitre d'origine en une transaction) |
| Endpoints | `POST /novels`, `PUT /novels/{slug}`, `POST /novels/{slug}/chapters`, `PUT /chapters/{chapter}`, `POST /chapters/{chapter}/publish`, `DELETE /chapters/{chapter}`, `GET /chapters/{chapter}`, `GET /chapters/{chapter}/children`, `GET /novels/{slug}/chapters`, `GET /me/drafts` |
| Filtres | `GET /novels?search=&genre_id=`, `GET /me/drafts?parent_id=&is_root=` via `DraftFilterDTO` |
| Autorisation | `NovelPolicy`, `ChapterPolicy` (`propose`, `update`, `publish`, `delete`) |
| Validation | `StoreNovelRequest`, `StoreChapterRequest`, `UpdateChapterRequest`, règle `LimitedTextChange` |
| Covers | `CoverUrl` : cover du roman, sinon cover par défaut du genre, sinon repli neutre — servies depuis `public/images/covers/` |
| Réglages | `config/ghosty.php` (longueurs, seuils de correction, pagination, profondeur affichée) |

### Frontend

| Domaine | Contenu |
|---|---|
| Accueil | `Toolbar` à deux gestes : **Nouveau** / **Lire — continuer**, plus le filtre par genre. Le formulaire s'ouvre sous la barre, sans quitter la page |
| Écriture | `NovelManageForm` (création et reprise d'un brouillon de roman), `ChapterManagePage` (proposer une suite **et** reprendre ou corriger un chapitre), `ChapterBodyFields` partagé par les deux |
| Relecture | Compteur vivant des mots encore modifiables, avertissement de correction unique, enregistrement bloqué au-delà du quota |
| Accès | Six routes d'auteur protégées par `meta.requiresAuth` ; un visiteur déclenche le dialogue de connexion et revient à la page demandée |

---

## 3. Décisions structurantes prises pendant le lot

### La correction d'un chapitre publié

Trois limites, et non une seule (amendement du 2026-08-08 à
[ADR-11](backend/memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md)) :
correction **unique**, fenêtre de **48 h**, et au plus **1 % des mots** modifiés avec
un plancher de **5 mots**.

La mesure est une **distance d'édition au niveau du mot**, casse ignorée — pas au
caractère. Une mesure au caractère refusait les corrections d'accents ordinaires
(`mangeait` → `mangé` vaut 4 caractères d'écart).

### Les brouillons

| | Brouillon (`status = 0`) | Publié (`status = 1`) |
|---|---|---|
| Qui le voit | son auteur seul | tout le monde |
| Écriture | libre | correction de fautes uniquement |
| Longueur minimale | non exigée | exigée **à la publication** |
| Compteurs | intacts | mis à jour à la publication |
| Suppression | oui (le roman part avec son chapitre d'origine) | jamais |

Un roman dont l'origine est un brouillon n'apparaît dans aucune liste publique.

### Écran d'accueil

Les cycles de vote ayant disparu, la distinction *Écrire un début* / *Écrire une
suite* du legacy n'a plus de sens : **on lit, et c'est depuis un chapitre qu'on
continue**. D'où le double bouton. Le compte à rebours « Fin du cycle » du legacy
n'est pas repris (ADR-08/09).

Connecté, le bandeau ne présente plus le site : il montre l'auteur.

---

## 4. Pièges rencontrés — à ne pas réintroduire

**1. `STATUS.SUCCESS` vaut 200 exactement.** Une création répond **201**, une
suppression **204**. Les contrôleurs front sortaient donc en silence : le roman était
créé, l'écran ne bougeait pas. Utiliser `ajaxHelper.isSuccess(status)`
(`src/core/helpers/ajax-helper.js`) et **jamais** `!== STATUS.SUCCESS` sur un appel
qui écrit.

**2. La base était en MyISAM** — moteur qui ignore les clés étrangères *et les
transactions*. Conséquences observées : chapitres orphelins après suppression d'un
roman, et `DB::transaction()` sans effet. Corrigé : `'engine' => 'InnoDB'` dans
`config/database.php`, puis `migrate:fresh --seed`.

**3. Deux routes, un seul composant.** `/` et `/novels/create` rendent tous deux
`HomePage` : Vue réutilise l'instance et ne rejoue pas `setup()`. Un état initialisé
une seule fois y reste figé. Le mode est donc **dérivé de l'URL** (`computed`), et les
onglets naviguent. Couvert depuis par `tests/views/HomePage.test.js`.

**4. Le service de suppression ne doit pas compter sur la cascade SQL.** Les tests
tournent sur SQLite (cascade active) et masquaient le problème. `discard()` supprime
les chapitres explicitement.

**5. Comparer un rendu à `t('clé')` dans un test ne prouve rien** : si la clé manque,
les deux côtés valent la clé et le test passe. Comparer au libellé en clair.

**6. `radius-50` n'existe pas** (seulement `radius-5`, `-10`, `-15`).

**7. La locale de l'application doit être `fr`.** `APP_LOCALE=en` avec un dossier
`lang/` ne contenant que `fr` faisait renvoyer **la clé brute** à la place de tous les
messages de validation, inscription comprise. Les tests ne l'ont pas vu parce qu'ils
assertaient la présence d'une erreur sur un champ, jamais son texte.

**8. Une garde de route change l'ordre des tests.** Avec `meta.requiresAuth`, un test
qui navigue **avant** d'authentifier voit sa navigation annulée. Authentifier d'abord,
pousser ensuite.

**9. Une distance d'édition naïve est quadratique.** 8,75 s pour 5 000 mots sur une
requête HTTP. Corrigé par une bande de largeur `quota` autour de la diagonale, plus le
rognage des préfixes et suffixes communs : 0,0007 s dans le cas courant. L'algorithme
existe **en double**, PHP et JS — les deux versions sont testées contre une
implémentation naïve, c'est ce qui les empêchera de diverger.

**10. `vi.clearAllMocks()` ne vide pas les files `mockReturnValueOnce`.** Une valeur
non consommée fuit vers le test suivant. Utiliser `vi.resetAllMocks()` dans un fichier
qui empile des `Once`.

---

## 5. Vérifications au moment d'écrire ce document

| | |
|---|---|
| `php artisan test` | **176 tests**, 399 assertions |
| `vendor/bin/phpstan analyse` (niveau max) | **0 erreur** |
| `vendor/bin/pint --test` | passed |
| `npm run test -- --run` | **445 tests**, 68 fichiers, stable sur 3 exécutions |
| `npx eslint .` | **0 erreur** (4 avertissements de nombres magiques dans `server.js`) |
| `npm run format:check` | passed |

---

## 6. Ce qui reste ouvert

### Écart avec le cahier des charges

**`last_activity_at` n'est pas implémenté — et sa raison d'être a disparu.** Le plan
le demandait « propagé aux ancêtres », pour deux usages : l'archivage des propositions
inactives (MVP §9) et l'indicateur « branches actives » (§16).

Or [ADR-09](backend/memory-bank/decisions/ADR-09-pas-d-archivage-automatique.md) a
**supprimé l'archivage automatique sur inactivité** : un chapitre sans suite reste
publié indéfiniment, et « l'encombrement se règle par le tri par soutiens, pas par un
changement d'état ». Le premier usage est donc mort par décision. Quant au tri, le lot
3 classe par `branch_like_count`, pas par date.

Il ne reste que l'indicateur du §16, qui appartient au **lot 9** et qui se calcule
depuis le `published_at` des descendants sans colonne dénormalisée. Ajouter la colonne
maintenant reviendrait à maintenir une donnée que personne ne lit, et à figer une
définition d'« activité » avant que le lot 9 ne l'ait tranchée.

**Décision : reporté au lot 9, où le besoin sera défini.** À rouvrir si un tri par
activité apparaît au lot 3.

### Fonctionnel

- **`Trier par` ne filtre rien** : le bouton est désactivé, avec une infobulle. Le
  classement est le sujet du lot 3.
- **Notifications figées** : `PENDING_NOTIFICATIONS = 2` dans `UserSummary.vue`, en
  attendant le lot 3b.
- **Covers manquantes** : Poésie (16) et Animalier (17) n'ont pas d'image et retombent
  sur `cover_default.jpg`. Les 15 autres viennent du legacy, redimensionnées à 375 px
  (9,2 Mo → 342 Ko). La cover personnalisée est le lot 7.
- **« Lire ce chapitre » est une coquille vide** : `readCurrentChapter = () => {}` dans
  `NovelDetailDialog`. Il attend le `ChapterReaderPage` du lot 2.
- **Aucune page de lecture** : après publication on redirige vers la fiche du roman.

### Qualité

- **Sept fichiers sans test** : `PaginatorComponent`, `PaginatorInfiniteComponent`, et
  les helpers `ajax-helpers`, `cookie-helper`, `form-helper`, `location-helper`,
  `ssr-storage`.
- **Deux seuils dupliqués sans garde-fou** : `proofreadingMaxChangedPercent` et
  `proofreadingMinChangedWords` sont recopiés de `config/ghosty.php` vers
  `frontend/src/config/chapter-config.js`. Rien ne détecte une divergence.
- **`content` n'a aucune limite de longueur** en validation. La distance bornée rend le
  calcul viable, mais une borne haute serait la vraie ceinture de sécurité.

### Prochaine étape prévue par le plan

**Lot 2 — Lecture et navigation** : `GET /novels/{slug}/chapters/{id}` (ancêtres,
suites triées, continuité courante), `GET /novels/{slug}/tree`, `ChapterReaderPage`,
`ContinuationSwitcher`, `BranchBreadcrumb`, `MultiversePage`, et
`<link rel="canonical">` vers la continuité courante.
