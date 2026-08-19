# CLAUDE.md - Backend

This file provides guidance to Claude Code (claude.ai/code) when working with the **backend** part of Ghosty.

## Vue d'Ensemble

**Backend Ghosty** : API REST Laravel 13 fournissant les endpoints pour l'application frontend Vue 3.

- **Framework** : Laravel 13
- **PHP** : 8.3+
- **Base de données** : MySQL 8.0
- **ORM** : Eloquent
- **Authentification** : Laravel Sanctum
- **Tests** : Pest ou PHPUnit
- **Hébergement** : O2Switch (mutualisé)

⚠️ **IMPORTANT** : ce fichier documente le modèle **multivers** du MVP. Il a été réécrit le 2026-07-31 : le schéma précédent, hérité du legacy PHP 5.6 (romans en `status = voting|writing`, propositions `accepted|rejected`, sessions de vote clôturées par un `VoteCalculationService`), **contredisait** le MVP et ne doit plus servir de référence.

Les décisions structurantes sont dans les ADR :

| ADR | Décision |
|---|---|
| [ADR-07](memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md) | Arbre `chapters` + chemin matérialisé ; `works` supprimée ; branche **dérivée**, sans table |
| [ADR-08](memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md) | Soutien **positif seul** (aucun downvote) ; signalement = unique voie négative ; continuité courante **automatique** |
| [ADR-09](memory-bank/decisions/ADR-09-pas-d-archivage-automatique.md) | **Aucun archivage automatique** : `archived` / `hidden` sont des issues de modération humaine |
| [ADR-10](memory-bank/decisions/ADR-10-notifications-in-app-agregees.md) | Notifications in-app **agrégées**, canal `database` natif |
| [ADR-11](memory-bank/decisions/ADR-11-chapitre-publie-non-reecrivable.md) | Un chapitre publié est **immuable** : corrigeable une seule fois, sous 48 h, et dans une part limitée du texte |

Plan de livraison par lots : [ghosty-mvp-plan.md](../ghosty-mvp-plan.md).

## Commandes de Développement (À venir)

```bash
# Installation
composer install
cp .env.example .env
php artisan key:generate

# Base de données
php artisan migrate
php artisan db:seed

# Développement (http://localhost:8000)
php artisan serve

# Tests
php artisan test              # Tous les tests
php artisan test --filter=NovelTest  # Test spécifique

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:clear
```

## Architecture Backend

### Structure des Dossiers (Cible)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── AuthController.php
│   │   │           ├── NovelController.php
│   │   │           ├── ChapterController.php
│   │   │           ├── LikeController.php
│   │   │           ├── ReportController.php
│   │   │           ├── CommentController.php
│   │   │           ├── NotificationController.php
│   │   │           ├── UserController.php
│   │   │           └── ModerationController.php
│   │   ├── Requests/              # Form Requests (validation)
│   │   │   ├── StoreNovelRequest.php
│   │   │   ├── UpdateNovelRequest.php
│   │   │   └── ...
│   │   ├── Resources/             # API Resources (serialization)
│   │   │   ├── NovelResource.php
│   │   │   ├── ChapterResource.php
│   │   │   ├── UserResource.php
│   │   │   └── ...
│   │   └── Middleware/
│   │       ├── CheckRole.php
│   │       └── RateLimitLikes.php
│   ├── Models/                    # Eloquent Models
│   │   ├── User.php
│   │   ├── Novel.php
│   │   ├── Chapter.php
│   │   ├── NovelCover.php
│   │   ├── Like.php
│   │   ├── Comment.php
│   │   ├── Report.php
│   │   └── Genre.php
│   ├── Repositories/              # SEUL endroit pour l'accès DB
│   │   ├── NovelRepository.php
│   │   ├── ChapterRepository.php
│   │   └── GenreRepository.php
│   ├── Policies/                  # Authorization
│   │   ├── NovelPolicy.php
│   │   ├── ChapterPolicy.php
│   │   └── ReportPolicy.php
│   └── Services/                  # Business Logic
│       ├── ChapterService.php             # seul écrivain de chapters (ADR-07)
│       ├── BranchService.php         # branch_like_count propagé (ADR-08)
│       ├── LikeGuard.php              # anti-abus des soutiens
│       ├── ModerationService.php         # seul chemin vers archived/hidden
│       ├── NotificationService.php       # agrégation par group_key
│       └── ImageUploadService.php
├── database/
│   ├── migrations/
│   │   ├── 0001_create_users_table.php
│   │   ├── 0002_create_cache_table.php
│   │   ├── 0003_create_jobs_table.php
│   │   ├── 0004_create_personal_access_tokens_table.php
│   │   ├── 0005_create_genres_table.php
│   │   ├── 0006_create_novels_table.php
│   │   └── 0007_create_chapters_table.php
│   ├── seeders/
│   │   ├── GenresSeeder.php         # ⚠️ Lit database/data/genres.json
│   │   ├── NovelSeeder.php          # ⚠️ Lit database/data/novels.json
│   │   ├── ChapterSeeder.php        # ⚠️ Lit database/data/chapters.json (arbre imbriqué)
│   │   ├── UserSeeder.php
│   │   └── DatabaseSeeder.php
│   ├── data/                         # ⚠️ Données JSON pour seeders
│   │   ├── genres.json              # Liste des genres (17 genres)
│   │   ├── novels.json              # Romans de test (20 romans)
│   │   └── chapters.json            # Multivers de démo (arbre du MVP §5)
│   └── factories/
│       ├── UserFactory.php
│       ├── NovelFactory.php
│       └── ChapterFactory.php
├── routes/
│   ├── api.php                    # Routes API
│   └── web.php
├── tests/
│   ├── Feature/
│   │   ├── Api/V1/{Controller}/{Controller}{Method}Test.php
│   │   └── Models/{Model}ModelTest.php
│   └── Unit/
├── storage/
│   └── app/
│       └── public/
│           ├── covers/            # Couvertures romans
│           └── avatars/           # Photos profils
├── public/
│   ├── build/                     # Build Vite (frontend)
│   └── index.php
├── .env
├── composer.json
└── artisan
```

## Schéma de Base de Données

### Tables Principales

#### users
```sql
id BIGINT PRIMARY KEY
pseudo VARCHAR UNIQUE
email VARCHAR UNIQUE
password VARCHAR                    -- Bcrypt (pas SHA1!)
email_verified_at TIMESTAMP
role ENUM('reader', 'author', 'moderator', 'admin')
photo VARCHAR
notifications_enabled BOOLEAN
firstname VARCHAR
lastname VARCHAR
birth_date DATE
warning_count INT DEFAULT 0
new_messages_count INT DEFAULT 0
banned_until DATE NULLABLE
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### novels
```sql
id BIGINT PRIMARY KEY
title VARCHAR
genre_id BIGINT → genres.id
author_id BIGINT → users.id
cover_url VARCHAR NULLABLE          -- déprécié : remplacé par la cover officielle
is_favorite BOOLEAN DEFAULT false
chapter_count INT DEFAULT 0         -- toutes réalités confondues
created_at TIMESTAMP
updated_at TIMESTAMP

INDEX idx_author (author_id)
```

> ⛔ **Pas de `status` sur un roman.** Il n'y a ni cycle de vote, ni phase d'écriture :
> une suite peut arriver à tout moment (MVP §3). Les états `voting` / `writing` du
> legacy n'existent plus.

#### chapters — l'arbre du multivers ✅ implémenté
```sql
id BIGINT PRIMARY KEY
novel_id BIGINT → novels.id
parent_id BIGINT NULLABLE → chapters.id   -- NULL = chapitre racine
author_id BIGINT → users.id
title VARCHAR
content LONGTEXT
summary TEXT NULLABLE
path VARCHAR                              -- chemin matérialisé "/1/12/45/"
depth SMALLINT                            -- 0 pour la racine
continuations_count INT DEFAULT 0         -- suites PUBLIÉES ; > 0 ⇒ branche
like_count INT DEFAULT 0
branch_like_count INT DEFAULT 0           -- cumul des soutiens de la racine jusqu'ici (ADR-08)
comment_count INT DEFAULT 0
read_count INT DEFAULT 0
status TINYINT DEFAULT 1                  -- 0 draft (auteur seul), 1 published,
                                          -- 2 archived, 3 hidden
published_at TIMESTAMP NULLABLE
corrected_at TIMESTAMP NULLABLE            -- correction unique (ADR-11)
created_at / updated_at TIMESTAMP

INDEX (novel_id, parent_id), (novel_id, status, branch_like_count), (status), (path)
INDEX chapters_active_branches_index (novel_id, continuations_count, status, branch_like_count)
```

**Trois pièges à connaître avant d'y toucher** :

1. **`continuations_count`, pas `children_count`** — Eloquent réserve `children_count` au résultat de `withCount('children')`, qui écraserait silencieusement le compteur dénormalisé.
2. **Il compte les suites publiées** : décrémenter aussi quand la modération archive ou masque une suite, sinon un parent reste affiché comme branche active (interdit par §9).
3. **`path` est encadré de séparateurs** (`/1/12/45/`) pour qu'un préfixe `LIKE '/1/12/%'` ne capture jamais le chapitre 120.

#### novel_covers — à venir (lot 7)
```sql
id, novel_id → novels.id, author_id → users.id, image_path,
status ENUM('proposed', 'official', 'archived'), like_count, comment_count, timestamps
```

#### likes — à venir (lot 3)
```sql
id, user_id → users.id, likeable_type, likeable_id, created_at
UNIQUE (user_id, likeable_type, likeable_id)
```

> ⛔ **Pas de colonne `vote`.** Le soutien est positif ou absent : il n'existe pas de `-1`
> ([ADR-08](memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md)).

#### comments — à venir (lot 5)
```sql
id, author_id → users.id, commentable_type (Novel|Chapter|NovelCover), commentable_id,
parent_id NULLABLE, reply_count, content, is_spoiler BOOLEAN,
status ENUM('visible', 'hidden', 'deleted'), timestamps

INDEX (commentable_type, commentable_id, parent_id)
```

#### reports / sanctions — à venir (lots 3 et 6)
```sql
reports   : reporter_id, reportable_type (Chapter|Comment|NovelCover|User), reportable_id,
            reason ENUM('poor_quality','off_topic','plagiarism','unauthorized_illustration',
                        'spam','hate_speech','insult','harassment','personal_attack',
                        'like_manipulation','illegal'),
            description, status ENUM('pending','processed'), moderator_id,
            resolution ENUM('dismissed','hidden','removed','sanction'), processed_at, timestamps
            UNIQUE (reporter_id, reportable_type, reportable_id)

sanctions : user_id, moderator_id, type ENUM('warning','like_ban','write_ban',
            'comment_ban','account_ban'), until NULLABLE, reason, report_id NULLABLE, timestamps
```

> ⛔ **Aucune bascule d'état sur un nombre de signalements.** Sans ce garde-fou, « signaler »
> redevient le downvote supprimé, actionnable en brigade.

#### notifications — à venir (lot 3b)

Table **native Laravel** (`php artisan make:notifications-table`, canal `database`), plus une
colonne `group_key` indexée qui porte l'agrégation. Pas de schéma maison.

### Ordre de Création des Migrations

1. `users`, `genres`
2. `novels`
3. `chapters`
4. `likes`, `reports`
5. `notifications`
6. `comments`
7. `sanctions`, `novel_covers`

## Seeders et Données de Test

### ⚠️ Architecture des Seeders : JSON Externe

**RÈGLE IMPORTANTE** : Les seeders NE DOIVENT PAS contenir de données hardcodées dans le code PHP. Toutes les données doivent être stockées dans des fichiers JSON dans `database/data/`.

**Pourquoi ?**
- Lisibilité : Le seeder reste simple et lisible
- Maintenabilité : Facile de modifier les données sans toucher au code
- Séparation : Logique (seeder) séparée des données (JSON)

### Structure des Seeders

```
database/
├── data/                      # ⚠️ Données JSON UNIQUEMENT
│   ├── genres.json           # 17 genres (id, name)
│   └── novels.json           # 20 romans de test (title, genre_id, cover_url)
└── seeders/
    ├── GenresSeeder.php      # Lit genres.json
    ├── NovelSeeder.php       # Lit novels.json
    └── DatabaseSeeder.php    # Appelle tous les seeders
```

### Exemple : GenresSeeder

**database/data/genres.json** :
```json
[
    { "id": 1, "name": "Science Fiction" },
    { "id": 2, "name": "Horreur" },
    { "id": 3, "name": "Aventure" }
]
```

**database/seeders/GenresSeeder.php** :
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GenresSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/genres.json');
        $genres = json_decode(file_get_contents($jsonPath), true);

        DB::table('genres')->truncate();

        foreach ($genres as $genre) {
            DB::table('genres')->insert([
                'id' => $genre['id'],
                'name' => $genre['name'],
                'slug' => Str::slug($genre['name']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
```

### Exemple : NovelSeeder

**database/data/novels.json** :
```json
[
    {
        "title": "Nuit virage",
        "genre_id": 2,
        "cover_url": "https://images.unsplash.com/photo-xxx"
    },
    {
        "title": "Destin Croisé",
        "genre_id": 5,
        "cover_url": "https://images.unsplash.com/photo-yyy"
    }
]
```

**database/seeders/NovelSeeder.php** :
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NovelSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/novels.json');
        $novels = json_decode(file_get_contents($jsonPath), true);

        DB::table('novels')->truncate();

        foreach ($novels as $novel) {
            DB::table('novels')->insert([
                'title' => $novel['title'],
                'genre_id' => $novel['genre_id'],
                'cover_url' => $novel['cover_url'],
                'is_favorite' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
```

### DatabaseSeeder

**database/seeders/DatabaseSeeder.php** :
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            GenresSeeder::class,
            NovelSeeder::class,
            // UsersSeeder::class,
            // etc.
        ]);
    }
}
```

## Développement d'une API

### 1. Migration

```php
<?php
// database/migrations/0007_create_chapters_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('novel_id')->constrained('novels')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('chapters')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->longText('content');
            $table->text('summary')->nullable();

            $table->string('path');
            $table->unsignedSmallInteger('depth')->default(0);

            // Volontairement pas `children_count` : Eloquent réserve ce nom au
            // résultat de `withCount('children')`, qui écraserait ce compteur.
            $table->unsignedInteger('continuations_count')->default(0);
            $table->unsignedInteger('like_count')->default(0);
            $table->unsignedInteger('branch_like_count')->default(0);

            $table->unsignedTinyInteger('status')->default(1);

            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['novel_id', 'parent_id']);
            $table->index(['novel_id', 'status', 'branch_like_count']);
            $table->index('path');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chapters');
    }
};
```

### 2. Model Eloquent

```php
<?php
// app/Models/Novel.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Novel extends Model
{
    protected $fillable = [
        'title',
        'genre_id',
        'author_id',
        'status'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'status_changed_at' => 'datetime'
    ];

    // Relations
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Tous les chapitres du roman, toutes réalités confondues.
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    /**
     * Chapitre d'origine, racine de l'arbre du multivers.
     */
    public function rootChapter(): HasOne
    {
        return $this->hasOne(Chapter::class)->whereNull('parent_id');
    }
}
```

### 3. Form Request (Validation)

```php
<?php
// app/Http/Requests/StoreNovelRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNovelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isAuthor();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|min:3|max:255',
            'genre_id' => 'required|exists:genres,id',
            'summary' => 'nullable|string|max:1000',
            'first_chapter_title' => 'required|string|max:255',
            'first_chapter_content' => 'required|string|min:100'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire',
            'title.min' => 'Le titre doit contenir au moins 3 caractères',
            'genre_id.exists' => 'Le genre sélectionné est invalide',
            'first_chapter_content.min' => 'Le premier chapitre doit contenir au moins 100 caractères'
        ];
    }
}
```

### 4. Resource (Serialization)

Le wrapping est désactivé (`JsonResource::withoutWrapping()` dans `AppServiceProvider`) :
les champs sont à la racine de la réponse, **pas** sous une clé `data`.

Les noms de champs sont **explicites** — les préfixes legacy (`nov_id`, `wrk_content`,
`nov_date_publi`) ne sont plus utilisés nulle part.

```php
<?php
// app/Http/Resources/ChapterResource.php

namespace App\Http\Resources;

use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Chapter
 */
class ChapterResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $this->when($this->shouldExposeContent($request), $this->content),
            'depth' => $this->depth,
            'is_continued' => $this->isContinued(),
            'continuations_count' => $this->continuations_count,
            'like_count' => $this->like_count,
            'branch_like_count' => $this->branch_like_count,
            'author' => [
                'id' => $this->author_id,
                'pseudo' => $this->whenLoaded('author', fn () => $this->author?->pseudo),
            ],
            'published_at' => $this->published_at?->toIso8601String(),
        ];
    }
}
```

**`is_continued` est dérivé**, jamais stocké : une proposition devient une branche dès qu'une
suite publiée la poursuit. Il n'existe pas d'entité « branche »
([ADR-07](memory-bank/decisions/ADR-07-modele-multivers-arbre-de-chapitres.md)).

**Le texte intégral n'est servi que sur la fiche d'un chapitre** : une liste de continuité
renverrait autant de `longText` que de chapitres.

### 5. Policy (Authorization)

```php
<?php
// app/Policies/NovelPolicy.php

namespace App\Policies;

use App\Models\User;
use App\Models\Novel;

class NovelPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Novel $novel): bool
    {
        return $novel->status !== Novel::STATUS_DRAFT
            || $user->id === $novel->author_id
            || $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAuthor();
    }

    public function update(User $user, Novel $novel): bool
    {
        return $user->id === $novel->author_id
            || $user->isAdmin();
    }

    public function delete(User $user, Novel $novel): bool
    {
        return $user->id === $novel->author_id
            || $user->isAdmin();
    }
}
```

### 6. Controller API

```php
<?php
// app/Http/Controllers/Api/V1/NovelController.php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNovelRequest;
use App\Http\Resources\NovelResource;
use App\Models\Novel;
use Illuminate\Http\Request;

class NovelController extends Controller
{
    public function index(Request $request)
    {
        $query = Novel::with(['genre', 'author']);

        // Filtres
        if ($request->filled('id_genre')) {
            $query->where('genre_id', $request->id_genre);
        }

        if ($request->filled('id_author')) {
            $query->where('author_id', $request->id_author);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Tri
        $sortBy = $request->input('sort', 'created_at');
        $sortOrder = $request->input('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $novels = $query->paginate(20);

        return NovelResource::collection($novels);
    }

    public function store(StoreNovelRequest $request)
    {
        $this->authorize('create', Novel::class);

        $novel = Novel::create([
            'title' => $request->title,
            'genre_id' => $request->genre_id,
            'author_id' => auth()->id(),
            'status' => Novel::STATUS_DRAFT
        ]);

        // Créer le premier chapitre
        $novel->chapters()->create([
            'title' => $request->first_chapter_title,
            'content' => $request->first_chapter_content,
            'author_id' => auth()->id(),
            'type' => 'chapter',
            'order' => 1,
            'status' => 'draft'
        ]);

        return new NovelResource($novel->load(['genre', 'author']));
    }

    public function show(Novel $novel)
    {
        $this->authorize('view', $novel);

        $novel->load(['genre', 'author', 'chapters']);

        return new NovelResource($novel);
    }

    public function update(StoreNovelRequest $request, Novel $novel)
    {
        $this->authorize('update', $novel);

        $novel->update($request->validated());

        return new NovelResource($novel->load(['genre', 'author']));
    }

    public function destroy(Novel $novel)
    {
        $this->authorize('delete', $novel);

        $novel->delete();

        return response()->json(['message' => 'Roman supprimé avec succès']);
    }
}
```

### 7. Routes API

```php
<?php
// routes/api.php

use App\Http\Controllers\Api\V1\NovelController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/novels', [NovelController::class, 'index']);
    Route::get('/novels/{novel}', [NovelController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/novels', [NovelController::class, 'store']);
        Route::put('/novels/{novel}', [NovelController::class, 'update']);
        Route::delete('/novels/{novel}', [NovelController::class, 'destroy']);
    });
});
```

## Authentification Sanctum

### Configuration

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'app.ghosty.local:5173')),

// Le token voyage dans un cookie HttpOnly, pas dans un en-tête Authorization
'token_cookie' => [
    'name' => env('SANCTUM_TOKEN_COOKIE', 'ghosty_token'),
    'session_name' => env('SANCTUM_SESSION_COOKIE', 'ghosty_session'),
    ...
],
```

`config/cors.php` doit poser `supports_credentials => true` avec des origines explicites
(`CORS_ALLOWED_ORIGINS`) : `*` est refusé par le navigateur dès qu'un cookie est envoyé.

### Login Controller

⛔ **Le token n'est JAMAIS rendu dans le corps de la réponse.** `AuthController::authenticated()`
le pose dans un cookie HttpOnly + Secure + SameSite, accompagné d'un cookie témoin
`ghosty_session` lisible et sans secret. `AppServiceProvider` branche
`Sanctum::getAccessTokenFromRequestUsing()` pour lire ce cookie — **seule** voie
d'authentification : un `Authorization: Bearer`, même valide, reçoit un 401.

Implémentation de référence : `app/Http/Controllers/Api/V1/AuthController.php`.
Décision et alternatives : [ADR-04](memory-bank/decisions/ADR-04-token-en-cookie-httponly.md).

## Services (Business Logic)

> ⛔ **`VoteCalculationService` n'existe plus.** Le service legacy clôturait une session de
> vote, acceptait un « gagnant » et passait les autres propositions en `rejected`. Le MVP
> écarte ce fonctionnement : « le vote n'est plus une échéance destinée à éliminer les
> propositions » (§7), et « une proposition moins soutenue peut toujours être poursuivie et
> devenir une branche ». **Aucune proposition n'est jamais rejetée.**

### BranchService — la continuité courante, sans élimination

Aucune colonne ne désigne un gagnant. Chaque chapitre porte `branch_like_count`, le **cumul
des soutiens depuis la racine jusqu'à lui**, et la continuité courante se déduit : c'est la
branche du chapitre publié au cumul le plus élevé. Les suites écartées restent intégralement
lisibles et peuvent encore devenir des branches.

Un soutien remonte donc dans toute la descendance du chapitre, en une seule requête grâce au
`path` matérialisé :

```php
public function applyLike(Chapter $chapter, int $delta = 1): void
{
    $chapter->increment('like_count', $delta);

    Chapter::where('path', 'like', $chapter->path.'%')
        ->increment('branch_like_count', $delta);
}
```

À la lecture, `ChapterRepository::currentContinuity()` prend le chapitre au plus fort cumul
et hydrate sa branche depuis `pathChapterIds()`. Sur une feuille, le même cumul évalue une
**branche complète** — d'où `bestBranches()`, un simple `ORDER BY` indexé.

**Quatre règles à ne pas contourner** :

1. **Aucun arbitrage humain.** Ni l'auteur du chapitre parent ni celui du roman ne choisit :
   ce serait un parti pris sur le travail des autres
   ([ADR-08](memory-bank/decisions/ADR-08-soutien-positif-et-continuite-automatique.md)).
2. **Le cumul, jamais la comparaison entre frères.** Comparer les seules suites directes est
   glouton : un cul-de-sac très soutenu interromprait la lecture au deuxième chapitre.
3. **Départage déterministe** — à cumul égal, le chapitre le plus profond l'emporte (sinon
   la lecture s'arrête avant la fin), puis le plus anciennement publié.
4. **On notifie le gain, jamais la perte.** Annoncer une rétrogradation transformerait un
   classement en défaite, à rebours de §7.

⚠️ La propagation est **synchrone** et écrit autant de lignes que le sous-arbre en compte.
C'est sans effet sur des romans courts ; si la latence d'un soutien devient perceptible, la
sortie prévue est une file groupée par roman, et le point d'appel ci-dessus est le seul à
changer.

### LikeGuard — anti-abus

Le soutien porte à lui seul le classement des suites, la continuité courante et la
régulation de la visibilité (rien n'étant archivé par le temps qui passe,
[ADR-09](memory-bank/decisions/ADR-09-pas-d-archivage-automatique.md)). Le truquer ne fausse
pas un classement : il détourne le parcours de lecture par défaut. D'où les garde-fous à
livrer avec le service — email vérifié, ancienneté de compte, unicité, pas d'auto-soutien,
throttle — et leurs seuils dans un `config/ghosty.php` créé à ce moment-là, pas avant.

## Tests

### Feature Test

```php
<?php
// tests/Feature/NovelControllerTest.php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Genre;
use App\Models\Novel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NovelControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_novels(): void
    {
        Novel::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/novels');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_author_can_create_novel(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $genre = Genre::factory()->create();

        $response = $this->actingAs($author)
            ->postJson('/api/v1/novels', [
                'title' => 'Test Novel',
                'genre_id' => $genre->id,
                'first_chapter_title' => 'Chapter 1',
                'first_chapter_content' => str_repeat('content ', 50)
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nov_title', 'Test Novel');

        $this->assertDatabaseHas('novels', [
            'title' => 'Test Novel',
            'author_id' => $author->id
        ]);
    }

    public function test_reader_cannot_create_novel(): void
    {
        $reader = User::factory()->create(['role' => 'reader']);
        $genre = Genre::factory()->create();

        $response = $this->actingAs($reader)
            ->postJson('/api/v1/novels', [
                'title' => 'Test Novel',
                'genre_id' => $genre->id
            ]);

        $response->assertStatus(403);
    }
}
```

### Unit Test

La `ChapterFactory` fournit les states qui construisent l'arbre — les utiliser plutôt que de
poser `path` et `depth` à la main :

| State | Effet |
|---|---|
| `continuing($parent)` | rattache au parent : `novel_id`, `depth`, `path`, et incrémente `continuations_count` du parent |
| `liked($count)` | pose `like_count` et le cumul de branche correspondant |
| `archived()` / `hidden()` | issues de modération |

```php
<?php
// tests/Feature/Models/ChapterModelTest.php

namespace Tests\Feature\Models;

use App\Models\Chapter;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChapterModelTest extends TestCase
{
    #[Test]
    public function a_proposal_becomes_a_branch_once_continued(): void
    {
        $chapter = Chapter::factory()->create();
        Chapter::factory()->continuing($chapter)->create();

        $this->assertTrue($chapter->refresh()->isContinued());
    }

    #[Test]
    public function ancestors_are_read_from_the_path_in_order(): void
    {
        $root = Chapter::factory()->create();
        $second = Chapter::factory()->continuing($root)->create();
        $third = Chapter::factory()->continuing($second->refresh())->create();

        $this->assertSame([$root->id, $second->id], $third->refresh()->ancestorIds());
    }
}
```

> ⚠️ `assertJsonMissing(['id' => $x])` cherche le fragment **partout** dans la réponse et
> matche aussi un `author.id` imbriqué. Pour vérifier une liste de chapitres, asserter la
> séquence exacte : `assertJsonPath('chapters.*.id', [$root->id, $main->id])`.

## Sécurité

### Checklist

- ✅ **Passwords** : `Hash::make()` (bcrypt/argon2)
- ✅ **SQL Injection** : Eloquent ORM (pas de SQL brut)
- ✅ **XSS** : Blade auto-escaping `{{ }}`
- ✅ **CSRF** : Token `@csrf` dans formulaires
- ✅ **Authorization** : Policies sur tous models
- ✅ **Validation** : Form Requests partout
- ✅ **Rate Limiting** : Middleware sur routes sensibles
- ✅ **Upload Files** : `Storage::disk()` + validation MIME
- ✅ **HTTPS** : Forcer en production
- ✅ **Token d'accès** : cookie HttpOnly + SameSite, **jamais** rendu dans le corps JSON
  (voir [ADR-04](memory-bank/decisions/ADR-04-token-en-cookie-httponly.md))

### Middleware Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Max 60 requêtes par minute
});

Route::post('/chapters/{chapter}/like', [LikeController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:10,1']);  // Max 10 soutiens/min
```

## Déploiement O2Switch

### Configuration .env

```env
APP_NAME=Ghosty
APP_ENV=production
APP_DEBUG=false
APP_URL=https://www.ghosty.fr

DB_CONNECTION=mysql
DB_HOST=ghosty.mysql.db
DB_PORT=3306
DB_DATABASE=ghosty_prod
DB_USERNAME=ghosty_user
DB_PASSWORD=***

SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

SANCTUM_STATEFUL_DOMAINS=www.ghosty.fr,ghosty.fr
```

### Cron Jobs

```bash
# cPanel - Ajouter cron (1x par minute)
* * * * * cd /home/user/laravel_app && php artisan schedule:run >> /dev/null 2>&1
```

### Permissions

```bash
chmod -R 755 /home/user/laravel_app
chmod -R 775 /home/user/laravel_app/storage
chmod -R 775 /home/user/laravel_app/bootstrap/cache
```

## Ressources

### Documentation Interne
- **[../CLAUDE.md](../CLAUDE.md)** : Vue d'ensemble projet
- **[../CLAUDE_BEST_PRACTICES.md](../CLAUDE_BEST_PRACTICES.md)** : Bonnes pratiques
- **[../frontend/CLAUDE.md](../frontend/CLAUDE.md)** : Frontend Vue 3
- **[../AUDIT_MIGRATION.md](../AUDIT_MIGRATION.md)** : Audit legacy + schéma DB

### Documentation Externe
- [Laravel 13 Documentation](https://laravel.com/docs/13.x)
- [Laravel Sanctum](https://laravel.com/docs/13.x/sanctum)
- [Eloquent ORM](https://laravel.com/docs/13.x/eloquent)
- [Pest PHP](https://pestphp.com/)

---

**Version** : 1.0
**Date** : 2025-10-18
**Backend** : Laravel 13 (À développer)

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3.14
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/mcp (MCP) - v0
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- phpunit/phpunit (PHPUNIT) - v11


## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] <name>` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== phpunit/core rules ===

## PHPUnit Core

- This application uses PHPUnit for testing. All tests must be written as PHPUnit classes. Use `php artisan make:test --phpunit <name>` to create a new test.
- If you see a test using "Pest", convert it to PHPUnit.
- Every time a test has been updated, run that singular test.
- When the tests relating to your feature are passing, ask the user if they would like to also run the entire test suite to make sure everything is still passing.
- Tests should test all of the happy paths, failure paths, and weird paths.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files, these are core to the application.

### Running Tests
- Run the minimal number of tests, using an appropriate filter, before finalizing.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
</laravel-boost-guidelines>
