# Lot 1 — Écriture et arbre : état au 2026-08-03

Document de reprise. Il résume ce qui a été fait, les décisions prises, les pièges
rencontrés et ce qui reste ouvert.

---

## 1. Où en est le dépôt

| | |
|---|---|
| Worktree | `c:\wamp64\www\ghosty-feature-ecriture-arbre` |
| Branche | `feature/ecriture-arbre` (partie de `main` @ `abe5373`) |
| État | **89 fichiers modifiés ou ajoutés, rien n'est commité** |

Le worktree `ghosty-feature-multivers` (lot 0) a été **fermé** : fast-forward dans
`main`, worktree et branche locale supprimés. `origin/feature/multivers-foundations`
existe toujours côté distant.

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

> Le catalogue de traductions est compilé au **démarrage** du serveur. Après avoir
> ajouté des clés, relancer `npm run dev:ssr`, sinon `[intlify] Not found`.

---

## 2. Ce qui a été livré

### Backend

| Domaine | Contenu |
|---|---|
| Écriture | `ChapterTreeService` (chemin matérialisé, profondeur, compteurs, activité propagée aux ancêtres), `NovelWritingService` (roman + chapitre d'origine en une transaction) |
| Endpoints | `POST /novels`, `POST /novels/{slug}/chapters`, `PUT /chapters/{chapter}`, `POST /chapters/{chapter}/publish`, `DELETE /chapters/{chapter}`, `GET /me/drafts` |
| Recherche | `GET /novels?search=` (titre, insensible à la casse) |
| Autorisation | `NovelPolicy` (créer = tout compte non banni), `ChapterPolicy` (`propose`, `update`, `publish`, `delete`) |
| Validation | `StoreNovelRequest`, `StoreChapterRequest`, `UpdateChapterRequest`, `PublishChapterRequest`, règle `SpellingCorrectionOnly` |
| Réglages | `config/ghosty.php` (longueurs, seuils de correction, pagination, profondeur affichée) |

### Frontend

| Domaine | Contenu |
|---|---|
| Accueil | Barre verte à deux gestes : **Nouveau** / **Lire — continuer**. Le formulaire s'ouvre sous la barre, sans quitter la page |
| Écriture | `NovelCreateForm` (genre bloquant, sections Récit/Résumé, Brouillon + Publier), `ChapterWritePage` (proposer une suite), `ChapterEditPage` (reprendre un brouillon ou corriger un publié) |
| Brouillons | `DraftsPage` — filtre Romans / Chapitres, Reprendre / Publier / Supprimer |
| Recherche | `NovelSearch` au-dessus de la grille, branchée à l'API |
| Bandeau | `UserSummary` : avatar, pseudo, brouillons en cours (ou invitation à écrire), notifications |
| En-tête | Connecté : pseudo + menu ☰ (Créer un roman, Mes brouillons, Déconnexion). Déconnecté : deux boutons en contour |

---

## 3. Décisions prises dans la conversation

### Un chapitre publié ne se réécrit pas — [ADR-11](backend/memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md)

Il n'existe plus d'édition libre d'un texte publié. La règle `SpellingCorrectionOnly`
compare mot à mot :

- même nombre de mots ;
- chaque mot corrigé reste à ≤ 2 caractères de l'original (Levenshtein en caractères,
  pas en octets) ;
- au plus 10 % des mots modifiés.

Ni fenêtre de temps, ni interdiction liée aux suites : l'orthographe ne change pas ce
qui a été lu. **Limite assumée** : la règle est lexicale, elle laisse passer une
inversion de sens tenant en deux caractères (« il peut » → « il pue »). Le garde-fou
reste le signalement.

### Les brouillons sont rétablis — amendement de l'ADR-11

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
(`src/helpers/ajax-helper.js`) et **jamais** `!== STATUS.SUCCESS` sur un appel qui écrit.

**2. La base était en MyISAM** — moteur qui ignore les clés étrangères *et les
transactions*. Conséquences observées : chapitres orphelins après suppression d'un
roman, et `DB::transaction()` sans effet. Corrigé : `'engine' => 'InnoDB'` dans
`config/database.php`, puis `migrate:fresh --seed`. Les 5 contraintes existent
désormais (`chapters.novel_id`, `parent_id`, `author_id`, `novels.author_id` en
CASCADE ; `novels.genre_id` en RESTRICT).
Sauvegarde de l'ancienne base : `…\scratchpad\ghosty-myisam-backup.sql` —
**dossier temporaire, à copier ailleurs si elle compte**.

**3. Deux routes, un seul composant.** `/` et `/novels/create` rendent tous deux
`HomePage` : Vue réutilise l'instance et ne rejoue pas `setup()`. Un état initialisé
une seule fois y reste figé. Le mode est donc **dérivé de l'URL** (`computed`), et les
onglets naviguent.

**4. Le service de suppression ne doit pas compter sur la cascade SQL.** Les tests
tournent sur SQLite (cascade active) et masquaient le problème. `discard()` supprime
les chapitres explicitement.

**5. Comparer un rendu à `t('clé')` dans un test ne prouve rien** : si la clé manque,
les deux côtés valent la clé et le test passe. Comparer au libellé en clair.

**6. `radius-50` n'existe pas** (seulement `radius-5`, `-10`, `-15`).

---

## 5. Vérifications au moment d'écrire ce document

| | |
|---|---|
| `php artisan test` | **123 tests**, 305 assertions |
| `vendor/bin/phpstan analyse` (niveau max) | **0 erreur** |
| `vendor/bin/pint --dirty` | passed |
| `npx vitest run` | **375 tests** |
| `npx eslint .` | 21 erreurs — **toutes pré-existantes** (`tests/utils/mocks/`, seeders), identiques à `main` |
| Parcours navigateur | genre → titres → refus si texte court → brouillon → liste → suppression : OK |
| Base | 6 users, 17 genres, 20 romans, 10 chapitres, 0 orphelin |

---

## 6. Ce qui reste ouvert

### Fonctionnel

- **`Trier par` et `Genre` ne filtrent rien** : les listes sont en dur dans
  `SearchBar.vue` et ne sont pas transmises à l'API. Seule la recherche par titre
  fonctionne.
- **Notifications figées** : `PENDING_NOTIFICATIONS = 2` dans `UserSummary.vue`, en
  attendant le lot 3b. Le singulier est déjà géré ; il suffira de remplacer la
  constante.
- **Publication réelle jamais testée depuis l'écran** — elle créerait un roman
  publié qu'aucun endpoint ne supprime. Couverte côté serveur par les tests.
- **Pas de page favoris** (le cœur du legacy n'a pas été repris), **pas de profil**,
  **pas de couverture** (lot 7).
- **Aucune page de lecture** : après publication on redirige vers la fiche du roman.
  C'est le lot 2.

### Qualité

- **`tests/helpers/locale-helper.test.js` est instable** : il échoue au premier
  `vitest run` qui suit un `vite build`, puis passe. Cause : le fichier mocke
  `node:fs` pendant que le setup global lit un vrai fichier via `importActual`, et le
  build invalide le cache de transformation. Non corrigé — cela touche l'infra de test
  partagée.
- **Aucun test ne couvre `HomePage`** (bascule des modes, formulaire inline). La
  régression du point 4.3 n'a été vue qu'en pilotant le navigateur.
- Les 21 erreurs ESLint pré-existantes (mocks et seeders) n'ont pas été traitées.

### Prochaine étape prévue par le plan

**Lot 2 — Lecture et navigation** : `GET /novels/{slug}/chapters/{id}` (ancêtres,
suites triées, continuité courante), `GET /novels/{slug}/tree`, page de lecture,
sélecteur de suites, fil d'Ariane, vue multivers, `<link rel="canonical">` vers la
continuité courante.

---

## 7. Fichiers créés dans cette session

**Backend** — `app/Services/{ChapterTreeService,NovelWritingService}.php`,
`app/Policies/{ChapterPolicy,NovelPolicy}.php`, `app/Rules/SpellingCorrectionOnly.php`,
`app/Support/TokenCookieSettings.php`, `app/Http/Requests/{StoreNovel,StoreChapter,UpdateChapter,PublishChapter}Request.php`,
`config/ghosty.php`, `lang/fr/chapters.php`,
`memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md`,
4 fichiers de tests `ChapterController{Store,Update,Publish,Destroy,Drafts}Test.php` et
`NovelControllerStoreTest.php`.

**Frontend** — `views/novels/NovelCreateForm.vue`,
`views/chapters/{ChapterWritePage,ChapterEditPage,DraftsPage}.vue`,
`views/parts/{NovelSearch,UserSummary}.vue`,
`apis/genres/{controllers,repositories}/`, `apis/*/formRequest/`,
`apis/*/dtos/*-error-dto.js`, `config/chapter-config.js`, `helpers/ajax-helper.js`,
`head/use-{drafts,chapter-edit}-head.js`, les fichiers de locales correspondants et
leurs tests.
