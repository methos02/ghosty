<?php

namespace App\Models;

use App\Models\Concerns\HasSlug;
use Database\Factories\NovelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @mixin IdeHelperNovel
 */
class Novel extends Model
{
    /** @use HasFactory<NovelFactory> */
    use HasFactory;

    use HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'genre_id',
        'author_id',
        'cover_url',
        'is_favorite',
        'chapter_count',
    ];

    protected function casts(): array
    {
        return [
            'is_favorite' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return BelongsTo<Genre, $this>
     */
    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Tous les chapitres du roman, toutes réalités confondues.
     *
     * @return HasMany<Chapter, $this>
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    /**
     * Chapitre d'origine, racine de l'arbre du multivers.
     *
     * @return HasOne<Chapter, $this>
     */
    public function rootChapter(): HasOne
    {
        return $this->hasOne(Chapter::class)->whereNull('parent_id');
    }
}
