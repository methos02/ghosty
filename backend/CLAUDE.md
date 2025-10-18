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
│   │   ├── GenresSeeder.php
│   │   ├── UsersSeeder.php
│   │   └── DatabaseSeeder.php
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
