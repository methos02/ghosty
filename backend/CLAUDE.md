# CLAUDE.md - Backend

This file provides guidance to Claude Code (claude.ai/code) when working with the **backend** part of Ghosty.

## Vue d'Ensemble

**Backend Ghosty** : API REST Laravel 12 fournissant les endpoints pour l'application frontend Vue 3.

- **Framework** : Laravel 12
- **PHP** : 8.2+
- **Base de données** : MySQL 8.0
- **ORM** : Eloquent
- **Authentification** : Laravel Sanctum
- **Tests** : Pest ou PHPUnit
- **Hébergement** : O2Switch (mutualisé)

⚠️ **IMPORTANT** : Ce backend est actuellement **vide** et doit être développé. Ce fichier documente l'architecture cible basée sur l'audit du legacy PHP 5.6.

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
│   │   │           ├── WorkController.php
│   │   │           ├── VoteController.php
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
│   │   │   ├── WorkResource.php
│   │   │   ├── UserResource.php
│   │   │   └── ...
│   │   └── Middleware/
│   │       ├── CheckRole.php
│   │       └── RateLimitVotes.php
│   ├── Models/                    # Eloquent Models
│   │   ├── User.php
│   │   ├── Novel.php
│   │   ├── Work.php
│   │   ├── Vote.php
│   │   ├── Comment.php
│   │   ├── Notification.php
│   │   ├── Report.php
│   │   └── Genre.php
│   ├── Policies/                  # Authorization
│   │   ├── NovelPolicy.php
│   │   ├── WorkPolicy.php
│   │   └── ReportPolicy.php
│   └── Services/                  # Business Logic
│       ├── VoteCalculationService.php
│       ├── NotificationService.php
│       └── ImageUploadService.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_01_000001_create_genres_table.php
│   │   ├── 2024_01_01_000002_create_novels_table.php
│   │   ├── 2024_01_01_000003_create_works_table.php
│   │   ├── 2024_01_01_000004_create_votes_table.php
│   │   ├── 2024_01_01_000005_create_comments_table.php
│   │   ├── 2024_01_01_000006_create_notifications_table.php
│   │   └── 2024_01_01_000007_create_reports_table.php
│   ├── seeders/
│   │   ├── GenresSeeder.php         # ⚠️ Lit database/data/genres.json
│   │   ├── NovelSeeder.php          # ⚠️ Lit database/data/novels.json
│   │   ├── UsersSeeder.php
│   │   └── DatabaseSeeder.php
│   ├── data/                         # ⚠️ Données JSON pour seeders
│   │   ├── genres.json              # Liste des genres (17 genres)
│   │   └── novels.json              # Romans de test (20 romans)
│   └── factories/
│       ├── UserFactory.php
│       └── NovelFactory.php
├── routes/
│   ├── api.php                    # Routes API
│   └── web.php
├── tests/
│   ├── Feature/
│   │   ├── NovelControllerTest.php
│   │   └── VoteControllerTest.php
│   └── Unit/
│       └── VoteCalculationServiceTest.php
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
cover_id BIGINT → works.id
status ENUM('draft', 'voting', 'writing', 'finished', 'rejected')
chapter_count INT DEFAULT 0
favorites_count INT DEFAULT 0
vote_sum INT DEFAULT 0
vote_count INT DEFAULT 0
published_at TIMESTAMP
status_changed_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP

INDEX idx_status (status)
INDEX idx_author (author_id)
INDEX idx_genre (genre_id)
```

#### works
```sql
id BIGINT PRIMARY KEY
title VARCHAR
content TEXT                        -- HTML pour chapitres, URL pour covers
summary TEXT
order INT                           -- Numéro chapitre
is_end BOOLEAN DEFAULT false
status ENUM('new', 'accepted', 'rejected', 'draft')
type ENUM('chapter', 'cover')
author_id BIGINT → users.id
novel_id BIGINT → novels.id
vote_sum INT DEFAULT 0
vote_count INT DEFAULT 0
comment_count INT DEFAULT 0
edit_count INT DEFAULT 0            -- Max 20 modifications
published_at TIMESTAMP
status_changed_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP

INDEX idx_novel (novel_id)
INDEX idx_type_status (type, status)
```

#### votes
```sql
id BIGINT PRIMARY KEY
user_id BIGINT → users.id
novel_id BIGINT → novels.id
work_id BIGINT → works.id
vote TINYINT                        -- -1, 0, 1
type ENUM('chapter', 'cover')
created_at TIMESTAMP
updated_at TIMESTAMP

UNIQUE KEY unique_vote (user_id, work_id)
INDEX idx_work (work_id)
```

#### comments
```sql
id BIGINT PRIMARY KEY
content TEXT
author_id BIGINT → users.id
work_id BIGINT → works.id
parent_id BIGINT NULLABLE           -- 0 si racine
reply_to_id BIGINT NULLABLE
reply_count INT DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP

INDEX idx_work (work_id)
INDEX idx_parent (parent_id)
```

#### notifications
```sql
id BIGINT PRIMARY KEY
user_id BIGINT → users.id
type VARCHAR                        -- 'vote_accepted', 'chapter_accepted', etc.
message TEXT                        -- HTML du message
data JSON                           -- Données contextuelles
is_read BOOLEAN DEFAULT false
created_at TIMESTAMP
deleted_at TIMESTAMP NULLABLE

INDEX idx_user_unread (user_id, is_read)
```

#### reports
```sql
id BIGINT PRIMARY KEY
reporter_id BIGINT → users.id       -- Signaleur
work_id BIGINT → works.id
moderator_id BIGINT NULLABLE → users.id
reason VARCHAR
description TEXT
status ENUM('pending', 'processed')
sanction_type ENUM('warning', 'vote_ban', 'write_ban') NULLABLE
sanction_until DATE NULLABLE
processed_at TIMESTAMP NULLABLE
created_at TIMESTAMP
updated_at TIMESTAMP

INDEX idx_status (status)
```

### Ordre de Création des Migrations

1. `users`, `genres`
2. `novels`
3. `works`
4. `votes`, `comments`
5. `notifications`, `reports`

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
// database/migrations/2024_01_01_000002_create_novels_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('novels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('genre_id')->constrained('genres');
            $table->foreignId('author_id')->constrained('users');
            $table->foreignId('cover_id')->nullable()->constrained('works');
            $table->enum('status', ['draft', 'voting', 'writing', 'finished', 'rejected'])
                ->default('draft');
            $table->integer('chapter_count')->default(0);
            $table->integer('favorites_count')->default(0);
            $table->integer('vote_sum')->default(0);
            $table->integer('vote_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('status_changed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('author_id');
            $table->index('genre_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('novels');
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

    public function chapters(): HasMany
    {
        return $this->hasMany(Work::class)
            ->where('type', 'chapter');
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Work::class)
            ->where('type', 'chapter')
            ->where('status', 'new');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['voting', 'writing', 'finished']);
    }

    public function scopeInVoting($query)
    {
        return $query->where('status', 'voting');
    }

    // Constantes
    const STATUS_DRAFT = 'draft';
    const STATUS_VOTING = 'voting';
    const STATUS_WRITING = 'writing';
    const STATUS_FINISHED = 'finished';
    const STATUS_REJECTED = 'rejected';
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

```php
<?php
// app/Http/Resources/NovelResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NovelResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'nov_id' => $this->id,
            'nov_title' => $this->title,
            'nov_status' => $this->status,
            'nov_id_genre' => $this->genre_id,
            'genre_label' => $this->whenLoaded('genre', fn() => $this->genre->label),
            'nov_id_author' => $this->author_id,
            'author_pseudo' => $this->whenLoaded('author', fn() => $this->author->pseudo),
            'chapter_count' => $this->chapter_count,
            'favorites_count' => $this->favorites_count,
            'vote_sum' => $this->vote_sum,
            'vote_count' => $this->vote_count,
            'vote_average' => $this->vote_count > 0
                ? round($this->vote_sum / $this->vote_count, 2)
                : 0,
            'nov_date_publi' => $this->published_at?->format('Y-m-d H:i:s'),
            'nov_date_statut' => $this->status_changed_at?->format('Y-m-d H:i:s')
        ];
    }
}
```

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
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:5173,127.0.0.1,127.0.0.1:5173'
)),
```

### Login Controller

```php
<?php
// app/Http/Controllers/Api/V1/AuthController.php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'pseudo' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::create([
            'pseudo' => $request->pseudo,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'reader'
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects']
            ]);
        }

        // Vérifier si banni
        if ($user->banned_until && $user->banned_until->isFuture()) {
            throw ValidationException::withMessages([
                'email' => ['Compte banni jusqu\'au ' . $user->banned_until->format('d/m/Y')]
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

## Services (Business Logic)

### Vote Calculation Service

```php
<?php
// app/Services/VoteCalculationService.php

namespace App\Services;

use App\Models\Novel;
use App\Models\Work;

class VoteCalculationService
{
    public function calculateWinner(Novel $novel): ?Work
    {
        $proposals = $novel->proposals()
            ->with('author')
            ->get();

        if ($proposals->isEmpty()) {
            return null;
        }

        // Algorithme de calcul (à adapter selon logique métier)
        $winner = $proposals->sortByDesc(function ($proposal) {
            // Score = vote_sum + bonus si auteur original
            $score = $proposal->vote_sum;
            if ($proposal->author_id === $proposal->novel->author_id) {
                $score += 5; // Bonus auteur original
            }
            return $score;
        })->first();

        return $winner;
    }

    public function closeVotingSession(Novel $novel): void
    {
        $winner = $this->calculateWinner($novel);

        if ($winner) {
            // Accepter le gagnant
            $winner->update([
                'status' => 'accepted',
                'order' => $novel->chapter_count + 1
            ]);

            // Incrémenter compteur chapitres
            $novel->increment('chapter_count');

            // Rejeter les autres propositions
            $novel->proposals()
                ->where('id', '!=', $winner->id)
                ->update(['status' => 'rejected']);

            // Changer statut roman
            $novel->update(['status' => Novel::STATUS_WRITING]);

            // Envoyer notifications
            app(NotificationService::class)->notifyChapterAccepted($winner);
        }
    }
}
```

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

```php
<?php
// tests/Unit/VoteCalculationServiceTest.php

namespace Tests\Unit;

use App\Models\Novel;
use App\Models\Work;
use App\Services\VoteCalculationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoteCalculationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_calculates_winner_with_highest_votes(): void
    {
        $novel = Novel::factory()->create(['status' => 'voting']);

        $proposal1 = Work::factory()->create([
            'novel_id' => $novel->id,
            'vote_sum' => 10,
            'status' => 'new'
        ]);

        $proposal2 = Work::factory()->create([
            'novel_id' => $novel->id,
            'vote_sum' => 15,
            'status' => 'new'
        ]);

        $service = new VoteCalculationService();
        $winner = $service->calculateWinner($novel);

        $this->assertEquals($proposal2->id, $winner->id);
    }
}
```

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

### Middleware Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Max 60 requêtes par minute
});

Route::post('/votes', [VoteController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:10,1']);  // Max 10 votes/min
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
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum)
- [Eloquent ORM](https://laravel.com/docs/12.x/eloquent)
- [Pest PHP](https://pestphp.com/)

---

**Version** : 1.0
**Date** : 2025-10-18
**Backend** : Laravel 12 (À développer)

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
